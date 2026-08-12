import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-login-image-one',
    templateUrl: './image-one.component.html',
    styleUrls: ['./image-one.component.scss'],
    standalone: false
})
export class LoginImageOneComponent implements OnInit {

  public show: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  showPassword() {
    this.show = !this.show;
  }

}
