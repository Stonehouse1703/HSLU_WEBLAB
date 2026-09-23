import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { SecurityMatrixDisplay } from './security-matrix-display';
import { SecurityMatrix } from '../../tour.types';

describe('SecurityMatrixDisplay', () => {
  let fixture: ComponentFixture<SecurityMatrixDisplay>;
  let component: SecurityMatrixDisplay;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecurityMatrixDisplay],
    }).compileComponents();

    fixture = TestBed.createComponent(SecurityMatrixDisplay);
    component = fixture.componentInstance;
  });

  it('should render nothing if matrix has no data', () => {
    fixture.componentRef.setInput('matrix', undefined);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-card')).toBeNull();
  });

  it('should render 3x3 matrix when data is present', () => {
    const mockMatrix: SecurityMatrix = {
      participants: 'bekannt',
      cloudCover: 'sonnig',
      precipitation: 'kein',
      visibility: 'gut',
      wind: 'windstill',
      temperature2000m: '-5',
      avalancheDanger: 2,
      dangerSources: ['Triebschnee', 'Gleitschnee'],
    };

    fixture.componentRef.setInput('matrix', mockMatrix);
    fixture.detectChanges();

    const titleEl = fixture.nativeElement.querySelector('h3');
    expect(titleEl?.textContent).toContain('3x3 Sicherheitsmatrix');

    const content = fixture.nativeElement.textContent;
    expect(content).toContain('Bekannt');
    expect(content).toContain('Sonnig');
    expect(content).toContain('Kein');
    expect(content).toContain('-5 °C');
    expect(content).toContain('Stufe 2 – Mässig');
    expect(content).toContain('Triebschnee');
    expect(content).toContain('Gleitschnee');
  });
});
