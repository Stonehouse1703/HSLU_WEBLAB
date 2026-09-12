import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {TourService} from '../../services/tour.api';
import { TourDetail } from "../../dumb_components/tour-list/tour-detail";

@Component({
  selector: 'app-tour-list',
  imports: [TourDetail],
  template: `

  <h2>Deine bevorstehenden Touren:</h2>

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
