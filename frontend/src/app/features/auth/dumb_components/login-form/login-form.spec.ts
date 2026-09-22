import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LoginForm } from './login-form';

describe('LoginForm', () => {
  let component: LoginForm;
  let fixture: ComponentFixture<LoginForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginForm],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize with an invalid empty form', () => {
    expect(component.loginForm.valid).toBe(false);
    expect(component.loginForm.get('email')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
    expect(component.submitted()).toBe(false);
  });

  it('should validate email format and required', () => {
    const emailControl = component.loginForm.get('email');
    expect(emailControl?.hasError('required')).toBe(true);

    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBe(true);

    emailControl?.setValue('valid@example.ch');
    expect(emailControl?.valid).toBe(true);
  });

  it('should validate password required', () => {
    const passwordControl = component.loginForm.get('password');
    expect(passwordControl?.hasError('required')).toBe(true);

    passwordControl?.setValue('secret123');
    expect(passwordControl?.valid).toBe(true);
  });

  it('should mark form as submitted and touched on invalid submit, but not emit', () => {
    const submitSpy = vi.fn();
    component.onFormSubmit.subscribe(submitSpy);

    component.submitForm();
    fixture.detectChanges();

    expect(component.submitted()).toBe(true);
    expect(component.loginForm.get('email')?.touched).toBe(true);
    expect(component.loginForm.get('password')?.touched).toBe(true);
    expect(component.isInvalid('email')).toBe(true);
    expect(component.isInvalid('password')).toBe(true);
    expect(submitSpy).not.toHaveBeenCalled();
  });

  it('should emit trimmed credentials on valid submission', () => {
    const submitSpy = vi.fn();
    component.onFormSubmit.subscribe(submitSpy);

    component.loginForm.setValue({
      email: 'colin@muster.ch',
      password: 'mypassword',
    });

    component.submitForm();

    expect(submitSpy).toHaveBeenCalledWith({
      email: 'colin@muster.ch',
      password: 'mypassword',
    });
  });

  it('should not submit if isSubmitting input is true', () => {
    const submitSpy = vi.fn();
    component.onFormSubmit.subscribe(submitSpy);

    fixture.componentRef.setInput('isSubmitting', true);
    fixture.detectChanges();

    component.loginForm.setValue({
      email: 'colin@muster.ch',
      password: 'mypassword',
    });

    component.submitForm();

    expect(submitSpy).not.toHaveBeenCalled();
  });
});
