import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  id: number;
  title: string;
  text?: string;
}

// Non-destructive success feedback (Save/Update/Delete confirmations,
// Approve/Decline) previously went through the same SweetAlert2 modal as
// genuine errors and destructive "are you sure?" confirms - a blocking
// dialog the user has to dismiss for something that isn't asking anything
// of them. This gives that case its own, quieter, self-dismissing channel.
// Errors and destructive confirms are unaffected and stay on SweetAlert2.
@Injectable({ providedIn: 'root' })
export class ToastService {
  private idCounter = 0;
  private readonly _toasts = new BehaviorSubject<ToastMessage[]>([]);
  readonly toasts$ = this._toasts.asObservable();

  success(title: string, text?: string, durationMs = 3500): void {
    const toast: ToastMessage = { id: ++this.idCounter, title, text };
    this._toasts.next([...this._toasts.value, toast]);
    setTimeout(() => this.dismiss(toast.id), durationMs);
  }

  dismiss(id: number): void {
    this._toasts.next(this._toasts.value.filter(t => t.id !== id));
  }
}
