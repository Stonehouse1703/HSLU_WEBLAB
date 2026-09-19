import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Button } from '../../../../components/button/button';

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule, RouterLink, Button],
  template: `
    <form [formGroup]="loginForm" (ngSubmit)="submitForm()" novalidate>
      <div class="field">
        <label for="email">E-Mail-Adresse:</label>
        <input
          id="email"
          type="email"
          formControlName="email"
          placeholder="z.B. colin@muster.ch"
          [class.input-error]="isInvalid('email')"
        >
        @if (isInvalid('email')) {
          <span class="field-error">
            @if (loginForm.get('email')?.hasError('required')) {
              Bitte eine E-Mail-Adresse eingeben.
            } @else if (loginForm.get('email')?.hasError('email')) {
              Bitte eine gültige E-Mail-Adresse eingeben.
            }
          </span>
        }
      </div>

      <div class="field">
        <label for="password">Passwort:</label>
        <input
          id="password"
          type="password"
          formControlName="password"
          placeholder="Dein Passwort"
          [class.input-error]="isInvalid('password')"
        >
        @if (isInvalid('password')) {
          <span class="field-error">Bitte Passwort eingeben.</span>
        }
      </div>

      <div class="actions">
        <app-button
          type="submit"
          text="Anmelden"
          variant="primary"
          [disabled]="isSubmitting() || loginForm.invalid"
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
      gap: 0.5rem;
    }

    .field label {
      color: #253c38;
      font-weight: 600;
    }

    .field input {
      width: 100%;
      box-sizing: border-box;
      padding: 0.75rem 0.875rem;
      border: 1px solid #d0d5dd;
      border-radius: 10px;
      background: #fff;
      font: inherit;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }

    .field input:focus {
      border-color: #4f46a5;
      box-shadow: 0 0 0 3px rgb(79 70 165 / 10%);
      outline: none;
    }

    .input-error {
      border-color: #dc2626 !important;
      background: #fff5f5;
      box-shadow: 0 0 0 3px rgb(220 38 38 / 8%);
    }

    .field-error {
      color: #dc2626;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1rem;
      margin-top: 0.5rem;
    }

    .register-switch-link {
      color: #4f46a5;
      font-size: 0.875rem;
      text-decoration: none;
      font-weight: 500;
      transition: text-decoration 0.2s ease;
    }

    .register-switch-link:hover {
      text-decoration: underline;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginForm {
  private readonly fb = inject(FormBuilder);

  readonly isSubmitting = input(false);
  readonly onFormSubmit = output<{ email: string; password: string }>();

  submitted = false;

  readonly loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  isInvalid(controlName: string): boolean {
    const control = this.loginForm.get(controlName);
    return !!control && control.invalid && (control.touched || this.submitted);
  }

  submitForm(): void {
    if (this.isSubmitting()) {
      return;
    }

    this.submitted = true;
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
