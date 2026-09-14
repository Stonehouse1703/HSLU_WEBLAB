import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Card } from '../../../../components/card/card';
import { TourService, CreateTourInput } from '../../../tour-management/services/tour.api';
import { TourForm } from '../../dumb_components/tour-form/tour-form';

@Component({
  selector: 'app-create-tour',
  imports: [Card, TourForm],
  template: `
    @if (errorMessage()) {
      <p class="error-banner" role="alert">{{ errorMessage() }}</p>
    }

    <app-card title="Tourenplanung">
      <app-tour-form
        [isSubmitting]="isSubmitting()"
        (onFormSubmit)="storeTour($event)"
      />
    </app-card>
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
  private readonly tourService = inject(TourService);
  private readonly router = inject(Router);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  storeTour(tour: CreateTourInput): void {
    if (this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.tourService.createTour(tour).subscribe({
      next: () => {
        this.router.navigate(['/tour-management']);
      },
      error: () => {
        this.isSubmitting.set(false);
        this.errorMessage.set('Die Tour konnte nicht gespeichert werden. Bitte versuchen Sie es später erneut.');
      },
    });
  }
}
