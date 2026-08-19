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
