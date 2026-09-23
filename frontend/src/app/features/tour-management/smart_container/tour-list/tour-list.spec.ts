import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TourList } from './tour-list';
import { TourService } from '../../services/tour.api';
import { Tour } from '../../tour.types';

describe('TourList', () => {
  let component: TourList;
  let fixture: ComponentFixture<TourList>;
  let router: Router;
  let navigateSpy: ReturnType<typeof vi.spyOn>;

  const mockTour: Tour = {
    id: 'tour-123',
    name: 'Pazolastock',
    date: '2099-12-31',
    time: '08:00',
    location: 'Oberalp',
    difficulty: 'mittel',
    altitude: '1100m',
    tourManagerIds: ['mgr-1'],
    participantIds: [],
  };

  const toursSignal = signal<Tour[]>([]);
  const loadingSignal = signal<boolean>(false);
  const errorSignal = signal<any>(undefined);
  const reloadSpy = vi.fn();
  const joinTourSpy = vi.fn();

  const mockTourService = {
    getMyTours: () => ({
      value: toursSignal,
      isLoading: loadingSignal,
      error: errorSignal,
      reload: reloadSpy,
    }),
    joinTour: joinTourSpy,
  };

  beforeEach(async () => {
    toursSignal.set([mockTour]);
    loadingSignal.set(false);
    errorSignal.set(undefined);
    joinTourSpy.mockReset();
    reloadSpy.mockReset();

    await TestBed.configureTestingModule({
      imports: [TourList],
      providers: [
        provideRouter([]),
        { provide: TourService, useValue: mockTourService },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture = TestBed.createComponent(TourList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /tour-editor when navigateToCreateTour is called', () => {
    component.navigateToCreateTour();
    expect(navigateSpy).toHaveBeenCalledWith(['/tour-editor']);
  });

  it('should display tours in list when available', () => {
    const tourPreviews = fixture.nativeElement.querySelectorAll('app-tour-preview');
    expect(tourPreviews.length).toBe(1);
  });

  it('should display empty state when no upcoming tours are available', () => {
    toursSignal.set([]);
    fixture.detectChanges();

    const emptyMessage = fixture.nativeElement.querySelector('.state-message.empty');
    expect(emptyMessage).toBeTruthy();
    expect(emptyMessage.textContent).toContain('Keine bevorstehenden Touren vorhanden.');
  });

  it('should display loading spinner when tours are loading', () => {
    loadingSignal.set(true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-loading-spinner')).toBeTruthy();
  });

  it('should display error message when loading fails', () => {
    errorSignal.set(new Error('Network error'));
    fixture.detectChanges();

    const errorAlert = fixture.nativeElement.querySelector('.state-message.error');
    expect(errorAlert).toBeTruthy();
    expect(errorAlert.textContent).toContain('Die Touren konnten leider nicht geladen werden.');
  });

  it('should correctly extract tourId from link or raw ID', () => {
    expect(component.extractTourId('tour-abc')).toBe('tour-abc');
    expect(component.extractTourId('http://localhost:4200/tour-management/tour-xyz')).toBe('tour-xyz');
    expect(component.extractTourId('   ')).toBeNull();
  });

  it('should join tour by link and navigate to tour detail', async () => {
    joinTourSpy.mockReturnValue(of(mockTour));
    component.linkInput.set('tour-123');

    await component.joinByLink();

    expect(joinTourSpy).toHaveBeenCalledWith('tour-123');
    expect(reloadSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/tour-management', 'tour-123']);
  });
});
