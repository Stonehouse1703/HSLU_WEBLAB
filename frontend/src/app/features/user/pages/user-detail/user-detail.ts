import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { UserDetailContainer } from '../../smart_container/user-detail/user-detail';

@Component({
  selector: 'app-user-detail',
  imports: [UserDetailContainer],
  template: `
    <main class="user-detail-page">
      @if (userId(); as id) {
        <app-user-detail-container [userId]="id" [tourId]="tourId()" />
      }
    </main>
  `,
  styles: `
    :host {
      display: block;
    }

    .user-detail-page {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly routeParams = toSignal(this.route.paramMap, { requireSync: true });
  private readonly queryParams = toSignal(this.route.queryParamMap, { requireSync: true });

  readonly userId = computed(() => this.routeParams().get('id'));
  readonly tourId = computed(() => this.queryParams().get('tourId'));
}
