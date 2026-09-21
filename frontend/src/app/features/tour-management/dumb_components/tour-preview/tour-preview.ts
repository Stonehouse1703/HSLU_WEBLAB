import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Tour, formatCost, formatShortRequirements } from '../../tour.types';
import { Card } from '../../../../components/card/card';
import { InfoItem } from '../../../../components/info-item/info-item';
import { Badge } from '../../../../components/badge/badge';
import { BadgeColor } from '../../../../components/badge/badge.type';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tour-preview',
  imports: [Card, InfoItem, Badge, RouterLink],
  template: `
    <a [routerLink]="['/tour-management', tour().id]" class="tour-card-link">
      <app-card [title]="tour().name">
        <div class="card-top-bar">
          <app-badge [color]="difficultyColor()" [text]="'Schwierigkeit: ' + tour().difficulty" />
        </div>
        <dl class="tour-preview">
          <app-info-item icon="date_range" title="Datum" [description]="tour().date" />
          <app-info-item icon="access_time" title="Zeit" [description]="tour().time" />
          <app-info-item icon="location_on" title="Treffpunkt" [description]="tour().location" />
          <app-info-item icon="terrain" title="Höhenmeter" [description]="tour().altitude" />
          @if (tour().distance) {
            <app-info-item icon="straighten" title="Strecke" [description]="tour().distance!" />
          }
          @if (formattedShortRequirements()) {
            <app-info-item icon="fitness_center" title="Anforderung" [description]="formattedShortRequirements()" />
          }
          @if (formattedCost()) {
            <app-info-item icon="payments" title="Kosten" [description]="formattedCost()" />
          }
        </dl>
      </app-card>
    </a>
  `,
  styles: `
    :host {
      display: block;
    }

    .tour-card-link {
      display: block;
      color: inherit;
      text-decoration: none;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }

    .tour-card-link:hover {
      transform: translateY(-2px);
    }

    .card-top-bar {
      display: flex;
      justify-content: flex-end;
      margin-top: -0.5rem;
      margin-bottom: 0.75rem;
    }

    .tour-preview {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TourPreview {
  readonly tour = input.required<Tour>();

  readonly difficultyColor = computed<BadgeColor>(() => {
    const diff = this.tour().difficulty?.toLowerCase() ?? '';
    if (diff.includes('leicht') || diff.includes('easy')) return 'success';
    if (diff.includes('mittel') || diff.includes('medium')) return 'secondary';
    if (diff.includes('schwer') || diff.includes('hard')) return 'danger';
    return 'light';
  });

  readonly formattedShortRequirements = computed(() => {
    const req = this.tour().requirements;
    if (!req) return '';
    return formatShortRequirements(req);
  });

  readonly formattedCost = computed(() => {
    return formatCost(this.tour().cost);
  });
}

// Backward compatibility alias
export { TourPreview as TourDetail };
