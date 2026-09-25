import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { TourService } from '../../services/tour.api';
import { AuthService } from '../../../auth/services/auth.service';
import { User } from '../../../user/user.types';
import { UserRoleChange } from '../../../user/dumb_components/user-card/user-card';
import { MeetingPoint } from '../../dumb_components/meeting-point/meeting-point';
import { TourInformation } from '../../dumb_components/tour-information/tour-information';
import { SecurityMatrixDisplay } from '../../dumb_components/security-matrix-display/security-matrix-display';
import { ParticipantInformation } from '../../dumb_components/participant/participant';
import { LoadingSpinner } from '../../../../components/loading-spinner/loading-spinner';
import { Button } from '../../../../components/button/button';
import { isTourUpcoming } from '../../tour.types';

@Component({
  selector: 'app-tour-detail-container',
  imports: [
    MeetingPoint,
    TourInformation,
    SecurityMatrixDisplay,
    ParticipantInformation,
    LoadingSpinner,
    Button,
    RouterLink,
  ],
  template: `
    @if (isRemoving()) {
      <div class="status-banner" role="status">Person wird aus der Tour entfernt ...</div>
    } @else if (removeError()) {
      <div class="error-banner" role="alert">{{ removeError() }}</div>
    } @else if (joinError()) {
      <div class="error-banner" role="alert">{{ joinError() }}</div>
    }

    @if (tourResource.isLoading()) {
      <app-loading-spinner label="Tourdaten werden geladen..." />
    } @else if (tourResource.error()) {
      <div class="error-banner" role="alert">
        Die Tour konnte leider nicht geladen werden.
      </div>
    } @else if (tourResource.value(); as selectedTour) {
      <header class="tour-header">
        <div class="header-nav">
          <a routerLink="/tour-management" class="back-link">
            <span class="material-icons" aria-hidden="true">arrow_back</span>
            Zurück zur Tourenübersicht
          </a>
        </div>

        <div class="tour-header-top">
          <div class="header-titles">
            <span class="eyebrow">Tourdetails & Planung</span>
            <h2>{{ selectedTour.name }}</h2>
          </div>

          <div class="header-actions">
            @if (!isPastTour()) {
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
            }

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
              <span class="joining-indicator" role="status">Tour wird beigetreten ...</span>
            } @else if (isPastTour() && !isMember()) {
              <span class="past-tour-badge">Diese Tour ist bereits vergangen</span>
            }
          </div>
        </div>
      </header>

      <div class="detail-grid">
        <app-meeting-point [tour]="selectedTour" />
        <app-tour-information [tour]="selectedTour" />
        @if (selectedTour.securityMatrix) {
          <app-security-matrix-display [matrix]="selectedTour.securityMatrix" />
        }
        <app-participant-information
          [tourId]="selectedTour.id"
          [participants]="participants()"
          [tourManagers]="tourManagers()"
          [currentUserId]="currentUserId()"
          [canChangeRoles]="canChangeRoles()"
          [canRemoveUsers]="canChangeRoles()"
          [canViewEmergencyContacts]="canChangeRoles()"
          [isLinkCopied]="isLinkCopied()"
          [canAddUsers]="!isPastTour()"
          (addUser)="copyInviteLink()"
          (emergencyContactSelected)="openEmergencyContact($event)"
          (removeUser)="removeUser($event)"
          (setUserRole)="setUserRole($event)"
        />
      </div>
    } @else {
      <div class="empty-state">
        <p>Diese Tour wurde nicht gefunden.</p>
        <app-button
          text="Zur Tourenübersicht"
          variant="secondary"
          (clicked)="navigateToOverview()"
        />
      </div>
    }
  `,
  styles: `
    :host {
      display: block;
    }

    .tour-header {
      margin-bottom: 1.5rem;
    }

    .header-nav {
      margin-bottom: 0.75rem;
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      color: var(--color-primary);
      font-size: 0.875rem;
      font-weight: 500;
      text-decoration: none;
    }

    .back-link:hover {
      text-decoration: underline;
    }

    .back-link .material-icons {
      font-size: 1.1rem;
    }

    .tour-header-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .header-titles {
      min-width: 0;
    }

    .eyebrow {
      display: block;
      margin-bottom: 0.35rem;
      color: var(--color-text-muted);
      font-size: 0.8rem;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    h2 {
      margin: 0;
      color: var(--color-text-main);
      font-size: clamp(1.6rem, 4vw, 2.25rem);
      font-weight: 500;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-shrink: 0;
      flex-wrap: wrap;
    }

    .share-button {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0 0.85rem;
      height: 2.75rem;
      border: 1px solid var(--color-border-input);
      border-radius: var(--radius-md);
      background: var(--color-bg-surface);
      color: var(--color-primary);
      font: inherit;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      box-shadow: var(--shadow-sm);
      transition:
        background-color var(--transition-fast),
        border-color var(--transition-fast),
        box-shadow var(--transition-fast),
        transform 0.1s ease;
    }

    .share-button:hover {
      background: var(--color-primary-subtle);
      border-color: var(--color-primary);
      box-shadow: 0 2px 6px var(--color-primary-focus-subtle);
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

    .edit-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2.75rem;
      height: 2.75rem;
      border: 1px solid var(--color-border-input);
      border-radius: var(--radius-md);
      background: var(--color-bg-surface);
      color: var(--color-primary);
      cursor: pointer;
      box-shadow: var(--shadow-sm);
      transition:
        background-color var(--transition-fast),
        border-color var(--transition-fast),
        box-shadow var(--transition-fast),
        transform 0.1s ease;
    }

    .edit-button:hover {
      background: var(--color-primary-subtle);
      border-color: var(--color-primary);
      box-shadow: 0 2px 6px var(--color-primary-focus-subtle);
      transform: translateY(-1px);
    }

    .edit-button .material-icons {
      font-size: 1.35rem;
    }

    .past-tour-badge {
      display: inline-flex;
      align-items: center;
      padding: 0.4rem 0.85rem;
      border-radius: var(--radius-full);
      font-size: 0.85rem;
      font-weight: 500;
      color: var(--color-text-muted);
      background: var(--color-border-subtle);
      border: 1px solid var(--color-border-input);
    }

    .joining-indicator {
      color: var(--color-primary);
      font-size: 0.875rem;
      font-weight: 500;
    }

    .detail-grid {
      display: grid;
      gap: 1.25rem;
    }

    .status-banner {
      margin-bottom: 1rem;
      padding: 0.75rem 1rem;
      border-radius: var(--radius-md);
      color: var(--color-info-text);
      background: var(--color-info-bg);
      border: 1px solid var(--color-info-border);
      font-size: 0.875rem;
    }

    .error-banner {
      margin-bottom: 1rem;
      padding: 0.75rem 1rem;
      border-radius: var(--radius-md);
      color: var(--color-danger-text);
      background-color: var(--color-danger-bg);
      border: 1px solid var(--color-danger-border);
      font-size: 0.875rem;
    }

    .empty-state {
      padding: 3rem 1rem;
      text-align: center;
      border-radius: var(--radius-lg);
      background: var(--color-bg-surface);
      border: 1px solid var(--color-border-default);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TourDetailContainer {
  readonly tourId = input.required<string>();

  private readonly router = inject(Router);
  private readonly tourService = inject(TourService);
  private readonly authService = inject(AuthService);

  readonly tourResource = this.tourService.getTourByIdResource(
    computed(() => this.tourId()),
  );
  readonly membersResource = this.tourService.getTourMembersResource(
    computed(() => this.tourId()),
  );

  readonly isRemoving = signal(false);
  readonly removeError = signal<string | null>(null);
  readonly isJoining = signal(false);
  readonly joinError = signal<string | null>(null);
  readonly isLinkCopied = signal(false);
  private copyTimeout?: ReturnType<typeof setTimeout>;

  readonly participants = computed(
    () => this.membersResource.value()?.participants ?? [],
  );
  readonly tourManagers = computed(
    () => this.membersResource.value()?.tourManagers ?? [],
  );
  readonly currentUserId = computed(() => this.authService.currentUser()?.id);

  readonly canChangeRoles = computed(() => {
    const currentUser = this.authService.currentUser();
    const tour = this.tourResource.value();

    return !!currentUser && !!tour?.tourManagerIds.includes(currentUser.id);
  });

  readonly isMember = computed(() => {
    const currentUser = this.authService.currentUser();
    const tour = this.tourResource.value();
    if (!currentUser || !tour) return false;
    return (
      tour.tourManagerIds.includes(currentUser.id) ||
      tour.participantIds.includes(currentUser.id)
    );
  });

  readonly isPastTour = computed(() => {
    const tour = this.tourResource.value();
    return !!tour && !isTourUpcoming(tour.date);
  });

  readonly canJoinTour = computed(() => {
    const currentUser = this.authService.currentUser();
    const tour = this.tourResource.value();

    return (
      !!currentUser &&
      !!tour &&
      isTourUpcoming(tour.date) &&
      !tour.tourManagerIds.includes(currentUser.id) &&
      !tour.participantIds.includes(currentUser.id)
    );
  });

  navigateToOverview(): void {
    this.router.navigate(['/tour-management']);
  }

  openEmergencyContact(user: User): void {
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
      this.membersResource.reload();
    } catch (err: any) {
      if (err?.error?.message) {
        this.joinError.set(err.error.message);
      } else {
        this.joinError.set('Der Tour konnte nicht beigetreten werden.');
      }
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
      this.membersResource.reload();
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
    this.membersResource.reload();
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
