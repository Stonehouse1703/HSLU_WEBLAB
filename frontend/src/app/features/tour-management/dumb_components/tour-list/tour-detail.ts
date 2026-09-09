import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Tour } from '../../tour.types';
import { Card } from '../../../../components/card/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tour-preview',
  imports: [
    Card, 
    MatIconModule,
    RouterLink  
  ],
  template: `
    <a [routerLink]="['/tour-management', tour().id]">
      <app-card title="{{ tour().name }}">
        <dl class="tour-preview">
          <div class="tour-info">
            <dt>
              <mat-icon aria-hidden="true">date_range</mat-icon>
              Datum
            </dt>
            <dd>{{ tour().date }}</dd>
          </div>

          <div class="tour-info">
            <dt>
              <mat-icon aria-hidden="true">access_time</mat-icon>
              Zeit
            </dt>
            <dd>{{ tour().time }}</dd>
          </div>

          <div class="tour-info">
            <dt>
              <mat-icon aria-hidden="true">location_on</mat-icon>
              Ort
            </dt>
            <dd>{{ tour().location }}</dd>
          </div>

          <div class="tour-info">
            <dt>
              <mat-icon aria-hidden="true">flag</mat-icon>
              Schwierigkeit
            </dt>
            <dd>{{ tour().difficulty }}</dd>
          </div>

          <div class="tour-info">
            <dt>
              <mat-icon aria-hidden="true">terrain</mat-icon>
              Höhe
            </dt>
            <dd>{{ tour().altitude }}</dd>
          </div>
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

    .tour-info {
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
    }

    mat-icon {
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
      color: #4f46a5;
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
  