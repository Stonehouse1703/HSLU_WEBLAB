import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Card } from '../../../../components/card/card';
import { Button } from '../../../../components/button/button';
import { User } from '../../../user/user.types';
import { UserCard, UserRoleChange } from '../../../user/dumb_components/user-card/user-card';

@Component({
  selector: 'app-participant-information',
  imports: [Card, UserCard, Button],
  template: `
    <app-card title="Personen">
      @if (canAddUsers()) {
        <div class="participant-header">
          <app-button
            [text]="isLinkCopied() ? 'Link kopiert!' : '+ Benutzer hinzufügen'"
            [variant]="isLinkCopied() ? 'primary' : 'secondary'"
            ariaLabel="Einladungslink kopieren um Benutzer hinzuzufügen"
            (clicked)="addUser.emit()"
          />
          @if (isLinkCopied()) {
            <span class="copy-success" role="status">Einladungslink wurde in die Zwischenablage kopiert!</span>
          }
        </div>
      }

      <div class="user-list">
        @for (user of tourManagers(); track user.id) {
          <app-user-card
            [user]="user"
            [tourId]="tourId()"
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
            [tourId]="tourId()"
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
    .participant-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }

    .copy-success {
      color: #166534;
      font-size: 0.875rem;
      font-weight: 500;
    }

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
  readonly tourId = input<string | undefined>();
  readonly canChangeRoles = input(false);
  readonly canRemoveUsers = input(false);
  readonly canViewEmergencyContacts = input(false);
  readonly isLinkCopied = input(false);
  readonly canAddUsers = input(true);
  readonly addUser = output<void>();
  readonly emergencyContactSelected = output<User>();
  readonly removeUser = output<User>();
  readonly setUserRole = output<UserRoleChange>();
}
