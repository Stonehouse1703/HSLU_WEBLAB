export class CreateTourDto {
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
  securityMatrix?: Record<string, any>;
}
