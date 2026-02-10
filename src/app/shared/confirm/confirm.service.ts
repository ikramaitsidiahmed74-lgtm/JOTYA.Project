import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

interface ConfirmPayload extends ConfirmOptions {
  resolve: (result: boolean) => void;
}

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  private _state = new BehaviorSubject<ConfirmPayload | null>(null);
  state$ = this._state.asObservable();

  confirm(options: ConfirmOptions): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this._state.next({
        title: options.title,
        message: options.message,
        confirmText: options.confirmText ?? 'Confirmer',
        cancelText: options.cancelText ?? 'Annuler',
        resolve,
      });
    });
  }

  close(result: boolean) {
    const cur = this._state.value;
    if (cur) {
      cur.resolve(result);
    }
    this._state.next(null);
  }
}
