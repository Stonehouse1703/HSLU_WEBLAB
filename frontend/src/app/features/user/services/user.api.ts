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

  getUserByIdResource(idSignal: Signal<string | null>) {
    return httpResource<User>(() => {
      const id = idSignal();
      return id ? `${this.usersUrl}/${encodeURIComponent(id)}` : undefined;
    });
  }
}
