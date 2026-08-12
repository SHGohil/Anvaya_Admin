import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {ChangerequestService} from '../../../../../shared/services/changerequest.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder } from '@angular/forms';
import { ReportsService } from 'src/app/shared/services/reports.service';
import Swal from 'sweetalert2';
@Component({
    selector: 'app-changerequest',
    templateUrl: './changerequest.component.html',
    styleUrls: ['./changerequest.component.scss'],
    standalone: false
})
export class ChangerequestComponent implements OnInit {
  changerequestdata: Object;
  viewdails: any;
  changedetails: any;
  isapproved: boolean;


  constructor(public rservice : ReportsService,private service:ChangerequestService,private modalService: NgbModal, private fb: FormBuilder , private cdr: ChangeDetectorRef){

  }

  ngOnInit(): void {
    this.getspecialdates();
  }

  getspecialdates(){
    this.service.getchangerequest().subscribe(apidata=>{
      this.changerequestdata = apidata;
    })
  }

  onviewdeails(val,content)
{
  this.modalService.open(content, { size: 'xl'})
  this.changedetails = val;
this.geteventdetails(val.eventsId)
}

geteventdetails(id: number) {
  this.rservice.getEventdetails(id).subscribe((apidata: any) => {
    this.viewdails = apidata;
  });
 }
 convertToIST(val: string): string {
  // Create a Date object from the input string
  const date = new Date(val);
 
  // Adjust the date to IST (GMT+05:30)
  // Add 5 hours and 30 minutes to the UTC time
  date.setHours(date.getHours() + 5);
  date.setMinutes(date.getMinutes() + 30);
 
  // Format the date and time to "YYYY-MM-DDTHH:mm:ss"
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');
 
  const istDate = `${year}-${month}-${day}T${hour}:${minute}:${second}`;
 
  return istDate;
 }
 post(id,val){
if(id==1){
  this.isapproved= true;
}
else{
  
  this.isapproved= false;
}
  let obj={
    eventChangeRequestId:val.eventChangeRequestId,
    eventsId:val.eventsId,
    eventDate:val.eventDate,
    eventEndDate:val.eventEndDate,
    personName:val.personName,
    guestName:val.guestName,
    phonenumber:val.phonenumber,
    venueIds:val.venueIds,
    eventTypeId:val.eventType.eventTypeId,
    eventTimeIds:val.eventTimeIds,
    eventStatusId:val.eventStatusId,
    eventFoodtypeId:val.eventFoodtypeId,
    comment:val.comment,
    createdBy:val.createdBy,
    createdDate:val.createdDate,
    modifiedBy:val.modifiedBy,
    modifiedDate:val.modifiedDate,
    isStatusgivenbyuser:val.isStatusgivenbyuser,
    bumpIN:val.bumpIN,
    bumpOUT:val.bumpOUT,
    bumpINstring:val.bumpINstring,
    bumpOUTstring:val.bumpOUTstring,
    requestedBy:val.requestedBy,
    requestedDate:val.requestedDate,
    isApproved:this.isapproved,
  }

  this.service.postChagereq(val.eventChangeRequestId,obj).subscribe(apidata=>{
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: 'Event Updated Successfully',
    });
    this.modalService.dismissAll();
    this.getspecialdates();
    },
    
    error => {
       
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.error,
      });
    
    })
 }
}
