import { Component, Input } from '@angular/core';

// One page-title pattern instead of every screen inventing its own heading
// markup (a bare <h4>, an <h5> stuffed inside a card-header, an invalid-case
// <H6>...). Primary action (e.g. "Add Users") is passed as projected content
// so each screen keeps its own click handler.
@Component({
    selector: 'app-page-header',
    templateUrl: './page-header.component.html',
    styleUrls: ['./page-header.component.scss'],
    standalone: false
})
export class PageHeaderComponent {
  @Input() title = '';
  @Input() subtitle?: string;
}
