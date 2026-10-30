import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { PermissionGrant, PermissionInfo, RoleSummary, RolesService } from 'src/app/shared/services/roles.service';
import { PermissionService } from 'src/app/shared/services/permission.service';
import { ToastService } from 'src/app/shared/services/toast.service';

interface PermissionGroup {
  name: string;
  items: PermissionInfo[];
}

/** The role being created or edited. `grants` holds a scope for each ticked permission. */
interface RoleDraft {
  id: number | null;
  roleName: string;
  description: string;
  isSystem: boolean;
  grants: Record<string, 'all' | 'own'>;
}

/**
 * Roles and what each may do. An admin builds a role here by ticking permissions; the change applies to
 * the people holding that role on their very next request, with no sign-out and no deploy.
 */
@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class RolesComponent implements OnInit {
  roles: RoleSummary[] = [];
  groups: PermissionGroup[] = [];
  loading = true;
  saving = false;
  draft: RoleDraft = this.blankDraft();
  private modalRef?: NgbModalRef;

  constructor(
    private api: RolesService,
    private modalService: NgbModal,
    private toast: ToastService,
    private permissions: PermissionService
  ) {}

  ngOnInit(): void {
    this.loadRoles();
    this.api.catalog().subscribe(catalog => {
      const byGroup = new Map<string, PermissionInfo[]>();
      for (const permission of catalog) {
        byGroup.set(permission.group, [...(byGroup.get(permission.group) ?? []), permission]);
      }
      this.groups = [...byGroup.entries()].map(([name, items]) => ({ name, items }));
    });
  }

  private blankDraft(): RoleDraft {
    return { id: null, roleName: '', description: '', isSystem: false, grants: {} };
  }

  private loadRoles(): void {
    this.loading = true;
    this.api.list().subscribe({
      next: roles => {
        this.roles = roles;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  newRole(content: unknown): void {
    this.draft = this.blankDraft();
    this.modalRef = this.modalService.open(content, { size: 'lg' });
  }

  edit(role: RoleSummary, content: unknown): void {
    this.api.get(role.rolesId).subscribe(detail => {
      const grants: Record<string, 'all' | 'own'> = {};
      for (const grant of detail.permissions) {
        grants[grant.key] = grant.scope;
      }
      this.draft = {
        id: detail.rolesId,
        roleName: detail.roleName,
        description: detail.description ?? '',
        isSystem: detail.isSystem,
        grants,
      };
      this.modalRef = this.modalService.open(content, { size: 'lg' });
    });
  }

  isGranted(key: string): boolean {
    return key in this.draft.grants;
  }

  toggle(permission: PermissionInfo, checked: boolean): void {
    if (this.draft.isSystem) {
      return;
    }
    if (checked) {
      this.draft.grants[permission.key] = 'all';
    } else {
      delete this.draft.grants[permission.key];
    }
  }

  setScope(permission: PermissionInfo, scope: string): void {
    if (!this.draft.isSystem && this.isGranted(permission.key)) {
      this.draft.grants[permission.key] = scope === 'own' ? 'own' : 'all';
    }
  }

  /** How many permissions a role holds, for the list. */
  grantCount(): number {
    return Object.keys(this.draft.grants).length;
  }

  save(): void {
    const name = this.draft.roleName.trim();
    if (!name) {
      return;
    }

    const permissions: PermissionGrant[] = Object.entries(this.draft.grants).map(([key, scope]) => ({ key, scope }));
    const description = this.draft.description.trim() || null;
    this.saving = true;

    const finish = (message: string) => {
      this.saving = false;
      this.modalRef?.close();
      this.toast.success('Success', message);
      this.loadRoles();
      // The signed-in admin's own role may have changed, so refresh what this screen's menu shows.
      this.permissions.load();
    };
    const fail = () => (this.saving = false); // the interceptor already told the user why

    if (this.draft.id === null) {
      this.api.create({ roleName: name, description: description ?? undefined, permissions }).subscribe({
        next: () => finish('Role created'),
        error: fail,
      });
      return;
    }

    const id = this.draft.id;
    this.api.update(id, { roleName: name, description }).subscribe({
      next: () => {
        if (this.draft.isSystem) {
          finish('Role updated');
          return;
        }
        this.api.setPermissions(id, permissions).subscribe({ next: () => finish('Role updated'), error: fail });
      },
      error: fail,
    });
  }

  delete(role: RoleSummary): void {
    Swal.fire({
      title: 'Delete this role?',
      text: `"${role.roleName}" and its permissions will be removed.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it',
    }).then(result => {
      if (result.isConfirmed) {
        // A role that people still hold, or the built-in one, is refused with a clear message.
        this.api.delete(role.rolesId).subscribe(() => {
          this.toast.success('Success', 'Role deleted');
          this.loadRoles();
        });
      }
    });
  }
}
