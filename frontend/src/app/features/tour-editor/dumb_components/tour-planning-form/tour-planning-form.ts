import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputFieldError } from '../../../../components/input-field-error/input-field-error';

@Component({
  selector: 'app-tour-planning-form',
  imports: [ReactiveFormsModule, InputFieldError],
  template: `
    <div class="planning-form" [formGroup]="formGroup()">
      <h4>Tourenplanung & Anforderungen</h4>

      <div class="field-grid">
        <div class="field">
          <label for="distance">Strecke (km):</label>
          <input
            id="distance"
            type="number"
            step="0.1"
            min="0"
            formControlName="distance"
            placeholder="z.B. 14.5"
            [class.has-error]="isInvalid('distance')"
          >
          <app-input-field-error
            [formField]="formGroup().get('distance')"
            [submitted]="submitted()"
          />
        </div>

        <div class="field">
          <label for="altitude">Höhenmeter (hm):</label>
          <input
            id="altitude"
            type="number"
            min="1"
            formControlName="altitude"
            placeholder="z.B. 1200"
            [class.has-error]="isInvalid('altitude')"
          >
          <app-input-field-error
            [formField]="formGroup().get('altitude')"
            [submitted]="submitted()"
          />
        </div>

        <div class="field">
          <label for="difficulty">Schwierigkeit:</label>
          <select
            id="difficulty"
            formControlName="difficulty"
            [class.has-error]="isInvalid('difficulty')"
          >
            <option value="" disabled>Bitte auswählen...</option>
            <option value="leicht">Leicht</option>
            <option value="mittel">Mittel</option>
            <option value="schwer">Schwer</option>
          </select>
          <app-input-field-error
            [formField]="formGroup().get('difficulty')"
            [submitted]="submitted()"
          />
        </div>

        <div class="field">
          <label for="travelRoute">Reiseroute (Anreise):</label>
          <select
            id="travelRoute"
            formControlName="travelRoute"
            [class.has-error]="isInvalid('travelRoute')"
          >
            <option value="" disabled>Bitte auswählen...</option>
            <option value="ÖV">ÖV (Öffentlicher Verkehr)</option>
            <option value="PW">PW (Personenwagen / Fahrgemeinschaft)</option>
            <option value="PW / ÖV">PW / ÖV (Beides möglich)</option>
          </select>
          <app-input-field-error
            [formField]="formGroup().get('travelRoute')"
            [submitted]="submitted()"
          />
        </div>

        <div class="field">
          <label for="cost">Kosten (CHF):</label>
          <input
            id="cost"
            type="number"
            min="0"
            step="1"
            formControlName="cost"
            placeholder="z.B. 25 (0 für gratis)"
            [class.has-error]="isInvalid('cost')"
          >
          <app-input-field-error
            [formField]="formGroup().get('cost')"
            [submitted]="submitted()"
          />
        </div>

        <div class="field field--full">
          <label for="requirements">Konditionelle Anforderungen:</label>
          <select
            id="requirements"
            formControlName="requirements"
            [class.has-error]="isInvalid('requirements')"
          >
            <option value="" disabled>Bitte auswählen...</option>
            <option value="A">A – wenig anstrengend (3 - 5 h Totalzeit; bis ca. 800 HM Aufstieg)</option>
            <option value="B">B – ziemlich anstrengend (4 - 7 h Totalzeit; ca. 800 - 1300 HM Aufstieg)</option>
            <option value="C">C – anstrengend (6 - 10 h Totalzeit; ca. 1300 - 1600 HM Aufstieg)</option>
            <option value="D">D – sehr anstrengend (länger als 10 h Totalzeit; Aufstieg mehr als 1600 HM)</option>
          </select>
          <app-input-field-error
            [formField]="formGroup().get('requirements')"
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
      color: var(--color-primary);
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

    .field label {
      color: var(--color-text-main);
      font-size: 0.875rem;
      font-weight: 500;
    }

    .field input,
    .field select {
      width: 100%;
      box-sizing: border-box;
      padding: 0.65rem 0.85rem;
      border: 1px solid var(--color-border-input);
      border-radius: var(--radius-md);
      background: var(--color-bg-surface);
      font: inherit;
      font-size: 0.9rem;
      outline: none;
      transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
    }

    .field input:focus,
    .field select:focus {
      border-color: var(--color-primary);
      box-shadow: var(--shadow-focus);
    }

    .has-error {
      border-color: var(--color-danger) !important;
      background: var(--color-danger-bg-subtle);
    }

    @media (max-width: 560px) {
      .field-grid {
        grid-template-columns: 1fr;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TourPlanningForm {
  readonly formGroup = input.required<FormGroup>();
  readonly submitted = input(false);

  isInvalid(controlName: string): boolean {
    const control = this.formGroup().get(controlName);
    return !!control && control.invalid && (control.touched || this.submitted());
  }
}
