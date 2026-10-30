import { Component, Input, ChangeDetectionStrategy } from "@angular/core";

@Component({
    selector: "app-svg-icon",
    templateUrl: "./svg-icon.component.html",
    styleUrls: ["./svg-icon.component.scss"],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class SvgIconComponent {
  @Input("icon") public icon;
}
