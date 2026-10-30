import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface RoleSummary {
  rolesId: number;
  roleName: string;
  description: string | null;
  isSystem: boolean;
  userCount: number;
}

export interface PermissionGrant {
  key: string;
  scope: 'all' | 'own';
}

export interface RoleDetail extends RoleSummary {
  permissions: PermissionGrant[];
}

export interface PermissionInfo {
  key: string;
  group: string;
  description: string;
  supportsScope: boolean;
}

/** Roles and permissions: the API behind the Roles screen. */
@Injectable({ providedIn: 'root' })
export class RolesService {
  private readonly base = `${environment.backendAPIURL}/Roles`;

  constructor(private http: HttpClient) {}

  list(): Observable<RoleSummary[]> {
    return this.http.get<RoleSummary[]>(this.base);
  }

  get(id: number): Observable<RoleDetail> {
    return this.http.get<RoleDetail>(`${this.base}/${id}`);
  }

  catalog(): Observable<PermissionInfo[]> {
    return this.http.get<PermissionInfo[]>(`${environment.backendAPIURL}/permissions`);
  }

  create(role: { roleName: string; description?: string; permissions: PermissionGrant[] }): Observable<RoleDetail> {
    return this.http.post<RoleDetail>(this.base, role);
  }

  update(id: number, role: { roleName: string; description?: string | null }): Observable<void> {
    return this.http.post<void>(`${this.base}/${id}`, { rolesId: id, ...role });
  }

  setPermissions(id: number, permissions: PermissionGrant[]): Observable<void> {
    return this.http.put<void>(`${this.base}/${id}/permissions`, permissions);
  }

  delete(id: number): Observable<void> {
    return this.http.post<void>(`${this.base}/${id}/delete`, null);
  }
}
