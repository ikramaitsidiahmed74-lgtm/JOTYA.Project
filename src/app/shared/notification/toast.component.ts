import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Toast } from './notification.service';
import { Observable } from 'rxjs';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="toast-container" aria-live="polite" aria-atomic="true">
    <div *ngFor="let t of toasts$ | async" class="toast" [ngClass]="t.type" role="status">
      <div class="toast-body">
        <div class="toast-message">{{ t.message }}</div>
        <button class="toast-close" (click)="dismiss(t.id)" aria-label="Fermer">✕</button>
      </div>
    </div>
  </div>
  `,
  styles: [
    `:host { position: fixed; top: 1rem; right: 1rem; z-index: 9999; }
    .toast-container { display:flex; flex-direction:column; gap:0.5rem; align-items:flex-end; }
    .toast { min-width: 220px; max-width:360px; padding:0.6rem 0.8rem; border-radius:8px; box-shadow:0 6px 18px rgba(0,0,0,0.2); color:#fff; font-size:14px; }
    .toast .toast-body { display:flex; align-items:center; justify-content:space-between; gap:0.5rem; }
    .toast .toast-message { flex:1; padding-right:0.5rem; }
    .toast .toast-close { background:transparent; border:0; color:inherit; cursor:pointer; font-weight:700; }
    .toast.success { background: #10b981; }
    .toast.error { background: #ef4444; }
    .toast.info { background: #0284c7; }
    .toast.warning { background: #f59e0b; color:#111827; }
    `
  ]
})
export class ToastComponent {
  toasts$!: Observable<Toast[]>;
  constructor(private ns: NotificationService) {
    this.toasts$ = this.ns.toasts$;
  }

  dismiss(id: string) {
    this.ns.dismiss(id);
  }
}
