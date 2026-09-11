import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { User } from '../../user.types';
import { Card } from '../../../../components/card/card';
import { InfoItem } from '../../../../components/info-item/info-item';


@Component({
  selector: 'app-pers-information',
  imports: [
    Card, InfoItem],
  template: `
    <app-card title="Persönliche Informationen">
          <dl class="info-list">
            <app-info-item icon="cake" title="Geburtsdatum" [describtion]="person().birthday" />
            <app-info-item icon="phone" title="Telefonnummer" [describtion]="person().phoneNumber" />
          </dl>
        </app-card>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersInformation {
  readonly person = input.required<User>();
}
