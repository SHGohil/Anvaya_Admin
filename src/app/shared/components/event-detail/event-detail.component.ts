import { Component, Input } from '@angular/core';

// calenderdates (read-only branch), confirmedevents, todaysevents,
// usernotification and dailyreport each hand-duplicated this exact
// event-detail body (used inside their own "Event Details" modal), down to
// the same inline color:#1D243380 styling and the same "EVEMT STATUS"
// typo. showStatus is passed in rather than computed here since each
// screen gates the status/bump-in/bump-out/comment section on its own
// condition (activeTab, eventStatusId, or a combination) - this component
// only needs to know whether to show it, not why.
@Component({
    selector: 'app-event-detail',
    templateUrl: './event-detail.component.html',
    styleUrls: ['./event-detail.component.scss'],
    standalone: false
})
export class EventDetailComponent {
  @Input() details: any;
  @Input() showStatus = false;

  convertToIST(val: string): string {
    // bumpIN/bumpOUT are null until the event is actually bumped in/out -
    // without this guard, new Date(null) produces an Invalid Date and the
    // date pipe throws rather than rendering.
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
