import { Component, OnInit, QueryList, ViewChildren } from "@angular/core";
import { NgbCalendar, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import * as chartData from '../../../shared/data/dashboard/online-course'
import * as googlechartData from './googlechartdata'
import { NgbdSortableHeader, SortEvent } from 'src/app/shared/directives/NgbdSortableHeader';
import { TableService } from "src/app/shared/services/table.service";
import { Observable } from "rxjs";
import { COMPANYDB, CompanyDB } from "src/app/shared/data/tables/company";
@Component({
  selector: "app-default",
  templateUrl: "./default.component.html",
  styleUrls: ["./default.component.scss"],
})
export class DefaultComponent implements OnInit {
  public show: boolean = false
  public activityChart = chartData.activityChart
  public  openTab: string = "oneway";
  public tableItem$: Observable<CompanyDB[]>;
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  total$: Observable<number>;
  constructor(calendar: NgbCalendar,public service: TableService)
   {
    this.tableItem$ = service.tableItem$;
    this.total$ = service.total$;
    this.service.setUserData(COMPANYDB)
   }
  ngOnInit() {}
  public pieChart2 = googlechartData.pieChart2;
  tabbed(val: string) {
    this.openTab = val;
  }
  toggle() {
    this.show = !this.show
  }
  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;

  }
}
