import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-input-field-error',
  imports: [JsonPipe],
  template: `
    @if (showRawError()) {
      <pre>{{ formField()?.errors | json }}</pre>
    }

    @if (formField()?.errors && (formField()?.touched || submitted())) {
      @if (formField()?.errors?.['required']) {
        <div class="error">Dieses Feld ist erforderlich.</div>
      }
      @if (formField()?.errors?.['minlength']; as minLen) {
        <div class="error">Mindestens {{ minLen.requiredLength }} Zeichen erforderlich.</div>
      }
      @if (formField()?.errors?.['email']) {
        <div class="error">Bitte eine gültige E-Mail-Adresse eingeben.</div>
      }
      @if (formField()?.errors?.['min']; as minVal) {
        <div class="error">Der Wert muss mindestens {{ minVal.min }} sein.</div>
      }
      @if (formField()?.errors?.['pastDate']) {
        <div class="error">Das Datum darf nicht in der Vergangenheit liegen.</div>
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .error {
      color: #b3261e;
      font-size: 0.8rem;
      margin-top: 0.25rem;
    }

    pre {
      margin: 0.25rem 0 0;
      color: #65636d;
      font-size: 0.75rem;
    }
  `,
})
export class InputFieldError {
  readonly showRawError = input(false);
  readonly submitted = input(false);
  readonly formField = input<AbstractControl | null | undefined>();
}
