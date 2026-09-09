import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Card } from '../../../../components/card/card';
import { Tour } from '../../tour.types';

@Component({
  selector: 'app-tour-information',
  imports: [Card, MatIconModule],
  template: `
    <app-card title="Tourinformationen">
      <dl class="tour-info">
        <div class="info-item">
          <dt>
            <mat-icon aria-hidden="true">flag</mat-icon>
            Schwierigkeit
          </dt>
          <dd>{{ tour().difficulty }}</dd>
        </div>

        <div class="info-item">
          <dt>
            <mat-icon aria-hidden="true">terrain</mat-icon>
            Höhenmeter
          </dt>
          <dd>{{ tour().altitude }}</dd>
        </div>

      </dl>
    </app-card>
  `,
  styles: `
    .tour-info {
      display: grid;
      gap: 1rem;
      margin: 0;
    }

    .info-item {
      display: grid;
      gap: 0.35rem;
    }

    dt {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #65636d;
      font-size: 0.875rem;
    }

    dd {
      margin: 0;
      font-weight: 500;
      overflow-wrap: anywhere;
    }

    mat-icon {
      width: 1.25rem;
      height: 1.25rem;
      color: #4f46a5;
      font-size: 1.25rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TourInformation {
  readonly tour = input.required<Tour>();
}
