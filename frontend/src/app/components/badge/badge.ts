import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { BadgeColor } from './badge.type';

@Component({
  selector: 'app-badge',
  imports: [NgClass],
  template: `
    <div class="badge" [ngClass]="color()">
      {{ text() }}
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .badge {
      display: inline-block;
      width: fit-content;
      padding: 0.25rem 0.625rem;
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 500;
      line-height: 1.2;

      &.primary {
        color: var(--color-text-inverse);
        background: var(--color-primary);
      }

      &.secondary {
        color: var(--color-primary-hover);
        background: var(--color-primary-muted);
      }

      &.light {
        color: var(--color-text-muted);
        background: var(--color-border-subtle);
      }

      &.danger {
        color: var(--color-text-inverse);
        background: var(--color-danger);
      }

      &.success {
        color: var(--color-success-text);
        background: var(--color-success-bg);
      }
    }
  `,
})
export class Badge {
  readonly text = input.required<string>();
  readonly color = input<BadgeColor>('primary');
}
