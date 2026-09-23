import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { InfoItem } from './info-item';

@Component({
  imports: [InfoItem],
  template: `
    <app-info-item
      icon="location_on"
      title="Ort"
      description="Andermatt"
    />
  `,
})
class TestHost {}

describe('InfoItem', () => {
  let fixture: ComponentFixture<TestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
  });

  it('should render icon, title, and description', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.material-icons')?.textContent?.trim()).toBe('location_on');
    expect(el.querySelector('dt')?.textContent).toContain('Ort');
    expect(el.querySelector('dd')?.textContent).toContain('Andermatt');
  });
});
