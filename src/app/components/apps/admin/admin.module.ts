import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';
import { DashboardComponent } from './dashboard/dashboard.component';
import {UsermoduleModule} from './usermodule/usermodule.module';
import { UsernotificationComponent } from './usernotification/usernotification.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component'
import { AddqueryComponent } from './usermodule/addquery/addquery.component';
import { TodayseventsComponent } from './usermodule/todaysevents/todaysevents.component';
import { DailyreportComponent } from './usermodule/dailyreport/dailyreport.component';
import { ConfirmedeventsComponent } from './usermodule/confirmedevents/confirmedevents.component';
import { CalenderdatesComponent } from './usermodule/calenderdates/calenderdates.component';

// daily-query/todays-events/daily-report/confirmed-events/calendar were
// previously only reachable embedded inside the dashboard's tab-switcher
// (no route of their own) - promoted to real routes here at the user's
// request to "rearrange... remove from home page and add another page".
// The components themselves are unchanged; UsermoduleModule (imported
// below) already declares and exports all five, so no new declarations
// are needed here, just routes pointing at them.
const routes: Routes = [
    {path:'dashboard', component:DashboardComponent},
    {path:'notification', component:UsernotificationComponent},
    {path:'resetpassword', component:ResetpasswordComponent},
    {path:'daily-query', component:AddqueryComponent},
    {path:'todays-events', component:TodayseventsComponent},
    {path:'daily-report', component:DailyreportComponent},
    {path:'confirmed-events', component:ConfirmedeventsComponent},
    {path:'calendar', component:CalenderdatesComponent},
];

@NgModule({
    declarations: [    
    DashboardComponent,
    UsernotificationComponent,
    ResetpasswordComponent,
  ],
    imports: [
        CommonModule, RouterModule.forChild(routes),UsermoduleModule,
        SharedModule,NgSelectModule,NgxPaginationModule,  NgbModalModule,
        NgApexchartsModule
    ]
})
export class AdminModule { }
