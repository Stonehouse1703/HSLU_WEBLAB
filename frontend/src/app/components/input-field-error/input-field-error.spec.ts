import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';
import { describe, it, expect, beforeEach } from 'vitest';
import { InputFieldError } from './input-field-error';

describe('InputFieldError', () => {
  let fixture: ComponentFixture<InputFieldError>;
  let component: InputFieldError;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputFieldError],
    }).compileComponents();

    fixture = TestBed.createComponent(InputFieldError);
    component = fixture.componentInstance;
  });

  it('should not display errors when field is untouched and unsubmitted', () => {
    const control = new FormControl('', [Validators.required]);
    fixture.componentRef.setInput('formField', control);
    fixture.componentRef.setInput('submitted', false);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.error')).toBeNull();
  });

  it('should display required error when touched or submitted', () => {
    const control = new FormControl('', [Validators.required]);
    control.markAsTouched();
    fixture.componentRef.setInput('formField', control);
    fixture.componentRef.setInput('submitted', true);
    fixture.detectChanges();

    const errorEl = fixture.nativeElement.querySelector('.error');
    expect(errorEl).not.toBeNull();
    expect(errorEl.textContent).toContain('Dieses Feld ist erforderlich.');
  });

  it('should display email error for invalid email', () => {
    const control = new FormControl('not-an-email', [Validators.email]);
    control.markAsTouched();
    fixture.componentRef.setInput('formField', control);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.error').textContent).toContain(
      'Bitte eine gültige E-Mail-Adresse eingeben.',
    );
  });

  it('should display pastDate error for past dates', () => {
    const control = new FormControl('2020-01-01');
    control.setErrors({ pastDate: true });
    control.markAsTouched();
    fixture.componentRef.setInput('formField', control);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.error').textContent).toContain(
      'Das Datum darf nicht in der Vergangenheit liegen.',
    );
  });
});
