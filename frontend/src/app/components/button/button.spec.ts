import {ComponentFixture, TestBed} from '@angular/core/testing';
import {vi} from 'vitest';
import {Button} from './button';

describe('Button', () => {
  let fixture: ComponentFixture<Button>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Button]
    }).compileComponents();

    fixture = TestBed.createComponent(Button);
    fixture.componentRef.setInput('text', 'Delete');
    fixture.componentRef.setInput('variant', 'danger');
    fixture.detectChanges();
  });

  it('should render the selected variant and emit clicks', () => {
    const clicked = vi.fn();
    fixture.componentInstance.clicked.subscribe(clicked);
    const button = fixture.nativeElement.querySelector('button');

    button.click();

    expect(button.classList).toContain('danger');
    expect(clicked).toHaveBeenCalled();
  });

  it('should not emit clicks while disabled', () => {
    const clicked = vi.fn();
    fixture.componentInstance.clicked.subscribe(clicked);
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    fixture.nativeElement.querySelector('button').click();

    expect(clicked).not.toHaveBeenCalled();
  });
});
