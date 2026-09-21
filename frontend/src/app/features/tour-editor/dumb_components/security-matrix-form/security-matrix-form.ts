import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  MATRIX_PARTICIPANTS_OPTIONS,
  MATRIX_CLOUD_COVER_OPTIONS,
  MATRIX_PRECIPITATION_OPTIONS,
  MATRIX_VISIBILITY_OPTIONS,
  MATRIX_WIND_OPTIONS,
  MATRIX_DANGER_LEVELS,
  MATRIX_DANGER_SOURCES,
  MATRIX_DANGER_LOCATIONS,
  MATRIX_OTHER_HAZARDS,
} from '../../../tour-management/tour.types';

type MultiChoiceField = 'dangerSources' | 'dangerLocations' | 'otherHazards';

@Component({
  selector: 'app-security-matrix-form',
  imports: [ReactiveFormsModule],
  template: `
    <div class="matrix-form-container" [formGroup]="matrixGroup()">
      <div class="matrix-header">
        <h4>3x3 Sicherheitsmatrix & Risikobeurteilung</h4>
        <p class="matrix-subtitle">
          Beurteilung der Verhältnisse, des Geländes und der Gruppe für eine sichere Tourenleitung.
        </p>
      </div>

      <div class="matrix-3x3-grid">
        <!-- Teilnehmer / Gruppe -->
        <div class="matrix-cell">
          <label class="cell-label" for="matrix-participants">
            <span class="material-icons cell-icon" aria-hidden="true">groups</span>
            Teilnehmer / Gruppe
          </label>
          <select id="matrix-participants" formControlName="participants">
            <option value="">Bitte auswählen...</option>
            @for (opt of participantOptions; track opt.value) {
              <option [value]="opt.value">{{ opt.label }}</option>
            }
          </select>
        </div>

        <!-- Bewölkung -->
        <div class="matrix-cell">
          <label class="cell-label" for="matrix-cloud-cover">
            <span class="material-icons cell-icon" aria-hidden="true">wb_cloudy</span>
            Bewölkung
          </label>
          <select id="matrix-cloud-cover" formControlName="cloudCover">
            <option value="">Bitte auswählen...</option>
            @for (opt of cloudCoverOptions; track opt.value) {
              <option [value]="opt.value">{{ opt.label }}</option>
            }
          </select>
        </div>

        <!-- Niederschlag -->
        <div class="matrix-cell">
          <label class="cell-label" for="matrix-precipitation">
            <span class="material-icons cell-icon" aria-hidden="true">grain</span>
            Niederschlag
          </label>
          <select id="matrix-precipitation" formControlName="precipitation">
            <option value="">Bitte auswählen...</option>
            @for (opt of precipitationOptions; track opt.value) {
              <option [value]="opt.value">{{ opt.label }}</option>
            }
          </select>
        </div>

        <!-- Sicht -->
        <div class="matrix-cell">
          <label class="cell-label" for="matrix-visibility">
            <span class="material-icons cell-icon" aria-hidden="true">visibility</span>
            Sicht
          </label>
          <select id="matrix-visibility" formControlName="visibility">
            <option value="">Bitte auswählen...</option>
            @for (opt of visibilityOptions; track opt.value) {
              <option [value]="opt.value">{{ opt.label }}</option>
            }
          </select>
        </div>

        <!-- Wind -->
        <div class="matrix-cell">
          <label class="cell-label" for="matrix-wind">
            <span class="material-icons cell-icon" aria-hidden="true">air</span>
            Wind
          </label>
          <select id="matrix-wind" formControlName="wind">
            <option value="">Bitte auswählen...</option>
            @for (opt of windOptions; track opt.value) {
              <option [value]="opt.value">{{ opt.label }}</option>
            }
          </select>
        </div>

        <!-- Temperatur auf 2000m -->
        <div class="matrix-cell">
          <label class="cell-label" for="matrix-temp">
            <span class="material-icons cell-icon" aria-hidden="true">device_thermostat</span>
            Temperatur auf 2000m
          </label>
          <div class="input-with-unit">
            <input
              id="matrix-temp"
              type="number"
              step="0.5"
              formControlName="temperature2000m"
              placeholder="z.B. -4"
            >
            <span class="unit-addon">°C</span>
          </div>
        </div>

        <!-- Lawinengefahr (Stufe 1–5) -->
        <div class="matrix-cell">
          <span class="cell-label">
            <span class="material-icons cell-icon" aria-hidden="true">warning</span>
            Lawinengefahr (Stufe 1–5)
          </span>
          <div class="danger-levels-bar" role="group" aria-label="Lawinengefahrenstufen">
            @for (item of dangerLevels; track item.level) {
              <button
                type="button"
                class="danger-btn {{ item.className }}"
                [class.selected]="matrixGroup().get('avalancheDanger')?.value === item.level"
                (click)="setAvalancheDanger(item.level)"
                [title]="item.level + ' – ' + item.name"
              >
                <span class="danger-num">{{ item.level }}</span>
                <span class="danger-txt">{{ item.name }}</span>
              </button>
            }
          </div>
        </div>

        <!-- Gefahrenquellen -->
        <div class="matrix-cell">
          <span class="cell-label">
            <span class="material-icons cell-icon" aria-hidden="true">report_problem</span>
            Gefahrenquellen
          </span>
          <div class="chip-list">
            @for (source of dangerSourceOptions; track source) {
              <button
                type="button"
                class="chip-toggle"
                [class.active]="isOptionSelected('dangerSources', source)"
                (click)="toggleOption('dangerSources', source)"
              >
                <span class="material-icons chip-check" aria-hidden="true">
                  {{ isOptionSelected('dangerSources', source) ? 'check_box' : 'check_box_outline_blank' }}
                </span>
                <span class="chip-label">{{ source }}</span>
              </button>
            }
          </div>
        </div>

        <!-- Gefahrenstellen -->
        <div class="matrix-cell">
          <span class="cell-label">
            <span class="material-icons cell-icon" aria-hidden="true">explore</span>
            Gefahrenstellen
          </span>
          <div class="chip-list">
            @for (loc of dangerLocationOptions; track loc) {
              <button
                type="button"
                class="chip-toggle"
                [class.active]="isOptionSelected('dangerLocations', loc)"
                (click)="toggleOption('dangerLocations', loc)"
              >
                <span class="material-icons chip-check" aria-hidden="true">
                  {{ isOptionSelected('dangerLocations', loc) ? 'check_box' : 'check_box_outline_blank' }}
                </span>
                <span class="chip-label">{{ loc }}</span>
              </button>
            }
          </div>
        </div>
      </div>

      <!-- Zusätzliche alpine Gefahren -->
      <div class="matrix-cell">
        <span class="cell-label">
          <span class="material-icons cell-icon" aria-hidden="true">landscape</span>
          Andere alpine Gefahren
        </span>
        <div class="chip-list chip-list--horizontal">
          @for (hazard of otherHazardOptions; track hazard) {
            <button
              type="button"
              class="chip-toggle"
              [class.active]="isOptionSelected('otherHazards', hazard)"
              (click)="toggleOption('otherHazards', hazard)"
            >
              <span class="material-icons chip-check" aria-hidden="true">
                {{ isOptionSelected('otherHazards', hazard) ? 'check_box' : 'check_box_outline_blank' }}
              </span>
              <span class="chip-label">{{ hazard }}</span>
            </button>
          }
        </div>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .matrix-form-container {
      display: flex;
      flex-direction: column;
      gap: 1.15rem;
    }

    .matrix-header {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    h4 {
      margin: 0;
      color: #4f46a5;
      font-size: 1.05rem;
      font-weight: 600;
    }

    .matrix-subtitle {
      margin: 0;
      color: #636173;
      font-size: 0.85rem;
      line-height: 1.4;
    }

    /* 3x3 Grid */
    .matrix-3x3-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1rem;
    }

    .matrix-cell {
      background: #fafafc;
      border: 1px solid #e2e1ea;
      border-radius: 10px;
      padding: 0.85rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      transition: border-color 0.15s ease;
    }

    .matrix-cell:focus-within {
      border-color: #837bbb;
      background: #fff;
    }

    .cell-label {
      font-weight: 600;
      font-size: 0.85rem;
      color: #2b2847;
      display: flex;
      align-items: center;
      gap: 0.35rem;
      margin: 0;
    }

    .cell-icon {
      font-size: 1.1rem;
      color: #4f46a5;
    }

    select,
    input {
      width: 100%;
      box-sizing: border-box;
      padding: 0.55rem 0.75rem;
      border: 1px solid #c8c6d0;
      border-radius: 8px;
      background: #fff;
      font: inherit;
      font-size: 0.88rem;
      outline: none;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }

    select:focus,
    input:focus {
      border-color: #4f46a5;
      box-shadow: 0 0 0 3px rgba(79, 70, 165, 0.12);
    }

    .input-with-unit {
      display: flex;
      align-items: center;
      position: relative;
    }

    .input-with-unit input {
      padding-right: 2.2rem;
    }

    .unit-addon {
      position: absolute;
      right: 0.75rem;
      color: #727080;
      font-size: 0.85rem;
      font-weight: 500;
      pointer-events: none;
    }

    /* Lawinengefahr 1-5 */
    .danger-levels-bar {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 0.35rem;
    }

    .danger-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 0.45rem 0.2rem;
      border-radius: 6px;
      border: 1.5px solid transparent;
      cursor: pointer;
      font: inherit;
      transition: all 0.15s ease;
      background: #fff;
    }

    .danger-num {
      font-weight: 700;
      font-size: 0.95rem;
      line-height: 1;
    }

    .danger-txt {
      font-size: 0.65rem;
      margin-top: 0.2rem;
      line-height: 1;
    }

    /* SLF Standard Colors */
    .level-1 {
      border-color: #a5d6a7;
      color: #2e7d32;
      background: #f1f8e9;
    }
    .level-1.selected {
      background: #2e7d32;
      color: #fff;
      border-color: #1b5e20;
      box-shadow: 0 2px 6px rgba(46, 125, 50, 0.35);
    }

    .level-2 {
      border-color: #fff59d;
      color: #9e7a00;
      background: #fffde7;
    }
    .level-2.selected {
      background: #fbc02d;
      color: #212121;
      border-color: #f57f17;
      box-shadow: 0 2px 6px rgba(251, 192, 45, 0.35);
    }

    .level-3 {
      border-color: #ffcc80;
      color: #e65100;
      background: #fff3e0;
    }
    .level-3.selected {
      background: #f57c00;
      color: #fff;
      border-color: #bf360c;
      box-shadow: 0 2px 6px rgba(245, 124, 0, 0.35);
    }

    .level-4 {
      border-color: #ef9a9a;
      color: #c62828;
      background: #ffebee;
    }
    .level-4.selected {
      background: #d32f2f;
      color: #fff;
      border-color: #b71c1c;
      box-shadow: 0 2px 6px rgba(211, 47, 47, 0.35);
    }

    .level-5 {
      border-color: #ef9a9a;
      color: #c62828;
      background: #fdc4cd;
    }
    .level-5.selected {
      background: #ff0e0e;
      color: #fff;
      border-color: #ff0808;
      box-shadow: 0 2px 6px rgba(38, 50, 56, 0.4);
    }

    /* Multichoice Chips */
    .chip-list {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .chip-list .chip-toggle {
      width: 100%;
      box-sizing: border-box;
    }

    .chip-list--horizontal {
      flex-direction: row;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .chip-list--horizontal .chip-toggle {
      width: auto;
    }

    .chip-toggle {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.4rem 0.65rem;
      border-radius: 6px;
      border: 1px solid #c8c6d0;
      background: #fff;
      color: #3b3947;
      font: inherit;
      font-size: 0.8rem;
      text-align: left;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .chip-toggle:hover {
      border-color: #4f46a5;
      background: #e6e5e7;
    }

    .chip-toggle.active {
      border-color: #3d2aee;
      background: #eeedfc;
      color: #1a1548;
      font-weight: 500;
    }

    .chip-toggle.active:hover {
      border-color: #3d2aee;
      background: #e2e0fb;
    }

    .chip-toggle.active .chip-icon,
    .chip-toggle.active .chip-check {
      color: #3d2aee;
    }

    .chip-check {
      font-size: 1rem;
      color: #727080;
    }

    .chip-label {
      line-height: 1.25;
    }

    @media (max-width: 900px) {
      .matrix-3x3-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 600px) {
      .matrix-3x3-grid {
        grid-template-columns: 1fr;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecurityMatrixForm {
  readonly formGroup = input.required<FormGroup>();
  readonly submitted = input(false);

  readonly matrixGroup = computed(() => {
    const parent = this.formGroup();
    return (parent.get('securityMatrix') as FormGroup) ?? parent;
  });

  readonly participantOptions = MATRIX_PARTICIPANTS_OPTIONS;
  readonly cloudCoverOptions = MATRIX_CLOUD_COVER_OPTIONS;
  readonly precipitationOptions = MATRIX_PRECIPITATION_OPTIONS;
  readonly visibilityOptions = MATRIX_VISIBILITY_OPTIONS;
  readonly windOptions = MATRIX_WIND_OPTIONS;
  readonly dangerLevels = MATRIX_DANGER_LEVELS;
  readonly dangerSourceOptions = MATRIX_DANGER_SOURCES;
  readonly dangerLocationOptions = MATRIX_DANGER_LOCATIONS;
  readonly otherHazardOptions = MATRIX_OTHER_HAZARDS;

  isOptionSelected(field: MultiChoiceField, option: string): boolean {
    const current: string[] = this.matrixGroup().get(field)?.value || [];
    return current.includes(option);
  }

  toggleOption(field: MultiChoiceField, option: string): void {
    const control = this.matrixGroup().get(field);
    const current: string[] = control?.value || [];
    const next = current.includes(option)
      ? current.filter(item => item !== option)
      : [...current, option];
    control?.setValue(next);
    control?.markAsDirty();
  }

  setAvalancheDanger(level: number): void {
    const control = this.matrixGroup().get('avalancheDanger');
    const current = control?.value;
    control?.setValue(current === level ? null : level);
    control?.markAsDirty();
  }
}
