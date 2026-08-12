import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { clippingParents } from "@popperjs/core";

@Component({
    selector: "app-my-account",
    templateUrl: "./my-account.component.html",
    styleUrls: ["./my-account.component.scss"],
    standalone: false
})
export class MyAccountComponent implements OnInit {
  public userName: string;
  public profileImg: "assets/images/dashboard/profile.jpg";
  roleid: any;
  username: any;

  constructor(public router: Router) {

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
    localStorage.clear();
    localStorage.removeItem('user')
    this.router.navigateByUrl('auth/login');
  }

  changepassword(){
    this.router.navigateByUrl('admin/resetpassword')
  }
}
