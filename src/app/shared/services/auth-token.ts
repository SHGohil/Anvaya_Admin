/**
 * Reads the bearer token from the stored login response.
 *
 * Services must call this per request rather than caching the token in their
 * constructor. `providedIn: 'root'` services are constructed on first injection,
 * which can happen before anyone has signed in - the old code did
 * `JSON.parse(localStorage.getItem('user')).token` in the constructor and threw
 * a TypeError, taking the whole screen down instead of redirecting to login.
 *
 * Reading per request also means the token is correct after a re-login without
 * a full page reload.
 */
export function readAuthToken(): string {
  if (typeof window === 'undefined' || !window.localStorage) {
    return '';
  }

  const raw = localStorage.getItem('user');
  if (!raw) {
    return '';
  }

  try {
    return JSON.parse(raw)?.token ?? '';
  } catch {
    return '';
  }
}
