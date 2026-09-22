import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TourService, CreateTourInput } from './tour.api';
import { Tour } from '../tour.types';

describe('TourService', () => {
  let service: TourService;
  let httpMock: HttpTestingController;

  const mockTour: Tour = {
    id: 'tour-1',
    name: 'Skitour Pazolastock',
    date: '2026-10-15',
    time: '08:00',
    location: 'Andermatt',
    difficulty: 'mittel',
    altitude: '1200m',
    tourManagerIds: ['usr-1'],
    participantIds: ['usr-2'],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TourService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(TourService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call POST /api/tours when createTour is called', () => {
    const input: CreateTourInput = {
      name: 'Neue Tour',
      date: '2026-11-01',
      time: '09:00',
      location: 'Engelberg',
      difficulty: 'leicht',
      altitude: '800m',
    };

    service.createTour(input).subscribe(res => {
      expect(res).toEqual(mockTour);
    });

    const req = httpMock.expectOne('/api/tours');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(input);
    req.flush(mockTour);
  });

  it('should call PATCH /api/tours/:id with encoded ID on updateTour', () => {
    const tourId = 'tour/special id#1';
    const update = { name: 'Aktualisierte Tour' };

    service.updateTour(tourId, update).subscribe(res => {
      expect(res).toEqual(mockTour);
    });

    const expectedUrl = `/api/tours/${encodeURIComponent(tourId)}`;
    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(update);
    req.flush(mockTour);
  });

  it('should call POST /api/tours/:id/join on joinTour', () => {
    service.joinTour('tour-1').subscribe(res => {
      expect(res).toEqual(mockTour);
    });

    const req = httpMock.expectOne('/api/tours/tour-1/join');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush(mockTour);
  });

  it('should call DELETE /api/tours/:tourId/users/:userId on removeUser with URL encoding', () => {
    service.removeUser('tour/1', 'user/2').subscribe(res => {
      expect(res).toEqual(mockTour);
    });

    const req = httpMock.expectOne('/api/tours/tour%2F1/users/user%2F2');
    expect(req.request.method).toBe('DELETE');
    req.flush(mockTour);
  });

  it('should call PATCH /api/tours/:tourId/users/:userId/role on setUserRole', () => {
    service.setUserRole('tour-1', 'user-2', 'admin').subscribe(res => {
      expect(res).toEqual(mockTour);
    });

    const req = httpMock.expectOne('/api/tours/tour-1/users/user-2/role');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ role: 'admin' });
    req.flush(mockTour);
  });

  it('should construct httpResources with proper endpoint definitions', () => {
    TestBed.runInInjectionContext(() => {
      const idSignal = signal<string | null>(null);
      const tourResource = service.getTourByIdResource(idSignal);
      expect(tourResource).toBeTruthy();

      const membersResource = service.getTourMembersResource(idSignal);
      expect(membersResource).toBeTruthy();
      expect(membersResource.value()).toEqual({ tourManagers: [], participants: [] });

      const myToursResource = service.getMyTours();
      expect(myToursResource).toBeTruthy();
      expect(myToursResource.value()).toEqual([]);
    });
  });
});
