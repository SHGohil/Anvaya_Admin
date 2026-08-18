import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReportsService } from 'src/app/shared/services/reports.service';
@Component({
    selector: 'app-confirmedevents',
    templateUrl: './confirmedevents.component.html',
    styleUrls: ['./confirmedevents.component.scss'],
    standalone: false
})
export class ConfirmedeventsComponent implements OnInit {
  reportdata: any;
  reportLoading = true;
  constructor(public service : ReportsService,private cdr: ChangeDetectorRef ,private modalService: NgbModal,)
  {
 
  }
 
  ngOnInit()
  {
   this.getreport(2);
  }
 

  onviewdeails(val,content)
{
  this.modalService.open(content, { size: 'lg'})
this.geteventdetails(val.eventsId)
}
convertToIST(val: string): string {
  // bumpIN/bumpOUT are null until the event is actually bumped in/out, even
  // for events *ngIf gates as eventStatusId==2 - without this, new Date(null)
  // produces an Invalid Date and every field below becomes NaN, which the
  // date pipe then throws on rather than rendering.
  if (!val) {
    return null;
  }
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
geteventdetails(id: number) {
  this.service.getEventdetails(id).subscribe((apidata: any) => {
    this.viewdails = apidata;
  });
 }
  viewdails(arg0: string, viewdails: any) {
    throw new Error('Method not implemented.');
  }

  getreport(id){
   this.service.getDailyquery(id).subscribe(apidata=>{

     this.reportdata = apidata;
     this.reportLoading = false;
 },

error => {

  console.error('Error during login:', error);
  this.reportLoading = false;

})
}
}
