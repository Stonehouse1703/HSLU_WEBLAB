import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LoginContainer } from '../../smart_container/login/login';

@Component({
  selector: 'app-login-page',
  imports: [LoginContainer],
  template: `
    <main class="login-page">
      <header class="page-header">
        <span class="eyebrow">Benutzerkonto</span>
        <h1>Anmelden</h1>
      </header>

      <app-login-container />
    </main>
  `,
  styles: `
    :host {
      display: block;
    }

    .page-header {
      margin-bottom: 2rem;
      text-align: center;
    }

    .eyebrow {
      display: block;
      margin-bottom: 0.35rem;
      color: var(--color-text-muted);
      font-size: 0.8rem;
      font-weight: 500;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    h1 {
      margin: 0;
      color: var(--color-text-main);
      font-size: clamp(1.6rem, 4vw, 2.25rem);
      font-weight: 500;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {}
