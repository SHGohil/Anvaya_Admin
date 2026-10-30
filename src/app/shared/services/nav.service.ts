import { Injectable, OnDestroy } from "@angular/core";
import { Subject, BehaviorSubject, fromEvent } from "rxjs";
import { takeUntil, debounceTime } from "rxjs/operators";
import { Router } from "@angular/router";
import { PermissionService } from "./permission.service";

// Menu
export interface Menu {
  headTitle1?: string;
  headTitle2?: string;
  path?: string;
  title?: string;
  icon?: string;
  type?: string;
  badgeType?: string;
  badgeValue?: string;
  active?: boolean;
  bookmark?: boolean;
  children?: Menu[];
  /** Permission the signed-in user needs to see this item (see PermissionService). No value = everyone. */
  permission?: string;
}

@Injectable({
  providedIn: "root",
})
export class NavService implements OnDestroy {


  
  private unsubscriber: Subject<any> = new Subject();
  public screenWidth: BehaviorSubject<number> = new BehaviorSubject(window.innerWidth);

  // Search Box
  public search: boolean = false;

  // Language
  public language: boolean = false;

  // Mega Menu
  public megaMenu: boolean = false;
  public levelMenu: boolean = false;
  public megaMenuColapse: boolean = window.innerWidth < 1199 ? true : false;

  // Collapse Sidebar - true means collapsed/hidden. The resize handler and
  // the mobile route-change handler below both set this to true to mean
  // "closed", so the initial value has to agree: closed on mobile, open on
  // desktop. (It didn't before - this was backwards, defaulting desktop to
  // collapsed and mobile to open - until the sidebar collapse toggle was
  // actually wired up to CSS and the inconsistency became visible.)
  public collapseSidebar: boolean = window.innerWidth < 991 ? true : false;

  // For Horizontal Layout Mobile
  public horizontal: boolean = window.innerWidth < 991 ? false : true;

  // Full screen
  public fullScreen: boolean = false;
  roleid: any;

  constructor(private router: Router, private permissions: PermissionService) {
    this.setScreenWidth(window.innerWidth);
    fromEvent(window, "resize")
      .pipe(debounceTime(1000), takeUntil(this.unsubscriber))
      .subscribe((evt: any) => {
        this.setScreenWidth(evt.target.innerWidth);
        if (evt.target.innerWidth < 991) {
          this.collapseSidebar = true;
          this.megaMenu = false;
          this.levelMenu = false;
        }
        if (evt.target.innerWidth < 1199) {
          this.megaMenuColapse = true;
        }
      });
    this.items = new BehaviorSubject<Menu[]>(this.buildMenu());
    this.followPermissions();
    if (window.innerWidth < 991) {
      // Detect Route change sidebar close
      this.router.events.subscribe((event) => {
        this.collapseSidebar = true;
        this.megaMenu = false;
        this.levelMenu = false;
      });
    }

  
  }

  /** Called from the constructor: keeps the menu in step with the user's permissions. */
  private followPermissions(): void {
    this.permissions.changes$
      .pipe(takeUntil(this.unsubscriber))
      .subscribe(() => this.items.next(this.buildMenu()));
  }

  ngOnDestroy() {
    // this.unsubscriber.next();
    this.unsubscriber.complete();
  }

  private setScreenWidth(width: number): void {
    this.screenWidth.next(width);
  }



  // The whole menu, once. Each item names the permission it needs, and the menu a person sees is
  // this list filtered by what their role allows (from GET /api/me). There are no per-role copies,
  // so a role built on the Roles screen gets the right menu with no code change.
  //
  // Group headings carry no permission: they are shown only while at least one item under them is.
  private readonly allMenuItems: Menu[] = [
    { path: "/admin/dashboard", title: "Dashboard", icon: "home", type: "link", active: true, permission: "dashboard.view" },
    { headTitle1: "Bookings" },
    { path: "/admin/daily-query", title: "Daily Query", icon: "edit", type: "link", permission: "events.create" },
    { path: "/admin/todays-events", title: "Today's Events", icon: "clock", type: "link", permission: "events.view" },
    { path: "/admin/daily-report", title: "Daily Report", icon: "bar-chart", type: "link", permission: "reports.view" },
    { path: "/admin/confirmed-events", title: "Confirmed Events", icon: "check-circle", type: "link", permission: "events.view" },
    { path: "/admin/calendar", title: "Calendar", icon: "calender", type: "link", permission: "calendar.view" },
    { headTitle1: "Admin" },
    { path: "/settings/users", title: "Users", icon: "user", type: "link", permission: "users.view" },
    { path: "/settings/roles", title: "Roles", icon: "shield", type: "link", permission: "roles.manage" },
    { path: "/settings/approvals", title: "Change Requests", icon: "file", type: "link", permission: "changerequests.view" },
    { path: "/settings/specials", title: "Special Dates", icon: "calender", type: "link", permission: "specialdates.view" },
    { path: "/admin/notification", title: "Notification", icon: "bell", type: "link", permission: "notifications.view" },
  ];

  /** The items the signed-in user may see, with headings dropped when nothing under them is visible. */
  private buildMenu(): Menu[] {
    const visible: Menu[] = [];
    for (const item of this.allMenuItems) {
      if (item.headTitle1 || !item.permission || this.permissions.has(item.permission)) {
        visible.push(item);
      }
    }

    return visible.filter((item, index) => {
      if (!item.headTitle1) {
        return true;
      }
      const next = visible[index + 1];
      return next !== undefined && !next.headTitle1;
    });
  }

  items: BehaviorSubject<Menu[]>;

}
