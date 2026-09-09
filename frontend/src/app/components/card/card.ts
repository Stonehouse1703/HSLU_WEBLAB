import {ChangeDetectionStrategy, Component, input} from '@angular/core';

@Component({
  selector: 'app-card',
  template: `
    <h3>{{ title() }}</h3>
    <ng-content/>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: `
    :host {
      display: block;
      padding: 1.5rem;
      border: 1px solid #e2e1e8;
      border-radius: 12px;
      background: #fff;
      box-shadow: 0 2px 8px rgb(30 25 60 / 6%);
    }

    h3 {
      padding-bottom: .75rem;
      border-bottom: 1px solid #e2e1e8;
      color: #4f46a5;
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
