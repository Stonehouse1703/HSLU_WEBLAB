import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

@Component({
  selector: 'app-meeting-point',
  imports: [
    ReactiveFormsModule
  ],
  template: `
    <div class="meeting" [formGroup]="formGroup">
      <h3>Treffpunkt</h3>

      <div class="field">
        <label for="date">Datum:</label>
        <input
          id="date"
          type="date"
          formControlName="date"
          [min]="effectiveMinDate"
          [class.input-error]="isInvalid('date')"
        >
        @if (hasPastDateError()) {
          <span class="field-error">Das Datum darf nicht in der Vergangenheit liegen.</span>
        } @else if (isInvalid('date')) {
          <span class="field-error">Bitte ein Datum auswählen.</span>
        }
      </div>

      <div class="field">
        <label for="time">Zeit:</label>
        <input
          id="time"
          type="time"
          formControlName="time"
          [class.input-error]="isInvalid('time')"
        >
        @if (isInvalid('time')) {
          <span class="field-error">Bitte eine Uhrzeit auswählen.</span>
        }
      </div>

      <div class="field">
        <label for="place">Ort:</label>
        <input
          id="place"
          type="text"
          formControlName="place"
          placeholder="z.B. Bahnhof Zug"
          [class.input-error]="isInvalid('place')"
        >
        @if (isInvalid('place')) {
          <span class="field-error">
            @if (formGroup.get('place')?.hasError('required')) {
              Bitte einen Ort / Treffpunkt angeben.
            } @else if (formGroup.get('place')?.hasError('minlength')) {
              Der Ort muss mindestens 2 Zeichen lang sein.
            }
          </span>
        }
      </div>
    </div>
  `,
  styles: `
    .meeting {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      width: 100%;
      gap: 15px;
    }

    .meeting h3 {
      width: 100%;
      margin: 0 0 5px 0;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 5px;
      flex: 1;
      min-width: 180px;
    }

    .field label {
      font-weight: 500;
      color: #253c38;
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
      transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
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
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeetingPoint {
  @Input({ required: true }) formGroup!: FormGroup;
  @Input() submitted = false;
  @Input() minDate?: string;

  get effectiveMinDate(): string {
    return this.minDate ?? getTodayDateString();
  }

  isInvalid(controlName: string): boolean {
    const control = this.formGroup.get(controlName);

    return !!control && control.invalid && (control.touched || this.submitted);
  }

  hasPastDateError(): boolean {
    const control = this.formGroup.get('date');
    return !!control && control.hasError('pastDate') && (control.touched || this.submitted);
  }
}
