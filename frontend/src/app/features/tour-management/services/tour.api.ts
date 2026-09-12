import { Injectable, type Signal } from '@angular/core';
import { Tour } from '../tour.types';
import { httpResource } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TourService {
  private readonly tourUrl = '/api/tours';

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
}
  