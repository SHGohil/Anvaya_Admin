import { Injectable, TemplateRef } from '@angular/core';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Observable } from 'rxjs';

export type ModalSize = 'md' | 'lg' | 'xl';

export interface ModalOptions {
  size?: ModalSize;
}

/**
 * The handle a screen gets back from `open()` and a template receives as `let-modal`.
 * It keeps the small surface the screens already used (`close`, `dismiss`), so the pop-up
 * templates did not need to change shape when the dialog library did.
 */
export class ModalRef {
  private ref?: DialogRef<unknown, unknown>;

  attach(ref: DialogRef<unknown, unknown>): void {
    this.ref = ref;
  }

  /** Closes the pop-up, optionally handing a result to whoever is listening to `closed`. */
  close(result?: unknown): void {
    this.ref?.close(result);
  }

  /** Closes the pop-up without a result (the cross, Cancel, or Escape). */
  dismiss(_reason?: unknown): void {
    this.ref?.close();
  }

  get closed(): Observable<unknown> {
    return this.ref!.closed;
  }
}

/**
 * Opens a template as a modal pop-up on the Angular CDK dialog: it traps focus, returns focus to
 * what opened it, closes on Escape or a click outside, and closes when the route changes.
 * Styling lives in `assets/ui/theme.css` (`.ui-modal-*`).
 */
@Injectable({ providedIn: 'root' })
export class ModalService {
  constructor(private dialog: Dialog) {}

  open(template: TemplateRef<unknown>, options: ModalOptions = {}): ModalRef {
    const handle = new ModalRef();
    const ref = this.dialog.open(template, {
      data: handle,
      panelClass: ['ui-modal-pane', `ui-modal-${options.size ?? 'md'}`],
      backdropClass: 'ui-backdrop',
      hasBackdrop: true,
      autoFocus: 'first-tabbable',
      restoreFocus: true,
      closeOnNavigation: true,
      maxWidth: '95vw',
      maxHeight: '92vh',
    });
    handle.attach(ref);
    return handle;
  }

  dismissAll(): void {
    this.dialog.closeAll();
  }
}
