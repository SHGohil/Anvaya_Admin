import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { skipGlobalErrorDialog } from '../interceptors/http-error.context';
import { readAuthToken } from './auth-token';

export type AccessScope = 'all' | 'own';

interface MeResponse {
  userId: number;
  userName: string;
  roleId: number;
  roleName: string;
  permissions: { key: string; scope: AccessScope }[];
}

/**
 * What the signed-in user may do, as decided by the API.
 *
 * The menu, route guards and buttons all read this instead of checking a role id, so the screens
 * shown always match what the API will actually allow, and a role built on the Roles screen works
 * everywhere with no frontend change. It is only a convenience for the UI: the API enforces every
 * permission itself, so hiding a button here is never the protection.
 *
 * Loaded once at startup (see AppModule) from GET /api/me. A copy is kept in localStorage so the
 * menu can draw straight away on the next visit; it is replaced as soon as the API answers.
 */
@Injectable({ providedIn: 'root' })
export class PermissionService {
  private static readonly CacheKey = 'permissions';

  private grants = new Map<string, AccessScope>();
  private role = '';

  /** Emits each time the permissions change (after load or clear), so menus can rebuild. */
  readonly changes$ = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) {
    this.restoreFromCache();
  }

  get roleName(): string {
    return this.role;
  }

  has(permission: string): boolean {
    return this.grants.has(permission);
  }

  /** 'all', 'own', or null when the permission is not granted. */
  scope(permission: string): AccessScope | null {
    return this.grants.get(permission) ?? null;
  }

  /** True when the user may edit events at all, directly or by sending a change request for approval. */
  get canEditEvents(): boolean {
    return this.has('events.edit.direct') || this.has('events.edit.request');
  }

  /** Asks the API who the user is and what they may do. Never throws: on failure the cached copy stays. */
  async load(): Promise<void> {
    if (!readAuthToken()) {
      this.clear();
      return;
    }

    try {
      const me = await firstValueFrom(
        this.http.get<MeResponse>(`${environment.backendAPIURL}/me`, { context: skipGlobalErrorDialog() })
      );
      this.apply(me);
      localStorage.setItem(PermissionService.CacheKey, JSON.stringify(me));
    } catch {
      // A 401 is handled by the auth interceptor (it signs out). Any other failure, such as the
      // server being unreachable, keeps whatever was cached so the user is not locked out of the UI.
    }
  }

  /** Forgets the permissions. Called on sign-out. */
  clear(): void {
    this.grants = new Map();
    this.role = '';
    try {
      localStorage.removeItem(PermissionService.CacheKey);
    } catch {
      // storage unavailable: nothing to clear
    }
    this.changes$.next(this.changes$.value + 1);
  }

  private restoreFromCache(): void {
    try {
      const raw = localStorage.getItem(PermissionService.CacheKey);
      if (raw && readAuthToken()) {
        this.apply(JSON.parse(raw) as MeResponse);
      }
    } catch {
      // an unreadable cache is the same as no cache
    }
  }

  private apply(me: MeResponse): void {
    this.grants = new Map((me.permissions ?? []).map(p => [p.key, p.scope]));
    this.role = me.roleName ?? '';
    this.changes$.next(this.changes$.value + 1);
  }
}
