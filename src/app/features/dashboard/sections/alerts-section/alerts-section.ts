import { Component, ViewChild, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { DataService } from '../../../../core/data.service';
import { Alert } from '../../../../core/models';

@Component({
  selector: 'app-alerts-section',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DatePipe,
    CardModule,
    TableModule,
    TagModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    TooltipModule,
  ],
  templateUrl: './alerts-section.html',
})
export class AlertsSection {
  private readonly data = inject(DataService);

  @ViewChild('dt') dt?: Table;

  alerts: Alert[] = this.data.getAlerts();
  events = this.data.getEvents();

  severityToTag(s: Alert['severity']): 'success' | 'info' | 'warn' | 'danger' {
    switch (s) {
      case 'success':
        return 'success';
      case 'info':
        return 'info';
      case 'warn':
        return 'warn';
      case 'error':
        return 'danger';
    }
  }

  severityLabel(s: Alert['severity']): string {
    switch (s) {
      case 'success':
        return 'OK';
      case 'info':
        return 'Info';
      case 'warn':
        return 'Warnung';
      case 'error':
        return 'Fehler';
    }
  }

  severityIcon(s: Alert['severity']): string {
    switch (s) {
      case 'success':
        return 'pi pi-check-circle';
      case 'info':
        return 'pi pi-info-circle';
      case 'warn':
        return 'pi pi-exclamation-triangle';
      case 'error':
        return 'pi pi-times-circle';
    }
  }

  acknowledge(a: Alert) {
    a.acknowledged = !a.acknowledged;
  }

  applyFilter(value: string) {
    this.dt?.filterGlobal(value, 'contains');
  }

  severityIconClass(sev: string): string {
    switch (sev) {
      case 'error':
        return 'text-rose-500 bg-rose-50 dark:bg-rose-500/10';
      case 'warn':
        return 'text-amber-500 bg-amber-50 dark:bg-amber-500/10';
      case 'success':
        return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10';
      default:
        return 'text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10';
    }
  }

  fmtAgo(d: Date): string {
    const m = Math.round((Date.now() - d.getTime()) / 60000);
    if (m < 1) return 'gerade';
    if (m < 60) return `vor ${m} min`;
    return `vor ${Math.round(m / 60)} h`;
  }
}
