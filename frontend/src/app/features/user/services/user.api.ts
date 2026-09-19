import { httpResource } from '@angular/common/http';
import { Injectable, Signal } from '@angular/core';
import { User } from '../user.types';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly usersUrl = '/api/users';

  getUsersResource() {
    return httpResource<User[]>(
      () => this.usersUrl,
      { defaultValue: [] },
    );
  }

  getUserByIdResource(
    idSignal: Signal<string | null>,
    tourIdSignal: Signal<string | null>,
  ) {
    return httpResource<User>(() => {
      const id = idSignal();
      const tourId = tourIdSignal();
      return id && tourId
        ? `/api/tours/${encodeURIComponent(tourId)}/users/${encodeURIComponent(id)}/emergency-contact`
        : undefined;
    });
  }
}
