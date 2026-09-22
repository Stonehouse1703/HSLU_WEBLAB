import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router, provideRouter } from '@angular/router';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AuthService, AuthUser, AuthResponse, RegisterData } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;

  const tokenKey = 'hslu_weblab_auth_token';
  const userKey = 'hslu_weblab_auth_user';

  const mockUser: AuthUser = {
    id: 'usr-1',
    firstName: 'Colin',
    lastName: 'Muster',
    email: 'colin@muster.ch',
  };

  const mockAuthResponse: AuthResponse = {
    token: 'jwt-token-xyz',
    user: mockUser,
  };

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    httpMock?.verify();
    localStorage.clear();
  });

  function setupService(token?: string, user?: AuthUser) {
    if (token) {
      localStorage.setItem(tokenKey, token);
    }
    if (user) {
      localStorage.setItem(userKey, JSON.stringify(user));
    }

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  }

  it('should initialize with null user and isLoggedIn=false when no stored session', () => {
    setupService();

    expect(service.currentUser()).toBeNull();
    expect(service.isLoggedIn()).toBe(false);
    expect(service.getToken()).toBeNull();
  });

  it('should initialize with stored user and isLoggedIn=true when user exists in localStorage', () => {
    setupService('existing-token', mockUser);

    expect(service.currentUser()).toEqual(mockUser);
    expect(service.isLoggedIn()).toBe(true);
    expect(service.getToken()).toBe('existing-token');

    // Constructor fetches /api/auth/me when token exists
    const req = httpMock.expectOne('/api/auth/me');
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should clear session on 401 error during initial /api/auth/me check', () => {
    setupService('expired-token', mockUser);

    const req = httpMock.expectOne('/api/auth/me');
    req.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

    expect(service.currentUser()).toBeNull();
    expect(service.isLoggedIn()).toBe(false);
    expect(localStorage.getItem(tokenKey)).toBeNull();
    expect(localStorage.getItem(userKey)).toBeNull();
  });

  it('should not clear session on server error (500) during /api/auth/me check', () => {
    setupService('valid-token', mockUser);

    const req = httpMock.expectOne('/api/auth/me');
    req.flush({ message: 'Server Error' }, { status: 500, statusText: 'Internal Server Error' });

    expect(service.currentUser()).toEqual(mockUser);
    expect(service.isLoggedIn()).toBe(true);
  });

  it('should handle corrupted JSON in localStorage gracefully', () => {
    localStorage.setItem(userKey, 'not-json-content{{{');
    setupService('valid-token');

    expect(service.currentUser()).toBeNull();

    const req = httpMock.expectOne('/api/auth/me');
    req.flush(mockUser);

    expect(service.currentUser()).toEqual(mockUser);
  });

  it('should handle login successfully: store token/user and update state', () => {
    setupService();

    service.login({ email: 'colin@muster.ch', password: 'secretpassword' }).subscribe(res => {
      expect(res).toEqual(mockAuthResponse);
    });

    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'colin@muster.ch', password: 'secretpassword' });
    req.flush(mockAuthResponse);

    expect(service.currentUser()).toEqual(mockUser);
    expect(service.isLoggedIn()).toBe(true);
    expect(localStorage.getItem(tokenKey)).toBe('jwt-token-xyz');
    expect(JSON.parse(localStorage.getItem(userKey)!)).toEqual(mockUser);
  });

  it('should handle register successfully: store token/user and update state', () => {
    setupService();

    const registerData: RegisterData = {
      firstName: 'Colin',
      lastName: 'Muster',
      email: 'colin@muster.ch',
      password: 'secretpassword',
      birthday: '1995-05-15',
      phoneNumber: '+41 79 123 45 67',
      emergencyContact: {
        firstName: 'Anna',
        lastName: 'Muster',
        phoneNumber: '+41 78 234 56 78',
        relationship: 'Partner/in',
      },
    };

    service.register(registerData).subscribe(res => {
      expect(res).toEqual(mockAuthResponse);
    });

    const req = httpMock.expectOne('/api/auth/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(registerData);
    req.flush(mockAuthResponse);

    expect(service.currentUser()).toEqual(mockUser);
    expect(service.isLoggedIn()).toBe(true);
    expect(localStorage.getItem(tokenKey)).toBe('jwt-token-xyz');
  });

  it('should clear session and navigate to /home on logout', () => {
    setupService('jwt-token-xyz', mockUser);

    const req = httpMock.expectOne('/api/auth/me');
    req.flush(mockUser);

    const navSpy = vi.spyOn(router, 'navigate');

    service.logout();

    expect(service.currentUser()).toBeNull();
    expect(service.isLoggedIn()).toBe(false);
    expect(localStorage.getItem(tokenKey)).toBeNull();
    expect(localStorage.getItem(userKey)).toBeNull();
    expect(navSpy).toHaveBeenCalledWith(['/home']);
  });
});
