import { Route } from '@angular/router';
import { PATHS } from './paths.config';
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
    loadComponent: () => import('../pages/home/home').then(m => m.Home),
  },
  {
    path: TOUR_MANAGEMENT.path,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('../features/tour-management/pages/tour-overview/tour-overview').then(
            m => m.TourOverviewPage,
          ),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('../features/tour-management/pages/tour-detail/tour-detail').then(
            m => m.TourDetail,
          ),
      },
    ],
  },
  {
    path: 'user/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../features/user/pages/user-detail/user-detail').then(
        m => m.UserDetail,
      ),
  },
  {
    path: 'tour-editor',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('../features/tour-editor/pages/tour-editor/tour-editor').then(
            m => m.TourEditor,
          ),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('../features/tour-editor/pages/tour-editor/tour-editor').then(
            m => m.TourEditor,
          ),
      },
    ],
  },
  {
    path: LOGIN.path,
    loadComponent: () =>
      import('../features/auth/pages/login/login').then(m => m.LoginPage),
  },
  {
    path: REGISTER.path,
    loadComponent: () =>
      import('../features/auth/pages/register/register').then(
        m => m.RegisterPage,
      ),
  },
  {
    path: '**',
    redirectTo: HOME.path,
  },
];
