import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Card } from '../../../../components/card/card';
import { SecurityMatrix, getDangerLevelName } from '../../tour.types';

interface StandardMatrixField {
  label: string;
  icon: string;
  value: () => string;
}

@Component({
  selector: 'app-security-matrix-display',
  imports: [Card],
  template: `
    @if (hasAnyData()) {
      <app-card title="3x3 Sicherheitsmatrix & Risikobeurteilung">
        <div class="matrix-display-container">
          <div class="matrix-grid">
            @for (field of standardFields(); track field.label) {
              <div class="grid-item">
                <span class="item-label">
                  <span class="material-icons item-icon" aria-hidden="true">{{ field.icon }}</span>
                  {{ field.label }}
                </span>
                <span class="item-value">{{ field.value() }}</span>
              </div>
            }

            <!-- 7. Lawinengefahr -->
            <div class="grid-item">
              <span class="item-label">
                <span class="material-icons item-icon" aria-hidden="true">warning</span>
                Lawinengefahr
              </span>
              @if (matrix()?.avalancheDanger) {
                <span class="danger-badge level-{{ matrix()?.avalancheDanger }}">
                  Stufe {{ matrix()?.avalancheDanger }} – {{ getDangerLevelName(matrix()?.avalancheDanger) }}
                </span>
              } @else {
                <span class="item-value">–</span>
              }
            </div>

            <!-- 8. Gefahrenquellen -->
            <div class="grid-item">
              <span class="item-label">
                <span class="material-icons item-icon" aria-hidden="true">report_problem</span>
                Gefahrenquellen
              </span>
              <div class="badge-wrap">
                @if (matrix()?.dangerSources && matrix()!.dangerSources!.length > 0) {
                  @for (source of matrix()!.dangerSources!; track source) {
                    <span class="hazard-badge">{{ source }}</span>
                  }
                } @else {
                  <span class="item-value">–</span>
                }
              </div>
            </div>

            <!-- 9. Gefahrenstellen -->
            <div class="grid-item">
              <span class="item-label">
                <span class="material-icons item-icon" aria-hidden="true">explore</span>
                Gefahrenstellen
              </span>
              <div class="badge-wrap">
                @if (matrix()?.dangerLocations && matrix()!.dangerLocations!.length > 0) {
                  @for (loc of matrix()!.dangerLocations!; track loc) {
                    <span class="hazard-badge">{{ loc }}</span>
                  }
                } @else {
                  <span class="item-value">–</span>
                }
              </div>
            </div>
          </div>

          <!-- Andere alpine Gefahren -->
          @if (matrix()?.otherHazards && matrix()!.otherHazards!.length > 0) {
            <div class="grid-item">
              <span class="item-label">
                <span class="material-icons item-icon" aria-hidden="true">landscape</span>
                Andere alpine Gefahren
              </span>
              <div class="badge-wrap">
                @for (hazard of matrix()!.otherHazards!; track hazard) {
                  <span class="hazard-badge">{{ hazard }}</span>
                }
              </div>
            </div>
          }
        </div>
      </app-card>
    }
  `,
  styles: `
    :host {
      display: block;
    }

    .matrix-display-container {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .matrix-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1rem;
    }

    .grid-item {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      padding: 0.75rem 0.85rem;
      background: var(--color-bg-surface-subtle);
      border: 1px solid var(--color-border-default);
      border-radius: var(--radius-md);
    }

    .item-label {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--color-text-muted);
      display: flex;
      align-items: center;
      gap: 0.35rem;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .item-icon {
      font-size: 1rem;
      color: var(--color-primary);
    }

    .item-value {
      font-size: 0.92rem;
      font-weight: 500;
      color: var(--color-text-main);
      text-transform: capitalize;
    }

    /* Danger Level Badge */
    .danger-badge {
      display: inline-flex;
      align-items: center;
      padding: 0.25rem 0.6rem;
      border-radius: var(--radius-sm);
      font-size: 0.85rem;
      font-weight: 600;
      width: fit-content;
    }

    .level-1 {
      background: var(--matrix-level-1-bg);
      color: var(--matrix-level-1);
      border: 1px solid var(--matrix-level-1-border);
    }
    .level-2 {
      background: var(--matrix-level-2-bg);
      color: var(--matrix-level-2);
      border: 1px solid var(--matrix-level-2-border);
    }
    .level-3 {
      background: var(--matrix-level-3-bg);
      color: var(--matrix-level-3);
      border: 1px solid var(--matrix-level-3-border);
    }
    .level-4 {
      background: var(--matrix-level-4-bg);
      color: var(--matrix-level-4);
      border: 1px solid var(--matrix-level-4-border);
    }
    .level-5 {
      background: var(--matrix-level-5-solid);
      color: var(--color-text-inverse);
      border: 1px solid var(--matrix-level-5-solid-border);
    }

    .badge-wrap {
      display: flex;
      flex-wrap: wrap;
      gap: 0.35rem;
      margin-top: 0.2rem;
    }

    .hazard-badge {
      display: inline-flex;
      align-items: center;
      background: var(--color-primary-light);
      color: var(--color-primary-hover);
      border: 1px solid var(--color-primary-muted);
      border-radius: var(--radius-sm);
      padding: 0.2rem 0.5rem;
      font-size: 0.78rem;
      font-weight: 500;
    }

    @media (max-width: 860px) {
      .matrix-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 560px) {
      .matrix-grid {
        grid-template-columns: 1fr;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecurityMatrixDisplay {
  readonly matrix = input<SecurityMatrix | undefined | null>(undefined);

  readonly getDangerLevelName = getDangerLevelName;

  readonly standardFields = computed<StandardMatrixField[]>(() => {
    const m = this.matrix();
    return [
      { label: 'Teilnehmer', icon: 'groups', value: () => this.formatValue(m?.participants) },
      { label: 'Bewölkung', icon: 'wb_cloudy', value: () => this.formatValue(m?.cloudCover) },
      { label: 'Niederschlag', icon: 'grain', value: () => this.formatValue(m?.precipitation) },
      { label: 'Sicht', icon: 'visibility', value: () => this.formatValue(m?.visibility) },
      { label: 'Wind', icon: 'air', value: () => this.formatValue(m?.wind) },
      {
        label: 'Temperatur 2000m',
        icon: 'device_thermostat',
        value: () => (m?.temperature2000m !== undefined && m?.temperature2000m !== null && String(m.temperature2000m).trim() !== '')
          ? `${m.temperature2000m} °C`
          : '–',
      },
    ];
  });

  readonly hasAnyData = computed(() => {
    const m = this.matrix();
    if (!m) return false;
    return !!(
      m.participants ||
      m.cloudCover ||
      m.precipitation ||
      m.visibility ||
      m.wind ||
      (m.temperature2000m !== undefined && m.temperature2000m !== null && String(m.temperature2000m).trim() !== '') ||
      m.avalancheDanger ||
      (m.dangerSources && m.dangerSources.length > 0) ||
      (m.dangerLocations && m.dangerLocations.length > 0) ||
      (m.otherHazards && m.otherHazards.length > 0)
    );
  });

  formatValue(val?: string): string {
    if (!val || !val.trim()) return '–';
    return val.charAt(0).toUpperCase() + val.slice(1);
  }
}
