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
      background: #f8f7fb;
      border: 1px solid #e5e4ee;
      border-radius: 8px;
    }

    .item-label {
      font-size: 0.8rem;
      font-weight: 600;
      color: #636173;
      display: flex;
      align-items: center;
      gap: 0.35rem;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .item-icon {
      font-size: 1rem;
      color: #4f46a5;
    }

    .item-value {
      font-size: 0.92rem;
      font-weight: 500;
      color: #1f1d2b;
      text-transform: capitalize;
    }

    /* Danger Level Badge */
    .danger-badge {
      display: inline-flex;
      align-items: center;
      padding: 0.25rem 0.6rem;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 600;
      width: fit-content;
    }

    .level-1 {
      background: #e8f5e9;
      color: #2e7d32;
      border: 1px solid #a5d6a7;
    }
    .level-2 {
      background: #fffde7;
      color: #9e7a00;
      border: 1px solid #fff59d;
    }
    .level-3 {
      background: #fff3e0;
      color: #e65100;
      border: 1px solid #ffcc80;
    }
    .level-4 {
      background: #ffebee;
      color: #c62828;
      border: 1px solid #ef9a9a;
    }
    .level-5 {
      background: #ff0e0e;
      color: #fff;
      border: 1px solid #ff0808;
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
      background: #ebe9f5;
      color: #38326a;
      border: 1px solid #d4d0e6;
      border-radius: 6px;
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
