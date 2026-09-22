import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';

describe('authInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let mockAuthService: {
    getToken: ReturnType<typeof vi.fn>;
    logout: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockAuthService = {
      getToken: vi.fn(),
      logout: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: mockAuthService },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add Authorization header with Bearer token when token is present', () => {
    mockAuthService.getToken.mockReturnValue('valid-token-123');

    httpClient.get('/api/tours').subscribe();

    const req = httpMock.expectOne('/api/tours');
    expect(req.request.headers.has('Authorization')).toBe(true);
    expect(req.request.headers.get('Authorization')).toBe('Bearer valid-token-123');
    req.flush([]);
  });

  it('should NOT add Authorization header when token is null', () => {
    mockAuthService.getToken.mockReturnValue(null);

    httpClient.get('/api/tours').subscribe();

    const req = httpMock.expectOne('/api/tours');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush([]);
  });

  it('should call authService.logout on 401 error from protected api endpoint', () => {
    mockAuthService.getToken.mockReturnValue('expired-token');

    httpClient.get('/api/tours/123').subscribe({
      error: err => {
        expect(err.status).toBe(401);
      },
    });

    const req = httpMock.expectOne('/api/tours/123');
    req.flush({ message: 'Token expired' }, { status: 401, statusText: 'Unauthorized' });

    expect(mockAuthService.logout).toHaveBeenCalledTimes(1);
  });

  it('should NOT call authService.logout on 401 error from /api/auth/login', () => {
    mockAuthService.getToken.mockReturnValue(null);

    httpClient.post('/api/auth/login', { email: 'a@b.ch', password: 'wrong' }).subscribe({
      error: err => {
        expect(err.status).toBe(401);
      },
    });

    const req = httpMock.expectOne('/api/auth/login');
    req.flush({ message: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });

    expect(mockAuthService.logout).not.toHaveBeenCalled();
  });

  it('should NOT call authService.logout on 500 error or other HTTP error codes', () => {
    mockAuthService.getToken.mockReturnValue('some-token');

    httpClient.get('/api/tours').subscribe({
      error: err => {
        expect(err.status).toBe(500);
      },
    });

    const req = httpMock.expectOne('/api/tours');
    req.flush({ message: 'Internal Server Error' }, { status: 500, statusText: 'Internal Server Error' });

    expect(mockAuthService.logout).not.toHaveBeenCalled();
  });
});
