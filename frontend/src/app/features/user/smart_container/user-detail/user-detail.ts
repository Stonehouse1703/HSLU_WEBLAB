import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.api';
import { AuthService } from '../../../auth/services/auth.service';
import { PersInformation } from '../../dumb_components/pers-information/pers-information';
import { EmergInformation } from '../../dumb_components/emerg-information/emerg-information';
import { EditProfileForm } from '../../dumb_components/edit-profile-form/edit-profile-form';
import { LoadingSpinner } from '../../../../components/loading-spinner/loading-spinner';
import { Button } from '../../../../components/button/button';
import { Card } from '../../../../components/card/card';
import { User } from '../../user.types';

@Component({
  selector: 'app-user-detail-container',
  imports: [
    PersInformation,
    EmergInformation,
    EditProfileForm,
    LoadingSpinner,
    Button,
    Card,
    RouterLink,
  ],
  template: `
    <div class="navigation-bar">
      <a [routerLink]="tourId() ? ['/tour-management', tourId()] : '/tour-management'" class="back-link">
        <span class="material-icons" aria-hidden="true">arrow_back</span>
        {{ tourId() ? 'Zurück zur Tour' : 'Zurück zur Übersicht' }}
      </a>
    </div>

    @if (errorMessage()) {
      <div class="error-banner" role="alert">{{ errorMessage() }}</div>
    }
    @if (successMessage()) {
      <div class="success-banner" role="status">{{ successMessage() }}</div>
    }

    @if (userResource.isLoading()) {
      <app-loading-spinner label="Personendaten werden geladen..." />
    } @else if (userResource.error()) {
      <div class="error-banner" role="alert">
        Die Person konnte nicht geladen werden. Bitte versuche es später nochmals.
      </div>
    } @else if (userResource.value(); as selectedUser) {
      <header class="page-header">
        <div class="header-row">
          <div>
            <span class="eyebrow">
              {{ isOwnProfile() ? 'Mein Profil' : 'Personendetails & Sicherheitsdaten' }}
            </span>
            <h2>{{ selectedUser.firstName }} {{ selectedUser.lastName }}</h2>
          </div>

          @if (isOwnProfile() && !isEditing()) {
            <app-button
              text="Profil bearbeiten"
              variant="secondary"
              ariaLabel="Profil und Notfallkontakt bearbeiten"
              (clicked)="startEditing()"
            />
          }
        </div>
      </header>

      @if (isEditing()) {
        <app-card title="Notfallkontakt & Profil bearbeiten">
          <app-edit-profile-form
            [user]="selectedUser"
            [isSubmitting]="isSubmitting()"
            (onSave)="saveProfile($event)"
            (onCancel)="isEditing.set(false)"
          />
        </app-card>
      } @else {
        <div class="detail-grid">
          <app-pers-information [person]="selectedUser" />
          <app-emerg-information [person]="selectedUser" />
        </div>
      }
    } @else {
      <div class="empty-state">
        <p>Diese Person wurde nicht im System gefunden.</p>
        <app-button
          text="Zurück zur Tourenübersicht"
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

    .navigation-bar {
      margin-bottom: 1rem;
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

    .page-header {
      margin-bottom: 1.5rem;
    }

    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
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

    .detail-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1.25rem;
      align-items: stretch;
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

    .success-banner {
      margin-bottom: 1rem;
      padding: 0.75rem 1rem;
      border-radius: var(--radius-md);
      color: var(--color-success-text);
      background-color: var(--color-success-bg);
      border: 1px solid var(--color-success-border);
      font-size: 0.875rem;
    }

    .empty-state {
      padding: 3rem 1rem;
      text-align: center;
      border-radius: var(--radius-lg);
      background: var(--color-bg-surface);
      border: 1px solid var(--color-border-default);
    }

    @media (max-width: 700px) {
      .detail-grid {
        grid-template-columns: 1fr;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailContainer {
  readonly userId = input.required<string>();
  readonly tourId = input<string | null>(null);

  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);

  readonly isEditing = signal(false);
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);

  readonly isOwnProfile = computed(
    () => this.authService.currentUser()?.id === this.userId(),
  );

  readonly userResource = this.userService.getUserByIdResource(
    computed(() => this.userId()),
    computed(() => this.tourId()),
  );

  navigateToOverview(): void {
    this.router.navigate(['/tour-management']);
  }

  startEditing(): void {
    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.isEditing.set(true);
  }

  saveProfile(data: Partial<User>): void {
    if (this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.userService.updateUser(this.userId(), data).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.isEditing.set(false);
        this.successMessage.set(
          'Profil und Notfallkontakt wurden erfolgreich aktualisiert.',
        );
        this.userResource.reload();

        const cur = this.authService.currentUser();
        if (cur && (data.firstName || data.lastName)) {
          const updatedAuthUser = {
            ...cur,
            firstName: data.firstName ?? cur.firstName,
            lastName: data.lastName ?? cur.lastName,
          };
          localStorage.setItem(
            'hslu_weblab_auth_user',
            JSON.stringify(updatedAuthUser),
          );
          this.authService.currentUser.set(updatedAuthUser);
        }
      },
      error: () => {
        this.isSubmitting.set(false);
        this.errorMessage.set(
          'Die Änderungen konnten nicht gespeichert werden. Bitte versuchen Sie es später erneut.',
        );
      },
    });
  }
}
