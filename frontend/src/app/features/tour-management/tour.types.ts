export interface SecurityMatrix {
  participants?: string; // 'bekannt' | 'gemischt' | 'unbekannt'
  cloudCover?: string; // 'sonnig' | 'wechselnd bewölkt' | 'stark bewölkt'
  precipitation?: string; // 'kein' | 'Schneefall' | 'Regen'
  visibility?: string; // 'gut' | 'eingeschränkt' | 'sehr schlecht'
  wind?: string; // 'windstill' | 'schwach/mässig' | 'stark/sturm'
  temperature2000m?: string; // z.B. "-5"
  avalancheDanger?: number; // 1 | 2 | 3 | 4 | 5
  dangerSources?: string[];
  dangerLocations?: string[];
  otherHazards?: string[];
}

export interface MatrixOption {
  value: string;
  label: string;
}

export interface DangerLevelInfo {
  level: number;
  name: string;
  className: string;
}

export const MATRIX_PARTICIPANTS_OPTIONS: MatrixOption[] = [
  { value: 'bekannt', label: 'Bekannt' },
  { value: 'gemischt', label: 'Gemischt' },
  { value: 'unbekannt', label: 'Unbekannt' },
];

export const MATRIX_CLOUD_COVER_OPTIONS: MatrixOption[] = [
  { value: 'sonnig', label: 'Sonnig' },
  { value: 'wechselnd bewölkt', label: 'Wechselnd bewölkt' },
  { value: 'stark bewölkt', label: 'Stark bewölkt' },
];

export const MATRIX_PRECIPITATION_OPTIONS: MatrixOption[] = [
  { value: 'kein', label: 'Kein Niederschlag' },
  { value: 'Schneefall', label: 'Schneefall' },
  { value: 'Regen', label: 'Regen' },
];

export const MATRIX_VISIBILITY_OPTIONS: MatrixOption[] = [
  { value: 'gut', label: 'Gut' },
  { value: 'eingeschränkt', label: 'Eingeschränkt' },
  { value: 'sehr schlecht', label: 'Sehr schlecht' },
];

export const MATRIX_WIND_OPTIONS: MatrixOption[] = [
  { value: 'windstill', label: 'Windstill' },
  { value: 'schwach/mässig', label: 'Schwach / Mässig' },
  { value: 'stark/sturm', label: 'Stark / Sturm' },
];

export const MATRIX_DANGER_LEVELS: DangerLevelInfo[] = [
  { level: 1, name: 'Gering', className: 'level-1' },
  { level: 2, name: 'Mässig', className: 'level-2' },
  { level: 3, name: 'Erheblich', className: 'level-3' },
  { level: 4, name: 'Gross', className: 'level-4' },
  { level: 5, name: 'Sehr gross', className: 'level-5' },
];

export const MATRIX_DANGER_SOURCES: string[] = [
  'Neuschnee',
  'Frischer Triebschnee',
  'Störanfällige / instabile Altschneedecke',
  'Starke Durchfeuchtung',
];

export const MATRIX_DANGER_LOCATIONS: string[] = [
  'Kammnähe',
  'Triebschneegefüllte Rinnen und Mulden',
  'Sonnenexponierte Steilhänge',
];

export const MATRIX_OTHER_HAZARDS: string[] = [
  'Absturzgefahr',
  'Wechten',
  'Felsen/Steine',
  'Gletscherspalten',
  'Sonne/Strahlung',
  'Kälte/Windchill',
];

export function getDangerLevelName(level?: number): string {
  const found = MATRIX_DANGER_LEVELS.find(item => item.level === level);
  return found?.name ?? '';
}

export interface Tour {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  difficulty: string;
  altitude: string;
  distance?: string;
  cost?: number;
  travelRoute?: string;
  requirements?: string;
  gpxData?: string;
  securityMatrix?: SecurityMatrix;
  tourManagerIds: string[];
  participantIds: string[];
}

export const REQUIREMENT_DESCRIPTIONS: Record<string, string> = {
  A: 'A – wenig anstrengend (3 - 5 h Totalzeit; bis ca. 800 HM Aufstieg)',
  B: 'B – ziemlich anstrengend (4 - 7 h Totalzeit; ca. 800 - 1300 HM Aufstieg)',
  C: 'C – anstrengend (6 - 10 h Totalzeit; ca. 1300 - 1600 HM Aufstieg)',
  D: 'D – sehr anstrengend (länger als 10 h Totalzeit; Aufstieg mehr als 1600 HM)',
};

export const SHORT_REQUIREMENT_DESCRIPTIONS: Record<string, string> = {
  A: 'A (wenig anstrengend, bis 800 HM)',
  B: 'B (ziemlich anstrengend, 800-1300 HM)',
  C: 'C (anstrengend, 1300-1600 HM)',
  D: 'D (sehr anstrengend, > 1600 HM)',
};

export function formatRequirements(level?: string): string {
  if (!level) return '';
  return REQUIREMENT_DESCRIPTIONS[level] ?? level;
}

export function formatShortRequirements(level?: string): string {
  if (!level) return '';
  return SHORT_REQUIREMENT_DESCRIPTIONS[level] ?? level;
}

export function formatCost(cost?: number | string | null): string {
  if (cost === undefined || cost === null || cost === '') return '';
  const num = typeof cost === 'number' ? cost : Number(cost);
  if (!isNaN(num)) {
    if (num === 0) {
      return 'Gratis';
    }
    return `CHF ${num}.-`;
  }
  if (String(cost).toLowerCase() === 'gratis' || String(cost).trim() === '0') {
    return 'Gratis';
  }
  return String(cost);
}

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isTourUpcoming(tourDate?: string, todayStr = getTodayDateString()): boolean {
  if (!tourDate) return false;
  const cleanedDate = tourDate.includes('T') ? tourDate.split('T')[0].trim() : tourDate.trim();
  if (!cleanedDate) return false;
  return cleanedDate >= todayStr;
}

