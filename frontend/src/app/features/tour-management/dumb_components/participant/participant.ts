import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Card } from '../../../../components/card/card';
import { User } from '../../../user/user.types';
import { UserCard } from '../../../user/dumb_components/user-card/user-card';

@Component({
  selector: 'app-participant-information',
  imports: [Card, UserCard],
  template: `
    <app-card title="Personen">
      <div class="user-list">
        @for (user of tourManagers(); track user.id) {
          <app-user-card [user]="user" [isTourManager]="true" />
        }
        @for (user of participants(); track user.id) {
          <app-user-card [user]="user" />
        }
        @if (tourManagers().length === 0 && participants().length === 0) {
          <span>Keine Personen angegeben.</span>
        }
      </div>
    </app-card>
  `,
  styles: `
    .user-list {
      display: grid;
      gap: 0.75rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParticipantInformation {
  readonly participants = input.required<User[]>();
  readonly tourManagers = input.required<User[]>();
}
