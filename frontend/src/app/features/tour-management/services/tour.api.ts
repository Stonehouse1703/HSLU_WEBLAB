import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, type Signal } from '@angular/core';
import { Tour } from '../tour.types';

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
}
  