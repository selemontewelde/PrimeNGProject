import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DashboardComponent, MenubarModule],
  templateUrl: './app.html',
})
export class App implements OnInit {
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      { label: 'Dashboard', icon: 'pi pi-home' },
      { label: 'Netzwerk', icon: 'pi pi-sitemap' },
      { label: 'Einstellungen', icon: 'pi pi-cog' },
    ];
  }
}
