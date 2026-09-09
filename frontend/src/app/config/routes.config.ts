import {Route} from '@angular/router';
import {PATHS} from './paths.config';
import {TourManagement} from '../features/tour-management/pages/tour-overview/tour-overview';

const { HOME, TOUR_MANAGEMENT } = PATHS;

export const routes: Route[] = [
  {
    path: '',
    redirectTo: TOUR_MANAGEMENT.path,
    pathMatch: 'full',
  },
  {
    path: HOME.path,
    redirectTo: TOUR_MANAGEMENT.path,
  },
  {
    path: TOUR_MANAGEMENT.path, 
    component: TourManagement,
  }
];