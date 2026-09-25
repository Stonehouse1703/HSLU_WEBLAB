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
      color: var(--color-primary);
      font-size: 1.05rem;
      font-weight: 600;
    }

    .matrix-subtitle {
      margin: 0;
      color: var(--color-text-muted);
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
      background: var(--color-bg-surface-alt);
      border: 1px solid var(--color-border-default);
      border-radius: var(--radius-md);
      padding: 0.85rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      transition: border-color var(--transition-fast);
    }

    .matrix-cell:focus-within {
      border-color: var(--color-primary-muted);
      background: var(--color-bg-surface);
    }

    .cell-label {
      font-weight: 600;
      font-size: 0.85rem;
      color: var(--color-primary-active);
      display: flex;
      align-items: center;
      gap: 0.35rem;
      margin: 0;
    }

    .cell-icon {
      font-size: 1.1rem;
      color: var(--color-primary);
    }

    select,
    input {
      width: 100%;
      box-sizing: border-box;
      padding: 0.55rem 0.75rem;
      border: 1px solid var(--color-border-input);
      border-radius: var(--radius-md);
      background: var(--color-bg-surface);
      font: inherit;
      font-size: 0.88rem;
      outline: none;
      transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
    }

    select:focus,
    input:focus {
      border-color: var(--color-primary);
      box-shadow: var(--shadow-focus);
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
      color: var(--color-text-subtle);
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
      border-radius: var(--radius-sm);
      border: 1.5px solid transparent;
      cursor: pointer;
      font: inherit;
      transition: all var(--transition-fast);
      background: var(--color-bg-surface);
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
      border-color: var(--matrix-level-1-border);
      color: var(--matrix-level-1);
      background: var(--matrix-level-1-bg);
    }
    .level-1.selected {
      background: var(--matrix-level-1-solid);
      color: var(--color-text-inverse);
      border-color: var(--matrix-level-1-solid-border);
      box-shadow: 0 2px 6px var(--matrix-level-1-shadow);
    }

    .level-2 {
      border-color: var(--matrix-level-2-border);
      color: var(--matrix-level-2);
      background: var(--matrix-level-2-bg);
    }
    .level-2.selected {
      background: var(--matrix-level-2-solid);
      color: var(--matrix-level-2-solid-text);
      border-color: var(--matrix-level-2-solid-border);
      box-shadow: 0 2px 6px var(--matrix-level-2-shadow);
    }

    .level-3 {
      border-color: var(--matrix-level-3-border);
      color: var(--matrix-level-3);
      background: var(--matrix-level-3-bg);
    }
    .level-3.selected {
      background: var(--matrix-level-3-solid);
      color: var(--color-text-inverse);
      border-color: var(--matrix-level-3-solid-border);
      box-shadow: 0 2px 6px var(--matrix-level-3-shadow);
    }

    .level-4 {
      border-color: var(--matrix-level-4-border);
      color: var(--matrix-level-4);
      background: var(--matrix-level-4-bg);
    }
    .level-4.selected {
      background: var(--matrix-level-4-solid);
      color: var(--color-text-inverse);
      border-color: var(--matrix-level-4-solid-border);
      box-shadow: 0 2px 6px var(--matrix-level-4-shadow);
    }

    .level-5 {
      border-color: var(--matrix-level-5-border);
      color: var(--matrix-level-4);
      background: var(--matrix-level-5-bg);
    }
    .level-5.selected {
      background: var(--matrix-level-5-solid);
      color: var(--color-text-inverse);
      border-color: var(--matrix-level-5-solid-border);
      box-shadow: 0 2px 6px var(--matrix-level-5-shadow);
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
      border-radius: var(--radius-sm);
      border: 1px solid var(--color-border-input);
      background: var(--color-bg-surface);
      color: var(--color-text-main);
      font: inherit;
      font-size: 0.8rem;
      text-align: left;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .chip-toggle:hover {
      border-color: var(--color-primary);
      background: var(--color-bg-surface-hover);
    }

    .chip-toggle.active {
      border-color: var(--color-primary);
      background: var(--color-primary-light);
      color: var(--color-primary-hover);
      font-weight: 500;
    }

    .chip-toggle.active:hover {
      border-color: var(--color-primary);
      background: var(--color-primary-muted);
    }

    .chip-toggle.active .chip-icon,
    .chip-toggle.active .chip-check {
      color: var(--color-primary);
    }

    .chip-check {
      font-size: 1rem;
      color: var(--color-text-subtle);
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
