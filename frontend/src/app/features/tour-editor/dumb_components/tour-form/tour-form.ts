import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from '../../../../components/button/button';
import { CreateTourInput } from '../../../tour-management/services/tour.api';
import { MeetingPoint } from '../meetingPoint/meetingPoint';
import { TourPlaning } from '../tourPlaning/tourPlaning';

@Component({
  selector: 'app-tour-form',
  imports: [ReactiveFormsModule, MeetingPoint, TourPlaning, Button],
  template: `
    <form [formGroup]="tourForm" (ngSubmit)="submitForm()" novalidate>
      <div class="field">
        <label for="name">Tourname:</label>
        <input
          id="name"
          type="text"
          formControlName="name"
          placeholder="z.B. Pazolastock"
          [class.input-error]="isInvalid('name')"
        >
      </div>

      <hr class="divider">
      <app-meeting-point [formGroup]="tourForm" [submitted]="submitted" />

      <hr class="divider">
      <app-tour-planing [formGroup]="tourForm" [submitted]="submitted" />

      <div class="actions">
        <app-button
          type="submit"
          text="Tour erstellen"
          variant="primary"
          [disabled]="isSubmitting() || (submitted && tourForm.invalid)"
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

    .field {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1rem;
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
      transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
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

    .actions {
      margin-top: 1.5rem;
    }

    .input-error {
      border-color: #dc2626 !important;
      background: #fff5f5;
      box-shadow: 0 0 0 3px rgb(220 38 38 / 8%);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TourForm {
  private readonly fb = inject(FormBuilder);

  readonly isSubmitting = input(false);
  readonly onFormSubmit = output<CreateTourInput>();

  submitted = false;

  readonly tourForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    date: ['', Validators.required],
    time: ['', Validators.required],
    place: ['', [Validators.required, Validators.minLength(2)]],
    altitude: ['', [Validators.required, Validators.min(1)]],
    difficulty: ['leicht', Validators.required],
  });

  isInvalid(controlName: string): boolean {
    const control = this.tourForm.get(controlName);
    return !!control && control.invalid && (control.touched || this.submitted);
  }

  submitForm(): void {
    if (this.isSubmitting()) {
      return;
    }

    this.submitted = true;
    this.tourForm.markAllAsTouched();

    if (this.tourForm.invalid) {
      return;
    }

    const value = this.tourForm.getRawValue();
    const name = value.name?.trim() ?? '';
    const date = value.date ?? '';
    const time = value.time ?? '';
    const place = value.place?.trim() ?? '';
    const altitude = Number(value.altitude ?? 0);
    const difficulty = value.difficulty ?? 'leicht';

    this.onFormSubmit.emit({
      name,
      date,
      time,
      location: place,
      altitude: `${altitude}m`,
      difficulty,
    });
  }
}
