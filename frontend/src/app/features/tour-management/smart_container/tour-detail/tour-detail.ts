import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { TourService } from '../../services/tour.api';
import { UserService } from '../../../user/services/user.api';
import { User } from '../../../user/user.types';
import { UserRoleChange } from '../../../user/dumb_components/user-card/user-card';
import { AuthService } from '../../../auth/services/auth.service';
import { MeetingPoint } from '../../dumb_components/meeting-point/meeting-point';
import { TourInformation } from '../../dumb_components/tour-information/tour-information';
import { ParticipantInformation } from '../../dumb_components/participant/participant';
import { Button } from '../../../../components/button/button';

@Component({
  selector: 'app-tour-detail-container',
  imports: [MeetingPoint, TourInformation, ParticipantInformation, Button],
  template: `
    @if (isRemoving()) {
      <p role="status">Person wird aus der Tour entfernt ...</p>
    } @else if (removeError()) {
      <p role="alert">{{ removeError() }}</p>
    } @else if (joinError()) {
      <p role="alert">{{ joinError() }}</p>
    }

    @if (tourResource.isLoading()) {
      <p>Tour wird geladen ...</p>
    } @else if (tourResource.error()) {
      <p>Die Tour konnte nicht geladen werden.</p>
    } @else if (tourResource.value(); as selectedTour) {
      <header class="tour-header">
        <div class="tour-header-top">
          <div class="header-titles">
            <span class="eyebrow">Tourdetails</span>
            <h2>{{ selectedTour.name }}</h2>
          </div>

          <div class="header-actions">
            <button
              type="button"
              class="share-button"
              (click)="copyInviteLink()"
              [title]="isLinkCopied() ? 'Link kopiert!' : 'Benutzer hinzufügen (Link kopieren)'"
              [attr.aria-label]="isLinkCopied() ? 'Link kopiert' : 'Benutzer hinzufügen'"
            >
              <span class="material-icons" aria-hidden="true">{{ isLinkCopied() ? 'check' : 'person_add' }}</span>
              <span class="share-button-text">{{ isLinkCopied() ? 'Link kopiert!' : 'Benutzer hinzufügen' }}</span>
            </button>

            @if (canChangeRoles()) {
              <button
                type="button"
                class="edit-button"
                (click)="editTour()"
                title="Tour bearbeiten"
                aria-label="Tour bearbeiten"
              >
                <span class="material-icons" aria-hidden="true">edit</span>
              </button>
            }

            @if (canJoinTour()) {
              <app-button
                text="Tour beitreten"
                variant="primary"
                [disabled]="isJoining()"
                (clicked)="joinTour()"
              />
            } @else if (isJoining()) {
              <p role="status">Tour wird beigetreten ...</p>
            }
          </div>
        </div>
      </header>

      <div class="detail-grid">
        <app-meeting-point [tour]="selectedTour" />
        <app-tour-information [tour]="selectedTour" />
        <app-participant-information
          [participants]="participants()"
          [tourManagers]="tourManagers()"
          [currentUserId]="currentUserId()"
          [canChangeRoles]="canChangeRoles()"
          [canRemoveUsers]="canChangeRoles()"
          [canViewEmergencyContacts]="canChangeRoles()"
          [isLinkCopied]="isLinkCopied()"
          (addUser)="copyInviteLink()"
          (emergencyContactSelected)="openEmergencyContact($event)"
          (removeUser)="removeUser($event)"
          (setUserRole)="setUserRole($event)"
        />
      </div>
    } @else {
      <p>Diese Tour wurde nicht gefunden.</p>
    }
  `,
  styles: `
    :host {
      display: block;
    }

    .tour-header {
      margin-bottom: 1.5rem;
    }

    .tour-header-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
    }

    .header-titles {
      min-width: 0;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-shrink: 0;
    }

    .edit-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2.75rem;
      height: 2.75rem;
      border: 1px solid #c8c6d0;
      border-radius: 8px;
      background: #fff;
      color: #4f46a5;
      cursor: pointer;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      transition:
        background-color 0.15s ease,
        border-color 0.15s ease,
        box-shadow 0.15s ease,
        transform 0.1s ease;
    }

    .edit-button:hover {
      background: #f4f3ff;
      border-color: #4f46a5;
      box-shadow: 0 2px 6px rgb(79 70 165 / 15%);
      transform: translateY(-1px);
    }

    .edit-button .material-icons {
      font-size: 1.35rem;
    }

    .share-button {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0 0.85rem;
      height: 2.75rem;
      border: 1px solid #c8c6d0;
      border-radius: 8px;
      background: #fff;
      color: #4f46a5;
      font: inherit;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      transition:
        background-color 0.15s ease,
        border-color 0.15s ease,
        box-shadow 0.15s ease,
        transform 0.1s ease;
    }

    .share-button:hover {
      background: #f4f3ff;
      border-color: #4f46a5;
      box-shadow: 0 2px 6px rgb(79 70 165 / 15%);
      transform: translateY(-1px);
    }

    .share-button .material-icons {
      font-size: 1.25rem;
    }

    @media (max-width: 500px) {
      .share-button-text {
        display: none;
      }
      .share-button {
        padding: 0;
        width: 2.75rem;
        justify-content: center;
      }
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

    h2 {
      margin: 0;
      color: #25252d;
      font-size: clamp(1.6rem, 4vw, 2.25rem);
      font-weight: 500;
    }

    .detail-grid {
      display: grid;
      gap: 0.5rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TourDetailContainer {
  readonly tourId = input.required<string>();

  private readonly router = inject(Router);
  private readonly tourService = inject(TourService);
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);

  readonly tourResource = this.tourService.getTourByIdResource(
    computed(() => this.tourId()),
  );
  private readonly usersResource = this.userService.getUsersResource();

  readonly isRemoving = signal(false);
  readonly removeError = signal<string | null>(null);
  readonly isJoining = signal(false);
  readonly joinError = signal<string | null>(null);
  readonly isLinkCopied = signal(false);
  private copyTimeout?: ReturnType<typeof setTimeout>;

  readonly participants = computed(() =>
    this.findUsers(this.tourResource.value()?.participantIds ?? []),
  );
  readonly tourManagers = computed(() =>
    this.findUsers(this.tourResource.value()?.tourManagerIds ?? []),
  );
  readonly currentUserId = computed(() => this.authService.currentUser()?.id);
  readonly canChangeRoles = computed(() => {
    const currentUser = this.authService.currentUser();
    const tour = this.tourResource.value();

    return !!currentUser && !!tour?.tourManagerIds.includes(currentUser.id);
  });
  readonly canJoinTour = computed(() => {
    const currentUser = this.authService.currentUser();
    const tour = this.tourResource.value();

    return (
      !!currentUser &&
      !!tour &&
      !tour.tourManagerIds.includes(currentUser.id) &&
      !tour.participantIds.includes(currentUser.id)
    );
  });

  private findUsers(ids: string[]): User[] {
    return ids
      .map(id => this.usersResource.value().find(user => user.id === id))
      .filter((user): user is User => user !== undefined);
  }

  openEmergencyContact(user: User) {
    this.router.navigate(['/user', user.id], {
      queryParams: { tourId: this.tourId() },
    });
  }

  async joinTour(): Promise<void> {
    const id = this.tourId();
    if (!id || this.isJoining() || !this.canJoinTour()) return;

    this.isJoining.set(true);
    this.joinError.set(null);

    try {
      await firstValueFrom(this.tourService.joinTour(id));
      this.tourResource.reload();
    } catch {
      this.joinError.set('Der Tour konnte nicht beigetreten werden.');
    } finally {
      this.isJoining.set(false);
    }
  }

  async removeUser(user: User): Promise<void> {
    const id = this.tourId();
    if (!id || user.id === this.currentUserId()) return;

    this.isRemoving.set(true);
    this.removeError.set(null);

    try {
      await firstValueFrom(this.tourService.removeUser(id, user.id));
      this.tourResource.reload();
    } catch {
      this.removeError.set('Die Person konnte nicht aus der Tour entfernt werden.');
    } finally {
      this.isRemoving.set(false);
    }
  }

  editTour(): void {
    const id = this.tourId();
    if (id && this.canChangeRoles()) {
      this.router.navigate(['/tour-editor', id]);
    }
  }

  async setUserRole(change: UserRoleChange): Promise<void> {
    const id = this.tourId();
    if (
      !id ||
      (change.user.id === this.currentUserId() &&
        change.role === 'participant')
    ) {
      return;
    }

    await firstValueFrom(
      this.tourService.setUserRole(id, change.user.id, change.role),
    );
    this.tourResource.reload();
  }

  async copyInviteLink(): Promise<void> {
    const id = this.tourId();
    if (!id) return;

    const shareUrl = `${window.location.origin}/tour-management/${id}`;

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        this.fallbackCopyText(shareUrl);
      }
      this.setCopiedFeedback();
    } catch {
      try {
        this.fallbackCopyText(shareUrl);
        this.setCopiedFeedback();
      } catch (e) {
        console.error('Kopieren fehlgeschlagen:', e);
      }
    }
  }

  private fallbackCopyText(text: string): void {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }

  private setCopiedFeedback(): void {
    this.isLinkCopied.set(true);
    if (this.copyTimeout) {
      clearTimeout(this.copyTimeout);
    }
    this.copyTimeout = setTimeout(() => {
      this.isLinkCopied.set(false);
    }, 2500);
  }
}
