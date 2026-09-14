import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

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
          [class.input-error]="isInvalid('date')"
        >
      </div>

      <div class="field">
        <label for="time">Zeit:</label>
        <input
          id="time"
          type="time"
          formControlName="time"
          [class.input-error]="isInvalid('time')"
        >
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

    .input-error {
      border-color: #dc2626 !important;
      background: #fff5f5;
      box-shadow: 0 0 0 3px rgb(220 38 38 / 8%);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeetingPoint {
  @Input({ required: true }) formGroup!: FormGroup;
  @Input() submitted = false;

  isInvalid(controlName: string): boolean {
    const control = this.formGroup.get(controlName);

    return !!control && control.invalid && (control.touched || this.submitted);
  }
}
