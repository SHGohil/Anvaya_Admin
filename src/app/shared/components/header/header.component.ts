import { Component, OnInit, Inject, DOCUMENT } from "@angular/core";

import { NavService } from "../../services/nav.service";
import { LayoutService } from "../../services/layout.service";

@Component({
    selector: "app-header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.scss"],
    standalone: false
})
export class HeaderComponent implements OnInit {
  public elem: any;

  constructor(public layout: LayoutService, public navServices: NavService, @Inject(DOCUMENT) private document: any) {}

  ngOnInit() {
    this.elem = document.documentElement;
  }

  sidebarToggle() {
    this.navServices.collapseSidebar = !this.navServices.collapseSidebar;
    this.navServices.megaMenu = false;
    this.navServices.levelMenu = false;
  }
}
