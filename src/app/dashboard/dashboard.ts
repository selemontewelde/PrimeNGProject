import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewSection } from '../features/dashboard/sections/overview-section/overview-section';
import { DevicesSection } from '../features/dashboard/sections/devices-section/devices-section';
import { AnalyticsSection } from '../features/dashboard/sections/analytics-section/analytics-section';
import { AlertsSection } from '../features/dashboard/sections/alerts-section/alerts-section';
import { SettingsSection } from '../features/dashboard/sections/settings-section/settings-section';
import { LayoutService, SectionId } from '../core/layout.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    OverviewSection,
    DevicesSection,
    AnalyticsSection,
    AlertsSection,
    SettingsSection,
  ],
  templateUrl: './dashboard.html',
})
export class DashboardComponent implements OnInit {
  private readonly layout = inject(LayoutService);

  ngOnInit() {
    // active-section tracking via IntersectionObserver
    queueMicrotask(() => {
      const ids: SectionId[] = ['overview', 'devices', 'analytics', 'alerts', 'settings'];
      const sections = ids
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => !!el);
      if (!sections.length || typeof IntersectionObserver === 'undefined') return;

      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
          if (visible?.target?.id) {
            this.layout.setActiveSection(visible.target.id as SectionId);
          }
        },
        { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
      );
      sections.forEach((s) => observer.observe(s));
    });
  }
}
