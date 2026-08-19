import { Component, OnInit } from '@angular/core';
import {TodaysqueryService} from './../../../../../shared/services/todaysquery.service'
import { ReportsService } from 'src/app/shared/services/reports.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
    selector: 'app-todaysevents',
    templateUrl: './todaysevents.component.html',
    styleUrls: ['./todaysevents.component.scss'],
    standalone: false
})
export class TodayseventsComponent implements OnInit {
  currentDate:string;
  todaysqueriesdata: any;
  count: number;
  viewdails: any;
  showtab:boolean=true;
  todaysLoading = true;
  
  constructor(public todaysservice : TodaysqueryService,public service : ReportsService,private modalService: NgbModal,) {
    
  }
  
  ngOnInit(): void {
    // currentDate was declared but never assigned, so the template's
    // "Today : {{currentDate}}" rendered with nothing after the colon.
    this.currentDate = this.getCurrentDateFormatted();
    this.gettodaysdata();
  }
 
  gettodaysdata(){

    this.todaysservice.getTodaysquerys().subscribe((apidata:[])=>{

          this.todaysqueriesdata = apidata;
          this.count = apidata?.length;
          this.todaysLoading = false;
    },
      error => {

         console.error('Error during login:', error);
         this.todaysLoading = false;

      })
  }
  adddailyquery(){
    this.showtab=false;
  }
  onviewdeails(val,content)
{
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
