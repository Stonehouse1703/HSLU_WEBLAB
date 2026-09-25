import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Card } from '../../../../components/card/card';
import { AuthService } from '../../services/auth.service';
import { LoginForm } from '../../dumb_components/login-form/login-form';

@Component({
  selector: 'app-login-container',
  imports: [Card, LoginForm],
  template: `
    @if (errorMessage()) {
      <p class="error-banner" role="alert">{{ errorMessage() }}</p>
    }

    <app-card title="Anmelden">
      <app-login-form
        [isSubmitting]="isSubmitting()"
        (onFormSubmit)="login($event)"
      />
    </app-card>
  `,
  styles: `
    :host {
      display: block;
      max-width: 480px;
      margin: 0 auto;
    }

    .error-banner {
      margin-bottom: 1rem;
      padding: 0.75rem 1rem;
      border-radius: var(--radius-md);
      color: var(--color-danger-text);
      background-color: var(--color-danger-bg);
      border: 1px solid var(--color-danger-border);
    }

    .hint-box {
      margin-top: 1.5rem;
      padding: 1rem;
      border-radius: var(--radius-md);
      background-color: var(--color-bg-app);
      border: 1px solid var(--color-border-default);
      font-size: 0.875rem;
      color: var(--color-text-muted);
    }

    .hint-box p {
      margin: 0 0 0.5rem 0;
    }

    .hint-box ul {
      margin: 0;
      padding-left: 1.25rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginContainer {
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  login(credentials: { email: string; password: string }): void {
    if (this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.authService.login(credentials).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        const targetUrl =
          returnUrl?.startsWith('/') && !returnUrl.startsWith('//')
            ? returnUrl
            : '/tour-management';
        this.router.navigateByUrl(targetUrl);
      },
      error: err => {
        this.isSubmitting.set(false);
        const msg =
          err?.error?.message ||
          'Anmeldung fehlgeschlagen. Bitte prüfe deine E-Mail-Adresse und dein Passwort.';
        this.errorMessage.set(msg);
      },
    });
  }
}
