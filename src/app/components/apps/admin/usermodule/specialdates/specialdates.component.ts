import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SpecialdatesService } from 'src/app/shared/services/specialdates.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-specialdates',
    templateUrl: './specialdates.component.html',
    styleUrls: ['./specialdates.component.scss'],
    standalone: false
})
export class SpecialdatesComponent implements OnInit {
  loginid: any;
  calenderdata: any;
  currentYear: number;
  selectedDates: any[] = []; // Combined array for selected and special dates
  loginroleid: any;

  constructor(private service: SpecialdatesService, private modalService: NgbModal, private fb: FormBuilder) {
    let user;
    if (typeof window !== 'undefined' && window.localStorage) {
      user = localStorage.getItem('user');
    }
    var userdata = JSON.parse(user);
    this.loginid = userdata.userdata.userId;
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
    this.currentYear = new Date().getFullYear();
    this.getcalederdates(this.currentYear);
    this.getselecteddate();
  }
  selectDate(date: string, i: number) {
    // Remove the time part from the date string
    const dateWithoutTime = date.split('T')[0];

    const isSelected = this.isSelected(dateWithoutTime, i);
    if (!isSelected) {
        // Check if the date is not already in the array
        if (!this.selectedDates.includes(dateWithoutTime)) {
            this.selectedDates.push(dateWithoutTime); // Add to selectedDates array without time
        }
    } else {
        this.selectedDates = this.selectedDates.filter(d => d !== dateWithoutTime); // Remove from selectedDates array
    }
}

  

  isSelected(date: string, index: number): boolean {
    const isoDate = new Date(date + 'Z').toISOString().slice(0, 10); // Convert selectedDate to ISO format date in UTC
    return this.selectedDates.some(selectedDate => {
      if (typeof selectedDate === 'string') {
        return selectedDate === isoDate; // Compare directly if selectedDate is a string
      } else if (selectedDate instanceof Date) {
        const isoSelectedDate = selectedDate.toISOString().slice(0, 10); // Convert selectedDate to ISO format date in UTC
        return isoSelectedDate === isoDate; // Compare only the date part
      }
      return false;
    });
  }
                                                                                                                                                                               
  

  getcalederdates(id) {
    this.service.calenderdates(id).subscribe((apidata: []) => {
      this.calenderdata = apidata;
    });
  }

  getselecteddate() {
    this.service.specialdates().subscribe((apidata: []) => {
      const specialDates = apidata.map((c: any) => c.date); // Get special dates from API
      specialDates.forEach(date => {
        this.selectedDates.push(date);
      });
    });
  }
  
  getFormattedDate(date: string): string {
    const day = new Date(date).getDate();
    const formattedDay = day.toString().padStart(2, '0');
    const suffix = (day === 1 || day === 21 || day === 31) ? 'st' : (day === 2 || day === 22) ? 'nd' : (day === 3 || day === 23) ? 'rd' : 'th';
    return `${formattedDay}`;
  }

  post() {
    let obj = {
      "dates": this.selectedDates, // Assuming this is where you want to post selected dates
      "year": this.currentYear,
      "createdBy": this.loginid,
      "createdDate": new Date(),
    };
    this.service.postspecialdates(obj).subscribe(apidata=>{
   
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Special Dates updated to the calender Successfully',
      });
      this.getselecteddate();
      },
      
      error => {
         
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something Went Wrong.',
        });
      
      })
  }
}
