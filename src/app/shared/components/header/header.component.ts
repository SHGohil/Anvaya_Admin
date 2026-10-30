import { Component, OnInit, Inject, DOCUMENT, ChangeDetectionStrategy } from "@angular/core";

import { NavService } from "../../services/nav.service";
import { LayoutService } from "../../services/layout.service";

@Component({
    selector: "app-header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.scss"],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class HeaderComponent implements OnInit {
  public elem: any;
  public dark = false;

  constructor(public layout: LayoutService, public navServices: NavService, @Inject(DOCUMENT) private document: any) {}

  ngOnInit() {
    this.elem = document.documentElement;
    let saved: string | null = null;
    try { saved = localStorage.getItem("theme"); } catch { /* storage blocked */ }
    if (saved) {
      this.elem.dataset.theme = saved;
    }
    this.dark = this.isDark();
  }

  /** Light/dark lives on <html data-theme>; with nothing stored it follows the OS setting. */
  private isDark(): boolean {
    const set = this.elem.dataset.theme;
    return set ? set === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  toggleTheme() {
    this.elem.dataset.theme = this.isDark() ? "light" : "dark";
    this.dark = this.isDark();
    try { localStorage.setItem("theme", this.elem.dataset.theme); } catch { /* storage blocked */ }
  }

  sidebarToggle() {
    this.navServices.collapseSidebar = !this.navServices.collapseSidebar;
    this.navServices.megaMenu = false;
    this.navServices.levelMenu = false;
  }
}
