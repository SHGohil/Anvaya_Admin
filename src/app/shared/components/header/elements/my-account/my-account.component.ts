import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { readRefreshToken } from "src/app/shared/services/auth-token";
import { PermissionService } from "src/app/shared/services/permission.service";

@Component({
    selector: "app-my-account",
    templateUrl: "./my-account.component.html",
    styleUrls: ["./my-account.component.scss"],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class MyAccountComponent implements OnInit {
  public userName: string;
  roleid: any;
  username: any;

  get initials(): string {
    return (this.username || "?").toString().trim().slice(0, 2).toUpperCase();
  }

  constructor(public router: Router, private permissions: PermissionService, private http: HttpClient) {

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
    // Retire the refresh token on the server so a copy of it stops working.
    const refreshToken = readRefreshToken();
    if (refreshToken) {
      this.http.post(`${environment.backendAPIURL}/Login/logout`, { refreshToken }).subscribe({ error: () => {} });
    }
    this.permissions.clear();
    localStorage.clear();
    localStorage.removeItem('user')
    this.router.navigateByUrl('auth/login');
  }

  changepassword(){
    this.router.navigateByUrl('admin/resetpassword')
  }
}
