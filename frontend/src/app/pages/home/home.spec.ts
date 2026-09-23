import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, it, expect, beforeEach } from 'vitest';
import { Home } from './home';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the home page', () => {
    expect(component).toBeTruthy();
  });

  it('should render the hero section with heading and call-to-actions', () => {
    const heading = fixture.nativeElement.querySelector('#home-title');
    expect(heading?.textContent).toContain('Alles Wichtige für deine nächste Tour.');

    const primaryAction = fixture.nativeElement.querySelector('.primary-action');
    expect(primaryAction?.textContent).toContain('Touren ansehen');
    expect(primaryAction?.getAttribute('href')).toBe('/tour-management');
  });

  it('should render the three feature cards', () => {
    const featureCards = fixture.nativeElement.querySelectorAll('.feature-card');
    expect(featureCards.length).toBe(3);

    const titles = [...featureCards].map(card => card.querySelector('h3')?.textContent);
    expect(titles).toEqual([
      'Touren organisieren',
      'Personen im Blick behalten',
      'Im Notfall vorbereitet sein',
    ]);
  });

  it('should render link to tour editor for creating new tours', () => {
    const secondaryAction = fixture.nativeElement.querySelector('.secondary-action');
    expect(secondaryAction?.textContent).toContain('Neue Tour erstellen');
    expect(secondaryAction?.getAttribute('href')).toBe('/tour-editor');
  });
});
