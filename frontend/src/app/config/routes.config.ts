import {Route} from '@angular/router';
import {PATHS} from './paths.config';
import {TourManagement} from '../features/tour-management/pages/tour-overview/tour-overview';
import {TourDetail} from '../features/tour-management/pages/tour-detail/tour-detail';
import {UserDetail} from '../features/user/pages/user-detail/user-detail';

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
    children: [
      {
        path: '',
        component: TourManagement,
      },
      {
        path: ':id',
        component: TourDetail,
      },
    ],
  },
  {
    path: 'user/:id',
    component: UserDetail,
  },
  {
    path: '**',
    redirectTo: TOUR_MANAGEMENT.path,
  }
];