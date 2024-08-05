import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { de } from 'date-fns/locale';
import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';
import { FirebaseManager } from 'src/services/firebase_manager';
const mm = '🔐 🔐 🔐 AuthMiddleware 🔐 ';
const errorMessage = '🔴 🔴 🔴 Request is Unauthorized';

interface AuthenticatedRequest extends Request {
  user: admin.auth.DecodedIdToken;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly fbService: FirebaseManager) {}
  async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const authToken = req.headers.authorization;

    Logger.debug(`${mm} incoming url: ${req.originalUrl}`);
    if (req.originalUrl.includes('Bot')) {
      Logger.debug(
        `${mm} 🔴 🔴 letting you into the club without a ticket! 
        🔵 🔵  ... because you want to play with Bots 🔵 `
      );
      next();
      return;
    }
    if (process.env.NODE_ENV == 'development') {
      Logger.debug(
        `${mm} 🔴 🔴 🔴 🔴 🔴 letting you into the club without a ticket! 🔵 🔵 🔵 `
      );
      next();
      return;
    }
    
    if (!authToken) {
      Logger.log(`${mm} authentication token not found in request header 🔴`);
      return res.status(401).json({
        message: errorMessage,
        statusCode: 401,
        date: new Date().toISOString(),
      });
    }
    try {
      // Verify the authentication token using Firebase Admin SDK
      //await this.fbService.initializeFirebase(); Bearer
      const token = authToken.substring(7);
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = decodedToken; // Set the authenticated user in the request object
      Logger.log(`${mm} authentication seems OK; ✅ req: ${req}`);

      next();
    } catch (error) {
      Logger.log(`${mm} Error verifying authentication token: 🔴 ${error} 🔴`);
      return res.status(403).json({
        message: errorMessage,
        statusCode: 403,
        date: new Date().toISOString(),
      });
    }
  }
}
