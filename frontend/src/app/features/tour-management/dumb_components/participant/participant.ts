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
            [canChangeRole]="canChangeRoles() && user.id !== currentUserId()"
            [canRemoveUser]="canRemoveUsers() && user.id !== currentUserId()"
            [canViewEmergencyContact]="canViewEmergencyContacts()"
            (emergencyContactSelected)="emergencyContactSelected.emit($event)"
            (removeUser)="removeUser.emit($event)"
            (setUserRole)="setUserRole.emit($event)"
          />
        }

        @for (user of participants(); track user.id) {
          <app-user-card
            [user]="user"
            [canChangeRole]="canChangeRoles()"
            [canRemoveUser]="canRemoveUsers() && user.id !== currentUserId()"
            [canViewEmergencyContact]="canViewEmergencyContacts()"
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
  readonly currentUserId = input<string | undefined>();
  readonly canChangeRoles = input(false);
  readonly canRemoveUsers = input(false);
  readonly canViewEmergencyContacts = input(false);
  readonly emergencyContactSelected = output<User>();
  readonly removeUser = output<User>();
  readonly setUserRole = output<UserRoleChange>();
}
