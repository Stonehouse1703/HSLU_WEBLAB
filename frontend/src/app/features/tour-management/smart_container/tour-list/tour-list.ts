import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {TourService} from '../../services/tour.service';
import { TourDetail } from "../../dumb_components/tour-list/tour-detail";

@Component({
  selector: 'app-tour-list',
  imports: [TourDetail],
  template: `

  <h2>Deine bevorstehenden Touren:</h2>

  <div class="tour-list">
    @for (tour of fetchTours(); track tour.id) {
      <app-tour-preview [tour]="tour"/>
    }
  </div>

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
  private tourService = inject(TourService);

  fetchTours() {
    return this.tourService.tours;
  }
}
