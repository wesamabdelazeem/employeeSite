import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatTooltipModule,
    RouterLink,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  version = '3.4.9.0-SNAPSHOT';
  currentDate = new Date('2025-05-06T02:00:00');
  username = 'terab01@bmi.gv.at';
  userDisplayName = 'Hassan Terab (terab01@bmi.gv.at)';

  /**
   * German label shown in the top-right of the header for the current
   * deployment environment. Driven by the `environment` field on the
   * environment config (set by each environment.*.ts file).
   */
  get environmentLabel(): string {
    const env = ((environment as any).environment ?? '').toString().toLowerCase();
    if (env === 'local') return 'Localhost';
    if (env === 'development') return 'Entwicklung';
    if (env === 'test') return 'Test';
    if (env === 'production' || (environment as any).production === true) return 'Get-It';
    return env ? env.charAt(0).toUpperCase() + env.slice(1) : 'Entwicklung';
  }

  /**
   * Modifier class so each environment can be coloured differently in the
   * header (`env-local` / `env-development` / `env-test` / `env-production`).
   */
  get environmentClass(): string {
    const env = ((environment as any).environment ?? '').toString().toLowerCase();
    return env ? `env-${env}` : '';
  }
}
