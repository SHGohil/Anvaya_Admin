import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-full',
    templateUrl: './full.component.html',
    styleUrls: ['./full.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class FullComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
