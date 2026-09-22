import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TourForm, notInPastValidator } from './tour-form';
import { Tour, getTodayDateString } from '../../../tour-management/tour.types';
import { GpxLoadedEvent } from '../gpx-upload/gpx-upload';

describe('TourForm & notInPastValidator', () => {
  describe('notInPastValidator', () => {
    it('should return null for empty values', () => {
      const validator = notInPastValidator();
      expect(validator(new FormControl(''))).toBeNull();
      expect(validator(new FormControl(null))).toBeNull();
    });

    it('should return null for future dates and today', () => {
      const today = getTodayDateString();
      const validator = notInPastValidator();

      expect(validator(new FormControl(today))).toBeNull();
      expect(validator(new FormControl('2099-12-31'))).toBeNull();
    });

    it('should return { pastDate: true } for dates before today', () => {
      const validator = notInPastValidator();
      expect(validator(new FormControl('2000-01-01'))).toEqual({ pastDate: true });
    });

    it('should allow past date if it matches the original tour date being edited', () => {
      const originalDate = '2020-05-15';
      const validator = notInPastValidator(() => originalDate);

      // Same past date is valid (user didn't change it while editing)
      expect(validator(new FormControl(originalDate))).toBeNull();
      // Different past date is invalid
      expect(validator(new FormControl('2020-05-14'))).toEqual({ pastDate: true });
    });
  });

  describe('TourForm Component', () => {
    let component: TourForm;
    let fixture: ComponentFixture<TourForm>;

    const validTourData: Tour = {
      id: 'tour-101',
      name: 'Pazolastock',
      date: '2026-12-24',
      time: '08:00',
      location: 'Oberalp',
      difficulty: 'mittel',
      altitude: '1100m',
      distance: '14.2 km',
      travelRoute: 'PW',
      cost: 20,
      requirements: 'B',
      tourManagerIds: ['mgr-1'],
      participantIds: [],
    };

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TourForm],
      }).compileComponents();

      fixture = TestBed.createComponent(TourForm);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should initialize empty invalid form', () => {
      expect(component.tourForm.valid).toBe(false);
      expect(component.submitted()).toBe(false);
    });

    it('should patch form values when tour input is provided', () => {
      fixture.componentRef.setInput('tour', validTourData);
      fixture.detectChanges();

      expect(component.tourForm.get('name')?.value).toBe('Pazolastock');
      expect(component.tourForm.get('place')?.value).toBe('Oberalp');
      expect(component.tourForm.get('altitude')?.value).toBe('1100');
      expect(component.tourForm.get('distance')?.value).toBe('14.2');
      expect(component.tourForm.valid).toBe(true);
    });

    it('should auto-populate empty name, altitude, distance when GPX is loaded', () => {
      const gpxEvent: GpxLoadedEvent = {
        content: '<gpx></gpx>',
        fileName: 'route.gpx',
        suggestedName: 'GPX Berg Tour',
        suggestedAltitude: 850,
        suggestedDistance: 11.5,
      };

      component.onGpxLoaded(gpxEvent);

      expect(component.gpxData()).toBe('<gpx></gpx>');
      expect(component.tourForm.get('name')?.value).toBe('GPX Berg Tour');
      expect(component.tourForm.get('altitude')?.value).toBe('850');
      expect(component.tourForm.get('distance')?.value).toBe('11.5');
    });

    it('should not overwrite existing user-entered name when GPX is loaded', () => {
      component.tourForm.get('name')?.setValue('Mein eigener Tourname');

      const gpxEvent: GpxLoadedEvent = {
        content: '<gpx></gpx>',
        fileName: 'route.gpx',
        suggestedName: 'Anderer Name',
      };

      component.onGpxLoaded(gpxEvent);

      expect(component.tourForm.get('name')?.value).toBe('Mein eigener Tourname');
    });

    it('should emit onFormSubmit with formatted payload on submit', () => {
      const submitSpy = vi.fn();
      component.onFormSubmit.subscribe(submitSpy);

      component.tourForm.patchValue({
        name: 'Urner Haute Route',
        date: '2026-11-20',
        time: '07:30',
        place: 'Andermatt',
        altitude: '1450',
        distance: '18.5',
        difficulty: 'schwer',
        requirements: 'C',
        travelRoute: 'ÖV',
        cost: '35',
      });

      component.submitForm();

      expect(submitSpy).toHaveBeenCalledWith({
        name: 'Urner Haute Route',
        date: '2026-11-20',
        time: '07:30',
        location: 'Andermatt',
        altitude: '1450m',
        distance: '18.5 km',
        difficulty: 'schwer',
        requirements: 'C',
        travelRoute: 'ÖV',
        cost: 35,
        gpxData: undefined,
        securityMatrix: undefined,
      });
    });

    it('should not submit if form is invalid and set submitted to true', () => {
      const submitSpy = vi.fn();
      component.onFormSubmit.subscribe(submitSpy);

      component.submitForm();

      expect(component.submitted()).toBe(true);
      expect(submitSpy).not.toHaveBeenCalled();
    });

    it('should emit cancelClicked when cancel button is clicked', () => {
      const cancelSpy = vi.fn();
      component.cancelClicked.subscribe(cancelSpy);

      fixture.componentRef.setInput('showCancelButton', true);
      fixture.detectChanges();

      const cancelBtn = fixture.nativeElement.querySelectorAll('app-button')[1];
      cancelBtn.querySelector('button').click();

      expect(cancelSpy).toHaveBeenCalledTimes(1);
    });
  });
});
