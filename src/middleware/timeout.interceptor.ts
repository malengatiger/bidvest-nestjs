import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  RequestTimeoutException,
  Logger,
} from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
const mm: string = '💦💦💦💦💦💦 TimeoutInterceptor';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const max: number = 30000;
    return next.handle().pipe(
      timeout(max),
      catchError((err: TimeoutError) => {
        if (err instanceof TimeoutError) {
          Logger.debug(
            `${mm} Catching TimeoutError name: ${err.name} message: ${err.message}`,
          );
          return throwError(() => new RequestTimeoutException());
        }
        Logger.debug(
          `${mm} WHY Do we get here, Sam? - should not be timeout ...`,
        );
        return throwError(() => err);
      }),
    );
  }
}
