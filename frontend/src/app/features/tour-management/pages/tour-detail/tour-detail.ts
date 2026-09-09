import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { TourService } from '../../services/tour.service';
import { UserService } from '../../../user/services/user.service';
import { User } from '../../../user/user.types';
import { MeetingPoint } from '../../dumb_components/meeting-point/meeting-point';
import { TourInformation } from '../../dumb_components/tour-information/tour-information';
import { ParticipantInformation } from '../../dumb_components/participant/participant';


@Component({
  selector: 'app-tour-detail',
  imports: [MeetingPoint, TourInformation, ParticipantInformation],
  template: `
    
  @if (tour(); as selectedTour) {
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

  readonly tour = computed(() => {
    const id = String(this.routeParams().get('id'));
    return id ? this.tourService.findTourById(id) : undefined;
  });

  readonly participants = computed(() => this.findUsers(this.tour()?.participantIds ?? []));
  readonly tourManagers = computed(() => this.findUsers(this.tour()?.tourManagerIds ?? []));

  private findUsers(ids: string[]): User[] {
    return ids
      .map(id => this.userService.findUserById(id))
      .filter((user): user is User => user !== undefined);
  }

  backToTours() {
    this.router.navigate(['/tour-management']);
  }
}
