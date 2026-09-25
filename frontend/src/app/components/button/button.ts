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
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: inline-block;
      width: fit-content;
    }

    button {
      width: fit-content;
      min-height: 2.5rem;
      padding: 0.65rem 1rem;
      border: 0;
      border-radius: var(--radius-md);
      font: inherit;
      font-weight: 500;
      cursor: pointer;
      touch-action: manipulation;
      transition: background-color var(--transition-fast), border-color var(--transition-fast), opacity var(--transition-fast);
    }

    .primary {
      color: var(--color-text-inverse);
      background: var(--color-primary);
    }

    .primary:hover:not(:disabled) {
      background: var(--color-primary-hover);
    }

    .secondary {
      border: 1px solid var(--color-border-input);
      color: var(--color-text-muted);
      background: var(--color-bg-surface);
    }

    .secondary:hover:not(:disabled) {
      background: var(--color-bg-app);
      border-color: var(--color-primary);
      color: var(--color-primary);
    }

    .danger {
      color: var(--color-text-inverse);
      background: var(--color-danger);
    }

    .danger:hover:not(:disabled) {
      background: var(--color-danger-hover);
    }

    button:focus-visible {
      outline: 3px solid var(--color-primary-focus);
      outline-offset: 2px;
    }

    button:disabled {
      color: var(--color-text-disabled);
      background: var(--color-border-default);
      cursor: not-allowed;
      opacity: 0.7;
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
