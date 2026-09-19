export interface Tour {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  difficulty: string;
  altitude: string;
  gpxData?: string;
  tourManagerIds: string[];
  participantIds: string[];
}
