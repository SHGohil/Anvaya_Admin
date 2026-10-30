import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddqueryComponent } from './addquery/addquery.component';
import { CalenderdatesComponent } from './calenderdates/calenderdates.component';
import { ChangerequestComponent } from './changerequest/changerequest.component';
import { ConfirmedeventsComponent } from './confirmedevents/confirmedevents.component';
import { DailyreportComponent } from './dailyreport/dailyreport.component';
import { EditeventComponent } from './editevent/editevent.component';
import { SpecialdatesComponent } from './specialdates/specialdates.component';
import { TodayseventsComponent } from './todaysevents/todaysevents.component';
import {UsersComponent} from './users/users.component'
import { RolesComponent } from './roles/roles.component';
import { CdkMenuModule } from '@angular/cdk/menu';
import { UsersService } from 'src/app/shared/services/users.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgApexchartsModule } from "ng-apexcharts";
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    AddqueryComponent,
    CalenderdatesComponent,
    ChangerequestComponent,
    ConfirmedeventsComponent,
    DailyreportComponent,
    EditeventComponent,
    SpecialdatesComponent,
    TodayseventsComponent,
    UsersComponent,
    RolesComponent
  ],
  imports: [
    CommonModule,ReactiveFormsModule,CdkMenuModule,NgSelectModule,NgApexchartsModule,
    FormsModule,SharedModule
  ],
  exports:[
    AddqueryComponent,
    CalenderdatesComponent,
    ChangerequestComponent,
    ConfirmedeventsComponent,
    DailyreportComponent,
    EditeventComponent,
    SpecialdatesComponent,
    TodayseventsComponent
  ],
  providers:[
 UsersService,

  ]
})
export class UsermoduleModule { }
