import {ChangeDetectionStrategy, Component, input} from '@angular/core';

@Component({
  selector: 'app-card',
  template: `
    <h3>{{ title() }}</h3>
    <ng-content/>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: block;
      padding: 1.5rem;
      border: 1px solid var(--color-border-default);
      border-radius: var(--radius-lg);
      background: var(--color-bg-surface);
      box-shadow: var(--shadow-card);
    }

    h3 {
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--color-border-default);
      color: var(--color-primary);
    }

    @media (max-width: 600px) {
      :host {
        padding: 1rem;
      }
    }
  `
})
export class Card {
  readonly title = input.required<string>();
}
