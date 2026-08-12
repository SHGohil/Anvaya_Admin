import { Component, OnInit } from '@angular/core';
import {TodaysqueryService} from './../../../../../shared/services/todaysquery.service'
import { ReportsService } from 'src/app/shared/services/reports.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-todaysevents',
  templateUrl: './todaysevents.component.html',
  styleUrls: ['./todaysevents.component.scss']
})
export class TodayseventsComponent implements OnInit {
  currentDate:string;
  todaysqueriesdata: Object;
  count: number;
  viewdails: any;
  showtab:boolean=true;
  
  constructor(public todaysservice : TodaysqueryService,public service : ReportsService,private modalService: NgbModal,) {
    
  }
  
  ngOnInit(): void {
    
    this.gettodaysdata();
  }
 
  gettodaysdata(){
    
    this.todaysservice.getTodaysquerys().subscribe((apidata:[])=>{

          this.todaysqueriesdata = apidata;
          this.count = apidata?.length;
    },
      error => {
         
         console.error('Error during login:', error);
      
      })
  }
  adddailyquery(){
    this.showtab=false;
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
  onviewdeails(val,content)
{
  debugger
  this.modalService.open(content, { size: 'lg'})
this.geteventdetails(val.eventsId)
}

geteventdetails(id: number) {
  this.service.getEventdetails(id).subscribe((apidata: any) => {
    this.viewdails = apidata;
  });
 }
   getCurrentDateFormatted(): string {
    const date = new Date();
    const day = date.getDate().toString().padStart(2, '0'); // Ensure day is two digits
    const monthNames = ["January", "February", "March", "April", "May", "June",
       "July", "August", "September", "October", "November", "December"
    ];
    const month = monthNames[date.getMonth()]; // Get month name
    const year = date.getFullYear();
   
    return `${day} ${month} ${year}`;
   }
}
