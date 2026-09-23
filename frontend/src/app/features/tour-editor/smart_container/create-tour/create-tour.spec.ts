import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CreateTour } from './create-tour';
import { TourService, CreateTourInput } from '../../../tour-management/services/tour.api';
import { AuthService } from '../../../auth/services/auth.service';
import { TourForm } from '../../dumb_components/tour-form/tour-form';
import { Tour } from '../../../tour-management/tour.types';

describe('CreateTour', () => {
  let component: CreateTour;
  let fixture: ComponentFixture<CreateTour>;
  let router: Router;
  let navigateSpy: ReturnType<typeof vi.spyOn>;

  const mockTourInput: CreateTourInput = {
    name: 'Skitour Pazolastock',
    date: '2026-12-24',
    time: '08:00',
    location: 'Oberalp',
    difficulty: 'mittel',
    altitude: '1100m',
  };

  const mockExistingTour: Tour = {
    id: 'tour-99',
    name: 'Skitour Pazolastock',
    date: '2026-12-24',
    time: '08:00',
    location: 'Oberalp',
    difficulty: 'mittel',
    altitude: '1100m',
    tourManagerIds: ['usr-1'],
    participantIds: [],
  };

  const createTourSpy = vi.fn();
  const updateTourSpy = vi.fn();
  const tourResourceValue = signal<Tour | undefined>(undefined);
  const tourResourceLoading = signal<boolean>(false);
  const tourResourceError = signal<any>(undefined);

  const mockTourService = {
    getTourByIdResource: () => ({
      value: tourResourceValue,
      isLoading: tourResourceLoading,
      error: tourResourceError,
    }),
    createTour: createTourSpy,
    updateTour: updateTourSpy,
  };

  const currentUserSignal = signal<{ id: string } | null>({ id: 'usr-1' });
  const mockAuthService = {
    currentUser: currentUserSignal,
  };

  beforeEach(async () => {
    createTourSpy.mockReset();
    updateTourSpy.mockReset();
    tourResourceValue.set(undefined);
    tourResourceLoading.set(false);
    tourResourceError.set(undefined);
    currentUserSignal.set({ id: 'usr-1' });

    await TestBed.configureTestingModule({
      imports: [CreateTour],
      providers: [
        provideRouter([]),
        { provide: TourService, useValue: mockTourService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture = TestBed.createComponent(CreateTour);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set default cardTitle to Tourenplanung and submit button text to Tour erstellen', () => {
    expect(component.cardTitle()).toBe('Tourenplanung');
    expect(component.submitButtonText()).toBe('Tour erstellen');
  });

  it('should delegate tour creation to TourService and navigate to /tour-management on submit', () => {
    createTourSpy.mockReturnValue(of(mockExistingTour));

    const tourFormDebug = fixture.debugElement.query(By.directive(TourForm));
    tourFormDebug.componentInstance.onFormSubmit.emit(mockTourInput);

    expect(createTourSpy).toHaveBeenCalledWith(mockTourInput);
    expect(navigateSpy).toHaveBeenCalledWith(['/tour-management']);
  });

  it('should delegate tour update when tourId is set and navigate to tour detail', () => {
    updateTourSpy.mockReturnValue(of(mockExistingTour));
    tourResourceValue.set(mockExistingTour);
    fixture.componentRef.setInput('tourId', 'tour-99');
    fixture.detectChanges();

    expect(component.cardTitle()).toBe('Tour bearbeiten');
    expect(component.submitButtonText()).toBe('Änderungen speichern');

    const tourFormDebug = fixture.debugElement.query(By.directive(TourForm));
    tourFormDebug.componentInstance.onFormSubmit.emit(mockTourInput);

    expect(updateTourSpy).toHaveBeenCalledWith('tour-99', mockTourInput);
    expect(navigateSpy).toHaveBeenCalledWith(['/tour-management', 'tour-99']);
  });

  it('should navigate back on cancelEdit', () => {
    component.cancelEdit();
    expect(navigateSpy).toHaveBeenCalledWith(['/tour-management']);

    fixture.componentRef.setInput('tourId', 'tour-99');
    fixture.detectChanges();
    component.cancelEdit();
    expect(navigateSpy).toHaveBeenCalledWith(['/tour-management', 'tour-99']);
  });
});
