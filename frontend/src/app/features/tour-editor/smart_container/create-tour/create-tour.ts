import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { Card } from '../../../../components/card/card';
import {
  TourService,
  CreateTourInput,
} from '../../../tour-management/services/tour.api';
import { AuthService } from '../../../auth/services/auth.service';
import { TourForm } from '../../dumb_components/tour-form/tour-form';

@Component({
  selector: 'app-create-tour',
  imports: [Card, TourForm],
  template: `
    @if (errorMessage()) {
      <p class="error-banner" role="alert">{{ errorMessage() }}</p>
    }

    @if (tourId() && tourResource.isLoading()) {
      <p>Tour wird geladen ...</p>
    } @else if (tourId() && tourResource.error()) {
      <p class="error-banner" role="alert">
        Die Tour konnte nicht geladen werden.
      </p>
    } @else if (tourId() && !isTourManager()) {
      <p class="error-banner" role="alert">
        Sie haben keine Berechtigung, diese Tour zu bearbeiten.
      </p>
    } @else {
      <app-card [title]="cardTitle()">
        <app-tour-form
          [tour]="tourResource.value()"
          [isSubmitting]="isSubmitting()"
          [submitButtonText]="submitButtonText()"
          [showCancelButton]="!!tourId()"
          (cancelClicked)="cancelEdit()"
          (onFormSubmit)="storeTour($event)"
        />
      </app-card>
    }
  `,
  styles: `
    :host {
      display: block;
    }

    .error-banner {
      margin-bottom: 1rem;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      color: #991b1b;
      background-color: #fee2e2;
      border: 1px solid #f87171;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateTour {
  readonly tourId = input<string | null>(null);

  private readonly tourService = inject(TourService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly tourResource = this.tourService.getTourByIdResource(
    computed(() => this.tourId()),
  );

  readonly isTourManager = computed(() => {
    const id = this.tourId();
    if (!id) return true;
    const tour = this.tourResource.value();
    const currentUser = this.authService.currentUser();
    if (!tour || !currentUser) return false;
    return tour.tourManagerIds.includes(currentUser.id);
  });

  readonly cardTitle = computed(() =>
    this.tourId() ? 'Tour bearbeiten' : 'Tourenplanung',
  );

  readonly submitButtonText = computed(() =>
    this.tourId() ? 'Änderungen speichern' : 'Tour erstellen',
  );

  cancelEdit(): void {
    const id = this.tourId();
    if (id) {
      this.router.navigate(['/tour-management', id]);
    } else {
      this.router.navigate(['/tour-management']);
    }
  }

  storeTour(tour: CreateTourInput): void {
    if (this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const id = this.tourId();

    if (id) {
      this.tourService.updateTour(id, tour).subscribe({
        next: () => {
          this.router.navigate(['/tour-management', id]);
        },
        error: () => {
          this.isSubmitting.set(false);
          this.errorMessage.set(
            'Die Tour konnte nicht aktualisiert werden. Bitte versuchen Sie es später erneut.',
          );
        },
      });
    } else {
      this.tourService.createTour(tour).subscribe({
        next: () => {
          this.router.navigate(['/tour-management']);
        },
        error: () => {
          this.isSubmitting.set(false);
          this.errorMessage.set(
            'Die Tour konnte nicht gespeichert werden. Bitte versuchen Sie es später erneut.',
          );
        },
      });
    }
  }
}
