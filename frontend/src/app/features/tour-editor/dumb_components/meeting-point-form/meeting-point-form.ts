import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputFieldError } from '../../../../components/input-field-error/input-field-error';

@Component({
  selector: 'app-meeting-point-form',
  imports: [ReactiveFormsModule, InputFieldError],
  template: `
    <div class="meeting-form" [formGroup]="formGroup()">
      <h4>Treffpunkt & Zeit</h4>

      <div class="field-grid">
        <div class="field">
          <label for="date">Datum:</label>
          <input
            id="date"
            type="date"
            formControlName="date"
            [min]="minDate()"
            [class.has-error]="isInvalid('date')"
          >
          <app-input-field-error
            [formField]="formGroup().get('date')"
            [submitted]="submitted()"
          />
        </div>

        <div class="field">
          <label for="time">Zeit:</label>
          <input
            id="time"
            type="time"
            formControlName="time"
            [class.has-error]="isInvalid('time')"
          >
          <app-input-field-error
            [formField]="formGroup().get('time')"
            [submitted]="submitted()"
          />
        </div>

        <div class="field field--full">
          <label for="place">Treffpunkt / Ort:</label>
          <input
            id="place"
            type="text"
            formControlName="place"
            placeholder="z.B. Bahnhof Göschenen oder Talstation"
            [class.has-error]="isInvalid('place')"
          >
          <app-input-field-error
            [formField]="formGroup().get('place')"
            [submitted]="submitted()"
          />
        </div>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    h4 {
      margin-top: 0;
      margin-bottom: 1rem;
      color: #4f46a5;
      font-size: 1.05rem;
    }

    .field-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1rem;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .field--full {
      grid-column: 1 / -1;
    }

    .has-error {
      border-color: #b3261e !important;
      background: #fff8f8;
    }

    @media (max-width: 560px) {
      .field-grid {
        grid-template-columns: 1fr;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeetingPointForm {
  readonly formGroup = input.required<FormGroup>();
  readonly submitted = input(false);
  readonly minDate = input<string | undefined>(undefined);

  isInvalid(controlName: string): boolean {
    const control = this.formGroup().get(controlName);
    return !!control && control.invalid && (control.touched || this.submitted());
  }
}
