import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CreateTour } from '../../smart_container/create-tour/create-tour';

@Component({
  selector: 'app-tour-editor',
  imports: [CreateTour],
  template: `
    <main class="tour-editor-page">
      <app-create-tour />
    </main>
  `,
  styles: `
    :host {
      display: block;
    }

    .tour-editor-page {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TourEditor {}
