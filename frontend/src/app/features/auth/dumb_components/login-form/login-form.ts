import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Button } from '../../../../components/button/button';
import { InputFieldError } from '../../../../components/input-field-error/input-field-error';

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule, RouterLink, Button, InputFieldError],
  template: `
    <form [formGroup]="loginForm" (ngSubmit)="submitForm()" novalidate>
      <div class="field">
        <label for="email">E-Mail-Adresse:</label>
        <input
          id="email"
          type="email"
          formControlName="email"
          placeholder="z.B. colin@muster.ch"
          data-testid="LOGIN_EMAIL_INPUT"
          [class.has-error]="isInvalid('email')"
        >
        <app-input-field-error
          [formField]="loginForm.get('email')"
          [submitted]="submitted()"
        />
      </div>

      <div class="field">
        <label for="password">Passwort:</label>
        <input
          id="password"
          type="password"
          formControlName="password"
          placeholder="Dein Passwort"
          data-testid="LOGIN_PASSWORD_INPUT"
          [class.has-error]="isInvalid('password')"
        >
        <app-input-field-error
          [formField]="loginForm.get('password')"
          [submitted]="submitted()"
        />
      </div>

      <div class="actions">
        <app-button
          type="submit"
          text="Anmelden"
          variant="primary"
          data-testid="LOGIN_SUBMIT_BUTTON"
          (clicked)="submitForm()"
          [disabled]="isSubmitting() || (submitted() && loginForm.invalid)"
        />

        <a routerLink="/register" class="register-switch-link">
          Noch kein Konto? Jetzt registrieren
        </a>
      </div>
    </form>
  `,
  styles: `
    :host {
      display: block;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .field label {
      color: var(--color-text-main);
      font-weight: 500;
      font-size: 0.875rem;
    }

    .field input {
      width: 100%;
      box-sizing: border-box;
      padding: 0.65rem 0.85rem;
      border: 1px solid var(--color-border-input);
      border-radius: var(--radius-md);
      background: var(--color-bg-surface);
      font: inherit;
      font-size: 0.9rem;
      outline: none;
      transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
    }

    .field input:focus {
      border-color: var(--color-primary);
      box-shadow: var(--shadow-focus);
    }

    .actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-top: 0.5rem;
      flex-wrap: wrap;
    }

    .register-switch-link {
      color: var(--color-primary);
      font-size: 0.875rem;
      text-decoration: none;
      font-weight: 500;
      transition: text-decoration var(--transition-normal);
    }

    .register-switch-link:hover {
      text-decoration: underline;
    }

    .has-error {
      border-color: var(--color-danger) !important;
      background: var(--color-danger-bg-subtle);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginForm {
  private readonly fb = inject(FormBuilder);

  readonly isSubmitting = input(false);
  readonly onFormSubmit = output<{ email: string; password: string }>();

  readonly submitted = signal(false);

  readonly loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  isInvalid(controlName: string): boolean {
    const control = this.loginForm.get(controlName);
    return !!control && control.invalid && (control.touched || this.submitted());
  }

  submitForm(): void {
    if (this.isSubmitting()) {
      return;
    }

    this.submitted.set(true);
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      return;
    }

    const value = this.loginForm.getRawValue();
    this.onFormSubmit.emit({
      email: value.email?.trim() ?? '',
      password: value.password ?? '',
    });
  }
}
