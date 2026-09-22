import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Navigation } from './navigation';
import { NavigationItem } from './navigation.type';
import { AuthUser } from '../../features/auth/services/auth.service';

describe('Navigation', () => {
  let component: Navigation;
  let fixture: ComponentFixture<Navigation>;

  const mockLinks: NavigationItem[] = [
    { path: 'home', label: 'Home' },
    { path: 'tour-management', label: 'Touren' },
    { path: 'tour-editor', label: 'Tour erfassen' },
    { path: 'login', label: 'Anmelden' },
    { path: 'register', label: 'Registrieren' },
  ];

  const mockUser: AuthUser = {
    id: 'user-1',
    firstName: 'Colin',
    lastName: 'Muster',
    email: 'colin@muster.ch',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navigation],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Navigation);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('links', mockLinks);
    fixture.detectChanges();
  });

  it('should create the navigation component', () => {
    expect(component).toBeTruthy();
  });

  it('should filter out login and register links from visibleLinks', () => {
    const visible = component.visibleLinks();
    expect(visible.map(l => l.path)).toEqual([
      'home',
      'tour-management',
      'tour-editor',
    ]);
  });

  it('should show login and register links when user is not logged in', () => {
    fixture.componentRef.setInput('currentUser', null);
    fixture.detectChanges();

    const loginLink = fixture.nativeElement.querySelector('.login-link');
    const registerLink = fixture.nativeElement.querySelector('.register-link');
    expect(loginLink).toBeTruthy();
    expect(registerLink).toBeTruthy();
  });

  it('should show user greeting and logout button when user is logged in', () => {
    fixture.componentRef.setInput('currentUser', mockUser);
    fixture.detectChanges();

    const greeting = fixture.nativeElement.querySelector('.user-greeting');
    const logoutBtn = fixture.nativeElement.querySelector('.logout-btn');
    expect(greeting?.textContent).toContain('Colin Muster');
    expect(logoutBtn).toBeTruthy();
  });

  it('should emit logout output when logout button is clicked', () => {
    fixture.componentRef.setInput('currentUser', mockUser);
    fixture.detectChanges();

    const logoutSpy = vi.fn();
    component.logout.subscribe(logoutSpy);

    const logoutBtn = fixture.nativeElement.querySelector('.logout-btn');
    logoutBtn.click();

    expect(logoutSpy).toHaveBeenCalledTimes(1);
  });
});
