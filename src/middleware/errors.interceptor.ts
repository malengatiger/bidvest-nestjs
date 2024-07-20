import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { KasieError } from 'src/services/kasie.error';
const mm: string = '🔴🔴🔴 ErrorsInterceptor';
@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(catchError(handleError));

    function handleError(err: KasieError) {
      Logger.log(`${mm} ... handling error: ${err}`);
      return throwError(
        () => new KasieError(err.statusCode, err.message, err.request),
      );
    }
  }
}
