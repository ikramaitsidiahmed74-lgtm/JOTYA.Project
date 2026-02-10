import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmService } from './confirm.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="state$ | async as s" class="confirm-backdrop">
      <div class="confirm-panel" role="dialog" aria-modal="true" aria-labelledby="confirmTitle">
        <h3 id="confirmTitle" class="confirm-title">{{ s.title || 'Confirmation' }}</h3>
        <div class="confirm-message">{{ s.message }}</div>
        <div class="confirm-actions">
          <button class="btn btn-cancel" (click)="close(false)">{{ s.cancelText }}</button>
          <button class="btn btn-confirm" (click)="close(true)">{{ s.confirmText }}</button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `:host { position: fixed; inset:0; pointer-events:none; z-index:10000; }
    .confirm-backdrop { pointer-events:auto; position:fixed; inset:0; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.4); }
    .confirm-panel { background:white; color:#111827; padding:1rem; border-radius:8px; width:90%; max-width:420px; box-shadow:0 10px 30px rgba(0,0,0,0.2); }
    .confirm-title { font-weight:600; margin:0 0 0.5rem 0; }
    .confirm-message { margin-bottom:1rem; color:#374151; }
    .confirm-actions { display:flex; gap:0.5rem; justify-content:flex-end; }
    .btn { padding:0.5rem 0.8rem; border-radius:6px; border:0; cursor:pointer; font-weight:600; }
    .btn-cancel { background:#f3f4f6; color:#111827; }
    .btn-confirm { background:#ffed00; color:#111827; }
    `
  ]
})
export class ConfirmComponent {
  state$!: Observable<any>;
  constructor(private cs: ConfirmService) {
    this.state$ = this.cs.state$;
  }

  close(result: boolean) { this.cs.close(result); }
}
