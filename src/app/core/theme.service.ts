import { Injectable, effect, signal } from '@angular/core';

const STORAGE_KEY = 'theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly darkMode = signal<boolean>(this.read());

  constructor() {
    effect(() => {
      const dark = this.darkMode();
      document.documentElement.classList.toggle('dark', dark);
      try {
        localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
      } catch {}
    });
  }

  toggle() {
    this.darkMode.update((v) => !v);
  }

  set(dark: boolean) {
    this.darkMode.set(dark);
  }

  private read(): boolean {
    try {
      const t = localStorage.getItem(STORAGE_KEY);
      if (t === 'dark') return true;
      if (t === 'light') return false;
    } catch {}
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
}
