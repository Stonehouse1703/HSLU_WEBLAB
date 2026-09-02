import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Navigation } from './navigation';
import { inputBinding, signal } from '@angular/core';


describe('Navigation', () => {
  let component: Navigation;
  let fixture: ComponentFixture<Navigation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navigation],
    }).compileComponents();

    fixture = TestBed.createComponent(Navigation, {
      bindings: [
        inputBinding('links', signal([]))
      ]
    });
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
