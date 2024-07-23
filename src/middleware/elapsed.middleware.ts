import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
// import { MessagingService } from '../messaging/messaging.service';
import { InjectModel } from '@nestjs/mongoose';
import { KasieError } from 'src/services/kasie.error';
import { FirestoreManager } from 'src/services/firestore_manager';
import { FirebaseManager } from 'src/services/firebase_manager';

const mm = ' 🔇 🔇 🔇 ElapsedTimeMiddleware';
@Injectable()
export class ElapsedTimeMiddleware implements NestMiddleware {
  constructor(
    private readonly firestore: FirestoreManager,
    private readonly firebaseManager: FirebaseManager
    // @InjectModel(KasieError.name)
    // private kasieErrorModel: mongoose.Model<KasieError>,
  ) {}
  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();

    res.on("finish", async () => {
      const elapsed = (Date.now() - start) / 1000;
      Logger.log(
        `${mm} ${req.originalUrl} took 🌸🌸🌸 ${elapsed} seconds 🔴 🔴 statusCode: ${res.statusCode}`
      );
      if (res.statusCode > 201) {
        //send message & write to database
        const error = {
          status: res.statusCode,
          message: `🔴 🔴 🔴 Error on Bidvest Backend: ${res.statusMessage}`,
          path: req.originalUrl,
          date: new Date().toISOString(),
        };
        await this.firestore.createDocument("SystemErrors", error);
        Logger.debug(`${mm} SystemError added to database `);
        await this.firebaseManager.sendMessage('errorsTopic', JSON.stringify(error));
      }
    });

    next();
  }
}
