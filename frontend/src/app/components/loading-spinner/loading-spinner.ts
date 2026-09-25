import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  imports: [],
  template: `
    <div class="loading-state" role="status" aria-live="polite">
      <span class="spinner" aria-hidden="true"></span>
      <span>{{ label() }}</span>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .loading-state {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      min-height: 5rem;
      color: var(--color-primary);
      font-size: 0.95rem;
      font-weight: 500;
    }

    .spinner {
      width: 1.75rem;
      height: 1.75rem;
      border: 3px solid var(--color-primary-muted);
      border-top-color: var(--color-primary);
      border-radius: var(--radius-full);
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `,
})
export class LoadingSpinner {
  readonly label = input('Wird geladen...');
}
