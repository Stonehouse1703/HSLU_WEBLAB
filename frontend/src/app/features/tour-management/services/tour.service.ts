import { Injectable } from '@angular/core';
import { DUMMY_TOURS } from '../tour';
import { Tour } from '../tour.types';

@Injectable({
  providedIn: 'root',
})
export class TourService {
  private tour = [...DUMMY_TOURS];

  get tours(): Tour[] {
    return [...this.tour];
  }

  findTourById(id: string): Tour | undefined {
  return this.tour.find(tour => tour.id === id);
  }
}
  