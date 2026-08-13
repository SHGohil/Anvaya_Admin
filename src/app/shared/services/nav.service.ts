import { Injectable, OnDestroy } from "@angular/core";
import { Subject, BehaviorSubject, fromEvent } from "rxjs";
import { takeUntil, debounceTime } from "rxjs/operators";
import { Router } from "@angular/router";

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

  constructor(private router: Router) {
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
    if (window.innerWidth < 991) {
      // Detect Route change sidebar close
      this.router.events.subscribe((event) => {
        this.collapseSidebar = true;
        this.megaMenu = false;
        this.levelMenu = false;
      });
    }

  
  }

  ngOnDestroy() {
    // this.unsubscriber.next();
    this.unsubscriber.complete();
  }

  private setScreenWidth(width: number): void {
    this.screenWidth.next(width);
  }



  private adminMenuItems: Menu[] = [
    { path: "/admin/dashboard", title: "Dashboard", icon: "home", type: "link", active: true  },
    { path: "/settings/users", title: "Users", icon: "user", type: "link" },
    { path: "/settings/approvals", title: "Change Requests", icon: "file", type: "link" },
    { path: "/settings/specials", title: "Special Dates", icon: "calender", type: "link" },
    { path: "/admin/notification", title: "Notification", icon: "learning", type: "link" },
 ];

 private salesManagerMenuItems: Menu[] = [
  { path: "/admin/dashboard", title: "Dashboard", icon: "home", type: "link", active: true },
  { path: "/settings/specials", title: "Special Dates", icon: "calender", type: "link" },
  { path: "/admin/notification", title: "Notification", icon: "learning", type: "link" },
 ];

 private salesExecutiveMenuItems: Menu[] = [
  { path: "/admin/dashboard", title: "Dashboard", icon: "home", type: "link", active: true },
  { path: "/admin/notification", title: "Notification", icon: "learning", type: "link" },
 ];
  private getMenuItemsByRole(): Menu[] {
    let user;
    if (typeof window !== 'undefined' && window.localStorage) {
      user = localStorage.getItem('user');
    }
    var userdata = JSON.parse(user);
    if(userdata!=undefined){

      this.roleid = userdata.userdata.roleId;
    }
     switch (this.roleid) {
       case 1: // Admin
         return this.adminMenuItems;
       case 2: // Sales Manager
         return this.salesManagerMenuItems;
       case 3: // Sales Executive
         return this.salesExecutiveMenuItems;
       default:
         return []; // Return an empty array or a default menu if roleId is not recognized
     }
  }

  MENUITEMS: Menu[] = [
    {
      headTitle1: "Menu",
    },
    { path: "/admin/dashboard", title: "Dashboard", icon: "home", type: "link", active:true},
   
    { path: "/admin/notification", title: "Notification", icon: "learning", type: "link"},
    { path: "/settings/users", title: "Users", icon: "user", type: "link" },
    { path: "/settings/approvals", title: "Change Requests", icon: "file", type: "link" },
    { path: "/settings/specials", title: "Special Dates", icon: "calender", type: "link" },
  ];

  // Array
  // items = new BehaviorSubject<Menu[]>(this.MENUITEMS);
 items = new BehaviorSubject<Menu[]>(this.getMenuItemsByRole());

}
