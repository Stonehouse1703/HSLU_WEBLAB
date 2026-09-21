import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { User } from '../../user.types';
import { Card } from '../../../../components/card/card';
import { InfoItem } from '../../../../components/info-item/info-item';

@Component({
  selector: 'app-pers-information',
  imports: [Card, InfoItem, DatePipe],
  template: `
    <app-card title="Persönliche Angaben">
      <dl class="info-list">
        <app-info-item icon="cake" title="Geburtsdatum" [description]="(person().birthday | date: 'dd.MM.yyyy') ?? ''" />
        <app-info-item icon="phone" title="Telefonnummer" [description]="person().phoneNumber" />
      </dl>
    </app-card>
  `,
  styles: `
    .info-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1.25rem;
      margin: 0;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersInformation {
  readonly person = input.required<User>();
}
