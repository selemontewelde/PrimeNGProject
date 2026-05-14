import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { InputNumberModule } from 'primeng/inputnumber';
import { DividerModule } from 'primeng/divider';
import { ThemeService } from '../../../../core/theme.service';

@Component({
  selector: 'app-settings-section',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ToggleSwitchModule,
    InputNumberModule,
    DividerModule,
  ],
  templateUrl: './settings-section.html',
})
export class SettingsSection {
  readonly theme = inject(ThemeService);

  // Two-way bound to the signal
  get dark() {
    return this.theme.darkMode();
  }
  set dark(v: boolean) {
    this.theme.set(v);
  }

  notif = {
    email: true,
    push: false,
    sms: false,
  };

  thresholds = {
    cpu: 85,
    tempC: 60,
    humidity: 70,
  };
}
