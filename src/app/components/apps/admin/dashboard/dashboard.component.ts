import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavService } from 'src/app/shared/services/nav.service';
import { TodaysqueryService } from 'src/app/shared/services/todaysquery.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    standalone: false
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

  // KPI overview - reuses the same /Analytics and /Reports endpoints the
  // Daily Report and Today's Events screens already call, so this adds no
  // new backend surface, just a second place that renders the same data.
  analytics: { open: number; tentative: number; confirmed: number; lost: number; total: number } | null = null;
  donutChart: any;
  todaysActivity: any[] = [];
  todaysCount = 0;
  // Distinct from analytics/todaysActivity being falsy/empty - without
  // these, "still loading" and "genuinely zero events" were the same
  // state, so the KPI row and activity feed just rendered blank until
  // the request resolved instead of showing a loading indicator.
  analyticsLoading = true;
  activityLoading = true;

  constructor(private cdr: ChangeDetectorRef,public navServices: NavService,private todaysservice: TodaysqueryService)
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
     this.loadAnalytics();
     this.loadTodaysActivity();
  }

  setactive(id){

    this.id = id
    this.activebad=id;
  }

  private loadAnalytics() {
    const year = new Date().getFullYear();
    this.todaysservice.getanalytics(year).subscribe({
      next: (apidata: any) => {
      this.analytics = apidata;
      this.analyticsLoading = false;
      this.donutChart = {
        chart: { type: 'donut', height: 190, sparkline: { enabled: true } },
        series: [apidata.open, apidata.tentative, apidata.confirmed, apidata.lost],
        labels: ['Open', 'Tentative', 'Confirmed', 'Lost'],
        colors: ['#2e90fa', '#f79009', '#12b76a', '#f04438'],
        stroke: { width: 0 },
        dataLabels: { enabled: false },
        legend: { show: false },
        tooltip: { y: { formatter: (val: number) => val + ' events' } },
        plotOptions: {
          pie: {
            donut: {
              size: '74%',
              labels: {
                show: true,
                total: {
                  show: true,
                  label: 'Total',
                  fontSize: '12px',
                  color: '#5d5772',
                  formatter: () => apidata.total,
                },
              },
            },
          },
        },
      };
      },
      error: () => {
        this.analyticsLoading = false;
      },
    });
  }

  private loadTodaysActivity() {
    this.todaysservice.getTodaysquerys().subscribe({
      next: (apidata: any) => {
        const list = apidata || [];
        this.todaysCount = list.length;
        this.todaysActivity = list.slice(0, 4);
        this.activityLoading = false;
      },
      error: () => {
        this.activityLoading = false;
      },
    });
  }
 }
