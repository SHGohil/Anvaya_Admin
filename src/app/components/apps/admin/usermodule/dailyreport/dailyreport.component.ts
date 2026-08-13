import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, MinLengthValidator, ValidatorFn, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalenderService } from 'src/app/shared/services/calender.service';
import { EventDataService } from 'src/app/shared/services/event-data.service';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { TodaysqueryService } from 'src/app/shared/services/todaysquery.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
@Component({
    selector: 'app-dailyreport',
    templateUrl: './dailyreport.component.html',
    styleUrls: ['./dailyreport.component.scss'],
    standalone: false
})
export class DailyreportComponent  implements OnInit {
  activeTab: string = 'all';
  reportdata: any[]=[];
  statusid: any;
  viewdails: Object;
  eventstatusData: Object;
  form: FormGroup;
  multipleSelectedVenue: number[] = [];
  myForm: FormGroup<{ fname: FormControl<string>; }>;
  eventform: FormGroup<{ eventsId: FormControl<string>; eventDate: FormControl<string>;  personName: FormControl<string>; guestName: FormControl<string>; phonenumber: FormControl<string>; venueIds: FormControl<number[]>; eventTypeId: FormControl<string>; eventTimeIds: FormControl<string>; eventStatusId: FormControl<string>; eventFoodtypeId: FormControl<string>; comment: FormControl<string>; createdBy: FormControl<string>; createdDate: FormControl<string>; modifiedBy: FormControl<string>; modifiedDate: FormControl<string>; isStatusgivenbyuser: FormControl<string>; bumpIN: FormControl<string>; bumpOUT: FormControl<string>; bumpINstring: FormControl<string>; bumpOUTstring: FormControl<string>; }>;
  specialdates: any[];
  venuedata: Object;
  loginid: any;
  roleid: any;
  eventtypedata: Object;
  eventFoodtypedata: any;
  statusdata: Object;
  status: number;
  eventTimeData: Object;
  test: any;
  currentStatus: any;
  eventStatusId: any;
  showedit: boolean;
  multipleSelectedEventTime: any;
  currentstate: any;
  loginroleid: any;
  eventstarttime: any;
  eventendtime: any;
  uniqueNames: string[];
  filtered_data: any[]=[];
  setActiveTab(tab: string) {
    this.activeTab = tab;
    if (this.activeTab == "all") {
      this.statusid = 0;
      this.getreport(this.statusid)
    }
    else if (this.activeTab == "confirmed") {
      this.statusid = 2;
      this.getreport(this.statusid)
    }
    else if (this.activeTab == "tentative") {
      this.statusid = 1;
      this.getreport(this.statusid)
    } else if (this.activeTab == "history") {
      this.statusid = 0;
      this.fullhistory(this.statusid)
    }
    else {
      this.statusid = 3;
      this.getreport(this.statusid)
    }
  }
 primary_color = "#F3C37C";
 secondary_color = "#B9E298";
 skillStatus: any ;
year: number;
data: any;
openpercentage:any;
tentativepercentage:any;
confirmedPercentage:any;
lostPercentage:any;
years: number[] = [];
total: any;
startDate:any;
endDate:any;
seleted_value: string = '';
 constructor(public todaysservice : TodaysqueryService,public service : ReportsService,private calendarService: CalenderService,private eventsdata :EventDataService,private modalService: NgbModal, private fb: FormBuilder , private cdr: ChangeDetectorRef )
 {
  const currentYear = new Date().getFullYear();
  for (let i = currentYear; i <= currentYear + 5; i++) {
    this.years.push(i);
    
  }
 }

