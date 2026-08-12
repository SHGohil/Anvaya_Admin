import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TodaysqueryService } from 'src/app/shared/services/todaysquery.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {
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
 constructor(public todaysservice : TodaysqueryService,private cdr: ChangeDetectorRef){
  const currentYear = new Date().getFullYear();
  for (let i = currentYear; i <= currentYear + 5; i++) {
    this.years.push(i);
    
  }

 }
 ngOnInit():void{
  const currentYear = new Date().getFullYear()
  this.year = currentYear;
  this.getanalytics(this.year);
 }

 onchangeyear(val){
  this.getanalytics(val.target.value)
 }
  getanalytics (val){
    debugger;
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
          text: "Tentative",
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
          text: "Confirmed",
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
          text: "Lost",
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
          text: "Open",
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
}
