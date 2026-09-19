import { NavigationItem } from '../components/navigation/navigation.type';

export const PATHS: { [key: string]: NavigationItem } = {
  HOME: {
    path: 'home',
    label: 'Home',
  },
  TOUR_MANAGEMENT: {
    path: 'tour-management',
    label: 'Touren',
  },
  LOGIN: {
    path: 'login',
    label: 'Anmelden',
  },
  REGISTER: {
    path: 'register',
    label: 'Registrieren',
  },
};
