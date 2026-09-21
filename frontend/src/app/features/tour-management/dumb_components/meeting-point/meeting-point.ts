import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Card } from '../../../../components/card/card';
import { Tour } from '../../tour.types';
import { InfoItem } from '../../../../components/info-item/info-item';

@Component({
  selector: 'app-meeting-point',
  imports: [Card, InfoItem],
  template: `
    <app-card title="Treffpunkt & Zeit">
      <dl class="tour-info">
        <app-info-item
          icon="date_range"
          title="Datum"
          [description]="tour().date"
        />
        <app-info-item
          icon="access_time"
          title="Zeit"
          [description]="tour().time"
        />
        <app-info-item
          icon="location_on"
          title="Ort"
          [description]="tour().location"
        />
      </dl>
    </app-card>
  `,
  styles: `
    .tour-info {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1.25rem;
      margin: 0;
      align-items: center;
    }

    @media (max-width: 560px) {
      .tour-info {
        grid-template-columns: 1fr;
        gap: 0.75rem;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeetingPoint {
  readonly tour = input.required<Tour>();
}
