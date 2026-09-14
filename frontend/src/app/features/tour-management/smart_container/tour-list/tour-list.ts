import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {TourService} from '../../services/tour.api';
import { TourDetail } from "../../dumb_components/tour-list/tour-detail";
import { RouterLink } from '@angular/router';
import { Button } from '../../../../components/button/button';

@Component({
  selector: 'app-tour-list',
  imports: [TourDetail, RouterLink, Button],
  template: `

  <h2>Deine bevorstehenden Touren:</h2>

  <a class="test" routerLink="/tour-editor">
    <app-button
      text="Tour erstellen"
      variant="primary"
    />
  </a>

  @if (toursResource.isLoading()) {
    <p>Touren werden geladen ...</p>
  } @else if (toursResource.error()) {
    <p>Die Touren konnten nicht geladen werden.</p>
  } @else if (toursResource.value().length === 0) {
    <p>Keine Touren vorhanden.</p>
  } @else {
    <div class="tour-list">
      @for (tour of toursResource.value(); track tour.id) {
        <app-tour-preview [tour]="tour" />
      }
    </div>
  }

  `,
  styles: `
    .tour-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class TourList {
  private readonly tourService = inject(TourService);
  readonly toursResource = this.tourService.getToursResource();
}
