import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from '../../../../components/button/button';
import { User } from '../../user.types';

@Component({
  selector: 'app-edit-profile-form',
  imports: [ReactiveFormsModule, Button],
  template: `
    <form [formGroup]="profileForm" (ngSubmit)="submitForm()" novalidate>
      <h3 class="section-title">Notfallkontakt</h3>
      <p class="section-hint">
        Diese Daten sind für die Tourenleitung hinterlegt, damit im Ernstfall am Berg unverzüglich Angehörige verständigt werden können.
      </p>

      <div class="fields-row">
        <div class="field">
          <label for="emergFirstName">Vorname:</label>
          <input
            id="emergFirstName"
            type="text"
            formControlName="emergFirstName"
            placeholder="z.B. Anna"
            [class.input-error]="isInvalid('emergFirstName')"
          />
        </div>

        <div class="field">
          <label for="emergLastName">Nachname:</label>
          <input
            id="emergLastName"
            type="text"
            formControlName="emergLastName"
            placeholder="z.B. Muster"
            [class.input-error]="isInvalid('emergLastName')"
          />
        </div>
      </div>

      <div class="fields-row">
        <div class="field">
          <label for="emergPhone">Telefonnummer:</label>
          <input
            id="emergPhone"
            type="tel"
            formControlName="emergPhone"
            placeholder="z.B. +41 78 234 56 78"
            [class.input-error]="isInvalid('emergPhone')"
          />
        </div>

        <div class="field">
          <label for="emergRelationship">Beziehung:</label>
          <input
            id="emergRelationship"
            type="text"
            formControlName="emergRelationship"
            placeholder="z.B. Mutter, Partner/in, Vater"
            [class.input-error]="isInvalid('emergRelationship')"
          />
        </div>
      </div>

      <hr class="divider" />

      <h3 class="section-title">Persönliche Daten</h3>

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

      <div class="fields-row">
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

        <div class="field">
          <label for="birthday">Geburtsdatum:</label>
          <input
            id="birthday"
            type="date"
            formControlName="birthday"
            [class.input-error]="isInvalid('birthday')"
          />
        </div>
      </div>

      <div class="actions">
        <app-button
          type="submit"
          text="Änderungen speichern"
          variant="primary"
          [disabled]="isSubmitting() || (submitted && profileForm.invalid)"
        />

        <app-button
          type="button"
          text="Abbrechen"
          variant="secondary"
          (clicked)="onCancel.emit()"
        />
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
      gap: 0.75rem;
      margin-top: 1.5rem;
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
export class EditProfileForm {
  private readonly fb = inject(FormBuilder);

  readonly user = input.required<User>();
  readonly isSubmitting = input(false);
  readonly onSave = output<Partial<User>>();
  readonly onCancel = output<void>();

  submitted = false;

  readonly profileForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    phoneNumber: ['', [Validators.required]],
    birthday: ['', [Validators.required]],
    emergFirstName: ['', [Validators.required]],
    emergLastName: ['', [Validators.required]],
    emergPhone: ['', [Validators.required]],
    emergRelationship: ['', [Validators.required]],
  });

  constructor() {
    effect(() => {
      const u = this.user();
      if (u) {
        this.profileForm.patchValue({
          firstName: u.firstName ?? '',
          lastName: u.lastName ?? '',
          phoneNumber: u.phoneNumber ?? '',
          birthday: u.birthday ?? '',
          emergFirstName: u.emergencyContact?.firstName ?? '',
          emergLastName: u.emergencyContact?.lastName ?? '',
          emergPhone: u.emergencyContact?.phoneNumber ?? '',
          emergRelationship: u.emergencyContact?.relationship ?? '',
        });
      }
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.profileForm.get(controlName);
    return !!control && control.invalid && (control.touched || this.submitted);
  }

  submitForm(): void {
    if (this.isSubmitting()) {
      return;
    }

    this.submitted = true;
    this.profileForm.markAllAsTouched();

    if (this.profileForm.invalid) {
      return;
    }

    const val = this.profileForm.getRawValue();

    this.onSave.emit({
      firstName: val.firstName?.trim(),
      lastName: val.lastName?.trim(),
      phoneNumber: val.phoneNumber?.trim(),
      birthday: val.birthday ?? '',
      emergencyContact: {
        firstName: val.emergFirstName?.trim() ?? '',
        lastName: val.emergLastName?.trim() ?? '',
        phoneNumber: val.emergPhone?.trim() ?? '',
        relationship: val.emergRelationship?.trim() ?? '',
      },
    });
  }
}
