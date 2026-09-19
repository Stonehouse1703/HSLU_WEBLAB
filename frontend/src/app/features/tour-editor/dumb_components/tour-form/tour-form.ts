import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from '../../../../components/button/button';
import { CreateTourInput } from '../../../tour-management/services/tour.api';
import { Tour } from '../../../tour-management/tour.types';
import { MeetingPoint } from '../meetingPoint/meetingPoint';
import { TourPlaning } from '../tourPlaning/tourPlaning';
import { GpxLoadedEvent, GpxUpload } from '../gpx-upload/gpx-upload';

@Component({
  selector: 'app-tour-form',
  imports: [ReactiveFormsModule, MeetingPoint, TourPlaning, GpxUpload, Button],
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
        />
      </div>

      <hr class="divider" />
      <app-meeting-point [formGroup]="tourForm" [submitted]="submitted" />

      <hr class="divider" />
      <app-tour-planing [formGroup]="tourForm" [submitted]="submitted" />

      <hr class="divider" />
      <app-gpx-upload
        [initialGpx]="gpxData()"
        (gpxLoaded)="onGpxLoaded($event)"
        (gpxCleared)="onGpxCleared()"
      />

      <div class="actions">
        <app-button
          type="submit"
          [text]="submitButtonText()"
          variant="primary"
          [disabled]="isSubmitting() || (submitted && tourForm.invalid)"
        />
        @if (showCancelButton()) {
          <app-button
            type="button"
            text="Abbrechen"
            variant="secondary"
            (clicked)="cancelClicked.emit()"
          />
        }
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
      transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease,
        background-color 0.2s ease;
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
      display: flex;
      align-items: center;
      gap: 0.75rem;
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
  readonly tour = input<Tour | null | undefined>(null);
  readonly submitButtonText = input<string>('Tour erstellen');
  readonly showCancelButton = input<boolean>(false);
  readonly onFormSubmit = output<CreateTourInput>();
  readonly cancelClicked = output<void>();

  submitted = false;
  readonly gpxData = signal<string | null>(null);

  readonly tourForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    date: ['', Validators.required],
    time: ['', Validators.required],
    place: ['', [Validators.required, Validators.minLength(2)]],
    altitude: ['', [Validators.required, Validators.min(1)]],
    difficulty: ['leicht', Validators.required],
  });

  constructor() {
    effect(() => {
      const tour = this.tour();
      if (tour) {
        const cleanAltitude = tour.altitude
          ? tour.altitude.replace(/[^0-9]/g, '')
          : '';

        this.tourForm.patchValue({
          name: tour.name,
          date: tour.date,
          time: tour.time,
          place: tour.location,
          altitude: cleanAltitude,
          difficulty: tour.difficulty,
        });

        if (tour.gpxData) {
          this.gpxData.set(tour.gpxData);
        }
      }
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.tourForm.get(controlName);
    return !!control && control.invalid && (control.touched || this.submitted);
  }

  onGpxLoaded(event: GpxLoadedEvent): void {
    this.gpxData.set(event.content);

    const nameControl = this.tourForm.get('name');
    if (nameControl && !nameControl.value?.trim() && event.suggestedName) {
      nameControl.setValue(event.suggestedName);
      nameControl.markAsDirty();
    }

    const altitudeControl = this.tourForm.get('altitude');
    if (
      altitudeControl &&
      (!altitudeControl.value || Number(altitudeControl.value) <= 0) &&
      event.suggestedAltitude
    ) {
      altitudeControl.setValue(String(event.suggestedAltitude));
      altitudeControl.markAsDirty();
    }
  }

  onGpxCleared(): void {
    this.gpxData.set(null);
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
      gpxData: this.gpxData() ?? undefined,
    });
  }
}
