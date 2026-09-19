import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Button } from '../../../../components/button/button';
import { RegisterData } from '../../services/auth.service';

@Component({
  selector: 'app-register-form',
  imports: [ReactiveFormsModule, RouterLink, Button],
  template: `
    <form [formGroup]="registerForm" (ngSubmit)="submitForm()" novalidate>
      <h3 class="section-title">Persönliche Angaben</h3>

      <div class="fields-row">
        <div class="field">
          <label for="firstName">Vorname:</label>
          <input
            id="firstName"
            type="text"
            formControlName="firstName"
            placeholder="z.B. Colin"
            [class.input-error]="isInvalid('firstName')"
          />
        </div>

        <div class="field">
          <label for="lastName">Nachname:</label>
          <input
            id="lastName"
            type="text"
            formControlName="lastName"
            placeholder="z.B. Muster"
            [class.input-error]="isInvalid('lastName')"
          />
        </div>
      </div>

      <div class="field">
        <label for="email">E-Mail-Adresse:</label>
        <input
          id="email"
          type="email"
          formControlName="email"
          placeholder="z.B. colin@muster.ch"
          [class.input-error]="isInvalid('email')"
        />
      </div>

      <div class="field">
        <label for="password">Passwort (mind. 6 Zeichen):</label>
        <input
          id="password"
          type="password"
          formControlName="password"
          placeholder="Sicheres Passwort"
          [class.input-error]="isInvalid('password')"
        />
      </div>

      <div class="fields-row">
        <div class="field">
          <label for="birthday">Geburtsdatum:</label>
          <input
            id="birthday"
            type="date"
            formControlName="birthday"
            [class.input-error]="isInvalid('birthday')"
          />
        </div>

        <div class="field">
          <label for="phoneNumber">Telefonnummer:</label>
          <input
            id="phoneNumber"
            type="tel"
            formControlName="phoneNumber"
            placeholder="z.B. +41 79 123 45 67"
            [class.input-error]="isInvalid('phoneNumber')"
          />
        </div>
      </div>

      <hr class="divider" />

      <h3 class="section-title">Notfallkontakt</h3>
      <p class="section-hint">
        Wird für die Tourenleitung hinterlegt, um im Ernstfall schnell Angehörige kontaktieren zu können.
      </p>

      <div class="fields-row">
        <div class="field">
          <label for="emergencyFirstName">Vorname:</label>
          <input
            id="emergencyFirstName"
            type="text"
            formControlName="emergencyFirstName"
            placeholder="z.B. Anna"
            [class.input-error]="isInvalid('emergencyFirstName')"
          />
        </div>

        <div class="field">
          <label for="emergencyLastName">Nachname:</label>
          <input
            id="emergencyLastName"
            type="text"
            formControlName="emergencyLastName"
            placeholder="z.B. Muster"
            [class.input-error]="isInvalid('emergencyLastName')"
          />
        </div>
      </div>

      <div class="fields-row">
        <div class="field">
          <label for="emergencyPhone">Telefonnummer:</label>
          <input
            id="emergencyPhone"
            type="tel"
            formControlName="emergencyPhone"
            placeholder="z.B. +41 78 234 56 78"
            [class.input-error]="isInvalid('emergencyPhone')"
          />
        </div>

        <div class="field">
          <label for="emergencyRelationship">Beziehung:</label>
          <input
            id="emergencyRelationship"
            type="text"
            formControlName="emergencyRelationship"
            placeholder="z.B. Mutter, Partner/in, Vater"
            [class.input-error]="isInvalid('emergencyRelationship')"
          />
        </div>
      </div>

      <div class="actions">
        <app-button
          type="submit"
          text="Registrieren"
          variant="primary"
          [disabled]="isSubmitting() || (submitted && registerForm.invalid)"
        />

        <a routerLink="/login" class="login-switch-link">
          Bereits ein Konto? Anmelden
        </a>
      </div>
    </form>
  `,
  styles: `
    :host {
      display: block;
    }

    form {
      display: block;
    }

    .section-title {
      margin: 0 0 0.5rem 0;
      color: #253c38;
      font-size: 1.1rem;
      font-weight: 600;
    }

    .section-hint {
      margin: 0 0 1rem 0;
      color: #65636d;
      font-size: 0.85rem;
      line-height: 1.4;
    }

    .fields-row {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .fields-row .field {
      flex: 1;
      margin-bottom: 0;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .field label {
      color: #253c38;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .field input {
      width: 100%;
      box-sizing: border-box;
      padding: 0.75rem 0.875rem;
      border: 1px solid #d0d5dd;
      border-radius: 10px;
      background: #fff;
      font: inherit;
      transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease;
    }

    .field input:focus {
      border-color: #4f46a5;
      box-shadow: 0 0 0 3px rgb(79 70 165 / 10%);
      outline: none;
    }

    .divider {
      border: none;
      border-top: 1px solid #e5e7eb;
      margin: 1.5rem 0;
    }

    .input-error {
      border-color: #dc2626 !important;
      background: #fff5f5;
      box-shadow: 0 0 0 3px rgb(220 38 38 / 8%);
    }

    .actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    .login-switch-link {
      color: #4f46a5;
      font-size: 0.9rem;
      text-decoration: none;
      font-weight: 500;
      transition: text-decoration 0.2s ease;
    }

    .login-switch-link:hover {
      text-decoration: underline;
    }

    @media (max-width: 600px) {
      .fields-row {
        flex-direction: column;
        gap: 1rem;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterForm {
  private readonly fb = inject(FormBuilder);

  readonly isSubmitting = input(false);
  readonly onFormSubmit = output<RegisterData>();

  submitted = false;

  readonly registerForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    birthday: ['', [Validators.required]],
    phoneNumber: ['', [Validators.required]],
    emergencyFirstName: ['', [Validators.required]],
    emergencyLastName: ['', [Validators.required]],
    emergencyPhone: ['', [Validators.required]],
    emergencyRelationship: ['', [Validators.required]],
  });

  isInvalid(controlName: string): boolean {
    const control = this.registerForm.get(controlName);
    return !!control && control.invalid && (control.touched || this.submitted);
  }

  submitForm(): void {
    if (this.isSubmitting()) {
      return;
    }

    this.submitted = true;
    this.registerForm.markAllAsTouched();

    if (this.registerForm.invalid) {
      return;
    }

    const value = this.registerForm.getRawValue();

    this.onFormSubmit.emit({
      firstName: value.firstName?.trim() ?? '',
      lastName: value.lastName?.trim() ?? '',
      email: value.email?.trim() ?? '',
      password: value.password ?? '',
      birthday: value.birthday ?? '',
      phoneNumber: value.phoneNumber?.trim() ?? '',
      emergencyContact: {
        firstName: value.emergencyFirstName?.trim() ?? '',
        lastName: value.emergencyLastName?.trim() ?? '',
        phoneNumber: value.emergencyPhone?.trim() ?? '',
        relationship: value.emergencyRelationship?.trim() ?? '',
      },
    });
  }
}
