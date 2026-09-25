import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Card } from '../../../../components/card/card';
import { InfoItem } from '../../../../components/info-item/info-item';
import { User } from '../../user.types';

@Component({
  selector: 'app-emerg-information',
  imports: [Card, InfoItem],
  template: `
    <app-card title="Notfallkontakt">
      @if (hasEmergencyContact()) {
        <dl class="info-list">
          <app-info-item
            icon="person"
            title="Kontaktperson"
            [description]="contactName()"
          />
          @if (person().emergencyContact?.phoneNumber) {
            <app-info-item
              icon="phone_in_talk"
              title="Telefonnummer"
              [description]="person().emergencyContact!.phoneNumber"
            />
          }
          @if (person().emergencyContact?.relationship) {
            <app-info-item
              icon="family_restroom"
              title="Beziehung / Rolle"
              [description]="person().emergencyContact!.relationship"
            />
          }
        </dl>
      } @else {
        <p class="empty-note">
          Keine Notfallkontakt-Informationen verfügbar oder keine Berechtigung zur Einsicht.
        </p>
      }
    </app-card>
  `,
  styles: `
    .info-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1.25rem;
      margin: 0;
    }

    .empty-note {
      color: var(--color-text-muted);
      font-size: 0.875rem;
      margin: 0;
      line-height: 1.5;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmergInformation {
  readonly person = input.required<User>();

  readonly hasEmergencyContact = computed(() => {
    const contact = this.person().emergencyContact;
    if (!contact) return false;
    return !!(
      contact.firstName ||
      contact.lastName ||
      contact.phoneNumber ||
      contact.relationship
    );
  });

  readonly contactName = computed(() => {
    const contact = this.person().emergencyContact;
    if (!contact) return '–';
    const name = `${contact.firstName ?? ''} ${contact.lastName ?? ''}`.trim();
    return name || '–';
  });
}
