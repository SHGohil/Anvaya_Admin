import { Injectable } from '@angular/core';
import { type HttpEvent, HttpBackend, HttpClient, HttpHandler, type HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, shareReplay, switchMap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';
import { readAuthToken, readRefreshToken, saveRenewedTokens } from '../services/auth-token';
import { SKIP_GLOBAL_ERROR } from './http-error.context';

/**
 * Attaches the bearer token to every call to our own API, signs the user out on
 * a 401, and surfaces any other failure to the user.
 *
 * Every service used to build the Authorization header by hand, which is how
 * notification.service came to send "Bearer undefined" and 401 on every poll
 * without anyone noticing: one missed header is silent.
 *
 * The error handling exists for the same reason. Of 62 subscriptions in the
 * application code only 8 passed an error callback, so a failed request left
 * the user looking at an empty table or a spinner that never resolved, with
 * nothing logged. Handling it here covers every call rather than 62 call sites.
 * Callers that show their own message opt out with skipGlobalErrorDialog().
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  // One renewal at a time: when several calls 401 together they all wait for the same
  // refresh, because a refresh token can be used only once.
  private refreshing$: Observable<string> | null = null;

  // Built on the raw backend so the renewal call does not pass back through this interceptor.
  private http: HttpClient;

  constructor(private router: Router, backend: HttpBackend) {
    this.http = new HttpClient(backend);
  }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const isOwnApi = req.url.startsWith(environment.backendAPIURL);
    const token = readAuthToken();

    if (isOwnApi && token && !req.headers.has('Authorization')) {
      req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (isOwnApi && error.status === 401 && this.canRenew(req)) {
          return this.renewToken().pipe(
            switchMap(newToken =>
              next.handle(req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } }))
            ),
            catchError((retryError: HttpErrorResponse) => {
              this.report(retryError, req.context.get(SKIP_GLOBAL_ERROR));
              return throwError(() => retryError);
            })
          );
        }

        if (isOwnApi) {
          this.report(error, req.context.get(SKIP_GLOBAL_ERROR));
        }

        return throwError(() => error);
      })
    );
  }

  /** Sign-in and renewal calls themselves are never retried, and renewal needs a refresh token. */
  private canRenew(req: HttpRequest<unknown>): boolean {
    return !req.url.includes('/Login') && !!readRefreshToken();
  }

  private renewToken(): Observable<string> {
    if (!this.refreshing$) {
      this.refreshing$ = this.http
        .post<{ token: string; refreshToken: string }>(`${environment.backendAPIURL}/Login/refresh`, {
          refreshToken: readRefreshToken()
        })
        .pipe(
          switchMap(r => {
            saveRenewedTokens(r.token, r.refreshToken);
            return [r.token];
          }),
          finalize(() => (this.refreshing$ = null)),
          shareReplay(1)
        );
    }
    return this.refreshing$;
  }

  private report(error: HttpErrorResponse, callerHandlesIt: boolean): void {
    // An expired or invalid token returns the user to the login screen rather
    // than leaving them on a page that silently shows nothing.
    if (error.status === 401) {
      localStorage.removeItem('user');
      this.router.navigate(['/auth/login']);
      return;
    }

    if (callerHandlesIt) {
      return;
    }

    Swal.fire({
      icon: 'error',
      title: this.titleFor(error),
      text: this.messageFor(error)
    });
  }

  private titleFor(error: HttpErrorResponse): string {
    if (error.status === 0) return 'Cannot reach the server';
    if (error.status === 403) return 'Not allowed';
    if (error.status === 404) return 'Not found';
    if (error.status === 409) return 'Conflict';
    if (error.status >= 500) return 'Server error';
    return 'Something went wrong';
  }

  /**
   * The API returns a plain string for deliberate rejections ("Select Venues",
   * "Venue already booked...") and a ProblemDetails object for faults. Show the
   * former as-is, since it is written for the user; summarise the latter.
   */
  private messageFor(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'The server did not respond. Check your connection and try again.';
    }

    const body = error.error;

    if (typeof body === 'string' && body.trim() && body.length < 300) {
      return body;
    }

    if (body && typeof body === 'object') {
      if (typeof body.title === 'string') {
        return body.detail
          ? `${body.title} (${body.detail})`
          : body.title;
      }
    }

    return 'Please try again. If it keeps happening, contact support.';
  }
}
