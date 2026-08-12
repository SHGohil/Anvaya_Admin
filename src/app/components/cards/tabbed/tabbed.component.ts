import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-tabbed',
    templateUrl: './tabbed.component.html',
    styleUrls: ['./tabbed.component.scss'],
    standalone: false
})
export class TabbedComponent {
  
  public active = 1;
  public materialSuccess = "success"
  public materialSecondary = "secondary"

  constructor() { }

}
