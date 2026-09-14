import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly tokenKey = 'hslu_weblab_auth_token';
  private readonly userKey = 'hslu_weblab_auth_user';

  readonly currentUser = signal<AuthUser | null>(this.getStoredUser());
  readonly isLoggedIn = computed(() => !!this.currentUser());

  constructor() {
    if (this.getToken()) {
      this.http.get<AuthUser>('/api/auth/me').subscribe({
        next: user => {
          this.currentUser.set(user);
          localStorage.setItem(this.userKey, JSON.stringify(user));
        },
        error: () => {
          this.logout();
        },
      });
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private getStoredUser(): AuthUser | null {
    const raw = localStorage.getItem(this.userKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  login(credentials: { email: string; password: string }) {
    return this.http.post<AuthResponse>('/api/auth/login', credentials).pipe(
      tap(res => {
        localStorage.setItem(this.tokenKey, res.token);
        localStorage.setItem(this.userKey, JSON.stringify(res.user));
        this.currentUser.set(res.user);
      }),
    );
  }

  register(data: { firstName: string; lastName: string; email: string; password: string }) {
    return this.http.post<AuthResponse>('/api/auth/register', data).pipe(
      tap(res => {
        localStorage.setItem(this.tokenKey, res.token);
        localStorage.setItem(this.userKey, JSON.stringify(res.user));
        this.currentUser.set(res.user);
      }),
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUser.set(null);
    this.router.navigate(['/home']);
  }
}
