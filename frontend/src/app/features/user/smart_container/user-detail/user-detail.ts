import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { UserService } from '../../services/user.api';
import { PersInformation } from '../../dumb_components/pers-information/pers-information';
import { EmergInformation } from '../../dumb_components/emerg-information/emerg-information';

@Component({
  selector: 'app-user-detail-container',
  imports: [PersInformation, EmergInformation],
  template: `
    @if (userResource.isLoading()) {
      <p>Person wird geladen ...</p>
    } @else if (userResource.error()) {
      <p>Die Person konnte nicht geladen werden.</p>
    } @else if (userResource.value(); as selectedUser) {
      <header class="page-header">
        <span class="eyebrow">Personendetails</span>
        <h1>{{ selectedUser.firstName }} {{ selectedUser.lastName }}</h1>
      </header>

      <div class="detail-grid">
        <app-pers-information [person]="selectedUser" />
        <app-emerg-information [person]="selectedUser" />
      </div>
    } @else {
      <p>Diese Person wurde nicht gefunden.</p>
    }
  `,
  styles: `
    :host {
      display: block;
    }

    .page-header {
      margin-bottom: 1.5rem;
    }

    .eyebrow {
      display: block;
      margin-bottom: 0.35rem;
      color: #65636d;
      font-size: 0.8rem;
      font-weight: 500;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    h1 {
      margin: 0;
      color: #25252d;
      font-size: clamp(1.6rem, 4vw, 2.25rem);
      font-weight: 500;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1rem;
      align-items: stretch;
    }

    app-pers-information,
    app-emerg-information {
      display: grid;
    }

    @media (max-width: 700px) {
      .detail-grid {
        grid-template-columns: 1fr;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailContainer {
  readonly userId = input.required<string>();

  private readonly userService = inject(UserService);

  readonly userResource = this.userService.getUserByIdResource(
    computed(() => this.userId()),
  );
}
