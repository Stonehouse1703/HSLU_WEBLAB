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
      color: #25252d;
      font-weight: 500;
      font-size: 0.875rem;
    }

    .field input {
      width: 100%;
      box-sizing: border-box;
      padding: 0.65rem 0.85rem;
      border: 1px solid #c8c6d0;
      border-radius: 8px;
      background: #fff;
      font: inherit;
      font-size: 0.9rem;
      outline: none;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }

    .field input:focus {
      border-color: #4f46a5;
      box-shadow: 0 0 0 3px rgba(79, 70, 165, 0.12);
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
      color: #4f46a5;
      font-size: 0.875rem;
      text-decoration: none;
      font-weight: 500;
      transition: text-decoration 0.2s ease;
    }

    .register-switch-link:hover {
      text-decoration: underline;
    }

    .has-error {
      border-color: #b3261e !important;
      background: #fff8f8;
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
