import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { TourDetailContainer } from '../../smart_container/tour-detail/tour-detail';

@Component({
  selector: 'app-tour-detail',
  imports: [TourDetailContainer],
  template: `
    <main class="tour-detail-page">
      @if (tourId(); as id) {
        <app-tour-detail-container [tourId]="id" />
      }
    </main>
  `,
  styles: `
    :host {
      display: block;
    }

    .tour-detail-page {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TourDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly routeParams = toSignal(this.route.paramMap, { requireSync: true });

  readonly tourId = computed(() => this.routeParams().get('id'));
}
