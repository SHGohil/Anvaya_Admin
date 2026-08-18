import { Component, EventEmitter, Input, Output } from '@angular/core';

// Change Requests and Notification hand-duplicated this exact card markup
// (2-column header with a Venue/Event Date line under it, 2-column body).
// The only real difference between the two call sites was how deep the
// data was nested (Notification's items wrap an `eventdetails` object) -
// each screen passes the correctly-shaped object as [item], so this
// component never needs to know about that wrapper.
@Component({
    selector: 'app-event-card-compact',
    templateUrl: './event-card-compact.component.html',
    styleUrls: ['./event-card-compact.component.scss'],
    standalone: false
})
export class EventCardCompactComponent {
  @Input() item: any;
  @Output() cardClick = new EventEmitter<void>();
}
