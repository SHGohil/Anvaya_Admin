import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { readAuthToken } from '../services/auth-token';

/**
 * Attaches the bearer token to every call to our own API, and signs the user
 * out on a 401.
 *
 * Every service used to build this header by hand, which is how
 * notification.service ended up sending "Bearer undefined" to a 401 for a long
 * time: a single missed header is silent. Every endpoint on the API except
 * POST /Login requires a token, so the default should be to send one.
 *
 * Services may still set the header themselves; this only fills it in when it
 * is absent, so the two cannot fight.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const isOwnApi = req.url.startsWith(environment.backendAPIURL);
    const token = readAuthToken();

    if (isOwnApi && token && !req.headers.has('Authorization')) {
      req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // An expired or invalid token should return the user to the login
        // screen rather than leaving them on a page that silently shows nothing.
        if (isOwnApi && error.status === 401) {
          localStorage.removeItem('user');
          this.router.navigate(['/auth/login']);
        }

        return throwError(() => error);
      })
    );
  }
}
