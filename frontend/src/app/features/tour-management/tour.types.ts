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
