import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { UserService } from '../../services/user.api';
import { AuthService } from '../../../auth/services/auth.service';
import { PersInformation } from '../../dumb_components/pers-information/pers-information';
import { EmergInformation } from '../../dumb_components/emerg-information/emerg-information';
import { EditProfileForm } from '../../dumb_components/edit-profile-form/edit-profile-form';
import { Card } from '../../../../components/card/card';
import { User } from '../../user.types';

@Component({
  selector: 'app-user-detail-container',
  imports: [PersInformation, EmergInformation, EditProfileForm, Card],
  template: `
    @if (errorMessage()) {
      <p class="error-banner" role="alert">{{ errorMessage() }}</p>
    }
    @if (successMessage()) {
      <p class="success-banner" role="status">{{ successMessage() }}</p>
    }

    @if (userResource.isLoading()) {
      <p>Person wird geladen ...</p>
    } @else if (userResource.error()) {
      <p class="error-banner">Die Person konnte nicht geladen werden.</p>
    } @else if (userResource.value(); as selectedUser) {
      <header class="page-header">
        <div class="header-row">
          <div>
            <span class="eyebrow">
              {{ isOwnProfile() ? 'Mein Profil' : 'Personendetails' }}
            </span>
            <h1>{{ selectedUser.firstName }} {{ selectedUser.lastName }}</h1>
          </div>

          @if (isOwnProfile() && !isEditing()) {
            <button
              type="button"
              class="edit-button"
              (click)="startEditing()"
              title="Profil & Notfallkontakt bearbeiten"
              aria-label="Profil & Notfallkontakt bearbeiten"
            >
              <span class="material-icons" aria-hidden="true">edit</span>
              <span>Bearbeiten</span>
            </button>
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
      <p>Diese Person wurde nicht gefunden.</p>
    }
  `,
  styles: `
    :host {
      display: block;
    }

    .page-header {
      margin-bottom: 1.5rem;
    }

    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
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

    h1 {
      margin: 0;
      color: #25252d;
      font-size: clamp(1.6rem, 4vw, 2.25rem);
      font-weight: 500;
    }

    .edit-button {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.6rem 1rem;
      border: 1px solid #c8c6d0;
      border-radius: 8px;
      background: #fff;
      color: #4f46a5;
      font-weight: 500;
      font-size: 0.9rem;
      cursor: pointer;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      transition:
        background-color 0.15s ease,
        border-color 0.15s ease,
        box-shadow 0.15s ease;
    }

    .edit-button:hover {
      background: #f4f3ff;
      border-color: #4f46a5;
      box-shadow: 0 2px 6px rgb(79 70 165 / 15%);
    }

    .edit-button .material-icons {
      font-size: 1.2rem;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1rem;
      align-items: stretch;
    }

    app-pers-information,
    app-emerg-information {
      display: grid;
    }

    .error-banner {
      margin-bottom: 1rem;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      color: #991b1b;
      background-color: #fee2e2;
      border: 1px solid #f87171;
    }

    .success-banner {
      margin-bottom: 1rem;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      color: #166534;
      background-color: #dcfce7;
      border: 1px solid #86efac;
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
