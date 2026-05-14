import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ThemeService } from '../../core/theme.service';
import { LayoutService, SectionId } from '../../core/layout.service';

interface NavItem {
  id: SectionId;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ButtonModule, TooltipModule],
  templateUrl: './app-header.html',
})
export class AppHeader {
  readonly theme = inject(ThemeService);
  readonly layout = inject(LayoutService);

  readonly themeIcon = computed(() =>
    this.theme.darkMode() ? 'pi pi-sun' : 'pi pi-moon',
  );

  readonly items: NavItem[] = [
    { id: 'overview', label: 'Übersicht', icon: 'pi pi-th-large' },
    { id: 'devices', label: 'Geräte', icon: 'pi pi-sitemap' },
    { id: 'analytics', label: 'Analytics', icon: 'pi pi-chart-bar' },
    { id: 'alerts', label: 'Alerts', icon: 'pi pi-bell' },
    { id: 'settings', label: 'Settings', icon: 'pi pi-cog' },
  ];

  go(id: SectionId) {
    this.layout.scrollTo(id);
  }
}
