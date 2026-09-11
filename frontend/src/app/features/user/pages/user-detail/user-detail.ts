import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Card } from '../../../../components/card/card';
import { InfoItem } from '../../../../components/info-item/info-item';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-detail',
  imports: [Card, InfoItem],
  template: `
    @if (user(); as selectedUser) {
      <header class="page-header">
        <span class="eyebrow">Personendetails</span>
        <h1>{{ selectedUser.firstName }} {{ selectedUser.lastName }}</h1>
      </header>

      <div class="detail-grid">
        <app-card title="Persönliche Informationen">
          <dl class="info-list">
            <app-info-item icon="cake" title="Geburtsdatum" [describtion]="selectedUser.birthday" />
            <app-info-item icon="phone" title="Telefonnummer" [describtion]="selectedUser.phoneNumber" />
          </dl>
        </app-card>

        <app-card title="Notfallkontakt">
          <dl class="info-list">
            <app-info-item
              icon="person"
              title="Name"
              [describtion]="selectedUser.emergencyContact.firstName + ' ' + selectedUser.emergencyContact.lastName"
            />
            <app-info-item icon="phone_in_talk" title="Telefonnummer" [describtion]="selectedUser.emergencyContact.phoneNumber" />
            <app-info-item icon="family_restroom" title="Beziehung" [describtion]="selectedUser.emergencyContact.relationship" />
          </dl>
        </app-card>
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
    }

    .info-list {
      display: grid;
      gap: 1rem;
      margin: 0;
    }

    @media (max-width: 700px) {
      .detail-grid {
        grid-template-columns: 1fr;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly userService = inject(UserService);
  private readonly routeParams = toSignal(this.route.paramMap, { requireSync: true });

  readonly user = computed(() => {
    const id = this.routeParams().get('id');
    return id ? this.userService.findUserById(id) : undefined;
  });
}
