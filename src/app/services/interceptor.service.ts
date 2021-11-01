import { AuthAPIService } from 'src/app/services/auth.api.service';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class InterceptorService implements HttpInterceptor {
  constructor(private authAPIService: AuthAPIService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.authAPIService.getJwtToken()) {
      request = this.addToken(request, this.authAPIService.getJwtToken());
    }

    return next.handle(request).pipe(catchError(this.handleError));
  }

  private addToken(request: HttpRequest<any>, token: string | null) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private handleError(error: HttpErrorResponse) {
    var res;

    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      res = JSON.stringify(error.error['error']);
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${res}`
      );
    }
    // Return an observable with a user-facing error message.
    return throwError(`${res}`);
  }
}
