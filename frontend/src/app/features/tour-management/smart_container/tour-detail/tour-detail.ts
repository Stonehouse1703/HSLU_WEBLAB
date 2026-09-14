import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { TourService } from '../../services/tour.api';
import { UserService } from '../../../user/services/user.api';
import { User } from '../../../user/user.types';
import { UserRoleChange } from '../../../user/dumb_components/user-card/user-card';
import { MeetingPoint } from '../../dumb_components/meeting-point/meeting-point';
import { TourInformation } from '../../dumb_components/tour-information/tour-information';
import { ParticipantInformation } from '../../dumb_components/participant/participant';

@Component({
  selector: 'app-tour-detail-container',
  imports: [MeetingPoint, TourInformation, ParticipantInformation],
  template: `
    @if (isRemoving()) {
      <p role="status">Person wird aus der Tour entfernt ...</p>
    } @else if (removeError()) {
      <p role="alert">{{ removeError() }}</p>
    }

    @if (tourResource.isLoading()) {
      <p>Tour wird geladen ...</p>
    } @else if (tourResource.error()) {
      <p>Die Tour konnte nicht geladen werden.</p>
    } @else if (tourResource.value(); as selectedTour) {
      <header class="tour-header">
        <span class="eyebrow">Tourdetails</span>
        <h2>{{ selectedTour.name }}</h2>
      </header>

      <div class="detail-grid">
        <app-meeting-point [tour]="selectedTour" />
        <app-tour-information [tour]="selectedTour" />
        <app-participant-information
          [participants]="participants()"
          [tourManagers]="tourManagers()"
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

  readonly tourResource = this.tourService.getTourByIdResource(
    computed(() => this.tourId()),
  );
  private readonly usersResource = this.userService.getUsersResource();

  readonly isRemoving = signal(false);
  readonly removeError = signal<string | null>(null);

  readonly participants = computed(() =>
    this.findUsers(this.tourResource.value()?.participantIds ?? []),
  );
  readonly tourManagers = computed(() =>
    this.findUsers(this.tourResource.value()?.tourManagerIds ?? []),
  );

  private findUsers(ids: string[]): User[] {
    return ids
      .map(id => this.usersResource.value().find(user => user.id === id))
      .filter((user): user is User => user !== undefined);
  }

  openEmergencyContact(user: User) {
    this.router.navigate(['/user', user.id]);
  }

  async removeUser(user: User): Promise<void> {
    const id = this.tourId();
    if (!id) return;

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

  async setUserRole(change: UserRoleChange): Promise<void> {
    const id = this.tourId();
    if (!id) return;

    await firstValueFrom(
      this.tourService.setUserRole(id, change.user.id, change.role),
    );
    this.tourResource.reload();
  }
}
