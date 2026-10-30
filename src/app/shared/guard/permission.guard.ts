import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { PermissionService } from '../services/permission.service';

/**
 * Keeps a screen to the people whose role allows it. Name the permission on the route:
 *
 *   { path: 'users', component: UsersComponent, canActivate: [PermissionGuard], data: { permission: 'users.view' } }
 *
 * Several permissions in an array mean "any of these". Someone who is not allowed lands on the
 * dashboard. This is a courtesy: it stops a screen opening only to fail, and the API enforces the
 * same permission regardless.
 */
@Injectable({ providedIn: 'root' })
export class PermissionGuard {
  constructor(private permissions: PermissionService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const required = route.data['permission'] as string | string[] | undefined;
    if (!required) {
      return true;
    }

    const anyOf = Array.isArray(required) ? required : [required];
    if (anyOf.some(permission => this.permissions.has(permission))) {
      return true;
    }

    return this.router.createUrlTree(['/admin/dashboard']);
  }
}
