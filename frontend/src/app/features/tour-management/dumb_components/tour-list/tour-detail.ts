import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Tour } from '../../tour.types';
import { Card } from '../../../../components/card/card';
import { InfoItem } from '../../../../components/info-item/info-item';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tour-preview',
  imports: [
    Card,
    InfoItem,
    RouterLink
  ],
  template: `
    <a [routerLink]="['/tour-management', tour().id]">
      <app-card title="{{ tour().name }}">
        <dl class="tour-preview">
            <app-info-item icon="date_range" title="Datum" [describtion]="tour().date" />
            <app-info-item icon="access_time" title="Zeit" [describtion]="tour().time" />
            <app-info-item icon="location_on" title="Ort" [describtion]="tour().location" />
            <app-info-item icon="flag" title="Schwierigkeit" [describtion]="tour().difficulty" />
            <app-info-item icon="terrain" title="Höhe" [describtion]="tour().altitude" />
        </dl>
      </app-card>
    </a>
  `,
  styles: `
    a {
      display: block;
      color: inherit;
      text-decoration: none;
    }

    :host {
      max-height: 100%;
      overflow: auto;
    }

    app-card {
      height: 100%;
      overflow: auto;
    }

    .tour-preview {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1rem;
      margin: 0;
    }

    @media (max-width: 700px) {
      .tour-preview {
        grid-template-columns: 1fr 1fr;
      }
    }

    @media (max-width: 420px) {
      .tour-preview {
        grid-template-columns: 1fr;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class TourDetail {
  readonly tour = input.required<Tour>();
}
  