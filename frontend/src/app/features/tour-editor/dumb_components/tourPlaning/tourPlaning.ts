import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-tour-planing',
  imports: [
    ReactiveFormsModule
  ],
  template: `
    <div class="tourPlaning" [formGroup]="formGroup">
      <h3>Tourenplanung</h3>

      <div class="field">
        <label for="altitude">Höhenmeter (hm):</label>
        <input
          id="altitude"
          type="number"
          formControlName="altitude"
          placeholder="1200"
          [class.input-error]="isInvalid('altitude')"
        >
      </div>

      <div class="field">
        <label for="difficulty">Schwierigkeit:</label>
        <select
          id="difficulty"
          formControlName="difficulty"
          [class.input-error]="isInvalid('difficulty')"
        >
          <option value="leicht">Leicht</option>
          <option value="mittel">Mittel</option>
          <option value="schwer">Schwer</option>
        </select>
      </div>
    </div>
  `,
  styles: `
    .tourPlaning {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      width: 100%;
      gap: 15px;
    }

    .tourPlaning h3 {
      width: 100%;
      margin: 0 0 5px 0;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 5px;
      flex: 1;
    }

    .field input,
    .field select {
      width: 100%;
      box-sizing: border-box;
      padding: 0.75rem 0.875rem;
      border: 1px solid #d0d5dd;
      border-radius: 10px;
      background: #fff;
      transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
    }

    .field input:focus,
    .field select:focus {
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
export class TourPlaning {
  @Input({ required: true }) formGroup!: FormGroup;
  @Input() submitted = false;

  isInvalid(controlName: string): boolean {
    const control = this.formGroup.get(controlName);

    return !!control && control.invalid && (control.touched || this.submitted);
  }
}
