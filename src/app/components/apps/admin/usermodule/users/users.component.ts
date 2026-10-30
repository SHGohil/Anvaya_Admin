import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import {UsersService} from '../../../../../shared/services/users.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastService } from 'src/app/shared/services/toast.service';
import Swal from 'sweetalert2';


@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class UsersComponent implements OnInit {
userdata: any[];
  // Without this, "still loading" and "no users" were the same blank
  // table - no rows, no message either way.
  usersLoading = true;
  // Client-side only - userdata is already the full, non-paginated list, so
  // there's no API/pagination change needed to support this.
  searchTerm = '';

  get filteredUsers(): any[] {
    if (!this.userdata) {
      return this.userdata;
    }
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      return this.userdata;
    }
    return this.userdata.filter(u =>
      (u.userName || '').toLowerCase().includes(term) ||
      (u.email || '').toLowerCase().includes(term) ||
      (u.mobileNumber || '').toString().toLowerCase().includes(term)
    );
  }
  rolesdata: Object;
  public show: boolean = false
  userForm: FormGroup;
  flag: number;
  /** The role the user being edited had when the dialog opened, to spot a role change. */
  private originalRoleId: number | null = null;
  loginid: any;
  tableItem$: any;
  total$: any;

constructor(private userservice : UsersService, private modalService:NgbModal, private fb : FormBuilder, private toast: ToastService){
  let user;
  if (typeof window !== 'undefined' && window.localStorage) {
   user = localStorage.getItem('user');
  }
  var userdata = JSON.parse(user);
  this.loginid = userdata.userdata.userId;
}

ngOnInit(): void {

  this.userForm = this.fb.group({
    "userId": [''] ,
    "userName": ['', [Validators.required]],
    "mobileNumber": ['', [Validators.required]],
    "email": ['', [Validators.required, Validators.email]],
    "password": ['', Validators.required],
    "roleId": ['', [Validators.required]],
  });

  this.getusers();
  this.getRoles();
} 
onPhoneNumberInput(event: any) {
  const input = event.target;
  let value = input.value;
  // Remove non-digit characters
  value = value.replace(/\D/g, '');
  // Limit the input to 15 digits
  if (value.length > 15) {
      value = value.slice(0, 15);
  }
  // Update the input value
  input.value = value;
  // Update the form control value
  this.userForm.get('mobileNumber').setValue(value, { emitEvent: false });
}
mobileNumberValidator(control: FormControl): { [s: string]: boolean } {
  const value = control.value;
  if (value && value.length !== 10) {
    return { 'invalidMobileNumber': true };
  }
  return null;
}
getusers(){

  this.userservice.getUsers().subscribe({
    next: (apidata: any) => {
      this.userdata = apidata;
      this.tableItem$ = apidata;
      this.total$ = apidata;
      this.usersLoading = false;
    },
    error: () => {
      this.usersLoading = false;
    },
  })
}
getRoles(){
  this.userservice.getRoles().subscribe(apidata=>{
    this.rolesdata = apidata;
  })
}
add(content){
  this.flag=1;
  this.userForm.reset();
  // A new user must have a password.
  this.userForm.controls.password.setValidators(Validators.required);
  this.userForm.controls.password.updateValueAndValidity();
  this.modalService.open(content, { size: 'lg'})
}
edit(item,content){
this.flag=2;
  // The list never carries a password, so editing must not demand one. Leaving it
  // blank keeps the current password; typing one sets a new password.
  this.userForm.controls.password.clearValidators();
  this.userForm.controls.password.updateValueAndValidity();
  this.modalService.open(content, { size: 'lg'})
  this.userForm.controls.userId.setValue(item.userId)
  this.userForm.controls.userName.setValue(item.userName)
  this.userForm.controls.mobileNumber.setValue(item.mobileNumber)
  this.userForm.controls.email.setValue(item.email)
  this.userForm.controls.password.setValue('')
  this.userForm.controls.roleId.setValue(item.roleId)
  this.originalRoleId = item.roleId;
}
cancel(){
  this.modalService.dismissAll();
}
postUser(val){
  if(this.userForm.invalid){
    
    this.userForm.markAllAsTouched();
    return;
  }
    
  if(this.flag==1){

    let obj ={
      userName:val.userName,
      mobileNumber:val.mobileNumber,
      email:val.email,
      password:val.password,
      roleId: parseInt(val.roleId),
      createdBy:this.loginid,
      createdDate:new Date(),
      
    }
    this.userservice.postusers(0,obj).subscribe(apidata=>{
      this.modalService.dismissAll();
      this.userForm.reset();
      this.getusers();
      this.toast.success('Success', 'User Added Successfully');
      },
      
      error => {
         
        // The auth interceptor already shows the server's own explanation (for example "A user with that
        // name or email already exists."), so no second, generic dialog here.
      
      })
  }
  else{
  // Changing someone's role changes what they can do on their next request, so ask first.
  if (this.originalRoleId !== null && parseInt(val.roleId) !== Number(this.originalRoleId)) {
    Swal.fire({
      title: "Change this user's role?",
      text: 'Their access changes immediately, on their next request.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, change it'
    }).then(result => {
      if (result.isConfirmed) {
        this.saveEditedUser(val);
      }
    });
    return;
  }
  this.saveEditedUser(val);
}
}

private saveEditedUser(val){
let obj={
      userId:val.userId,
      userName:val.userName,
      mobileNumber:val.mobileNumber,
      email:val.email,
      password:val.password,
      roleId:parseInt(val.roleId),
      createdBy:val.createdBy,
      createdDate:val.createdDate,
      modifiedBy:this.loginid,
      modifiedDate:new Date(),
}

this.userservice.postusers(val.userId,obj).subscribe(apidata=>{
  this.modalService.dismissAll();
      this.userForm.reset();
      this.getusers();
      this.toast.success('Success', 'User Updated Successfully');

},

error => {
        // The auth interceptor already shows the server's own explanation (for example "A user with that
        // name or email already exists."), so no second, generic dialog here.
})
}

showPassword(){
  this.show = !this.show
}

delete(val){
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, proceed!'
   }).then((result) => {
    if (result.isConfirmed) {
    this.userservice.dleleteusers(val.userId,val).subscribe(apidata=>{
      this.getusers();
      this.toast.success('Success', 'User Deleted Successfully');
    },

    error => {
            // The auth interceptor already shows the server's own explanation (for example "A user with that
        // name or email already exists."), so no second, generic dialog here.
    })
      
    }
   });
   
}

}