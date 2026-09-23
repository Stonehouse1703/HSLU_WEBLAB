import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { LoadingSpinner } from './loading-spinner';

describe('LoadingSpinner', () => {
  let fixture: ComponentFixture<LoadingSpinner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingSpinner],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingSpinner);
  });

  it('should expose default loading label and role="status"', () => {
    fixture.detectChanges();

    const statusEl = fixture.nativeElement.querySelector('[role="status"]');
    expect(statusEl).toBeTruthy();
    expect(statusEl.textContent).toContain('Wird geladen...');
  });

  it('should expose a custom accessible loading status', () => {
    fixture.componentRef.setInput('label', 'Touren werden geladen...');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="status"]').textContent).toContain(
      'Touren werden geladen...',
    );
  });
});
