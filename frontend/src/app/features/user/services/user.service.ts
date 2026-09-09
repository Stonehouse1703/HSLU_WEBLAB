import { Injectable } from '@angular/core';
import { DUMMY_USERS } from '../user';
import { User } from '../user.types';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly _users = [...DUMMY_USERS];

  get users(): User[] {
    return [...this._users];
  }

  findUserById(id: string): User | undefined {
    return this._users.find(user => user.id === id);
  }
}
