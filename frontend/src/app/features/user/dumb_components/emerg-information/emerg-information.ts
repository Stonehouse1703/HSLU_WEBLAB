import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Card } from '../../../../components/card/card';
import { InfoItem } from '../../../../components/info-item/info-item';
import { User } from '../../user.types';

@Component({
  selector: 'app-emerg-information',
  imports: [Card, InfoItem],
  template: `
  <app-card title="Notfallkontakt">
    <dl class="info-list">
      <app-info-item
        icon="person"
        title="Name"
        [description]="person().emergencyContact.firstName + ' ' + person().emergencyContact.lastName"
      />
      <app-info-item icon="phone_in_talk" title="Telefonnummer" [description]="person().emergencyContact.phoneNumber" />
      <app-info-item icon="family_restroom" title="Beziehung" [description]="person().emergencyContact.relationship" />
    </dl>
  </app-card>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmergInformation {
  readonly person = input.required<User>();
}
