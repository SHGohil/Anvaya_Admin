import { HttpContext, HttpContextToken } from '@angular/common/http';

/**
 * Set on a request whose caller shows its own error message, so the global
 * handler stays quiet and the user does not see two dialogs for one failure.
 *
 * Usage:
 *   this.http.post(url, body, { context: skipGlobalErrorDialog() })
 */
export const SKIP_GLOBAL_ERROR = new HttpContextToken<boolean>(() => false);

export function skipGlobalErrorDialog(context: HttpContext = new HttpContext()): HttpContext {
  return context.set(SKIP_GLOBAL_ERROR, true);
}
