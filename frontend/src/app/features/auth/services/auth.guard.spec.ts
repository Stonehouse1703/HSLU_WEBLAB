import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree, provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach } from 'vitest';
import { authGuard } from './auth.guard';
import { AuthService } from './auth.service';

describe('authGuard', () => {
  let router: Router;
  let mockAuthService: { isLoggedIn: ReturnType<typeof signal<boolean>> };

  beforeEach(() => {
    mockAuthService = {
      isLoggedIn: signal(false),
    };

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: mockAuthService },
      ],
    });

    router = TestBed.inject(Router);
  });

  function executeGuard(url: string) {
    const route = {} as ActivatedRouteSnapshot;
    const state = { url } as RouterStateSnapshot;
    return TestBed.runInInjectionContext(() => authGuard(route, state));
  }

  it('should allow navigation when user is logged in', () => {
    mockAuthService.isLoggedIn.set(true);

    const result = executeGuard('/tour-management');
    expect(result).toBe(true);
  });

  it('should redirect to /login with returnUrl query param when user is not logged in', () => {
    mockAuthService.isLoggedIn.set(false);

    const targetUrl = '/tour-management/42?tab=participants';
    const result = executeGuard(targetUrl);

    expect(result instanceof UrlTree).toBe(true);
    const urlTree = result as UrlTree;
    expect(router.serializeUrl(urlTree)).toBe(
      '/login?returnUrl=%2Ftour-management%2F42%3Ftab%3Dparticipants',
    );
  });

  it('should redirect to /login when attempting to access root protected url', () => {
    mockAuthService.isLoggedIn.set(false);

    const result = executeGuard('/');
    expect(result instanceof UrlTree).toBe(true);
    const urlTree = result as UrlTree;
    expect(urlTree.queryParams['returnUrl']).toBe('/');
  });
});
