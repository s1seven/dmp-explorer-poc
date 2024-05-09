import {
  HttpErrorResponse,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, delay, switchMap, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogData, ErrorDialogComponent } from './error-dialog.component';

/**
 * Display a dialog with the error message when 500s occur.
 * Also allows the user to retry the request.
 */

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private dialog = inject(MatDialog);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        if (!this.shouldHandleError(err)) return throwError(() => err);
        const errorMessage = this.getErrorMessage(err, req);
        const dialog = this.dialog.open(ErrorDialogComponent, {
          disableClose: true,
          width: '420px',
          data: { message: errorMessage } as DialogData,
        });
        return dialog.afterClosed().pipe(
          delay(2000),
          switchMap((retry) =>
            retry
              ? this.intercept(req.clone(), next)
              : throwError(() => errorMessage)
          )
        );
      })
    );
  }

  private getErrorMessage(
    err: HttpErrorResponse,
    req: HttpRequest<any>
  ): string {
    if (err.error instanceof ErrorEvent) {
      return `An error occurred: ${err.error.message} when calling ${req.url}.`;
    }

    const message = err.error?.message;
    return message
      ? `${message} when calling ${req.url}.`
      : `Backend returned code ${err.status}, body was: ${err.error} when calling ${req.url}.`;
  }

  private shouldHandleError(err: HttpErrorResponse): boolean {
    // Show dialog on server errors and if the backend cannot be reached
    return err.status >= 500 || err.status === 0;
  }
}
