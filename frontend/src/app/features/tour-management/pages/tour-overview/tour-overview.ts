import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TourList } from '../../smart_container/tour-list/tour-list';

@Component({
  selector: 'app-tour-overview',
  imports: [TourList],
  template: `
    <main class="tour-overview-page">
      <app-tour-list />
    </main>
  `,
  styles: `
    :host {
      display: block;
    }

    .tour-overview-page {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TourOverviewPage {}

// Backward compatibility alias
export { TourOverviewPage as TourManagement };
