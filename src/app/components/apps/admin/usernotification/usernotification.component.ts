import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {YourServiceName } from '../../../../shared/services/notification.service'
@Component({
    selector: 'app-usernotification',
    templateUrl: './usernotification.component.html',
    styleUrls: ['./usernotification.component.scss'],
    standalone: false
})
export class UsernotificationComponent {
  usernotificationData: any;
  viewdetails: any;
  notificationLoading = true;
 
 
  constructor( private modalService: NgbModal,private cdr: ChangeDetectorRef,private formBuilder : FormBuilder,private notification :YourServiceName) {}


  ngOnInit() {
    this.getNotificationData();
  }

  onviewdeails(val, content) { 
    this.modalService.open(content, { size: 'lg' }); 
    this.geteventdetails(val.eventId, content);
   }
   
  


   geteventdetails(id: number,content) {
    this.notification.getEventdetail(id).subscribe((apidata: any) => {
      this.viewdetails = apidata;
    });
   }

  
  getNotificationData() {
    this.notification.getnotification().subscribe(
       apiData => {
         this.usernotificationData = apiData;
         this.notificationLoading = false;
       },
       error => {
         console.error("Error fetching notifications:", error);
         this.notificationLoading = false;
       }
    );
   }
}
