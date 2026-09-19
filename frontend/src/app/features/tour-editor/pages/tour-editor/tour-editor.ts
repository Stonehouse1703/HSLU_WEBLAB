import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { CreateTour } from '../../smart_container/create-tour/create-tour';

@Component({
  selector: 'app-tour-editor',
  imports: [CreateTour],
  template: `
    <main class="tour-editor-page">
      <app-create-tour [tourId]="tourId()" />
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
export class TourEditor {
  private readonly route = inject(ActivatedRoute);
  private readonly routeParams = toSignal(this.route.paramMap, {
    requireSync: true,
  });

  readonly tourId = computed(() => this.routeParams().get('id'));
}
