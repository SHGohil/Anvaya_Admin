import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-resetpassword',
    templateUrl: './resetpassword.component.html',
    styleUrls: ['./resetpassword.component.scss'],
    standalone: false
})
export class ResetpasswordComponent implements OnInit, OnDestroy {
  showPassword2:any;
  showPassword1:any;
  public show: boolean = false;
  resetForm: any;
  private isFormValidating: boolean = false;
  userid: any;

  constructor(private formBuilder : FormBuilder,public router: Router , public rservice: ReportsService, private fb: FormBuilder) 
  {

    let user;
    if (typeof window !== 'undefined' && window.localStorage) {
     user = localStorage.getItem('user');
    }
    var userdata = JSON.parse(user);
    if(userdata!=undefined){

      this.userid = userdata.userdata.userId;
    }
   }
 
  ngOnInit() { 
 
    this.resetForm = this.formBuilder.group({
      // The API requires the current password when a user changes their own,
      // so a stolen token alone cannot take an account over permanently.
      currentPassword: ['', [Validators.required]],
      password: ['', [Validators.required,this.passwordValidator]],
      cnpassword: ['', [Validators.required ]],
   }, { validator: this.passwordMatchValidator });
  
  }  
  passwordValidator(control: FormControl): { [key: string]: boolean } | null {
    const password = control.value;
    if (!password) {
      return { 'required': true };
    }
  
    const hasCapital = /[A-Z]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);
    const isValidLength = password.length >= 8;
  
    if (!hasCapital || !hasSpecial || !isValidLength) {
      return { 'invalidPassword': true };
    }
  
    return null;
  }  
  toggleShowPassword1(){
    this.showPassword1=!this.showPassword1
  }
  toggleShowPassword2(){
    this.showPassword2=!this.showPassword2
  }
  passwordMatchValidator = (control: AbstractControl): {[key: string]: any} | null => {
    const password = control.get('password');
    const confirmPassword = control.get('cnpassword');
    
    if (!password || !confirmPassword) {
      return null;
    }
  
    return password.value === confirmPassword.value ? null : { 'passwordMismatch': true };
  };
  ngOnDestroy() {
    // These two fields were declared but never assigned, so this method threw
    // "Cannot read properties of undefined (reading 'unsubscribe')" every time
    // the user navigated away from this page. There is nothing to clean up:
    // the form is built with FormBuilder and nothing subscribes to valueChanges.
  }

  showPassword() {
    this.show =!this.show;
  }
 
  // matchingPasswords(group: FormGroup) {
  //   let password = this.form.controls.password.value;
  //   let confirmPassword = this.form.controls.confirmPassword.value;
  //   return password === confirmPassword? null : { notSame: true };
  // }

  // getErrorMessage() {
  //   if (this.form.get('password').invalid && this.form.get('password').touched) {
  //     return 'Password is required and must be at least 8 characters long, including uppercase, lowercase, and numbers.';
  //   }
  //   if (this.form.get('confirmPassword').invalid && this.form.get('confirmPassword').touched) {
  //     return 'Confirm Password is required and must be at least 8 characters long, including uppercase, lowercase, and numbers.';
  //   }
  //   if (this.form.errors?.notSame) {
  //     return 'Passwords do not match.';
  //   }
  //   return '';
  // }

  resetpassword(val) {
    this.isFormValidating = true;

    if (this.resetForm.valid) {
      this.rservice.reset(this.userid, val.currentPassword, val.password).subscribe({
        next: () => {
          // The password changed, so the current token no longer reflects reality.
          // Sign out and make the user log in again with the new one.
          localStorage.clear();
          localStorage.removeItem('user');
          this.router.navigateByUrl('auth/login');
          window.location.reload();
        },
        error: (err) => {
          // Previously the failure branch was silent: a wrong current password
          // looked identical to a successful change.
          this.isFormValidating = false;
          Swal.fire({
            icon: 'error',
            title: 'Could not change password',
            text: typeof err?.error === 'string'
              ? err.error
              : 'Please check your current password and try again.'
          });
        }
      });
      return;
    }

    this.isFormValidating = false;
  }
}
