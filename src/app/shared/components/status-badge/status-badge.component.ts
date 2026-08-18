import { Component, Input } from '@angular/core';

// One status language for the four event states, used everywhere a booking's
// status is shown - replaces the icon-only verify.svg/danger.svg/Close_MD.svg
// badges that had no text label. Mapping matches the dashboard's activity
// feed exactly (eventStatusId 2/1/3/else -> Confirmed/Tentative/Lost/Open).
@Component({
    selector: 'app-status-badge',
    templateUrl: './status-badge.component.html',
    styleUrls: ['./status-badge.component.scss'],
    standalone: false
})
export class StatusBadgeComponent {
  @Input() eventStatusId: number | null | undefined;

  get label(): string {
    switch (this.eventStatusId) {
      case 2: return 'Confirmed';
      case 1: return 'Tentative';
      case 3: return 'Lost';
      default: return 'Open';
    }
  }

  get variant(): string {
    switch (this.eventStatusId) {
      case 2: return 'good';
      case 1: return 'warn';
      case 3: return 'critical';
      default: return 'info';
    }
  }
}
