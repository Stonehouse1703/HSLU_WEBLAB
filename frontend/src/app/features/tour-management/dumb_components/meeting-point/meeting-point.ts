import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Card } from '../../../../components/card/card';
import { Tour } from '../../tour.types';
import { InfoItem } from '../../../../components/info-item/info-item';

@Component({
  selector: 'app-meeting-point',
  imports: [
    Card,
    InfoItem
  ],
  template: `
    <app-card title="Treffpunkt">
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
          title="Treffpunkt"
          [description]="tour().location"
        />
      </dl>
    </app-card>
  `,
  styles: `  

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
