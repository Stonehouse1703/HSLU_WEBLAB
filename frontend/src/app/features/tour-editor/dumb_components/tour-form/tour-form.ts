import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Button } from '../../../../components/button/button';
import { InputFieldError } from '../../../../components/input-field-error/input-field-error';
import { Tour, getTodayDateString } from '../../../tour-management/tour.types';
import { CreateTourInput } from '../../../tour-management/services/tour.api';
import { MeetingPointForm } from '../meeting-point-form/meeting-point-form';
import { TourPlanningForm } from '../tour-planning-form/tour-planning-form';
import { GpxUpload, GpxLoadedEvent } from '../gpx-upload/gpx-upload';

export function notInPastValidator(
  originalDateGetter?: () => string | undefined,
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const todayStr = getTodayDateString();
    const original = originalDateGetter?.();
    if (control.value < todayStr && control.value !== original) {
      return { pastDate: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-tour-form',
  imports: [
    ReactiveFormsModule,
    MeetingPointForm,
    TourPlanningForm,
    GpxUpload,
    Button,
    InputFieldError,
  ],
  template: `
    <form [formGroup]="tourForm" (ngSubmit)="submitForm()" novalidate>
      <div class="field">
        <label for="name">Tourname:</label>
        <input
          id="name"
          type="text"
          formControlName="name"
          placeholder="z.B. Pazolastock Skitour"
          [class.has-error]="isInvalid('name')"
        >
        <app-input-field-error
          [formField]="tourForm.get('name')"
          [submitted]="submitted()"
        />
      </div>

      <hr class="divider">
      <app-meeting-point-form
        [formGroup]="tourForm"
        [submitted]="submitted()"
        [minDate]="effectiveMinDate()"
      />

      <hr class="divider">
      <app-tour-planning-form [formGroup]="tourForm" [submitted]="submitted()" />

      <hr class="divider">
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
          [disabled]="isSubmitting() || (submitted() && tourForm.invalid)"
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

    .divider {
      border: none;
      border-top: 1px solid #e2e1e8;
      margin: 0.5rem 0;
    }

    .actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-top: 0.5rem;
      flex-wrap: wrap;
    }

    .has-error {
      border-color: #b3261e !important;
      background: #fff8f8;
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

  readonly submitted = signal(false);
  readonly gpxData = signal<string | null>(null);

  readonly effectiveMinDate = computed(() => {
    const existingDate = this.tour()?.date;
    const todayStr = getTodayDateString();
    if (existingDate && existingDate < todayStr) {
      return existingDate;
    }
    return todayStr;
  });

  readonly tourForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    date: [
      '',
      [Validators.required, notInPastValidator(() => this.tour()?.date)],
    ],
    time: ['', Validators.required],
    place: ['', [Validators.required, Validators.minLength(2)]],
    altitude: ['', [Validators.required, Validators.min(1)]],
    distance: ['', [Validators.required, Validators.min(0)]],
    difficulty: ['', Validators.required],
    requirements: ['', Validators.required],
    travelRoute: ['', Validators.required],
    cost: ['', [Validators.required, Validators.min(0)]],
  });

  constructor() {
    effect(() => {
      const tour = this.tour();
      if (tour) {
        const cleanAltitude = tour.altitude
          ? tour.altitude.replace(/[^0-9]/g, '')
          : '';
        const cleanDistance = tour.distance
          ? tour.distance.replace(/[^0-9.]/g, '')
          : '';

        this.tourForm.patchValue({
          name: tour.name ?? '',
          date: tour.date ?? '',
          time: tour.time ?? '',
          place: tour.location ?? '',
          altitude: cleanAltitude,
          distance: cleanDistance,
          difficulty: tour.difficulty ?? '',
          requirements: tour.requirements ?? '',
          travelRoute: tour.travelRoute ?? '',
          cost:
            tour.cost !== undefined && tour.cost !== null
              ? String(tour.cost)
              : '',
        });

        if (tour.gpxData) {
          this.gpxData.set(tour.gpxData);
        }
      }
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.tourForm.get(controlName);
    return !!control && control.invalid && (control.touched || this.submitted());
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

    const distanceControl = this.tourForm.get('distance');
    if (
      distanceControl &&
      (!distanceControl.value || Number(distanceControl.value) <= 0) &&
      event.suggestedDistance
    ) {
      distanceControl.setValue(String(event.suggestedDistance));
      distanceControl.markAsDirty();
    }
  }

  onGpxCleared(): void {
    this.gpxData.set(null);
  }

  submitForm(): void {
    if (this.isSubmitting()) {
      return;
    }

    this.submitted.set(true);
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
    const distanceVal =
      value.distance !== null &&
      value.distance !== undefined &&
      value.distance !== ''
        ? `${value.distance} km`
        : '';
    const difficulty = value.difficulty ?? '';
    const requirements = value.requirements ?? '';
    const travelRoute = value.travelRoute ?? '';
    const costVal =
      value.cost !== null &&
      value.cost !== undefined &&
      String(value.cost).trim() !== ''
        ? Math.max(0, Math.round(Number(value.cost)))
        : 0;

    this.onFormSubmit.emit({
      name,
      date,
      time,
      location: place,
      altitude: `${altitude}m`,
      distance: distanceVal,
      difficulty,
      requirements,
      travelRoute,
      cost: costVal,
      gpxData: this.gpxData() ?? undefined,
    });
  }
}
