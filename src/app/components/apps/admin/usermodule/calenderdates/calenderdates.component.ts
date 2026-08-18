import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable, map, of } from 'rxjs';
import {CalenderService} from '../../../../../shared/services/calender.service'
import {EventDataService} from '../../../../../shared/services/event-data.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Modal } from 'bootstrap'; 
import { ReportsService } from '../../../../../shared/services/reports.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
    selector: 'app-calenderdates',
    templateUrl: './calenderdates.component.html',
    styleUrls: ['./calenderdates.component.scss'],
    standalone: false
})
export class CalenderdatesComponent implements OnInit {
  showedit =false;
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  currentMonthIndex = 0; // Default to January
  currentYear = new Date().getFullYear(); // Current year
  selectedIndex:any;
  todayDate: any;
  nextDate: any;
  previousDay: any;
  selectedDate: Date;
  day1: any='';
  day2: any='';
  day3: any='';
  previousdate: any;
  currentdate: any;
  loginroleid: any;
  viewdails: any;
  eventstarttime: any;
  eventendtime: any;
  // Method to generate image URL based on month and year
  getImageUrl(month: string, year: number): string {
    // Example logic to generate or retrieve the image URL
    // This is just a placeholder. You'll need to replace this with actual logic
    return `path/to/images/${month.toLowerCase()}-${year}.jpg`;
  }


 
  owlcarousel3Options = {
    center: true,
    items: 4,
    lazyLoad: true,
    loop: true,
    margin: 10,
    nav: false,
    responsive: {
      0: {
        items: 1
      },
      576: {
        items: 1
      },
      768: {
        items: 2
      },
      992: {
        items: 3
      }
    }
  }





  calendarData: any;
  specialdates: Object;
  oneeventdata: any;
  clickedMonth: any;
  venuedata$: Observable<any[]>;
  eventtypedata: Object;
  eventtimedata: Object;
  venuedata: Object;
  name: string;
  containerHeight = 50;
  typeata$: Observable<{ label: any; value: any; }[]>;
  statusdata: Object;
  eventFoodtypedata: Object;
  showevents: boolean = false;
  
  
  
  eventform: any;
  test:any; 
  myForm: any;   
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  defaultBindingsList: { value: string; label: string; job: string; }[];
  multipleSelectedVenue: number[] = [];
  multipleSelectedEventTime:any;
  eventTimeData: any;
  status: any;
  eventStatusId: number=0;
  loginid: any;
  roleid: any;   
  bootstrap: any;
  @ViewChild('exampleModal') modalElement: ElementRef;
  currentStatus: any;

  onecalendarData: Object;
  eventdatedata: any=[];
  currentdateselected: any;
  years: number[] = [];
  constructor(private fb:FormBuilder,public service : ReportsService, private calendarService: CalenderService,private modalService: NgbModal,private cdr: ChangeDetectorRef,private formBuilder : FormBuilder,private eventsdata :EventDataService,private toast: ToastService) 
  {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i <= currentYear + 5; i++) {
      this.years.push(i);
      
    }

