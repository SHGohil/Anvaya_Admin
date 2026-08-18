import { Component, OnInit } from '@angular/core';

import {UsersService} from '../../../../../shared/services/users.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastService } from 'src/app/shared/services/toast.service';
import Swal from 'sweetalert2';


@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
    standalone: false
})
export class UsersComponent implements OnInit {
userdata: any[];
  // Without this, "still loading" and "no users" were the same blank
  // table - no rows, no message either way.
  usersLoading = true;
  rolesdata: Object;
  public show: boolean = false
  userForm: FormGroup;
  flag: number;
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
  this.modalService.open(content, { size: 'lg'})
}
edit(item,content){
this.flag=2;
  this.modalService.open(content, { size: 'lg'})
  this.userForm.controls.userId.setValue(item.userId)
  this.userForm.controls.userName.setValue(item.userName)
  this.userForm.controls.mobileNumber.setValue(item.mobileNumber)
  this.userForm.controls.email.setValue(item.email)
  this.userForm.controls.password.setValue(item.password)
  this.userForm.controls.roleId.setValue(item.roleId)
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
         
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something Went Wrong.',
        });
      
      })
  }
  else{
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
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something Went Wrong.',
        });
})
  }
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
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Something Went Wrong.',
            });
    })
      
    }
   });
   
}

}