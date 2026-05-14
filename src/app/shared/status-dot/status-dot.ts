import { Component, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-dot',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span
      class="inline-block w-3 h-3 rounded-full border border-white dark:border-slate-800 shadow-sm shrink-0"
      [class.bg-emerald-500]="state === 'online'"
      [class.shadow-emerald-500/50]="state === 'online'"
      [class.bg-amber-500]="state === 'warn'"
      [class.bg-rose-500]="state === 'offline'"
      [class.shadow-rose-500/40]="state === 'offline'"
      [attr.aria-label]="state"
    ></span>
  `,
})
export class StatusDot {
  @Input() state: 'online' | 'warn' | 'offline' = 'online';
}
