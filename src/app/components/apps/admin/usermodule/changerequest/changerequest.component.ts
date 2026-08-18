import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {ChangerequestService} from '../../../../../shared/services/changerequest.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder } from '@angular/forms';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import Swal from 'sweetalert2';
@Component({
    selector: 'app-changerequest',
    templateUrl: './changerequest.component.html',
    styleUrls: ['./changerequest.component.scss'],
    standalone: false
})
export class ChangerequestComponent implements OnInit {
  /** The pending queue, not the whole { pending, approved, rejected } response. */
  changerequestdata: any[] = [];
  viewdails: any;
  changedetails: any;
  isapproved: boolean;
  // changerequestdata starts as [] (not null/undefined), so the existing
  // "no data" empty-state check below was already true before the API
  // ever responded - the empty-state image showed on every load, not just
  // genuinely-empty results.
  changerequestLoading = true;


  constructor(public rservice : ReportsService,private service:ChangerequestService,private modalService: NgbModal, private fb: FormBuilder , private cdr: ChangeDetectorRef, private toast: ToastService){

  }

  ngOnInit(): void {
    this.getspecialdates();
  }

  getspecialdates(){
    this.service.getchangerequest().subscribe({
      next: (apidata: any) => {
      // The API returns { pending, approved, rejected }, not a flat list. This
      // assigned the whole object and the template did *ngFor over it, so
      // Angular threw NG02200 ("Cannot find a differ supporting object") and
      // the screen rendered nothing.
      //
      // This screen offers Approve and Decline on every card, so it shows the
      // pending queue - a request that has already been decided must not be
      // decided again.
      this.changerequestdata = apidata?.pending ?? [];
      this.changerequestLoading = false;
      },
      error: () => {
        this.changerequestLoading = false;
      },
    })
  }

  // Pure, template-only helpers for the Original/Requested comparison view -
  // don't touch viewdails/changedetails or any other state.
  fieldChanged(a: any, b: any): boolean {
    return (a ?? null) !== (b ?? null);
  }

  listChanged(a: any[], b: any[], key: string): boolean {
    const names = (list: any[]) => (list || []).map(x => x?.[key]).sort().join(',');
    return names(a) !== names(b);
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
    // Both outcomes used to report "Event Updated Successfully". A decline does
    // not update the event at all - the API leaves it untouched - so saying it
    // was updated told the reviewer the opposite of what happened.
    this.toast.success(
      this.isapproved ? 'Approved' : 'Declined',
      this.isapproved
        ? 'The change request was approved and the event has been updated.'
        : 'The change request was declined. The event is unchanged.',
    );
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
