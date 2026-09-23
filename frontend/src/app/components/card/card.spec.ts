import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { Card } from './card';

@Component({
  imports: [Card],
  template: `
    <app-card title="Touren-Details">
      <p>Projected tour information</p>
    </app-card>
  `,
})
class TestHost {}

describe('Card', () => {
  let fixture: ComponentFixture<TestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
  });

  it('should render its title and projected body', () => {
    expect(fixture.nativeElement.querySelector('h3').textContent).toContain('Touren-Details');
    expect(fixture.nativeElement.querySelector('p').textContent).toContain('Projected tour information');
  });
});
