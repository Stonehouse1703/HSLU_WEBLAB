import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Card } from '../../../../components/card/card';
import { User } from '../../../user/user.types';
import { UserCard, UserRoleChange } from '../../../user/dumb_components/user-card/user-card';

@Component({
  selector: 'app-participant-information',
  imports: [Card, UserCard],
  template: `
    <app-card title="Personen">
      <div class="user-list">
        @for (user of tourManagers(); track user.id) {
          <app-user-card
            [user]="user"
            [isTourManager]="true"
            (emergencyContactSelected)="emergencyContactSelected.emit($event)"
            (removeUser)="removeUser.emit($event)"
            (setUserRole)="setUserRole.emit($event)"
           />
        }
        @for (user of participants(); track user.id) {
          <app-user-card 
          [user]="user"
          (emergencyContactSelected)="emergencyContactSelected.emit($event)"
          (removeUser)="removeUser.emit($event)"
          (setUserRole)="setUserRole.emit($event)"
          />
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
  readonly emergencyContactSelected = output<User>();
  readonly removeUser = output<User>();
  readonly setUserRole = output<UserRoleChange>();
}