    const currentDate = new Date();
const currentMonth = currentDate.getMonth(); // Note: getMonth() returns a zero-based index (0 for January, 1 for February, etc.)
this.selectedIndex = this.months.indexOf(this.months[currentMonth]);

  }
  @Input() month: string;
  selected: boolean = false;

  toggleSelection(i:any) {
    
      this.selectedIndex = i
    
    this.currentMonth();
  }

  ngOnInit(): void {

    let user;
    if (typeof window !== 'undefined' && window.localStorage) {
      user = localStorage.getItem('user');
    }
    var userdata = JSON.parse(user);
    if(userdata!=undefined){

      this.loginroleid = userdata.userdata.roleId;
    }
    this.myForm = this.fb.group({
      fname: ['']
    });
    this.eventform= this.fb.group({
      eventsId:[''],
      eventDate:[''],
      eventEndDate:[''],
      personName:[''],
      guestName:[''],
      phonenumber:[''],
      venueIds:[this.multipleSelectedVenue, Validators.required],
      eventTypeId:[''],
      eventTimeIds:['', Validators.required],
      eventStatusId:[''],
      eventFoodtypeId:[''],
      comment:[''],
      createdBy:[''],
      createdDate:[''],
      modifiedBy:[''],
      modifiedDate:[''],
      isStatusgivenbyuser:[''],
      bumpIN:[''],
      bumpOUT:[''],
      bumpINstring:[''],
      bumpOUTstring:[''],
    })
    this.eventform.get('eventDate').disable();
  
    this.toggleSelection(this.selectedIndex);
      this.currentYear = new Date().getFullYear()
      var date = new Date();
// Convert the date to a string in ISO format
var isoString = date.toISOString();

var formattedDate  = isoString.slice(0, 10)+'T00:00:00';
      this.getoncedatedata(formattedDate)
      this.getSpecialDates(this.currentYear);
      this.getcalenderdata(this.currentYear);
      this.getVenues();
      this.getType();
      this.getStatus();
      this.getFoodType(); 
      this.currentMonth(); 
  }

  onchangeyear(val){
    
    this.currentYear=val.target.value;
    this.getonecaledetdata(this.currentMonthIndex+1);
  }
  currentMonth() {

   var month = this.selectedIndex+1;
   this.getonecaledetdata(month);
   this.currentMonthIndex=this.selectedIndex;
    return this.months[this.currentMonthIndex];

 }
