import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { User } from '../user.types';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly _users = signal<User[]>([]);

  get users(): User[] {
    return this._users();
  }

  findUserById(id: string): User | undefined {
    return this._users().find(user => user.id === id);
  }

  constructor() {
    this.http.get<User[]>('/api/users').subscribe(users => this._users.set(users));
  }
}
