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

    // No stored user, an unparseable one, one without a token, or one whose token
    // has expired: not signed in. An expired token used to pass this check and then
    // fail every API call with a 401 from inside a screen that looked signed in.
    if (!user || !user.token || isTokenExpired(user.token)) {
      if (user) {
        localStorage.removeItem("user");
      }
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

/**
 * True when the JWT's `exp` claim is in the past. A token that cannot be decoded is
 * treated as expired, so a mangled value signs the user out rather than being trusted.
 */
function isTokenExpired(token: string): boolean {
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const exp = JSON.parse(json).exp;
    return typeof exp === "number" && exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}

/**
 * Keeps non-admins off the admin-only screens (Users, Change Requests).
 *
 * The sidebar already hides those links, but a hidden link does not stop anyone typing
 * the address. The API enforces the role independently; this just stops the screen
 * opening and showing an empty or failing page.
 */
@Injectable({
  providedIn: "root",
})
export class AdminRoleGuard {
  constructor(private router: Router) {}

  canActivate(): boolean | UrlTree {
    try {
      const user = JSON.parse(localStorage.getItem("user") ?? "null");
      if (user?.userdata?.roleId === 1) {
        return true;
      }
    } catch {
      // fall through: an unreadable user is not an admin
    }
    return this.router.createUrlTree(["/admin/dashboard"]);
  }
}
