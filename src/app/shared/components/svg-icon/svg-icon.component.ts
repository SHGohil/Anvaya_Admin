import { Component, Input } from "@angular/core";

@Component({
    selector: "app-svg-icon",
    templateUrl: "./svg-icon.component.html",
    styleUrls: ["./svg-icon.component.scss"],
    standalone: false
})
export class SvgIconComponent {
  @Input("icon") public icon;
}
