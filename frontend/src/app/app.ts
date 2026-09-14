import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navigation } from './components/navigation/navigation';
import { PATHS } from './config/paths.config';
import { AuthService } from './features/auth/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navigation],
  template: `
    <app-navigation
      [links]="getAvailableLinks()"
      [currentUser]="authService.currentUser()"
      (logout)="authService.logout()"
    />

    <div>
      <router-outlet></router-outlet>
    </div>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      height: 100dvh;
    }

    :host > div {
      display: block;
      flex: 1;
      min-height: 0;
      width: min(100% - 2rem, 1200px);
      margin: 0 auto;
      padding: 2rem 0;
    }

    @media (max-width: 600px) {
      :host > div {
        width: min(100% - 1rem, 1200px);
        padding: 1rem 0;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly authService = inject(AuthService);

  getAvailableLinks() {
    return Object.values(PATHS);
  }
}
