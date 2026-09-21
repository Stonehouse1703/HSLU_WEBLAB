import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from '../../../../components/button/button';
import { Badge } from '../../../../components/badge/badge';
import { User } from '../../user.types';

export type UserRole = 'admin' | 'participant';
export interface UserRoleChange {
  user: User;
  role: UserRole;
}

@Component({
  selector: 'app-user-card',
  imports: [Button, Badge, RouterLink],
  template: `
    <div class="user-row">
      <div class="user-identity">
        <span class="material-icons user-icon" aria-hidden="true">
          {{ isTourManager() ? 'record_voice_over' : 'person' }}
        </span>
        <a [routerLink]="['/user', user().id]" class="user-name">
          {{ user().firstName }} {{ user().lastName }}
        </a>
        <app-badge
          [color]="isTourManager() ? 'primary' : 'light'"
          [text]="isTourManager() ? 'Tourleitung' : 'Teilnehmer'"
        />
      </div>

      <div class="user-meta">
        <span class="meta-item">
          <span class="material-icons meta-icon" aria-hidden="true">phone</span>
          {{ user().phoneNumber }}
        </span>
        <span class="meta-item">
          <span class="material-icons meta-icon" aria-hidden="true">cake</span>
          {{ user().birthday }}
        </span>
      </div>

      <div class="user-actions">
        @if (canViewEmergencyContact()) {
          <app-button
            text="Notfallkontakt"
            variant="secondary"
            [ariaLabel]="'Notfallkontakt von ' + user().firstName"
            (clicked)="emergencyContactSelected.emit(user())"
          />
        }
        @if (canChangeRole()) {
          @if (!isTourManager()) {
            <app-button
              text="Zu Leitung ernennen"
              variant="primary"
              [ariaLabel]="user().firstName + ' zur Tourleitung ernennen'"
              (clicked)="setUserRole.emit({ user: user(), role: 'admin' })"
            />
          } @else {
            <app-button
              text="Zurückstufen"
              variant="secondary"
              [ariaLabel]="user().firstName + ' als Teilnehmer zurückstufen'"
              (clicked)="setUserRole.emit({ user: user(), role: 'participant' })"
            />
          }
        }
        @if (canRemoveUser()) {
          <app-button
            text="Entfernen"
            variant="danger"
            [ariaLabel]="user().firstName + ' aus Tour entfernen'"
            (clicked)="removeUser.emit(user())"
          />
        }
      </div>
    </div>
  `,
  styles: `
    .user-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.85rem 1rem;
      border: 1px solid #e2e1e8;
      border-radius: 8px;
      background: #fff;
      transition: background-color 0.15s ease;
    }

    .user-row:hover {
      background: #fdfdfd;
    }

    .user-identity {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      min-width: 14rem;
      flex: 1 1 auto;
    }

    .user-icon {
      color: #4f46a5;
      font-size: 1.35rem;
    }

    .user-name {
      color: #25252d;
      font-weight: 500;
      text-decoration: none;
      transition: color 0.15s ease;
    }

    .user-name:hover {
      color: #4f46a5;
      text-decoration: underline;
    }

    .user-meta {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      color: #65636d;
      font-size: 0.875rem;
      flex: 1 1 auto;
    }

    .meta-item {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      white-space: nowrap;
    }

    .meta-icon {
      color: #898792;
      font-size: 1rem;
    }

    .user-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-left: auto;
    }

    @media (max-width: 768px) {
      .user-row {
        flex-direction: column;
        align-items: flex-start;
      }

      .user-actions {
        width: 100%;
        justify-content: flex-start;
        margin-left: 0;
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
  readonly canViewEmergencyContact = input(false);
  readonly emergencyContactSelected = output<User>();
  readonly removeUser = output<User>();
  readonly setUserRole = output<UserRoleChange>();
}
