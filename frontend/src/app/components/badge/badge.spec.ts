import { TestBed } from '@angular/core/testing';
import { describe, it, expect } from 'vitest';
import { inputBinding, signal } from '@angular/core';
import { Badge } from './badge';
import { BadgeColor } from './badge.type';

describe('Badge', () => {
  it('should create', async () => {
    const { component } = await setup();
    expect(component).toBeTruthy();
  });

  it('should render the text', async () => {
    const { fixture } = await setup();
    expect(fixture.nativeElement.querySelector('div.badge').textContent).toContain('Badge Text');
  });

  it('should attach class for primary badge by default', async () => {
    const { fixture } = await setup();
    const badgeElementClasses = fixture.nativeElement.querySelector('div.badge').classList;
    expect(badgeElementClasses.contains('primary')).toBe(true);
    expect(badgeElementClasses.contains('badge')).toBe(true);
  });

  it('should attach class for secondary badge', async () => {
    const { fixture } = await setup({ color: 'secondary' });
    const badgeElementClasses = fixture.nativeElement.querySelector('div.badge').classList;
    expect(badgeElementClasses.contains('secondary')).toBe(true);
    expect(badgeElementClasses.contains('badge')).toBe(true);
  });

  it('should attach class for danger badge', async () => {
    const { fixture } = await setup({ color: 'danger', text: 'Gefahr' });
    const badge = fixture.nativeElement.querySelector('div.badge');
    expect(badge.classList.contains('danger')).toBe(true);
    expect(badge.textContent).toContain('Gefahr');
  });

  it('should attach class for success badge', async () => {
    const { fixture } = await setup({ color: 'success', text: 'Erfolgreich' });
    const badge = fixture.nativeElement.querySelector('div.badge');
    expect(badge.classList.contains('success')).toBe(true);
    expect(badge.textContent).toContain('Erfolgreich');
  });
});

interface Props {
  text: string;
  color: BadgeColor;
}

const defaultProps: Props = {
  text: 'Badge Text',
  color: 'primary',
};

async function setup(props: Partial<Props> = {}) {
  const mergedProps = { ...defaultProps, ...props };

  await TestBed.configureTestingModule({
    imports: [Badge],
  }).compileComponents();

  const fixture = TestBed.createComponent(Badge, {
    bindings: [
      inputBinding('text', signal(mergedProps.text)),
      inputBinding('color', signal(mergedProps.color)),
    ],
  });
  const component = fixture.componentInstance;
  fixture.detectChanges();

  return {
    fixture,
    component,
  };
}
