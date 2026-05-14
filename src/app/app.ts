import { Component } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard';
import { AppHeader } from './layout/app-header/app-header';
import { MobileDrawer } from './layout/mobile-drawer/mobile-drawer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AppHeader, DashboardComponent, MobileDrawer],
  templateUrl: './app.html',
})
export class App {}
