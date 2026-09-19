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
        <label for="distance">Strecke (km):</label>
        <input
          id="distance"
          type="number"
          step="0.1"
          min="0"
          formControlName="distance"
          placeholder="z.B. 14.5"
          [class.input-error]="isInvalid('distance')"
        >
        @if (isInvalid('distance')) {
          <span class="field-error">
            @if (formGroup.get('distance')?.hasError('required')) {
              Bitte eine Distanz in km angeben.
            } @else if (formGroup.get('distance')?.hasError('min')) {
              Die Distanz muss mindestens 0 km betragen.
            }
          </span>
        }
      </div>

      <div class="field">
        <label for="altitude">Höhenmeter (hm):</label>
        <input
          id="altitude"
          type="number"
          formControlName="altitude"
          placeholder="1200"
          [class.input-error]="isInvalid('altitude')"
        >
        @if (isInvalid('altitude')) {
          <span class="field-error">
            @if (formGroup.get('altitude')?.hasError('required')) {
              Bitte Höhenmeter angeben.
            } @else if (formGroup.get('altitude')?.hasError('min')) {
              Die Höhenmeter müssen mindestens 1 hm betragen.
            }
          </span>
        }
      </div>

      <div class="field">
        <label for="difficulty">Schwierigkeit:</label>
        <select
          id="difficulty"
          formControlName="difficulty"
          [class.input-error]="isInvalid('difficulty')"
        >
          <option value="" disabled selected>Bitte auswählen...</option>
          <option value="leicht">Leicht</option>
          <option value="mittel">Mittel</option>
          <option value="schwer">Schwer</option>
        </select>
        @if (isInvalid('difficulty')) {
          <span class="field-error">Bitte eine Schwierigkeit auswählen.</span>
        }
      </div>

      <div class="field">
        <label for="travelRoute">Reiseroute (Anreise):</label>
        <select
          id="travelRoute"
          formControlName="travelRoute"
          [class.input-error]="isInvalid('travelRoute')"
        >
          <option value="" disabled selected>Bitte auswählen...</option>
          <option value="ÖV">ÖV (Öffentlicher Verkehr)</option>
          <option value="PW">PW (Personenwagen / Fahrgemeinschaft)</option>
          <option value="PW / ÖV">PW / ÖV (Beides möglich)</option>
        </select>
        @if (isInvalid('travelRoute')) {
          <span class="field-error">Bitte eine Reiseroute auswählen.</span>
        }
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
          [class.input-error]="isInvalid('cost')"
        >
        @if (isInvalid('cost')) {
          <span class="field-error">
            @if (formGroup.get('cost')?.hasError('required')) {
              Bitte Kosten angeben (0 für gratis).
            } @else if (formGroup.get('cost')?.hasError('min')) {
              Die Kosten dürfen nicht negativ sein.
            }
          </span>
        }
      </div>

      <div class="field field-full">
        <label for="requirements">Konditionelle Anforderungen:</label>
        <select
          id="requirements"
          formControlName="requirements"
          [class.input-error]="isInvalid('requirements')"
        >
          <option value="" disabled selected>Bitte auswählen...</option>
          <option value="A">A – wenig anstrengend (3 - 5 h Totalzeit; bis ca. 800 HM Aufstieg)</option>
          <option value="B">B – ziemlich anstrengend (4 - 7 h Totalzeit; ca. 800 - 1300 HM Aufstieg)</option>
          <option value="C">C – anstrengend (6 - 10 h Totalzeit; ca. 1300 - 1600 HM Aufstieg)</option>
          <option value="D">D – sehr anstrengend (länger als 10 h Totalzeit; Aufstieg mehr als 1600 HM)</option>
        </select>
        @if (isInvalid('requirements')) {
          <span class="field-error">Bitte konditionelle Anforderungen auswählen.</span>
        }
      </div>
    </div>
  `,
  styles: `
    .tourPlaning {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 15px;
      width: 100%;
    }

    .tourPlaning h3 {
      grid-column: 1 / -1;
      width: 100%;
      margin: 0 0 5px 0;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .field-full {
      grid-column: 1 / -1;
    }

    .field label {
      font-weight: 500;
      color: #253c38;
      font-size: 0.9rem;
    }

    .field input,
    .field select {
      width: 100%;
      box-sizing: border-box;
      padding: 0.75rem 0.875rem;
      border: 1px solid #d0d5dd;
      border-radius: 10px;
      background: #fff;
      font: inherit;
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

    .field-error {
      color: #dc2626;
      font-size: 0.8rem;
      font-weight: 500;
    }

    @media (max-width: 600px) {
      .tourPlaning {
        grid-template-columns: 1fr;
      }
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
