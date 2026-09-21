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
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 500;
      line-height: 1.2;

      &.primary {
        color: #fff;
        background: #4f46a5;
      }

      &.secondary {
        color: #383273;
        background: #dedaf4;
      }

      &.light {
        color: #4e4c56;
        background: #e8e7ec;
      }

      &.danger {
        color: #fff;
        background: #b3261e;
      }

      &.success {
        color: #1b5e20;
        background: #d4edda;
      }
    }
  `,
})
export class Badge {
  readonly text = input.required<string>();
  readonly color = input<BadgeColor>('primary');
}