 ngOnInit()
 {

  const currentyear = new Date().getFullYear()
  this.year = currentyear;
  this.getanalytics(this.year);
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
  this.eventform = this.fb.group({
    eventsId: [''],
    eventDate: ['', [Validators.required]],
    personName: ['', [Validators.required]],
    guestName: ['', [Validators.required]],
    phonenumber: ['', [Validators.required , this.phoneNumberValidator() ]],
    venueIds: [this.multipleSelectedVenue,Validators.required ],
    eventTypeId: [''],
    eventTimeIds: ['',[Validators.required]],
    eventStatusId: [''],
    eventFoodtypeId: [''],
    comment: [''],
    createdBy: [''],
    createdDate: [''],
    modifiedBy: [''],
    modifiedDate: [''],
    isStatusgivenbyuser: [''],
    bumpIN: [''],
    bumpOUT: [''],
    bumpINstring: [''],
    bumpOUTstring: [''],
});
this.eventform.get('eventDate').disable();
  this.getreport(0);
  this.getStatus();

this.form = this.fb.group({
  eventstatus:[''],
})
const currentYear = new Date().getFullYear()
  this.getSpecialDates(currentYear);
      this.getVenues();
      this.getType();
      this.getFoodType();  
 }  
 onchangeyear(val){
  this.getanalytics(val.target.value)
 }
  getanalytics (val){
 
    this.todaysservice.getanalytics(val).subscribe((apidata:any)=>{
      const total = apidata.open + apidata.tentative + apidata.confirmed + apidata.lost;
      var open =apidata.open;
      var tentative = apidata.tentative;
      var confirmed = apidata.confirmed;
      var lost =apidata.lost;
      this.total = apidata.total;
      this.skillStatus = {
        chart: {
          type: "radialBar",
          height: 375,
          offsetY: -30,
          offsetX: 20,
        },
        plotOptions: {
          radialBar: {
            size: undefined,
            inverseOrder: false,
            hollow: {
              margin: 10,
              size: "30%",
              background: "transparent",
            },
            track: {
              show: true,
              background: "#f2f2f2",
              strokeWidth: "10%",
              opacity: 1,
              margin: 3,
            },
          },
        },
        series: [apidata.openPercentage, apidata.tentativePercentage, apidata.confirmedPercentage,apidata.lostPercentage],
        labels: ["Open"+`(${open})`, "Tentative"+`(${tentative})`, "Confirmed"+`(${confirmed})`,"Lost"+`(${lost})`],
        legend: {
          show: true,
          fontSize: "16px",
          fontFamily: "Roboto, sans-serif",
          fontWeight: 500,
          labels: {
            colors: "#2C323F",
          },
          markers: {
            width: 86,
            height: 18,
            radius: 3,
          },
        },
        colors: ["#57AEEC", "#F3C37C", "#B9E298","#807979"],
        responsive: [
          {
            breakpoint: 767,
            options: {
              title: {
                style: {
                  fontSize: "16px",
                },
              },
            },
          },
        ],
      };
      if (total > 0) {
        this.data = {
          chartType: 'PieChart',
          dataTable: [
            ['Task', 'Count'],
            ['Open' + ` (${open})`, open],
            ['Tentative' + ` (${tentative})`, tentative],
            ['Confirmed' + ` (${confirmed})`, confirmed],
            ['Lost' + ` (${lost})`, lost],
          ],
          options: {
            is3D: true,
            width: '100%',
            height: 400,
            colors: ["#57AEEC", "#F3C37C", "#B9E298", "#807979"],
            backgroundColor: 'transparent'
          },
        };
      } else {
        this.data = {
          chartType: 'PieChart',
          dataTable: [
            ['Task', 'Count'],
            ['No Data Available', 1],
          ],
          options: {
            is3D: true,
            width: '100%',
            height: 400,
            colors: ["#CCCCCC"],
            backgroundColor: 'transparent'
          },
        };
      }

      this.tentativepercentage= {
        chart: {
          height: 70,
          type: "bar",
          stacked: true,
          sparkline: {
            enabled: true,
          },
        },
        plotOptions: {
          bar: {
            horizontal: true,
            barHeight: "15%",
            colors: {
              backgroundBarColors: [this.primary_color],
              backgroundBarOpacity: 0.2,
            },
          },
        },
        colors: [this.primary_color],
        stroke: {
          width: 0,
        },
        fill: {
          colors: [this.primary_color],
          type: "gradient",
          gradient: {
            gradientToColors: [this.primary_color],
          },
        },
        series: [
          {
            name: "Process 1",
            data: [apidata.tentativePercentage],
          },
        ],
        title: {
          floating: true,
          offsetX: -10,
          offsetY: 5,
          text: "Tentative"+` (${tentative})`,
          style: {
            fontSize: "18px",
            fontFamily: "Roboto, sans-serif",
            fontWeight: 500,
          },
        },
        subtitle: {
          floating: true,
          align: "right",
          offsetY: 0,
          text: `${apidata.tentativePercentage}`+"%",
          style: {
            fontSize: "14px",
          },
        },
        tooltip: {
          enabled: false,
        },
        xaxis: {
          categories: ["Packed"],
        },
        yaxis: {
          max: 100,
        },
        responsive: [
          {
            breakpoint: 767,
            options: {
              title: {
                style: {
                  fontSize: "16px",
                },
              },
            },
          },
        ],
      };

      this.confirmedPercentage={
        chart: {
          height: 70,
          type: "bar",
          stacked: true,
          sparkline: {
            enabled: true,
          },
        },
        plotOptions: {
          bar: {
            horizontal: true,
            barHeight: "15%",
            colors: {
              backgroundBarColors: [this.secondary_color],
              backgroundBarOpacity: 0.2,
              backgroundBarRadius: 10,
            },
          },
        },
        colors: [this.secondary_color],
        stroke: {
          width: 0,
        },
        series: [
          {
            name: "Confirmed",
            data: [apidata.confirmedPercentage],
          },
        ],
        title: {
          floating: true,
          offsetX: -10,
          offsetY: 5,
          text: "Confirmed" +` (${confirmed})`,
          style: {
            fontSize: "18px",
            fontFamily: "Roboto, sans-serif",
            fontWeight: 500,
          },
        },
        subtitle: {
          floating: true,
          align: "right",
          offsetY: 0,
          text: `${apidata.confirmedPercentage}`+"%",
          style: {
            fontSize: "14px",
          },
        },
        tooltip: {
          enabled: false,
        },
        xaxis: {
          categories: ["Process 2"],
        },
        yaxis: {
          max: 100,
        },
        fill: {
          colors: [this.secondary_color],
          type: "gradient",
          gradient: {
            inverseColors: false,
            gradientToColors: [this.secondary_color],
          },
        },
        responsive: [
          {
            breakpoint: 767,
            options: {
              title: {
                style: {
                  fontSize: "16px",
                },
              },
            },
          },
        ],
      };

      this.lostPercentage = {
        chart: {
          height: 70,
          type: "bar",
          stacked: true,
          sparkline: {
            enabled: true,
          },
        },
        plotOptions: {
          bar: {
            horizontal: true,
            barHeight: "15%",
            colors: {
              backgroundBarColors: ["#807979"],
              backgroundBarOpacity: 0.2,
              backgroundBarRadius: 10,
            },
          },
        },
        colors: ["#807979"],
        stroke: {
          width: 0,
        },
        series: [
          {
            name: "Lost",
            data: [apidata.lostPercentage],
          },
        ],
        fill: {
          colors: ["#807979"],
          type: "gradient",
          gradient: {
            gradientToColors: ["#807979"],
          },
        },
        title: {
          floating: true,
          offsetX: -10,
          offsetY: 5,
          text: "Lost"+` (${lost})`,
          style: {
            fontSize: "18px",
            fontFamily: "Roboto, sans-serif",
            fontWeight: 500,
          },
        },
        subtitle: {
          floating: true,
          align: "right",
          offsetY: 0,
          text: `${apidata.lostPercentage}`+"%",
          style: {
            fontSize: "14px",
          },
        },
        tooltip: {
          enabled: false,
        },
        xaxis: {
          categories: ["Reach Station"],
        },
        yaxis: {
          max: 100,
        },
        responsive: [
          {
            breakpoint: 767,
            options: {
              title: {
                style: {
                  fontSize: "16px",
                },
              },
            },
          },
        ],
      };

      this.openpercentage= {
        chart: {
          height: 70,
          type: "bar",
          stacked: true,
          sparkline: {
            enabled: true,
          },
        },
        plotOptions: {
          bar: {
            horizontal: true,
            barHeight: "15%",
            colors: {
              backgroundBarColors: ["#57AEEC"],
              backgroundBarOpacity: 0.2,
              backgroundBarRadius: 10,
            },
          },
        },
        colors: ["#57AEEC"],
        stroke: {
          width: 0,
        },
        series: [
          {
            name: "Open",
            data: [apidata.openPercentage],
          },
        ],
        fill: {
          colors: ["#57AEEC"],
          type: "gradient",
          gradient: {
            gradientToColors: ["#57AEEC"],
          },
        },
        title: {
          floating: true,
          offsetX: -10,
          offsetY: 5,
          text: "Open"+` (${open})`,
          style: {
            fontSize: "18px",
            fontFamily: "Roboto, sans-serif",
            fontWeight: 500,
          },
        },
        subtitle: {
          floating: true,
          align: "right",
          offsetY: 0,
          text: `${apidata.openPercentage}`+"%",
          style: {
            fontSize: "14px",
          },
        },
        tooltip: {
          enabled: false,
        },
        xaxis: {
          categories: ["Out for delivery"],
        },
        yaxis: {
          max: 100,
        },
        responsive: [
          {
            breakpoint: 767,
            options: {
              title: {
                style: {
                  fontSize: "16px",
                },
              },
            },
          },
        ],
      };
      this.cdr.detectChanges();
    })
  }
 phoneNumberValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const value: string = control.value;
    if (!value) {
      return null; // If value is empty, leave validation to the required validator
    }
    const isValidLength = value.length >= 6 && value.length <= 15;
    return isValidLength ? null : { 'invalidLength': {value: control.value} };
  };
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
onPhoneNumberInput(event: any) {
  const input = event.target;
  let value = input.value;
  // Remove non-digit characters
  value = value.replace(/\D/g, '');
  // Limit the input to 15 digits
  if (value.length > 15) {
      value = value.slice(0, 15);
  }
  // Update the input value
  input.value = value;
  // Update the form control value
  this.form.get('phonenumber').setValue(value, { emitEvent: false });
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
getTimes(date:Date,venues:string){
 
  this.eventsdata.getTime(date,venues).subscribe((apidata:any)=>{
    
    this.eventTimeData= apidata   
    
  } 
  )  } 
 getFoodType(){
  this.eventsdata.getfoodtypes().subscribe(apidata=>{
    this.eventFoodtypedata = apidata;
    
  })
}
updateEventStatus(newStatusId: any) {

  // Perform the necessary update using the new status ID
 
  this.status = parseInt(newStatusId);
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

 getSpecialDates(id: number) {
    
  this.calendarService.specialdates().subscribe((data: any[]) => { // Assuming data is an array
    this.specialdates = data.filter(c => c.year === id);
  
  });
}


noofdays(val: string): number {
  const today = new Date();
  const date = new Date(val);

  // Calculate the difference in milliseconds
  const differenceMs = today.getTime() - date.getTime();

  // Convert milliseconds to days
  const days = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));

  return days;
}

 getreport(id){
  this.currentstate =id;
  this.service.getDailyquery(id).subscribe((apidata:[])=>{
   this.filtered_data = apidata;
    if(id ==0){
      this.reportdata = apidata.filter((c:any)=>c.eventStatusId ==0 ||c.eventStatusId ==null );
      // this.reportdata = this.reportdata.sort((a, b) => {
      //   return new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime();
      // });
     this.dateFilter();
      const uniqueMap = new Map<string, string>();
      this.reportdata.forEach(name => {
        const key = name?.personName.toLowerCase(); // Normalize for comparison
        if (!uniqueMap.has(key)) {
          uniqueMap.set(key, name?.personName); // Store original casing of first appearance
        }
      });
      this.uniqueNames = Array.from(uniqueMap.values());
    }
    else {
      this.reportdata = apidata;
       this.dateFilter();
        const uniqueMap = new Map<string, string>();
      this.reportdata.forEach(name => {
        const key = name?.personName.toLowerCase(); // Normalize for comparison
        if (!uniqueMap.has(key)) {
          uniqueMap.set(key, name?.personName); // Store original casing of first appearance
        }
      });
      this.uniqueNames = Array.from(uniqueMap.values());
    }
    console.log("reportdata" , this.reportdata)
},
error => {
   
   console.error('Error during login:', error);

})
}
  onNameChange(value) {
    this.seleted_value=value;
    this.reportdata = this.filtered_data.filter((report) => report.personName ===  this.seleted_value);
  }
  fullhistory(id) {
    this.currentstate = id;
    this.service.getDailyquery(id).subscribe((apidata: []) => {
      this.filtered_data = apidata;
      if (id == 0) {
        this.reportdata = apidata.filter((c: any) => c.eventStatusId == 0 || c.eventStatusId == null);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set time to start of today

        this.reportdata = this.reportdata
          .filter(item => new Date(item.eventDate).getTime() < today.getTime())
          .sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());

        const uniqueMap = new Map<string, string>();
        this.reportdata.forEach(name => {
          const key = name?.personName.toLowerCase(); // Normalize for comparison
          if (!uniqueMap.has(key)) {
            uniqueMap.set(key, name?.personName); // Store original casing of first appearance
          }
        });
        this.uniqueNames = Array.from(uniqueMap.values());
      }
      else {
        this.reportdata = apidata;
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set time to start of today

        this.reportdata = this.reportdata
          .filter(item => new Date(item.eventDate).getTime() < today.getTime())
          .sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());

        const uniqueMap = new Map<string, string>();
        this.reportdata.forEach(name => {
          const key = name?.personName.toLowerCase(); // Normalize for comparison
          if (!uniqueMap.has(key)) {
            uniqueMap.set(key, name?.personName); // Store original casing of first appearance
          }
        });
        this.uniqueNames = Array.from(uniqueMap.values());
      }
      console.log("reportdata", this.reportdata)
    },
      error => {

        console.error('Error during login:', error);

      })
  }

  filterData() {
     this.seleted_value='';
    if (!this.startDate || !this.endDate) {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Please select both start and end dates.',
      });
      return;
    }
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    if (start.toDateString() === end.toDateString()) {
       Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Start date and end date cannot be the same.',
      });
      return;
    }
    if (start > end) {
       Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Start date cannot be after end date.',
      });
      return;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Remove time part for accurate comparison

    this.reportdata = this.filtered_data
      .filter(item => {
        const itemDate = new Date(item.eventDate);
        itemDate.setHours(0, 0, 0, 0);
        return itemDate >= start && itemDate <= end;
      })
      .sort((a, b) => {
        const dateA = new Date(a.eventDate);
        const dateB = new Date(b.eventDate);
        dateA.setHours(0, 0, 0, 0);
        dateB.setHours(0, 0, 0, 0);
        const isTodayA = dateA.getTime() === today.getTime();
        const isTodayB = dateB.getTime() === today.getTime();
        if (isTodayA && !isTodayB) return -1;
        if (!isTodayA && isTodayB) return 1;
        return dateA.getTime() - dateB.getTime();
      });

  }
  clearFilter() {
    this.startDate = '';
    this.endDate = '';
    this.seleted_value = '';
    this.setActiveTab('all');
  }
