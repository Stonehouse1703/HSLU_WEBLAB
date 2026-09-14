import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
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
          <span class="user-greeting">
            Angemeldet als <strong>{{ user.firstName }} {{ user.lastName }}</strong>
          </span>
          <button class="logout-btn" (click)="logout.emit()">Abmelden</button>
        } @else {
          <a routerLink="/login" class="login-link" routerLinkActive="active">Anmelden</a>
        }
      </div>
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      position: sticky;
      top: 0;
      z-index: 1;
      display: block;
      border-bottom: 1px solid #e2e1e8;
      background: #fff;
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

    .user-greeting {
      font-size: 0.875rem;
      color: #65636d;
    }

    .user-greeting strong {
      color: #25252d;
    }

    a {
      padding: 0.625rem 0.75rem;
      border-radius: 8px;
      text-decoration: none;
      color: #4e4c56;
      font-weight: 500;
    }

    a.active {
      color: #4f46a5;
      background: #eeecf9;
    }

    .login-link {
      background: #eeecf9;
      color: #4f46a5;
    }

    .logout-btn {
      padding: 0.45rem 0.75rem;
      border: 1px solid #d0d5dd;
      border-radius: 8px;
      background: #fff;
      color: #65636d;
      font: inherit;
      font-size: 0.875rem;
      cursor: pointer;
      transition: background-color 0.2s ease, border-color 0.2s ease;
    }

    .logout-btn:hover {
      background: #f6f6fa;
      border-color: #c8c6d0;
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

  visibleLinks(): NavigationItem[] {
    return this.links().filter(item => item.path !== 'login');
  }
}
