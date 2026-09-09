import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Card } from '../../../../components/card/card';
import { Tour } from '../../tour.types';

@Component({
  selector: 'app-meeting-point',
  imports: [Card],
  template: `
    <app-card title="Treffpunkt">
      <dl class="tour-info">
        <div class="info-item">
          <dt>
            <span class="material-icons" aria-hidden="true">date_range</span>
            Datum
          </dt>
          <dd>{{ tour().date }}</dd>
        </div>

        <div class="info-item">
          <dt>
            <span class="material-icons" aria-hidden="true">access_time</span>
            Zeit
          </dt>
          <dd>{{ tour().time }}</dd>
        </div>

        <div class="info-item">
          <dt>
            <span class="material-icons" aria-hidden="true">location_on</span>
            Treffpunkt
          </dt>
          <dd>{{ tour().location }}</dd>
        </div>
      </dl>
    </app-card>
  `,
  styles: `
    .tour-info {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1rem;
      margin: 0;
    }

    .info-item {
      display: grid;
      gap: 0.35rem;
      min-width: 0;
    }

    dt {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #65636d;
      font-size: 0.875rem;
      white-space: nowrap;
    }

    dd {
      margin: 0;
      font-weight: 500;
      overflow-wrap: anywhere;
    }

    .material-icons {
      width: 1.25rem;
      height: 1.25rem;
      color: #4f46a5;
      font-size: 1.25rem;
    }

    .info-item:nth-child(2) {
      justify-items: center;
      text-align: center;
    }

    .info-item:nth-child(3) {
      justify-items: end;
      text-align: right;
    }

    @media (max-width: 560px) {
      .tour-info {
        grid-template-columns: 1fr;
      }

      .info-item:nth-child(2),
      .info-item:nth-child(3) {
        justify-items: start;
        text-align: left;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeetingPoint {
  readonly tour = input.required<Tour>();
}
