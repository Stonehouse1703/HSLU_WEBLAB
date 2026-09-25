import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { Card } from '../../../../components/card/card';
import { AuthService, RegisterData } from '../../services/auth.service';
import { RegisterForm } from '../../dumb_components/register-form/register-form';

@Component({
  selector: 'app-register-container',
  imports: [Card, RegisterForm],
  template: `
    @if (errorMessage()) {
      <p class="error-banner" role="alert">{{ errorMessage() }}</p>
    }

    <app-card title="Registrierung">
      <app-register-form
        [isSubmitting]="isSubmitting()"
        (onFormSubmit)="register($event)"
      />
    </app-card>
  `,
  styles: `
    :host {
      display: block;
      max-width: 640px;
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
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterContainer {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  register(data: RegisterData): void {
    if (this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.authService.register(data).subscribe({
      next: () => {
        this.router.navigate(['/tour-management']);
      },
      error: err => {
        this.isSubmitting.set(false);
        const msg =
          err?.error?.message ||
          'Die Registrierung ist fehlgeschlagen. Bitte prüfe deine Eingaben oder versuche es später erneut.';
        this.errorMessage.set(msg);
      },
    });
  }
}