getStatus(){
  this.service.getEventStatus().subscribe((apidata)=>{

    this.statusdata =apidata;
    
    console.log("status" , this.statusdata)
},
error => {
   
   console.error('Error during login:', error);

})
}

onviewdeails(item,content)
{

  this.modalService.open(content, { size: 'lg'})
  this.test=item.guestName
  this.currentStatus =parseInt(item.eventStatusId) ;
  this.status =parseInt(item.eventStatusId) ;
  console.log(this.status)
  this.eventStatusId = item.eventStatusId;
  this.showedit =true ;
  const datePart = item.eventDate.split('T')[0]; 
  this.eventform.controls.eventsId.setValue(item.eventsId)  
  this.eventform.controls.eventDate.setValue(datePart)
  this.eventform.controls.personName.setValue(item.personName) 
  this.eventform.controls.guestName.setValue(item?.guestName) 
  this.eventform.controls.phonenumber.setValue(item.phonenumber) 
  this.eventform.controls.eventTypeId.setValue(item.eventType.eventTypeId) 
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

    this.eventform.controls.bumpIN.setValue(this.convertToIST(item.bumpIN)) 
    this.eventform.controls.bumpOUT.setValue(this.convertToIST(item.bumpOUT)) 
  } 
  else{
    this.updatetime(item.eventsId);
      
    this.eventform.controls.bumpIN.setValue(this.eventstarttime) 
    this.eventform.controls.bumpOUT.setValue(this.eventendtime) 

  }
 
  this.eventform.controls.bumpINstring.setValue(this.convertToIST(item.bumpINstring)) 
  this.eventform.controls.bumpOUTstring.setValue(this.convertToIST(item.bumpOUTstring)) 
  this.getTimes(item.eventDate,item.venueIds);
  this.geteventdetails(item.eventsId)
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
geteventdetails(id: number) {
  this.service.getEventdetails(id).subscribe((apidata: any) => {
    this.viewdails = apidata;
    console.log("viewdetails", this.viewdails);
  });
 }
 

 currentDateTime(){
  const currentDateTime = new Date();

// Convert the current date and time to ISO 8601 format
const currentDateTimeISO = currentDateTime.toISOString();
 return currentDateTimeISO
}
 Save() {
   if(this.eventform.controls.eventStatusId.value==null || this.eventform.controls.eventStatusId.value=='0'){
    this.eventform.markAllAsTouched();
    return;
   }
  if(this.eventform.invalid){
  
    this.eventform.markAllAsTouched();
    return;
  }

console.log(this.status)
console.log(typeof(this.status))

  let payload = {
    eventsId: this.eventform.controls.eventsId.value,
    eventDate: this.eventform.controls.eventDate.value,
    eventEndDate: this.eventform.controls.eventDate.value,
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
    // bumpIN:  this.status==2?new Date(this.eventform.controls.bumpIN.value)?.toISOString() : null,
      // bumpOUT: this.status==2? new Date(this.eventform.controls.bumpOUT.value).toISOString(): null,
      // bumpINstring:  this.status==2?new Date(this.eventform.controls.bumpIN.value).toISOString(): null ,
      // bumpOUTstring: this.status==2? new Date(this.eventform.controls.bumpOUT.value).toISOString(): null,
      bumpIN: this.status == 2 ? this.eventform.controls.bumpIN.value : null,
      bumpOUT: this.status == 2 ? this.eventform.controls.bumpOUT.value: null,
      bumpINstring: this.status == 2 ? this.eventform.controls.bumpIN.value : null,
      bumpOUTstring: this.status == 2 ? this.eventform.controls.bumpOUT.value : null,
};
console.log(payload,"---------------payload-------")
if(parseInt(this.currentStatus) != 2 && parseInt(this.currentStatus) != 3  ) {
      
    this.calendarService.updateEvent(this.roleid,payload).subscribe(data => {
    
      const currentYear = new Date().getFullYear()
        this.showedit = false; 
        this.getreport(this.currentstate)
        this.modalService.dismissAll();
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Event Updated Successfully',
        });
        this.getreport(this.statusid)
    },(error:any)=>{
    
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Request Confirmed',
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.reload();
        }
    });
    
    });
    
}  else {
   
    payload['isApproved'] = null;
    this.calendarService.authenticateEvent(payload).subscribe(data => {
      const currentYear = new Date().getFullYear();
      this.modalService.dismissAll();
      this.getreport( this.currentstate)
      Swal.fire({
        icon: 'success',
        title: 'Saved',
        text: 'Event Details Sent for Authentication',
      });
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
  exportToExcel(): void {
    const exportData = this.reportdata.map(event => ({
      Date:new Date(event?.eventDate),
      Name: event?.personName,
      Guest: event?.guestName,
      Venue: Array.isArray(event?.venuelist)
        ? event.venuelist.map(v => v?.venueName).join(", ")
        : "",
      EventTime: Array.isArray(event?.eventTimeIdslist)
        ? event.eventTimeIdslist.map(et => et?.eventTimeName).join(", ")
        : "",
      Phone: event?.phonenumber,
      EventType: event?.eventTypeName,
      Status: event?.eventStatusName,
      FoodType: event?.eventFoodTypeName,
      BumpIn: new Date(event?.bumpIN),
      BumpOut: new Date(event?.bumpOUT)
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Events': worksheet },
      SheetNames: ['Events']
    };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(data, 'Event_Report.xlsx');
  }
  dateFilter(){
     const today = new Date();
today.setHours(0, 0, 0, 0); // Normalize today's date

const currentMonth = today.getMonth();
const currentYear = today.getFullYear();

// Group 1: Today
const todayRecords = this.reportdata
  .filter(item => {
    const eventDate = new Date(item.eventDate);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate.getTime() === today.getTime();
  });

// Group 2: Future dates in this month (after today)
const futureThisMonth = this.reportdata
  .filter(item => {
    const eventDate = new Date(item.eventDate);
    eventDate.setHours(0, 0, 0, 0);
    return (
      eventDate > today &&
      eventDate.getMonth() === currentMonth &&
      eventDate.getFullYear() === currentYear
    );
  })
  .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());

// Group 3: Future months
const futureOtherMonths = this.reportdata
  .filter(item => {
    const eventDate = new Date(item.eventDate);
    eventDate.setHours(0, 0, 0, 0);
    return (
      eventDate > today &&
      (eventDate.getMonth() !== currentMonth || eventDate.getFullYear() !== currentYear)
    );
  })
  .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());

// Combine all: Today first, then rest
this.reportdata = [...todayRecords, ...futureThisMonth, ...futureOtherMonths];

  }
}
