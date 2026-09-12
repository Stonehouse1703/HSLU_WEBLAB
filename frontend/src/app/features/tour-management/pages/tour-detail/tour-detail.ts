import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { TourService } from '../../services/tour.api';
import { UserService } from '../../../user/services/user.api';
import { User } from '../../../user/user.types';
import { MeetingPoint } from '../../dumb_components/meeting-point/meeting-point';
import { TourInformation } from '../../dumb_components/tour-information/tour-information';
import { ParticipantInformation } from '../../dumb_components/participant/participant';


@Component({
  selector: 'app-tour-detail',
  imports: [MeetingPoint, TourInformation, ParticipantInformation],
  template: `
    
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
      <app-tour-information
        [tour]="selectedTour"
      />
      <app-participant-information
        [participants]="participants()"
        [tourManagers]="tourManagers()"
        (emergencyContactSelected)="openEmergencyContact($event)"
      />
    </div>
  } @else {
    <p>Diese Tour wurde nicht gefunden.</p>
  }
  `,
  styles: `
    .detail-grid {
      display: grid;
      gap: 0.5rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TourDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly tourService = inject(TourService);
  private readonly userService = inject(UserService);
  private readonly routeParams = toSignal(this.route.paramMap, {requireSync: true});
  readonly tourResource = this.tourService.getTourByIdResource(
    computed(() => this.routeParams().get('id')),
  );
  private readonly usersResource = this.userService.getUsersResource();

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

  backToTours() {
    this.router.navigate(['/tour-management']);
  }

  openEmergencyContact(user: User) {
    this.router.navigate(['/user', user.id]);
  }
}
