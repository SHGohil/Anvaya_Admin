import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {YourServiceName} from '../../../../../shared/services/notification.service'
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {

  public openNotification: boolean = false;
  notificationData: any;
  notificationCount: any;
  firstFourNotifications: any;


  constructor( private modalService: NgbModal,private cdr: ChangeDetectorRef,private formBuilder : FormBuilder,private notification: YourServiceName) {}


  ngOnInit() {
    this.getNotificationData();
  }

  toggleNotificationMobile() {
    this.openNotification = !this.openNotification;
  }

  getNotificationData() {
    this.notification.getnotification().subscribe(
      apiData => {
        this.notificationData = apiData;
        this.notificationCount = this.notificationData?.length;
        this.firstFourNotifications = this.notificationData?.slice(0, 4);
      },
      error => {
        console.error("Error fetching notifications:", error);
      }
    );
  }
}