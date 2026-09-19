import {Route} from '@angular/router';
import {PATHS} from './paths.config';
import {TourManagement} from '../features/tour-management/pages/tour-overview/tour-overview';
import {TourDetail} from '../features/tour-management/pages/tour-detail/tour-detail';
import {UserDetail} from '../features/user/pages/user-detail/user-detail';
import {Home} from '../pages/home/home';
import { TourEditor } from '../features/tour-editor/pages/tour-editor/tour-editor';
import { LoginPage } from '../features/auth/pages/login/login';
import { RegisterPage } from '../features/auth/pages/register/register';
import { authGuard } from '../features/auth/services/auth.guard';

const { HOME, TOUR_MANAGEMENT, LOGIN, REGISTER } = PATHS;

export const routes: Route[] = [
  {
    path: '',
    redirectTo: HOME.path,
    pathMatch: 'full',
  },
  {
    path: HOME.path,
    component: Home,
  },
  {
    path: TOUR_MANAGEMENT.path,
    canActivate: [authGuard],
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
    path: 'tour-editor',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: TourEditor,
      },
      {
        path: ':id',
        component: TourEditor,
      },
    ],
  },
  {
    path: LOGIN.path,
    component: LoginPage,
  },
  {
    path: REGISTER.path,
    component: RegisterPage,
  },
  {
    path: '**',
    redirectTo: HOME.path,
  }
];