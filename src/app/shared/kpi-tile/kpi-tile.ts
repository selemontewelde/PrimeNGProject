import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-kpi-tile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kpi-tile.html',
})
export class KpiTile {
  @Input() label = '';
  @Input() value: number | string = 0;
  @Input() unit?: string;
  @Input() icon = 'pi pi-chart-line';
  @Input() trend?: number;
  @Input() severity: 'info' | 'success' | 'warn' | 'danger' = 'info';

  get iconWrap(): string {
    switch (this.severity) {
      case 'success':
        return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-300';
      case 'warn':
        return 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-300';
      case 'danger':
        return 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-300';
      default:
        return 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300';
    }
  }

  get trendClass(): string {
    if (this.trend == null) return '';
    return this.trend >= 0
      ? 'text-emerald-600 dark:text-emerald-400'
      : 'text-rose-600 dark:text-rose-400';
  }

  get trendIcon(): string {
    if (this.trend == null) return '';
    return this.trend >= 0 ? 'pi pi-arrow-up-right' : 'pi pi-arrow-down-right';
  }
}
