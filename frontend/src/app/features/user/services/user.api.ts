import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { User } from '../user.types';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly usersUrl = '/api/users';
  private readonly http = inject(HttpClient);

  getUsersResource() {
    return httpResource<User[]>(
      () => this.usersUrl,
      { defaultValue: [] },
    );
  }

  getUserByIdResource(
    idSignal: Signal<string | null>,
    tourIdSignal?: Signal<string | null>,
  ) {
    return httpResource<User>(() => {
      const id = idSignal();
      const tourId = tourIdSignal ? tourIdSignal() : null;
      if (!id) return undefined;
      return tourId
        ? `/api/tours/${encodeURIComponent(tourId)}/users/${encodeURIComponent(id)}/emergency-contact`
        : `${this.usersUrl}/${encodeURIComponent(id)}`;
    });
  }

  updateUser(id: string, data: Partial<User>) {
    return this.http.patch<User>(
      `${this.usersUrl}/${encodeURIComponent(id)}`,
      data,
    );
  }
}
