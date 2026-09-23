import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { describe, it, expect } from 'vitest';
import { TourOverviewPage } from './tour-overview';
import { TourService } from '../../services/tour.api';
import { Tour } from '../../tour.types';

describe('TourOverviewPage', () => {
  it('should create', async () => {
    const { component } = await setup();
    expect(component).toBeTruthy();
  });

  it('should render the main container and app-tour-list', async () => {
    const { fixture } = await setup();
    expect(fixture.nativeElement.querySelector('main.tour-overview-page')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('app-tour-list')).toBeTruthy();
  });
});

interface Props {
  tours: Tour[];
}

const defaultProps: Props = {
  tours: [],
};

async function setup(props: Partial<Props> = {}) {
  const mergedProps = { ...defaultProps, ...props };

  await TestBed.configureTestingModule({
    imports: [TourOverviewPage],
    providers: [
      provideRouter([]),
      {
        provide: TourService,
        useValue: {
          getMyTours: () => ({
            value: signal(mergedProps.tours),
            isLoading: signal(false),
            error: signal(undefined),
            reload: () => {},
          }),
          joinTour: () => {},
        },
      },
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(TourOverviewPage);
  fixture.detectChanges();

  return {
    fixture,
    component: fixture.componentInstance,
  };
}
