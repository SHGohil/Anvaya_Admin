import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from "@angular/router";

/**
 * Blocks routes for signed-out users.
 *
 * This previously returned `true` on every path, including the not-signed-in
 * branch. It navigated to the login page but still activated the guarded route,
 * so the protected component was constructed and fired its API calls anyway -
 * which then threw, because the data services read the token from localStorage.
 */
@Injectable({
  providedIn: "root",
})
export class AdminGuard {
  constructor(public router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const user = this.readUser();

    // No stored user, an unparseable one, or one without a token: not signed in.
    if (!user || !user.token) {
      // Returning a UrlTree both cancels this navigation and redirects, rather
      // than starting a second navigation that races the first.
      return this.router.createUrlTree(["/auth/login"], {
        queryParams: { returnUrl: state.url }
      });
    }

    return true;
  }

  /**
   * localStorage can hold anything - a half-written value, or "undefined" from an
   * older build - so a parse failure is treated as signed out rather than thrown.
   */
  private readUser(): any | null {
    if (typeof window === "undefined" || !window.localStorage) {
      return null;
    }

    const raw = localStorage.getItem("user");
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw);
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  }
}
