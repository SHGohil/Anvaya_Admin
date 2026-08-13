import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsermoduleModule } from './usermodule.module';
import { UsersComponent } from './users/users.component';
import { ChangerequestComponent } from './changerequest/changerequest.component';
import { SpecialdatesComponent } from './specialdates/specialdates.component';
import { AnalyticsComponent } from './analytics/analytics.component';

/**
 * Routing for the /settings/* screens, split out of UsermoduleModule itself.
 *
 * UsermoduleModule is also imported directly (not via the router) by
 * AdminModule, which needs its components to embed inside the dashboard
 * (app-addquery, app-todaysevents, etc.) but has nothing to do with these
 * routes. When UsermoduleModule called RouterModule.forChild(routes) itself,
 * that registration ran twice - once as the lazy chunk for "settings", once
 * as part of the "admin" chunk pulling it in as a plain import - registering
 * users/approvals/specials/Analytics under both parents. That duplicate
 * registration was the cause of navigating between /settings/* screens not
 * reliably tearing down the previous route's component (confirmed: both
 * would render into the outlet at once).
 *
 * Keeping the routing here, loaded only via routes.ts's "settings" entry,
 * means it's registered exactly once.
 */
const routes: Routes = [
  { path: 'users', component: UsersComponent },
  { path: 'approvals', component: ChangerequestComponent },
  { path: 'specials', component: SpecialdatesComponent },
  { path: 'Analytics', component: AnalyticsComponent },
];

@NgModule({
  imports: [UsermoduleModule, RouterModule.forChild(routes)],
})
export class UsermoduleRoutingModule {}
