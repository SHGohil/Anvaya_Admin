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

const routes: Routes = [
    {path:'dashboard', component:DashboardComponent},
    {path:'notification', component:UsernotificationComponent},
    {path:'resetpassword', component:ResetpasswordComponent},
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