getonecaledetdata(month){
  this.calendarService.onecalenderdates(this.currentYear,month).subscribe(data => {
    this.onecalendarData = data;
    this.showedit=true;
  });
}
 nextMonth() {
    if (this.currentMonthIndex < this.months.length - 1) {
      this.currentMonthIndex++;
      var month = this.currentMonthIndex+1;
   this.getonecaledetdata(month);
    }
 }

 previousMonth() {
    if (this.currentMonthIndex > 0) {
      this.currentMonthIndex--;
      var month = this.currentMonthIndex+1;
   this.getonecaledetdata(month);
    }
 }

 goToToday() {
    const now = new Date();
    this.currentYear = now.getFullYear();
    this.selectedIndex = now.getMonth();
    this.currentMonth();
 }
  getVenues() {
    this.eventsdata.getvenue().subscribe(apidata=>{
      this.venuedata = apidata;
     
    }) 
    let user;
  if (typeof window !== 'undefined' && window.localStorage) {
   user = localStorage.getItem('user');
  }
  var userdata = JSON.parse(user);
  this.loginid = userdata.userdata.userId;
  this.roleid = userdata.userdata.roleId;

   }
  // getVenues() {
  //   this.eventsdata.getvenue().pipe(
  //      map((apidata: any[]) => apidata.map(item => ({ label: item.venueName, value :item.venueId })))
  //   ).subscribe(transformedData => {
  //      this.venuedata =transformedData;
  //      
  //   });
  //  }
   getType(){
    this.eventsdata.gettype().subscribe(apidata=>{
      this.eventtypedata = apidata;
      
    })
  }
   getFoodType(){
    this.eventsdata.getfoodtypes().subscribe(apidata=>{
      this.eventFoodtypedata = apidata;
      
    })
  }
   getStatus(){
    this.eventsdata.getStatus().subscribe(apidata=>{
      this.statusdata = apidata;
      
    })
  }
  getTimes(date:Date,venues:string){
   
    this.eventsdata.getTime(date,venues).subscribe((apidata:any)=>{
      
      this.eventTimeData= apidata   
      
    } 
    )  } 
  
  //   pipe(
  //     map((apidata: any[]) => apidata.map(item => ({ label: item.eventTimeName , value :item.eventTimeId})))
  //  ).subscribe(transformedData => {
  //     this.typeata$ = of(transformedData);
 
  //  });
  
  // } 
  getcalenderdata(id){
    this.calendarService.calenderdates(id).subscribe(data => {
      this.calendarData = data;
 
    });

  }
  adjustContainerHeight(newHeight: number) {
    this.containerHeight = newHeight;
  }
  isSpecialDate(date: string): boolean {
    
    if (this.specialdates) {
      const specialDatesArray = Object.values(this.specialdates);
      const dateToCompare = date.split('T')[0]; // Extract the date part
      return specialDatesArray.some(specialDate => specialDate.date.split('T')[0] === dateToCompare);
    }
    return false; // Handle the case when this.specialdates is undefined or null
  }
  
  
  toggleWithGreeting(tooltip, greeting: string) {
    if (tooltip.isOpen()) {
      tooltip.close();
    } else {
      tooltip.open({greeting});
    }
  }
  
  getSpecialDates(id: number) {
    
    this.calendarService.specialdates().subscribe((data: any) => { // Assuming data is an array
      this.specialdates = data.filter(c => c.year === id);
    
    });
  }
  
  
  getCellStyle(day: any, venue: any): any {
    if (!day.events || day.events.length === 0) {
      return null;          
    } else {
      const event = day.events.find((event:any) => event.venuelist.some((venueItem:any) => venueItem.venueId === venue.venueId ));
      if (event) {
        const hasStatusId2 = day.events.find((event:any) => event.venuelist.some((venueItem:any) => venueItem.venueId === venue.venueId )&&event.eventStatusId==2);
        const hasStatusId1 = day.events.find((event:any) => event.venuelist.some((venueItem:any) => venueItem.venueId === venue.venueId )&&event.eventStatusId==1);
        const hasStatusId3 = day.events.find((event:any) => event.venuelist.some((venueItem:any) => venueItem.venueId === venue.venueId )&&event.eventStatusId==0);
        const hasStatusId4 = day.events.find((event:any) => event.venuelist.some((venueItem:any) => venueItem.venueId === venue.venueId )&&event.eventStatusId==3);

  if (!hasStatusId2&&!hasStatusId1&&!hasStatusId3&&!hasStatusId4) {
    switch (event.eventStatusId) {
      case 0:
      case null: 
        return {'background-color': '#2e90fa'}; 
      case 1:
        return {'background-color': '#f79009'};
      case 2:
        return {'background-color': '#12b76a'};
      case 3:
        return {'background-color': '#f04438'};
      default:  
        return {'background-color': '#f79009'};
    }
  }
  else if(hasStatusId2){
    return {'background-color': '#12b76a'};
  }

 else if(hasStatusId1){
    return {'background-color': '#f79009'};
  }
  else if(hasStatusId3){
    return {'background-color': '#2e90fa'}; 
  }
  else if(hasStatusId4){
    return {'background-color': '#f04438'};
  }
  else{
    switch (event.eventStatusId) {
      case 0:
      case null: 
        return {'background-color': '#2e90fa'}; 
      case 1:
        return {'background-color': '#f79009'};
      case 2:
        return {'background-color': '#12b76a'};
      case 3:
        return {'background-color': '#f04438'};
      default:  
        return {'background-color': '#f79009'};
    }
  }
      } else {
        return null; 
      }
    }
  }
  onviewdeails(item,content)
  {
   this.modalService.open(content, { size: 'lg'})
    this.test=item.guestName
    this.currentStatus =parseInt(item.eventStatusId) ;
    this.status =parseInt(item.eventStatusId) ;
    this.eventStatusId = item.eventStatusId;
   
    const datePart = item.eventDate.split('T')[0]; 
    this.eventform.controls.eventsId.setValue(item.eventsId)  
    
   
    this.eventform.controls.eventDate.setValue(datePart);
  
    this.eventform.controls.eventEndDate.setValue(item.eventEndDate) 
    this.eventform.controls.personName.setValue(item.personName) 
    this.eventform.controls.guestName.setValue(item?.guestName) 
    this.eventform.controls.phonenumber.setValue(item.phonenumber) 
    this.eventform.controls.eventTypeId.setValue(item.eventType?.eventTypeId) 
    const venueIdsString = item.venueIds // This is an example input; replace it with actual data.
  
    if(venueIdsString!=null){
  
      // Convert the string to an array of numbers
      const venueIdsArray = venueIdsString.split(',').map(id => parseInt(id, 10));
    
      // Patch the form control with the array of numbers
     
      this.multipleSelectedVenue=venueIdsArray
    }
    // this.eventform.controls.venueIds.setValue(venueIdsArray);
    // const selectedVenueIds = [];
    // for (let list of item.venuelist) {
    //     selectedVenueIds.push(list.venueIds);
    // }
    // this.eventform.controls.venueIds.setValue(selectedVenueIds);
    // this.eventform.controls.venueIds.setValue(item.venueIds) 
    const eventTimeIdslist = item.eventTimeIdslist
  
    // Extract the event time IDs from `eventTimeIdslist`
    const eventTimeIdsArray = eventTimeIdslist.map(eventTime => eventTime.eventTimeId);
  
    // Patch the form control with the array of event time IDs
    // this.eventform.get('eventTimeIds').patchValue(eventTimeIdsArray);
    this.multipleSelectedEventTime = eventTimeIdsArray
  
    // Update `multipleSelectedEventTime` variable if needed
    this.multipleSelectedEventTime = eventTimeIdsArray;
    // this.eventform.controls.eventTimeIds.setValue(item.eventTimeIdslist) 
    this.eventform.controls.eventStatusId.setValue(item.eventStatusId) 
    this.eventform.controls.eventFoodtypeId.setValue(item.eventFoodTypeId) 
    this.eventform.controls.comment.setValue(item.comment) 
    this.eventform.controls.createdBy.setValue(item.createdBy) 
    this.eventform.controls.createdDate.setValue(item.createdDate) 
    this.eventform.controls.modifiedBy.setValue(item.modifiedBy) 
    this.eventform.controls.modifiedDate.setValue(item.modifiedDate) 
    this.eventform.controls.isStatusgivenbyuser.setValue(item.isStatusgivenbyuser)
    if(item.eventStatusId==2){

      // this.eventform.controls.bumpIN.setValue(this.convertToIST(item.bumpIN)) 
      // this.eventform.controls.bumpOUT.setValue(this.convertToIST(item.bumpOUT)) 
      this.eventform.controls.bumpIN.setValue(item.bumpIN)
      this.eventform.controls.bumpOUT.setValue(item.bumpOUT)
    } 
    else{
   this.updatetime(item.eventsId);
      
      this.eventform.controls.bumpIN.setValue(this.eventstarttime) 
      this.eventform.controls.bumpOUT.setValue(this.eventendtime) 

    }
    this.eventform.controls.bumpINstring.setValue(this.convertToIST(item.bumpINstring)) 
    this.eventform.controls.bumpOUTstring.setValue(this.convertToIST(item.bumpOUTstring)) 
    this.getTimes(item.eventDate,item.venueIds)
   // this.geteventdetails(item.eventsId)
   
  }
  async updatetime(id: any) {
    try {
      const apidata: any = await this.service.eventstartandendtime(id).toPromise();
      this.eventstarttime = apidata.starttime;
      this.eventendtime = apidata.endtime;
    
      console.log("Start Time:", this.eventform.controls.bumpIN.setValue(this.eventstarttime) );
      console.log("End Time:", this.eventform.controls.bumpOUT.setValue(this.eventendtime) );
  
      // Call other functions here that need to be executed after receiving the response
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle error if necessary
    }
  }
  async updatetimeonselecttime(id: any, date:any) {
    try {
      const apidata: any = await this.service.eventstartandendtimebydate(id,date).toPromise();
      this.eventstarttime = apidata.starttime;
      this.eventendtime = apidata.endtime;
    
      console.log("Start Time:", this.eventform.controls.bumpIN.setValue(this.eventstarttime) );
      console.log("End Time:", this.eventform.controls.bumpOUT.setValue(this.eventendtime) );
  
      // Call other functions here that need to be executed after receiving the response
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle error if necessary
    }
  }
  changebumpinbumpout(events) {
    if (!Array.isArray(events)) {
        console.error('events is not an array');
        return;
    }

    const eventIds = events.map(event => event.eventTimeId);

    const target = eventIds.join(',');
    var date= this.eventform.controls.eventDate.value;  
    this.updatetimeonselecttime(target,date);  
    console.log(target); 
}

  geteventdetails(id: number) {
    this.service.getEventdetails(id).subscribe((apidata: any) => {
      this.viewdails = apidata;
      console.log("viewdetails", this.viewdails);
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
  Save() {
    if(this.eventform.invalid){
      this.eventform.markAllAsTouched();
      return;
    }
  
    let payload = {
      eventsId: this.eventform.controls.eventsId.value,
      eventDate: this.eventform.controls.eventDate.value,
      eventEndDate: this.eventform.controls.eventEndDate.value,
      personName: this.eventform.controls.personName.value,
      guestName: this.eventform.controls.guestName.value,
      phonenumber: this.eventform.controls.phonenumber.value,
      venueIds: this.multipleSelectedVenue.join(','),
      eventTypeId: this.eventform.controls.eventTypeId.value,
      eventTimeIds: this.multipleSelectedEventTime.join(',') ,
      eventStatusId: parseInt(this.eventform.controls.eventStatusId.value),
      eventFoodtypeId: this.eventform.controls.eventFoodtypeId.value ,
      comment: this.eventform.controls.comment.value?.length>0 ? this.eventform.controls.comment.value : ' ' ,
      createdBy: this.eventform.controls.createdBy.value == null ? 0: this.eventform.controls.createdBy.value ,
      createdDate: this.eventform.controls.createdDate.value ,
      modifiedBy: this.loginid ,
      modifiedDate: this.currentDateTime() ,
      isStatusgivenbyuser: this.status == 1 ? false : true ,
      bumpIN:  this.status==1?null:new Date(this.eventform.controls.bumpIN.value).toISOString() ,
      bumpOUT: this.status==1?null:new Date(this.eventform.controls.bumpOUT.value).toISOString(),
      bumpINstring:  this.status==1?null:new Date(this.eventform.controls.bumpIN.value).toISOString() ,
      bumpOUTstring: this.status==1?null:new Date(this.eventform.controls.bumpOUT.value).toISOString(),
  };

  if(parseInt(this.currentStatus) != 2 && parseInt(this.currentStatus) != 3  ) {
        
      this.calendarService.updateEvent(this.roleid,payload).subscribe(data => {
      
        const currentYear = new Date().getFullYear()
        this.getcalenderdata(currentYear);
          this.showedit = false; 
          this.modalService.dismissAll();
         this.getoncedatedata(this.currentdateselected);
          this.toast.success('Success', 'Event Updated Successfully');
      },(error:any)=>{
      
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.error ,  
        });
      });
  }  else {
     
      payload['isApproved'] = null;
      this.calendarService.authenticateEvent(payload).subscribe(data => {
        this.getoncedatedata(this.currentdateselected);
        const currentYear = new Date().getFullYear();
        this.modalService.dismissAll();
        this.toast.success('Saved', 'Event Details Sent for Authentication');
        this.getcalenderdata(currentYear);
          this.showedit = false;
      },(error:any)=>{
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.error ,  
        });
  });
  } 
} 

  currentDateTime(){
  const currentDateTime = new Date();

// Convert the current date and time to ISO 8601 format
const currentDateTimeISO = currentDateTime.toISOString();
 return currentDateTimeISO
}
 
   
  closeUpdate(){
    this.showedit = false;
}

  getFormattedDate(date: string): string {
    const day = new Date(date).getDate();
    const formattedDay=day.toString().padStart(2, '0');
    const suffix = (day === 1 || day === 21 || day === 31) ? 'st' : (day === 2 || day === 22) ? 'nd' : (day === 3 || day === 23) ? 'rd' : 'th';
    return `${formattedDay}`;
  }
  closeModal() {
   
    const modalInstance = new Modal(this.modalElement?.nativeElement);
    modalInstance.close();
 } 

 updateEventStatus(newStatusId: number) {
  
  // Perform the necessary update using the new status ID
 
  this.status = newStatusId;
  if (newStatusId == 2) {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
   
    // Check if bumpIN has a value of the year 1970
    const bumpInTime = this.eventform.controls.bumpIN.value;
    if (bumpInTime && new Date(bumpInTime).getFullYear() === 1970) {
       // If bumpIN has a value of the year 1970, set it to today's date at 00:00
       this.eventform.controls.bumpIN.patchValue(todayString + 'T00:00');
    }
   
    // Similar check and update for bumpOUT
    const bumpOutTime = this.eventform.controls.bumpOUT.value;
    if (bumpOutTime && new Date(bumpOutTime).getFullYear() === 1970) {
       // If bumpOUT has a value of the year 1970, set it to today's date at 23:59
       this.eventform.controls.bumpOUT.patchValue(todayString + 'T23:59');
    }
   
  
    this.eventform.get('bumpIN')?.setValidators(Validators.required);
    this.eventform.get('bumpOUT')?.setValidators(Validators.required);
    this.eventform.get('eventFoodtypeId')?.setValidators(Validators.required);
   }
    else {
   
    this.eventform.get('bumpIN')?.clearValidators();
    this.eventform.get('bumpOUT')?.clearValidators();
    this.eventform.get('eventFoodtypeId')?.clearValidators();
  }
  
  this.eventform.get('bumpIN')?.updateValueAndValidity();
  this.eventform.get('bumpOUT')?.updateValueAndValidity();
  this.eventform.get('eventFoodtypeId')?.updateValueAndValidity();
  // Add your update logic here, e.g., make an API call to update the event status
}
  onclickdata(day,name) {
    this.showedit=false;
   var date = day.date;
   this.currentdateselected = date;
   this.getoncedatedata(date);
   
  }
  sortEventsByStatus(events, customOrder) {
    return events.sort((a, b) => {
      const indexA = customOrder.indexOf(a.eventStatusId);
      const indexB = customOrder.indexOf(b.eventStatusId);
  
      
      return (indexA === -1 ? Number.MAX_SAFE_INTEGER : indexA) - 
             (indexB === -1 ? Number.MAX_SAFE_INTEGER : indexB);
    });

  }
 customOrder = [2, 1, 3, 0];

