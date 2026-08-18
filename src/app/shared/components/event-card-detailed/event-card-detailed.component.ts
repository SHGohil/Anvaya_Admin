import { Component, EventEmitter, Input, Output } from '@angular/core';

// Confirmed Events and Today's Events hand-duplicated this exact card
// markup byte-for-byte (4-column header: name/BumpIn/BumpOut/status,
// 6-column body: Sales Exec/Event Date/Entry Date/Guest/Type/Venues).
// The click handler stays at each call site (cardClick just signals
// "the card was clicked") since onviewdeails() needs the original item
// reference, not a copy passed through this component.
@Component({
    selector: 'app-event-card-detailed',
    templateUrl: './event-card-detailed.component.html',
    styleUrls: ['./event-card-detailed.component.scss'],
    standalone: false
})
export class EventCardDetailedComponent {
  @Input() item: any;
  @Output() cardClick = new EventEmitter<void>();

  // bumpIN/bumpOUT are null until the event is actually bumped in/out, even
  // for events *ngIf gates as eventStatusId==2 - without this, new Date(null)
  // produces an Invalid Date and every field below becomes NaN, which the
  // date pipe then throws on rather than rendering. Consolidated from the
  // identical copy that used to live in both ConfirmedeventsComponent and
  // TodayseventsComponent.
  convertToIST(val: string): string {
    if (!val) {
      return null;
    }
    const date = new Date(val);
    date.setHours(date.getHours() + 5);
    date.setMinutes(date.getMinutes() + 30);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
  }
}
