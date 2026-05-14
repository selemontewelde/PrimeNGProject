import { Injectable, signal } from '@angular/core';

export type SectionId = 'overview' | 'devices' | 'analytics' | 'alerts' | 'settings';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  readonly drawerOpen = signal(false);
  readonly activeSection = signal<SectionId>('overview');

  toggleDrawer() {
    this.drawerOpen.update((v) => !v);
  }

  openDrawer() {
    this.drawerOpen.set(true);
  }

  closeDrawer() {
    this.drawerOpen.set(false);
  }

  setActiveSection(id: SectionId) {
    this.activeSection.set(id);
  }

  scrollTo(id: SectionId) {
    this.closeDrawer();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.setActiveSection(id);
    }
  }
}
