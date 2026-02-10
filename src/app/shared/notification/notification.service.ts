import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  timeout?: number; // ms
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private _toasts = new BehaviorSubject<Toast[]>([]);
  toasts$ = this._toasts.asObservable();

  private defaultTimeout = 4000;

  show(type: ToastType, message: string, timeoutMs?: number) {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    const toast: Toast = { id, type, message, timeout: timeoutMs ?? this.defaultTimeout };
    this._toasts.next([...this._toasts.value, toast]);

    // Auto dismiss
    setTimeout(() => this.dismiss(id), toast.timeout);
    return id;
  }

  success(message: string, timeoutMs?: number) {
    return this.show('success', message, timeoutMs);
  }

  error(message: string, timeoutMs?: number) {
    return this.show('error', message, timeoutMs);
  }

  info(message: string, timeoutMs?: number) {
    return this.show('info', message, timeoutMs);
  }

  warning(message: string, timeoutMs?: number) {
    return this.show('warning', message, timeoutMs);
  }

  dismiss(id: string) {
    const next = this._toasts.value.filter(t => t.id !== id);
    this._toasts.next(next);
  }

  clear() {
    this._toasts.next([]);
  }
}
