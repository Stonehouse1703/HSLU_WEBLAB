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
  imports: [TourPreview, RouterLink, Button, LoadingSpinner],
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
      color: #25252d;
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
      border: 1px solid #c8c6d0;
      border-radius: 12px;
      background: #fdfcff;
      box-shadow: 0 2px 8px rgba(79, 70, 165, 0.08);
    }

    .join-panel-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #4f46a5;
      margin-bottom: 0.35rem;
      font-size: 1.05rem;
    }

    .join-panel-header .material-icons {
      font-size: 1.25rem;
    }

    .join-description {
      margin: 0 0 0.85rem 0;
      color: #65636d;
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
      border: 1px solid #c8c6d0;
      border-radius: 8px;
      font: inherit;
      font-size: 0.9rem;
      outline: none;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }

    .join-input:focus {
      border-color: #4f46a5;
      box-shadow: 0 0 0 3px rgba(79, 70, 165, 0.15);
    }

    .join-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .join-status {
      margin: 0.65rem 0 0 0;
      color: #4f46a5;
      font-size: 0.875rem;
    }

    .join-error {
      margin: 0.65rem 0 0 0;
      color: #b3261e;
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
      border-radius: 12px;
      background: #fff;
      border: 1px solid #e2e1e8;
    }

    .state-message.error {
      color: #b3261e;
      border-color: #f87171;
      background: #fff5f5;
    }

    .state-message.empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      color: #65636d;
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
