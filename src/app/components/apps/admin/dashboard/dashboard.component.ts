import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavService } from 'src/app/shared/services/nav.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent  implements OnInit {
  activebad = 1;
  id: number;
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
  constructor(private cdr: ChangeDetectorRef,public navServices: NavService) 
  {
    
    this.id=1;
    let user;
    if (typeof window !== 'undefined' && window.localStorage) {
     user = localStorage.getItem('user');
    }
    var userdata = JSON.parse(user);
    var token = userdata.token;

  }
 
  ngOnInit() {
     this.activebad = this.id;
     this.cdr.detectChanges();
    
     
  }

  setactive(id){
    
    this.id = id
    this.activebad=id;
  }
 }
