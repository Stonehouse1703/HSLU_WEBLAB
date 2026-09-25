import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { TourService } from '../../services/tour.api';
import { TourPreview } from '../../dumb_components/tour-preview/tour-preview';
import { Button } from '../../../../components/button/button';
import { LoadingSpinner } from '../../../../components/loading-spinner/loading-spinner';
import { getTodayDateString, isTourUpcoming } from '../../tour.types';

@Component({
  selector: 'app-tour-list',
  imports: [TourPreview, Button, LoadingSpinner],
  template: `
    <div class="list-header">
      <h2>Deine bevorstehenden Touren</h2>

      <div class="header-actions">
        <app-button
          text="Tour erstellen"
          variant="primary"
          (clicked)="navigateToCreateTour()"
        />
        <app-button
          text="Per Link beitreten"
          variant="secondary"
          (clicked)="toggleJoinInput()"
        />
      </div>
    </div>

    @if (showJoinInput()) {
      <div class="join-panel">
        <div class="join-panel-header">
          <span class="material-icons" aria-hidden="true">link</span>
          <strong>Tour per Link oder ID beitreten</strong>
        </div>
        <p class="join-description">
          Füge hier den Einladungslink oder die Tour-ID ein, um der Tour direkt beizutreten.
        </p>
        <div class="join-form">
          <input
            type="text"
            class="join-input"
            placeholder="z.B. http://.../tour-management/[id] oder [id]"
            [value]="linkInput()"
            (input)="onInputChange($event)"
            (keydown.enter)="joinByLink()"
            aria-label="Tour-Link oder Tour-ID"
          />
          <div class="join-buttons">
            <app-button
              text="Beitreten"
              variant="primary"
              [disabled]="isJoining() || !linkInput().trim()"
              (clicked)="joinByLink()"
            />
            <app-button
              text="Abbrechen"
              variant="secondary"
              [disabled]="isJoining()"
              (clicked)="cancelJoin()"
            />
          </div>
        </div>

        @if (isJoining()) {
          <p class="join-status" role="status">Tour wird beigetreten ...</p>
        }
        @if (joinError()) {
          <p class="join-error" role="alert">{{ joinError() }}</p>
        }
      </div>
    }

    @if (toursResource.isLoading()) {
      <app-loading-spinner label="Touren werden geladen..." />
    } @else if (toursResource.error()) {
      <div class="state-message error" role="alert">
        <p>Die Touren konnten leider nicht geladen werden. Bitte versuche es später nochmals.</p>
      </div>
    } @else if (upcomingTours().length === 0) {
      <div class="state-message empty">
        <p>Keine bevorstehenden Touren vorhanden.</p>
        <app-button
          text="Erste Tour erstellen"
          variant="primary"
          (clicked)="navigateToCreateTour()"
        />
      </div>
    } @else {
      <div class="tour-list">
        @for (tour of upcomingTours(); track tour.id) {
          <app-tour-preview [tour]="tour" />
        }
      </div>
    }
  `,
  styles: `
    :host {
      display: block;
    }

    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .list-header h2 {
      margin: 0;
      color: var(--color-text-main);
      font-size: clamp(1.4rem, 3.5vw, 1.85rem);
      font-weight: 500;
    }

    .list-header a {
      text-decoration: none;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .join-panel {
      margin-bottom: 1.5rem;
      padding: 1.25rem;
      border: 1px solid var(--color-border-input);
      border-radius: var(--radius-lg);
      background: var(--color-bg-surface-subtle);
      box-shadow: var(--shadow-card);
    }

    .join-panel-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--color-primary);
      margin-bottom: 0.35rem;
      font-size: 1.05rem;
    }

    .join-panel-header .material-icons {
      font-size: 1.25rem;
    }

    .join-description {
      margin: 0 0 0.85rem 0;
      color: var(--color-text-muted);
      font-size: 0.875rem;
    }

    .join-form {
      display: flex;
      gap: 0.75rem;
      align-items: center;
      flex-wrap: wrap;
    }

    .join-input {
      flex: 1;
      min-width: 260px;
      padding: 0.65rem 0.85rem;
      border: 1px solid var(--color-border-input);
      border-radius: var(--radius-md);
      font: inherit;
      font-size: 0.9rem;
      outline: none;
      transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
    }

    .join-input:focus {
      border-color: var(--color-primary);
      box-shadow: var(--shadow-focus);
    }

    .join-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .join-status {
      margin: 0.65rem 0 0 0;
      color: var(--color-primary);
      font-size: 0.875rem;
    }

    .join-error {
      margin: 0.65rem 0 0 0;
      color: var(--color-danger);
      font-size: 0.875rem;
      font-weight: 500;
    }

    .tour-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .state-message {
      padding: 2.5rem 1.5rem;
      text-align: center;
      border-radius: var(--radius-lg);
      background: var(--color-bg-surface);
      border: 1px solid var(--color-border-default);
    }

    .state-message.error {
      color: var(--color-danger);
      border-color: var(--color-danger-border);
      background: var(--color-danger-bg-subtle);
    }

    .state-message.empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      color: var(--color-text-muted);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TourList {
  private readonly tourService = inject(TourService);
  private readonly router = inject(Router);

  readonly toursResource = this.tourService.getMyTours();

  readonly upcomingTours = computed(() => {
    const tours = this.toursResource.value() ?? [];
    const today = getTodayDateString();
    return tours
      .filter(tour => isTourUpcoming(tour.date, today))
      .sort((a, b) => {
        const dateA = a.date || '';
        const dateB = b.date || '';
        if (dateA !== dateB) {
          return dateA.localeCompare(dateB);
        }
        const timeA = a.time || '';
        const timeB = b.time || '';
        return timeA.localeCompare(timeB);
      });
  });

  readonly showJoinInput = signal(false);
  readonly linkInput = signal('');
  readonly isJoining = signal(false);
  readonly joinError = signal<string | null>(null);

  navigateToCreateTour(): void {
    this.router.navigate(['/tour-editor']);
  }

  toggleJoinInput(): void {
    this.showJoinInput.update(prev => !prev);
    this.joinError.set(null);
    if (!this.showJoinInput()) {
      this.linkInput.set('');
    }
  }

  cancelJoin(): void {
    this.showJoinInput.set(false);
    this.linkInput.set('');
    this.joinError.set(null);
  }

  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.linkInput.set(input.value);
    if (this.joinError()) {
      this.joinError.set(null);
    }
  }

  extractTourId(raw: string): string | null {
    const trimmed = raw.trim();
    if (!trimmed) return null;

    const clean = trimmed.split('?')[0].split('#')[0].replace(/\/+$/, '');

    const match = clean.match(/tour-management\/([a-zA-Z0-9_-]+)/i);
    if (match && match[1]) {
      return match[1];
    }

    if (clean.includes('://')) {
      try {
        const url = new URL(clean);
        const parts = url.pathname.split('/').filter(Boolean);
        if (parts.length > 0) {
          const last = parts[parts.length - 1];
          if (/^[a-zA-Z0-9_-]+$/.test(last)) {
            return last;
          }
        }
      } catch {
        // ignore parse error
      }
    }

    if (/^[a-zA-Z0-9_-]+$/.test(clean)) {
      return clean;
    }

    return null;
  }

  async joinByLink(): Promise<void> {
    const input = this.linkInput().trim();
    if (!input || this.isJoining()) return;

    const tourId = this.extractTourId(input);
    if (!tourId) {
      this.joinError.set('Bitte gib einen gültigen Tour-Link oder eine gültige Tour-ID ein.');
      return;
    }

    this.isJoining.set(true);
    this.joinError.set(null);

    try {
      await firstValueFrom(this.tourService.joinTour(tourId));
      this.toursResource.reload();
      this.showJoinInput.set(false);
      this.linkInput.set('');
      this.router.navigate(['/tour-management', tourId]);
    } catch (err: any) {
      if (err?.status === 404) {
        this.joinError.set('Tour wurde nicht gefunden. Bitte überprüfe den Link oder die ID.');
      } else if (err?.status === 401) {
        this.joinError.set('Bitte melde dich zuerst an.');
      } else if (err?.status === 400 && err?.error?.message) {
        this.joinError.set(err.error.message);
      } else {
        this.joinError.set('Der Tour konnte nicht beigetreten werden.');
      }
    } finally {
      this.isJoining.set(false);
    }
  }
}