// Call the function
 
  getoncedatedata(date){
    this.calendarService.currentdateevents(date).subscribe((apidata=[])=>{
      this.eventdatedata = apidata;
      // if(this.eventdatedata.previousDateEvents[0]?.eventDate)
        console.log(this.eventdatedata)
        this.eventdatedata.currentDateEvents = this.sortEventsByStatus(this.eventdatedata.currentDateEvents, this.customOrder); 
        this.eventdatedata.nextDateEvents = this.sortEventsByStatus(this.eventdatedata.nextDateEvents, this.customOrder); 
        this.eventdatedata.previousDateEvents = this.sortEventsByStatus(this.eventdatedata.previousDateEvents, this.customOrder); 
        this.previousdate=this.eventdatedata.previousdate;
      console.log(this.previousdate)
      this.currentdate=this.eventdatedata.currentdate;
      this.nextDate=this.eventdatedata.nextdate;
      console.log(apidata, "--currentdateevents--")
      if (this.eventdatedata.previousDateEvents[0]?.eventDate) { 
    
        const date = new Date(this.eventdatedata.previousDateEvents[0]?.eventDate);
        this.day1 = date
    
        const day2 = new Date(date); 
        day2.setDate(day2.getDate() + 1); 
        this.day2 = day2
    
        const day3 = new Date(date); 
        day3.setDate(day3.getDate() + 2); 
        this.day3 = day3
    }  
    
    if (this.eventdatedata.currentDateEvents[0]?.eventDate) { 
  
      const date = new Date(this.eventdatedata.currentDateEvents[0]?.eventDate);
      this.day2= date
  
      const day1 = new Date(date); // Creating a new Date object for day1
      day1.setDate(day1.getDate() - 1); // Decrementing the date by 1 day
      this.day1 = day1
  
      const day3 = new Date(date); // Creating a new Date object for day3
      day3.setDate(day3.getDate() + 1); // Incrementing the date by 1 day
      this.day3 = day3
  }
  
      if(this.eventdatedata.nextDateEvents[0]?.eventDate){ 
        this.day3 = new Date(this.eventdatedata.nextDateEvents[0]?.eventDate);
       
        const date = new Date(this.eventdatedata.nextDateEvents[0]?.eventDate);
      this.day3= date
  
      const day1 = new Date(date); // Creating a new Date object for day1
      day1.setDate(day1.getDate() - 2); // Decrementing the date by 1 day
      this.day1 = day1
  
      const day2 = new Date(date); // Creating a new Date object for day3
      day2.setDate(day2.getDate() - 1); // Incrementing the date by 1 day
      this.day2 = day2
       
      }  
     
      
      
    })
    console.log(this.eventdatedata,"eventdatedata================")
  }
  trackByEventsId(index: number, item: any): number {
    return item.eventsId;
  }

  owlcarousel1 = [
    { id: 1, img: "assets/images/slider/1.jpg" },
    { id: 2, img: "assets/images/slider/2.jpg" },
    { id: 3, img: "assets/images/slider/3.jpg" },
    { id: 4, img: "assets/images/slider/4.jpg" },
    { id: 5, img: "assets/images/slider/5.jpg" },
    { id: 2, img: "assets/images/slider/6.jpg" },
    { id: 3, img: "assets/images/slider/7.jpg" },
    { id: 4, img: "assets/images/slider/8.jpg" },
    { id: 5, img: "assets/images/slider/9.jpg" },
    { id: 6, img: "assets/images/slider/10.jpg" },
    { id: 7, img: "assets/images/slider/1.jpg" },
    { id: 8, img: "assets/images/slider/2.jpg" },
    { id: 9, img: "assets/images/slider/3.jpg" },
    { id: 10, img: "assets/images/slider/4.jpg" },
    { id: 11, img: "assets/images/slider/5.jpg" },
    { id: 12, img: "assets/images/slider/6.jpg" },

  ];

  //Options
  // owlcarousel1Options = {
  //   loop: true,
  //   margin: 10,
  //   lazyLoad: true,
  //   nav: false,
  //   responsive: {
  //     0: {
  //       items: 1
  //     },
  //     600: {
  //       items: 3
  //     },
  //     1000: {
  //       items: 5
  //     }
  //   }
  // };

  owlcarousel1Options = {
    items: 6, // Display six items per slide
    loop: true, // Loop back to the first slide after the last one
    autoplay: false, // Disable autoplay if not needed
    autoplayTimeout: 0, // Set to 0 to disable automatic transition
    autoplayHoverPause: false, // Disable pausing on hover if not needed
    responsive: [
      {
        breakpoint: 1024,
        items: 6
      },
      {
        breakpoint: 768,
        items: 4
      },
      {
        breakpoint: 480,
        items: 2
      }
    ]
  };
  
  
  noofdays(val: string): number {
    const today = new Date();
    const date = new Date(val);
  
    // Calculate the difference in milliseconds
    const differenceMs = today.getTime() - date.getTime();
  
    // Convert milliseconds to days
    const days = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));
  
    return days;
  }
  
}