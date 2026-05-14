import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TagModule } from 'primeng/tag';
import { DataService } from '../../../../core/data.service';
import { ThemeService } from '../../../../core/theme.service';
import { KpiTile } from '../../../../shared/kpi-tile/kpi-tile';

@Component({
  selector: 'app-overview-section',
  standalone: true,
  imports: [CommonModule, CardModule, ChartModule, TagModule, KpiTile],
  templateUrl: './overview-section.html',
})
export class OverviewSection {
  private readonly data = inject(DataService);
  private readonly theme = inject(ThemeService);

  readonly kpis = this.data.getKpis();
  readonly events = this.data.getEvents().slice(0, 8);

  get doughnutData() {
    const s = this.data.getStatusDistribution();
    return {
      labels: ['Online', 'Warnung', 'Offline'],
      datasets: [
        {
          data: [s.online, s.warn, s.offline],
          backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
          borderWidth: 0,
        },
      ],
    };
  }

  get doughnutOptions() {
    const dark = this.theme.darkMode();
    return {
      cutout: '70%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: dark ? '#cbd5e1' : '#475569',
            font: { family: 'Inter', size: 12 },
            usePointStyle: true,
            padding: 14,
          },
        },
      },
    };
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
