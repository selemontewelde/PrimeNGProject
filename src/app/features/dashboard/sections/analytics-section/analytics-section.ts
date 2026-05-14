import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { DataService } from '../../../../core/data.service';
import { ThemeService } from '../../../../core/theme.service';

@Component({
  selector: 'app-analytics-section',
  standalone: true,
  imports: [CommonModule, CardModule, ChartModule],
  templateUrl: './analytics-section.html',
})
export class AnalyticsSection {
  private readonly data = inject(DataService);
  private readonly theme = inject(ThemeService);

  private readonly traffic = this.data.getTrafficSeries();
  private readonly load = this.data.getDeviceLoadSeries();
  private readonly sensors = this.data.getSensorTrends();
  private readonly status = this.data.getStatusDistribution();

  readonly trafficData = computed(() => ({
    labels: this.traffic.labels,
    datasets: [
      {
        label: 'RX (Mbps)',
        data: this.traffic.rx,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        borderWidth: 2,
      },
      {
        label: 'TX (Mbps)',
        data: this.traffic.tx,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.15)',
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  }));

  readonly loadData = computed(() => ({
    labels: this.load.labels,
    datasets: [
      {
        label: 'CPU %',
        data: this.load.cpu,
        backgroundColor: '#6366f1',
        borderRadius: 6,
      },
      {
        label: 'RAM %',
        data: this.load.ram,
        backgroundColor: '#10b981',
        borderRadius: 6,
      },
    ],
  }));

  readonly statusData = computed(() => ({
    labels: ['Online', 'Warnung', 'Offline'],
    datasets: [
      {
        data: [this.status.online, this.status.warn, this.status.offline],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
        borderWidth: 0,
      },
    ],
  }));

  readonly sensorsData = computed(() => ({
    labels: this.sensors.labels,
    datasets: [
      {
        label: 'Temperatur (°C)',
        data: this.sensors.temp,
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
        tension: 0.4,
        yAxisID: 'y',
        pointRadius: 0,
        borderWidth: 2,
        fill: false,
      },
      {
        label: 'Luftfeuchte (%)',
        data: this.sensors.humidity,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.15)',
        tension: 0.4,
        yAxisID: 'y1',
        pointRadius: 0,
        borderWidth: 2,
        fill: false,
      },
    ],
  }));

  readonly lineOptions = computed(() => this.makeAxisOptions());
  readonly barOptions = computed(() =>
    this.makeAxisOptions({ stacked: false, maxY: 100, beginAtZero: true }),
  );
  readonly doughnutOptions = computed(() => {
    const dark = this.theme.darkMode();
    return {
      cutout: '65%',
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
  });
  readonly dualAxisOptions = computed(() => {
    const dark = this.theme.darkMode();
    const tick = dark ? '#94a3b8' : '#64748b';
    const grid = dark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(15, 23, 42, 0.08)';
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          labels: { color: tick, font: { family: 'Inter', size: 12 }, usePointStyle: true },
        },
      },
      scales: {
        x: { ticks: { color: tick }, grid: { color: grid } },
        y: {
          type: 'linear',
          position: 'left',
          ticks: { color: tick },
          grid: { color: grid },
          title: { display: true, text: '°C', color: tick },
        },
        y1: {
          type: 'linear',
          position: 'right',
          ticks: { color: tick },
          grid: { drawOnChartArea: false },
          title: { display: true, text: '%', color: tick },
        },
      },
    };
  });

  private makeAxisOptions(opts?: { stacked?: boolean; maxY?: number; beginAtZero?: boolean }) {
    const dark = this.theme.darkMode();
    const tick = dark ? '#94a3b8' : '#64748b';
    const grid = dark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(15, 23, 42, 0.08)';
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          labels: { color: tick, font: { family: 'Inter', size: 12 }, usePointStyle: true },
        },
      },
      scales: {
        x: {
          stacked: opts?.stacked ?? false,
          ticks: { color: tick },
          grid: { color: grid },
        },
        y: {
          stacked: opts?.stacked ?? false,
          beginAtZero: opts?.beginAtZero ?? true,
          max: opts?.maxY,
          ticks: { color: tick },
          grid: { color: grid },
        },
      },
    };
  }
}
