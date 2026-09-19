import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Button } from '../../../../components/button/button';
import { User } from '../../user.types';

export type UserRole = 'admin' | 'participant';
export interface UserRoleChange {
  user: User;
  role: UserRole;
}

@Component({
  selector: 'app-user-card',
  imports: [Button],
  template: `
    <div class="user-summary">
        <span class="material-icons user-icon" aria-hidden="true">
        {{ isTourManager() ? 'record_voice_over' : 'person' }}
        </span>
        <span class="user-name">{{ user().firstName }} {{ user().lastName }}</span>
        <span class="role">{{ isTourManager() ? 'Tourleitung' : '' }}</span>
        <span class="phone-number">{{ user().phoneNumber }}</span>
        <span class="birthday">{{ user().birthday }}</span>
        <app-button
            class="preview-action"
            text="Notfallkontakt"
            variant="danger"
            [ariaLabel]="'Notfallkontakt von ' + user().firstName"
            (clicked)="emergencyContactSelected.emit(user())"
        />
        @if (canRemoveUser()) {
          <app-button
              class="preview-action"
              text="X"
              variant="danger"
              [ariaLabel]="user().firstName + ' entfernen'"
              (clicked)="removeUser.emit(user())"
          />
        }
        @if (canChangeRole()) {
          @if (!isTourManager()) {
            <app-button
              class="preview-action"
              text="Tourleiter ernennen"
              variant="primary"
              [ariaLabel]="user().firstName + ' zur Tourleitung ernennen'"
              (clicked)="setUserRole.emit({ user: user(), role: 'admin' })"
            />
          } @else {
            <app-button
              class="preview-action"
              text="Als Teilnehmer zurückstufen"
              variant="secondary"
              [ariaLabel]="user().firstName + ' als Teilnehmer zurückstufen'"
              (clicked)="setUserRole.emit({ user: user(), role: 'participant' })"
            />
          }
        }
    </div>
  `,
  styles: `
    .user-summary {
      display: grid;
      grid-template-columns: 1.5rem minmax(10rem, 1.4fr) minmax(6rem, 0.8fr) minmax(8rem, 1fr) minmax(6.5rem, 0.8fr) minmax(6.5rem, 0.8fr);
      align-items: center;
      column-gap: 0.75rem;
      row-gap: 0.25rem;
      min-width: 0;
      color: #65636d;
      padding: 0.5rem;
    }

    .user-name {
      min-width: 0;
      overflow: hidden;
      color: #25252d;
      font-weight: 500;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .phone-number {
      color: #898792;
      font-size: 0.875rem;
    }

    .role {
      color: #4f46a5;
      font-size: 0.875rem;
      font-weight: 500;
      white-space: nowrap;
    }

    .phone-number,
    .birthday {
      color: #898792;
      font-size: 0.875rem;
      white-space: nowrap;
    }

    .user-icon {
      width: 1.25rem;
      height: 1.25rem;
      color: #4f46a5;
      font-size: 1.25rem;
    }   

    @media (max-width: 700px) {
      .user-summary {
        grid-template-columns: 1.5rem minmax(0, 1fr) auto;
      }

      .phone-number,
      .birthday {
        grid-column: 2 / -1;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCard {
  readonly user = input.required<User>();
  readonly isTourManager = input(false);
  readonly canChangeRole = input(false);
  readonly canRemoveUser = input(false);
  readonly emergencyContactSelected = output<User>();
  readonly removeUser = output<User>();
  readonly setUserRole = output<UserRoleChange>();
}
