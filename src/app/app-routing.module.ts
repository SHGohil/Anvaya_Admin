import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { ContentComponent } from "./shared/components/layout/content/content.component";
import { content } from "./shared/routes/routes";
import { CommonModule } from '@angular/common';
import { AdminGuard } from './shared/guard/admin.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth/login',
    component: LoginComponent
  },
  {
    path: '',
    component: ContentComponent,
    canActivate: [AdminGuard],
    children: content
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [[RouterModule.forRoot(routes, {
    
    anchorScrolling: 'enabled',
    useHash : true,
    scrollPositionRestoration: 'enabled',
    
})
],
],
  exports: [RouterModule]
})
export class AppRoutingModule { }
