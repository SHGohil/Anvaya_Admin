import { ChangeDetectorRef, Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReportsService } from 'src/app/shared/services/reports.service';
@Component({
    selector: 'app-confirmedevents',
    templateUrl: './confirmedevents.component.html',
    styleUrls: ['./confirmedevents.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ConfirmedeventsComponent implements OnInit {
  reportdata: any[] = [];
  reportLoading = true;
  total = 0;
  page = 1;
  loadingMore = false;
  readonly pageSize = 50;
  constructor(public service : ReportsService,private cdr: ChangeDetectorRef ,private modalService: NgbModal,)
  {
 
  }
 
  ngOnInit()
  {
   this.loadPage();
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

  /** Loads the next page of confirmed events and appends it to what is already shown. */
  loadPage(){
    this.loadingMore = true;
    this.service.getEventsPage(2, this.page, this.pageSize).subscribe({
      next: ({ items, total }) => {
        this.reportdata = [...this.reportdata, ...items];
        this.total = total;
        this.page++;
        this.reportLoading = false;
        this.loadingMore = false;
      },
      error: () => {
        this.reportLoading = false;
        this.loadingMore = false;
      }
    });
  }

  get hasMore(): boolean {
    return this.reportdata.length < this.total;
  }
}
