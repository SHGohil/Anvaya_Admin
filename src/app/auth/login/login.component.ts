import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import {LoginService} from '../../shared/services/login.service'
import Swal from 'sweetalert2'; 

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  public newUser = false;
  // public user: firebase.User;
  public loginForm: FormGroup;
  public show: boolean = false
  public errorMessage: any;

  constructor(private fb: FormBuilder, public router: Router,public loginservice:LoginService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {}

  login() {
      let user = {
        email: this.loginForm.value["email"],
        password: this.loginForm.value["password"],
        // name: "test user",
      };

      this.loginservice.adminLogin(user).subscribe(apidata=>{

        localStorage.setItem("user", JSON.stringify(apidata));
        this.router.navigate(["/admin/dashboard"]);
        setTimeout(() => {
         window.location.reload();
        }, 200);
      },
      error => {
         
         console.error('Error during login:', error);
         Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: "Please check the login credentials",
          
        });
      })
    
  }

  showPassword(){
    this.show = !this.show
  }
}
