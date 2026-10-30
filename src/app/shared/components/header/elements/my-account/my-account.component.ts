import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { Router } from "@angular/router";
import { PermissionService } from "src/app/shared/services/permission.service";
import { clippingParents } from "@popperjs/core";

@Component({
    selector: "app-my-account",
    templateUrl: "./my-account.component.html",
    styleUrls: ["./my-account.component.scss"],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class MyAccountComponent implements OnInit {
  public userName: string;
  public profileImg: "assets/images/dashboard/profile.jpg";
  roleid: any;
  username: any;

  constructor(public router: Router, private permissions: PermissionService) {

    let user;
    if (typeof window !== 'undefined' && window.localStorage) {
      user = localStorage.getItem('user');
    }
    var userdata = JSON.parse(user);
    this.username = userdata.userdata.userName;
    if (JSON.parse(localStorage.getItem("user"))) {
    } else {
    }
  }

  ngOnInit() {}
  redirect(id){
   
      this.router.navigateByUrl(id)
    
  }
  logoutFunc() {
    this.permissions.clear();
    localStorage.clear();
    localStorage.removeItem('user')
    this.router.navigateByUrl('auth/login');
  }

  changepassword(){
    this.router.navigateByUrl('admin/resetpassword')
  }
}
