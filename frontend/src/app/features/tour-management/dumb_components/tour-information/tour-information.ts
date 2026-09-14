import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Card } from '../../../../components/card/card';
import { InfoItem } from '../../../../components/info-item/info-item';
import { Tour } from '../../tour.types';

@Component({
  selector: 'app-tour-information',
  imports: [Card, InfoItem],
  template: `
    <app-card title="Tourinformationen">
      <dl class="tour-info">
        <app-info-item 
          icon="flag" 
          title="Schwierigkeit" 
          [description]="tour().difficulty" 
        />
        <app-info-item 
          icon="terrain" 
          title="Höhenmeter" 
          [description]="tour().altitude" 
        />

      </dl>
    </app-card>
  `,
  styles: `
    .tour-info {
      display: grid;
      gap: 1rem;
      margin: 0;
    }

  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TourInformation {
  readonly tour = input.required<Tour>();
}
