import { Component, computed, input, output, ChangeDetectionStrategy } from '@angular/core';
import { NavigationItem } from './navigation.type';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthUser } from '../../features/auth/services/auth.service';

@Component({
  selector: 'app-navigation',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav data-testid="TOP_LEVEL_NAVBAR">
      <div class="nav-links">
        @for (linkItem of visibleLinks(); track linkItem.path) {
          <a [routerLink]="linkItem.path" routerLinkActive="active">{{ linkItem.label }}</a>
        }
      </div>

      <div class="auth-section">
        @if (currentUser(); as user) {
          <a [routerLink]="['/user', user.id]" class="user-greeting-link" title="Mein Profil & Notfallkontakt bearbeiten">
            <span class="user-greeting">
              Angemeldet als <strong>{{ user.firstName }} {{ user.lastName }}</strong>
            </span>
          </a>
          <button class="logout-btn" (click)="logout.emit()" data-testid="NAV_LOGOUT_BUTTON">Abmelden</button>
        } @else {
          <a routerLink="/login" class="login-link" routerLinkActive="active" data-testid="NAV_LOGIN_LINK">Anmelden</a>
          <a routerLink="/register" class="register-link" routerLinkActive="active" data-testid="NAV_REGISTER_LINK">Registrieren</a>
        }
      </div>
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      position: sticky;
      top: 0;
      z-index: 10;
      display: block;
      border-bottom: 1px solid var(--color-border-default);
      background: var(--color-bg-surface);
    }

    nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 0.5rem;
      width: min(100% - 2rem, 1200px);
      margin: 0 auto;
      padding: 0.75rem 0;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      flex-wrap: wrap;
    }

    .auth-section {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-greeting-link {
      text-decoration: none;
      color: inherit;
      padding: 0.35rem 0.5rem;
      border-radius: var(--radius-md);
      transition: background-color var(--transition-fast);
    }

    .user-greeting-link:hover {
      background: var(--color-primary-subtle);
    }

    .user-greeting-link:hover strong {
      color: var(--color-primary);
    }

    .user-greeting {
      font-size: 0.875rem;
      color: var(--color-text-muted);
    }

    .user-greeting strong {
      color: var(--color-text-main);
    }

    a {
      padding: 0.625rem 0.75rem;
      border-radius: var(--radius-md);
      text-decoration: none;
      color: var(--color-text-muted);
      font-weight: 500;
      transition: background-color var(--transition-fast), color var(--transition-fast);
    }

    a.active {
      color: var(--color-primary);
      background: var(--color-primary-light);
    }

    .login-link {
      background: var(--color-primary-light);
      color: var(--color-primary);
    }

    .register-link {
      border: 1px solid var(--color-border-input);
      color: var(--color-text-main);
      background: var(--color-bg-surface);
    }

    .register-link:hover {
      background: var(--color-bg-app);
      border-color: var(--color-primary);
      color: var(--color-primary);
    }

    .logout-btn {
      padding: 0.45rem 0.75rem;
      border: 1px solid var(--color-border-input);
      border-radius: var(--radius-md);
      background: var(--color-bg-surface);
      color: var(--color-text-muted);
      font: inherit;
      font-size: 0.875rem;
      cursor: pointer;
      transition: background-color var(--transition-normal), border-color var(--transition-normal);
    }

    .logout-btn:hover {
      background: var(--color-bg-app);
      border-color: var(--color-border-input);
      color: var(--color-primary);
    }

    @media (max-width: 600px) {
      nav {
        width: min(100% - 1rem, 1200px);
      }
    }
  `,
})
export class Navigation {
  readonly links = input.required<NavigationItem[]>();
  readonly currentUser = input<AuthUser | null>(null);
  readonly logout = output<void>();

  readonly visibleLinks = computed(() => {
    return this.links().filter(
      item => item.path !== 'login' && item.path !== 'register',
    );
  });
}
