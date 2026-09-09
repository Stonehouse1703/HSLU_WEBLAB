import {ChangeDetectionStrategy, Component, input, output} from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';
export type ButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'app-button',
  template: `
    <button
      [type]="type()"
      [class]="variant()"
      [disabled]="disabled()"
      [attr.aria-label]="ariaLabel()"
      (click)="clicked.emit()"
    >
      {{ text() }}
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: `
    :host {
      display: inline-block;
      width: fit-content;
    }

    button {
      width: fit-content;
      padding: .65rem 1rem;
      border: 0;
      border-radius: 8px;
      font: inherit;
      cursor: pointer;
    }

    .primary {
      color: #fff;
      background: #4f46a5;
    }

    .secondary {
      border: 1px solid #c8c6d0;
      color: #65636d;
      background: #fff;
    }

    .secondary:hover {
      background: #f6f6fa;
    }

    .danger {
      color: #fff;
      background: #b3261e;
    }

    button:focus-visible {
      outline: 3px solid rgb(79 70 165 / 25%);
      outline-offset: 2px;
    }

    button:disabled {
      color: #777680;
      background: #e1e0e7;
      cursor: not-allowed;
    }
  `
})
export class Button {
  readonly text = input.required<string>();
  readonly variant = input.required<ButtonVariant>();
  readonly type = input<ButtonType>('button');
  readonly disabled = input(false);
  readonly ariaLabel = input<string>();

  readonly clicked = output<void>();
}
