import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
// import { DragulaModule } from "ng2-dragula";
import { TranslateModule } from "@ngx-translate/core";
// Components
import { BreadcrumbComponent } from "./components/breadcrumb/breadcrumb.component";
import { FeatherIconsComponent } from "./components/feather-icons/feather-icons.component";
import { FooterComponent } from "./components/footer/footer.component";
import { HeaderComponent } from "./components/header/header.component";
import { ContentComponent } from "./components/layout/content/content.component";
import { FullComponent } from "./components/layout/full/full.component";
import { LoaderComponent } from "./components/loader/loader.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { TapToTopComponent } from "./components/tap-to-top/tap-to-top.component";
// Header Elements Components
import { NotificationComponent } from "./components/header/elements/notification/notification.component";
import { MyAccountComponent } from "./components/header/elements/my-account/my-account.component";
// Directives
import { DisableKeyPressDirective } from "./directives/disable-key-press.directive";
import { OnlyAlphabetsDirective } from "./directives/only-alphabets.directive";
import { OnlyNumbersDirective } from "./directives/only-numbers.directive";
import { ShowOptionsDirective } from "./directives/show-options.directive";
// Services
import { LayoutService } from "./services/layout.service";
import { NavService } from "./services/nav.service";
import { NgbdSortableHeader } from "./directives/NgbdSortableHeader";
import { DecimalPipe } from "@angular/common";
import { SvgIconComponent } from "./components/svg-icon/svg-icon.component";
import { CarouselModule } from "ngx-owl-carousel-o";
import { StatusBadgeComponent } from "./components/status-badge/status-badge.component";
import { PageHeaderComponent } from "./components/page-header/page-header.component";
import { EventCardCompactComponent } from "./components/event-card-compact/event-card-compact.component";
import { EventCardDetailedComponent } from "./components/event-card-detailed/event-card-detailed.component";

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    ContentComponent,
    BreadcrumbComponent,
    FeatherIconsComponent,
    FullComponent,
    ShowOptionsDirective,
    DisableKeyPressDirective,
    OnlyAlphabetsDirective,
    OnlyNumbersDirective,
    LoaderComponent,
    TapToTopComponent,
    NotificationComponent,
    MyAccountComponent,
    NgbdSortableHeader,
    SvgIconComponent,
    StatusBadgeComponent,
    PageHeaderComponent,
    EventCardCompactComponent,
    EventCardDetailedComponent,
  ],
  imports: [
    CommonModule, 
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    // DragulaModule.forRoot(),
    TranslateModule.forRoot(),
    CarouselModule],
  providers: [NavService, LayoutService, DecimalPipe],
  exports: [NgbModule, FormsModule, ReactiveFormsModule,
    TranslateModule,
    LoaderComponent, BreadcrumbComponent, FeatherIconsComponent, TapToTopComponent, DisableKeyPressDirective, OnlyAlphabetsDirective, OnlyNumbersDirective, NgbdSortableHeader, SvgIconComponent, StatusBadgeComponent, PageHeaderComponent, EventCardCompactComponent, EventCardDetailedComponent],
})
export class SharedModule {}
