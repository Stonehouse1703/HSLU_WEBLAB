import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TourDetailContainer } from './tour-detail';
import { TourService } from '../../services/tour.api';
import { AuthService } from '../../../auth/services/auth.service';
import { Tour } from '../../tour.types';
import { User } from '../../../user/user.types';

describe('TourDetailContainer', () => {
  let component: TourDetailContainer;
  let fixture: ComponentFixture<TourDetailContainer>;
  let router: Router;
  let navigateSpy: ReturnType<typeof vi.spyOn>;

  const mockTour: Tour = {
    id: 'tour-100',
    name: 'Pazolastock Rundtour',
    date: '2099-12-31',
    time: '08:00',
    location: 'Andermatt',
    difficulty: 'mittel',
    altitude: '1200m',
    tourManagerIds: ['mgr-1'],
    participantIds: ['part-2'],
  };

  const mockMembers = {
    tourManagers: [
      {
        id: 'mgr-1',
        firstName: 'Colin',
        lastName: 'Leiter',
        email: 'colin@leiter.ch',
        birthday: '1995-01-01',
        phoneNumber: '+41 79 111 22 33',
        emergencyContact: {
          firstName: 'Anna',
          lastName: 'Muster',
          phoneNumber: '+41 78 123 45 67',
          relationship: 'Partner',
        },
      },
    ] as User[],
    participants: [
      {
        id: 'part-2',
        firstName: 'Hans',
        lastName: 'Teilnehmer',
        email: 'hans@teilnehmer.ch',
        birthday: '1998-05-10',
        phoneNumber: '+41 76 222 33 44',
        emergencyContact: {
          firstName: 'Peter',
          lastName: 'Teilnehmer',
          phoneNumber: '+41 77 987 65 43',
          relationship: 'Vater',
        },
      },
    ] as User[],
  };

  const tourSignal = signal<Tour | undefined>(mockTour);
  const membersSignal = signal<typeof mockMembers | undefined>(mockMembers);
  const currentUserSignal = signal<{ id: string; email: string } | null>({
    id: 'mgr-1',
    email: 'colin@leiter.ch',
  });

  const mockTourService = {
    getTourByIdResource: () => ({
      value: tourSignal,
      isLoading: signal(false),
      error: signal(undefined),
      reload: vi.fn(),
    }),
    getTourMembersResource: () => ({
      value: membersSignal,
      isLoading: signal(false),
      error: signal(undefined),
      reload: vi.fn(),
    }),
    joinTour: vi.fn(),
    removeUser: vi.fn(),
    setUserRole: vi.fn(),
  };

  const mockAuthService = {
    currentUser: currentUserSignal,
  };

  beforeEach(async () => {
    tourSignal.set(mockTour);
    membersSignal.set(mockMembers);
    currentUserSignal.set({ id: 'mgr-1', email: 'colin@leiter.ch' });

    await TestBed.configureTestingModule({
      imports: [TourDetailContainer],
      providers: [
        provideRouter([]),
        { provide: TourService, useValue: mockTourService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture = TestBed.createComponent(TourDetailContainer);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('tourId', 'tour-100');
    fixture.detectChanges();
  });

  it('should create the container', () => {
    expect(component).toBeTruthy();
  });

  it('should render tour name in header', () => {
    const heading = fixture.nativeElement.querySelector('h2');
    expect(heading?.textContent).toContain('Pazolastock Rundtour');
  });

  it('should recognize tour manager role and show edit button', () => {
    expect(component.canChangeRoles()).toBe(true);
    const editBtn = fixture.nativeElement.querySelector('.edit-button');
    expect(editBtn).toBeTruthy();
  });

  it('should navigate to /tour-editor/:id when editTour is called by manager', () => {
    component.editTour();
    expect(navigateSpy).toHaveBeenCalledWith(['/tour-editor', 'tour-100']);
  });

  it('should not show edit button when current user is only a participant', () => {
    currentUserSignal.set({ id: 'part-2', email: 'hans@teilnehmer.ch' });
    fixture.detectChanges();

    expect(component.canChangeRoles()).toBe(false);
    const editBtn = fixture.nativeElement.querySelector('.edit-button');
    expect(editBtn).toBeNull();
  });

  it('should navigate to emergency contact view on openEmergencyContact', () => {
    const targetUser = mockMembers.participants[0];
    component.openEmergencyContact(targetUser);

    expect(navigateSpy).toHaveBeenCalledWith(['/user', targetUser.id], {
      queryParams: { tourId: 'tour-100' },
    });
  });

  it('should navigate back to overview on navigateToOverview', () => {
    component.navigateToOverview();
    expect(navigateSpy).toHaveBeenCalledWith(['/tour-management']);
  });
});
