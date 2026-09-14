import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, type Signal } from '@angular/core';
import { Tour } from '../tour.types';

export type CreateTourInput = {
  name: string;
  date: string;
  time: string;
  location: string;
  difficulty: string;
  altitude: string;
};

@Injectable({
  providedIn: 'root',
})
export class TourService {
  private readonly tourUrl = '/api/tours';
  private readonly http = inject(HttpClient);

  getToursResource() {
    return httpResource<Tour[]>(
      () => this.tourUrl,
      { defaultValue: [] },
    );
  }

  createTour(tour: CreateTourInput) {
    return this.http.post<Tour>(this.tourUrl, tour);
  }

  getTourByIdResource(idSignal: Signal<string | null>) {
    return httpResource<Tour>(() => {
      const id = idSignal();
      return id ? `${this.tourUrl}/${encodeURIComponent(id)}` : undefined;
    });
  }

  removeUser(tourId: string, userId: string) {
    return this.http.delete<Tour>(
      `${this.tourUrl}/${encodeURIComponent(tourId)}/users/${encodeURIComponent(userId)}`,
    );
  }

  setUserRole(
    tourId: string,
    userId: string,
    role: 'admin' | 'participant',
  ) {
    return this.http.patch<Tour>(
      `${this.tourUrl}/${encodeURIComponent(tourId)}/users/${encodeURIComponent(userId)}/role`,
      { role },
    );
  }
}
  