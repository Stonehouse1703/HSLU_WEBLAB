import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-info-item',
  imports: [],
  template: `
  <div class="info-item">
    <dt>
      <span class="material-icons" aria-hidden="true">{{ icon() }}</span>
      {{ title() }}
    </dt>
    <dd>{{ description() }}</dd>
  </div>
  `,
  styles: `
    dt {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--color-text-muted);
      font-size: 0.875rem;
      white-space: nowrap;
    }

    dd {
      margin: 0;
      font-weight: 500;
      color: var(--color-text-main);
      overflow-wrap: anywhere;
    }

    .material-icons {
      width: 1.25rem;
      height: 1.25rem;
      color: var(--color-primary);
      font-size: 1.25rem;
    }

    .info-item {
      display: grid;
      gap: 0.35rem;
      min-width: 0;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoItem {
  readonly icon = input.required<string>();
  readonly title = input.required<string>();
  readonly description = input.required<string>();
}
