import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Card } from '../../../../components/card/card';
import { InfoItem } from '../../../../components/info-item/info-item';
import { Tour } from '../../tour.types';
import { MapComponent } from '../map/map';

@Component({
  selector: 'app-tour-information',
  imports: [Card, InfoItem, MapComponent],
  template: `
    <app-card title="Tourinformationen">
      <div class="tour-content" [class.has-map]="!!tour().gpxData">
        <div class="info-pane">
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
        </div>

        @if (tour().gpxData) {
          <div class="map-pane">
            <app-map [gpxData]="tour().gpxData" height="340px" />
          </div>
        }
      </div>
    </app-card>
  `,
  styles: `
    :host {
      display: block;
    }

    .tour-content {
      width: 100%;
    }

    .tour-content.has-map {
      display: grid;
      grid-template-columns: minmax(220px, 280px) 1fr;
      gap: 1.5rem;
      align-items: start;
    }

    .info-pane {
      min-width: 0;
    }

    .map-pane {
      min-width: 0;
      width: 100%;
    }

    .tour-info {
      display: grid;
      gap: 1rem;
      margin: 0;
    }

    @media (max-width: 768px) {
      .tour-content.has-map {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TourInformation {
  readonly tour = input.required<Tour>();
}
