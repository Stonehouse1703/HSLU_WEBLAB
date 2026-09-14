import { backgroundColors } from './../../../../../../../backend/node_modules/ora/node_modules/chalk/source/index.d';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MeetingPoint } from '../../dumb_components/meetingPoint/meetingPoint';
import { TourPlaning } from '../../dumb_components/tourPlaning/tourPlaning';
import { Card } from '../../../../components/card/card';
import { TourService } from '../../../tour-management/services/tour.api';
import { Button } from '../../../../components/button/button';

@Component({
  selector: 'app-tour-editor',
  imports: [ReactiveFormsModule, MeetingPoint, TourPlaning, Card, Button],
  template: `
    <form [formGroup]="tourForm" novalidate>
      <app-card title="Tourenplanung">
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

        <app-button
          type="submit"
          text="Tour erstellen"
          variant="primary"
          (clicked)="saveTour()"
        />
      </app-card>
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

    app-button{
      margin: 1.5rem 0;
    }

    .input-error {
      border-color: #dc2626 !important;
      background: #fff5f5;
      box-shadow: 0 0 0 3px rgb(220 38 38 / 8%);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TourEditor {
  private readonly fb = inject(FormBuilder);
  private readonly tourService = inject(TourService);
  private readonly router = inject(Router);

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

  saveTour(): void {
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

    this.tourService.createTour({
      name,
      date,
      time,
      location: place,
      altitude: `${altitude}m`,
      difficulty,
    }).subscribe({
      next: () => {
        this.router.navigate(['/tour-management']);
      },
      error: () => {
        console.error('Tour konnte nicht gespeichert werden.');
      },
    });
  }
}
