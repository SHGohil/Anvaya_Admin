import { Directive, HostListener, HostBinding } from '@angular/core';

@Directive({
    selector: '[disableKeyPress]',
    standalone: false
})
export class DisableKeyPressDirective {

  @HostBinding('attr.autocomplete') public autocomplete;

  constructor() {
    this.autocomplete = 'off';
  }

  @HostListener('keypress', ['$event']) public disableKeys(event: Event) {
    event.preventDefault();
  }
}
