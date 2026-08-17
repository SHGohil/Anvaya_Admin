import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { EventDataService } from 'src/app/shared/services/event-data.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-addquery',
    templateUrl: './addquery.component.html',
    styleUrls: ['./addquery.component.scss'],
    standalone: false
})
export class AddqueryComponent implements OnInit {
  venueData$:any;
  typedata: Object;
  timedata: any;
  form: any;
  isAllVenueSelected:boolean=false;
  selectedVenueIds: number[] = [];
  venueIdsString: any;
  eventDate: any;
  timeIdesString: string;
  selectedTimeIds:  number[] = [];
  loginid: any;


  constructor(public router :Router ,private fb:FormBuilder, private service: EventDataService)
  {
    let user;
    if (typeof window !== 'undefined' && window.localStorage) {
     user = localStorage.getItem('user');
    }
    var userdata = JSON.parse(user);
    this.loginid = userdata.userdata.userId;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      "eventsId":[''],
      "eventDate":['',],
      "eventEndDate":[''],
      "personName":['',Validators.required],
      "guestName":['',Validators.required],
      "phonenumber":['',Validators.required],
      "venueIds":['',],
      "eventTypeId":['',],
      "eventTimeIds":['',],
      "createdBy":[''],
      "createdDate":[''],
      "comment":[''],
    })
    this.gettype();
    this.getvenues();
    this.geteventtime();
    

  }

  getValue(value:any){
     if(this.form.controls.eventDate.value){
      this.isAllVenueSelected= value;
      if(this.isAllVenueSelected){
        // patchValue only updates the reactive form control (and, through
        // that, what the ng-select box displays) - it doesn't fire
        // ng-select's own (change) event, so onSelect() is called
        // explicitly right after to keep selectedVenueIds/venueIdsString
        // (used by post()) in sync with what's now actually selected.
        const allVenues = this.venueData$ || [];
        this.form.controls.venueIds.patchValue(allVenues.map((v: any) => v.venueId));
        this.onSelect(allVenues);
       }
       else{
        this.form.controls.venueIds.patchValue([]);
        this.selectedVenueIds = [];
        this.venueIdsString = '';
       }

     }
     else{
      this.form.controls.eventDate.markAsTouched();
     }
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
    this.form.get('phonenumber').setValue(value, { emitEvent: false });
}

getvenues(){
  this.service.getvenue().subscribe((apidata:any)=>{
    this.venueData$= apidata;
    
  })
}


gettype(){
  this.service.gettype().subscribe(apidata=>{
    this.typedata = apidata;
  })
}

geteventtime(){
  this.service.geteventtype().subscribe(apidata=>{
    this.timedata= apidata;
    console.log( this.timedata,"---my list timedata--" )
  })
}

gettime(date, venues){
  this.service.getonTime(date,venues).subscribe(apidata=>{
    this.timedata = apidata;
    if(this.timedata.length==0){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "No Event times are  available for selected date and venues selected",
      });
    }
  })
}



onDateChange(value: any) {
  // Update the eventDate form control value when the input changes
 this.eventDate=value;
  // You can also perform additional logic here if needed
  // if (this.venueIdsString!="" &&this.venueIdsString!=undefined) {
  //   this.gettime(this.eventDate, this.venueIdsString);
  // }
  this.geteventtime();
}


onSelect(event: any) {
  if(event){
    const selectedIds = event.map((item: any) => item.venueId); 

    this.selectedVenueIds = this.selectedVenueIds.filter(id => selectedIds.includes(id));
  
    selectedIds.forEach(id => {
      if (!this.selectedVenueIds.includes(id)) {
        this.selectedVenueIds.push(id);
      }
    });
  
    this.venueIdsString = this.selectedVenueIds.join(',');
  }
}
onSelectTime(event: any) {
  const selectedIds = event.map((item: any) => item.eventTimeId); 

  this.selectedTimeIds = this.selectedTimeIds.filter(id => selectedIds.includes(id));

  selectedIds.forEach(id => {
    if (!this.selectedTimeIds.includes(id)) {
      this.selectedTimeIds.push(id);
    }
  });

  this.timeIdesString = this.selectedTimeIds.join(',');
  console.log('Selected venue IDs as string:', this.selectedTimeIds);
}
  onclickcancel(){
    
    window.location.reload();  
  }

//   post(val){
//     debugger
//     if((!this.isAllVenueSelected && this.form.controls.venueIds.value.length==0) && this.form.invalid){
//       this.form.markAllAsTouched();
//       return;
//     }
//     let allVenueId=["1","2","3","4","5","6","7","8"]
//   if(this.form.controls.guestName.value && this.form.controls.personName.value && this.form.controls.phonenumber.value && this.form.controls.eventDate.value &&this.form.controls.eventTypeId.value && this.form.controls.eventTimeIds.value && (this.isAllVenueSelected || this.form.controls.venueIds.value)){
//     let obj={
//       "eventDate":new Date(val.eventDate),
//       "eventEndDate":new Date(val.eventDate),
//       "personName":val.personName,
//       "guestName":val.guestName,
//       "phonenumber":val.phonenumber,
//       "venueIds":this.isAllVenueSelected ? allVenueId.toString(): this.venueIdsString,
//       "eventTypeId": parseInt(val.eventTypeId) ,
//       "eventTimeIds":this.timeIdesString,
//       "eventFoodtypeId":val.eventFoodtypeId,
//       "createdBy":this.loginid,
//       "createdDate":new Date(),
//     }
     
//     this.service.postevents(obj).subscribe(apidata=>{
//       this.form.reset();
//       Swal.fire({
//         icon: 'success',
//         title: 'Success',
//         text: 'Event Added Successfully',
//       });
//       window.location.reload();
//       this.isAllVenueSelected = false;
      
// },

// error => {
//         Swal.fire({
//           icon: 'error',
//           title: 'Oops...',
//           text: error.error,
//         });
// })
//   }
//   else{
//     this.form.markAllAsTouched();
//     console.log(this.form.controls)
//     Swal.fire({
//       icon: 'error',
//       title: 'Oops...',
//       text: "Please Fill all the details correctly",
//     });
//   }
              
//   }




  post(val){
    // if((!this.isAllVenueSelected && this.form.controls.venueIds.value.length==0) && this.form.invalid){
    //   this.form.markAllAsTouched();
    //   return;
    // }
    if (this.form.valid || ( this.form.controls.venueIds.value.length > 0)) {
    let obj={
      "eventDate":new Date(val.eventDate),
      "eventEndDate":new Date(val.eventDate),
      "personName":val.personName,
      "guestName":val.guestName,
      "phonenumber":val.phonenumber,
      "venueIds":this.venueIdsString,
      "eventTypeId": parseInt(val.eventTypeId) ,
      "eventTimeIds":this.timeIdesString,
      "eventFoodtypeId":val.eventFoodtypeId,
      "createdBy":this.loginid,
      "createdDate":new Date(),
      "comment":val.comment,
    }
     
    this.service.postevents(obj).subscribe(apidata=>{
      this.form.reset();
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Event Added Successfully',
      });
      window.location.reload();
      this.isAllVenueSelected = false;
      
},

error => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.error,
        });
})
  }
  else{
    this.form.markAllAsTouched();
    console.log(this.form.controls)
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: "Please Fill all the details correctly",
    });
  }
              
  }

}


