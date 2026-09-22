import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { GpxUpload } from './gpx-upload';

describe('GpxUpload', () => {
  let component: GpxUpload;
  let fixture: ComponentFixture<GpxUpload>;
  const OriginalFileReader = globalThis.FileReader;

  const sampleGpxXml = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Test">
  <metadata><name>Metadata Name</name></metadata>
  <trk>
    <name>Pazolastock Route</name>
    <trkseg>
      <trkpt lat="46.657" lon="8.671"><ele>2044</ele></trkpt>
      <trkpt lat="46.662" lon="8.665"><ele>2400</ele></trkpt>
      <trkpt lat="46.668" lon="8.658"><ele>2740</ele></trkpt>
    </trkseg>
  </trk>
</gpx>`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpxUpload],
    }).compileComponents();

    fixture = TestBed.createComponent(GpxUpload);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    globalThis.FileReader = OriginalFileReader;
  });

  it('should initialize with dropzone visible when no file loaded', () => {
    expect(component.fileName()).toBeNull();
    const dropzone = fixture.nativeElement.querySelector('.dropzone');
    expect(dropzone).toBeTruthy();
    expect(dropzone.textContent).toContain('GPX-Datei auswählen oder hierher ziehen');
  });

  it('should display file card when initialGpx input is set', () => {
    fixture.componentRef.setInput('initialGpx', sampleGpxXml);
    fixture.detectChanges();

    expect(component.fileName()).toBe('Hinterlegte GPX-Route');
    expect(component.gpxContent()).toBe(sampleGpxXml);
    expect(fixture.nativeElement.querySelector('.file-card')).toBeTruthy();
  });

  it('should reject files that do not have .gpx extension', () => {
    const file = new File(['hello'], 'document.pdf', { type: 'application/pdf' });
    (component as any).processFile(file);
    fixture.detectChanges();

    expect(component.errorMessage()).toBe('Bitte wählen Sie eine gültige Datei mit der Endung .gpx aus.');
    expect(component.fileName()).toBeNull();
  });

  it('should reject files with invalid content that do not start with <', () => {
    class MockFileReader {
      result = 'invalid text';
      onload: (() => void) | null = null;
      readAsText() {
        this.onload?.();
      }
    }
    vi.stubGlobal('FileReader', MockFileReader);

    const file = new File(['invalid text'], 'route.gpx', { type: 'text/plain' });
    (component as any).processFile(file);

    expect(component.errorMessage()).toBe('Die Datei enthält keine gültigen XML/GPX Daten.');
  });

  it('should parse valid GPX, extract metadata and emit gpxLoaded', () => {
    const loadedSpy = vi.fn();
    component.gpxLoaded.subscribe(loadedSpy);

    class MockFileReader {
      result = sampleGpxXml;
      onload: (() => void) | null = null;
      readAsText() {
        this.onload?.();
      }
    }
    vi.stubGlobal('FileReader', MockFileReader);

    const file = new File([sampleGpxXml], 'pazola.gpx', { type: 'application/gpx+xml' });
    (component as any).processFile(file);

    expect(component.fileName()).toBe('pazola.gpx');
    expect(component.gpxContent()).toBe(sampleGpxXml);
    expect(loadedSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        fileName: 'pazola.gpx',
        content: sampleGpxXml,
        suggestedName: 'Pazolastock Route',
        suggestedAltitude: 696,
      }),
    );
  });

  it('should clear loaded file and emit gpxCleared on clearFile()', () => {
    const clearSpy = vi.fn();
    component.gpxCleared.subscribe(clearSpy);

    component.fileName.set('my-route.gpx');
    component.gpxContent.set(sampleGpxXml);

    component.clearFile();

    expect(component.fileName()).toBeNull();
    expect(component.gpxContent()).toBeNull();
    expect(component.errorMessage()).toBeNull();
    expect(clearSpy).toHaveBeenCalledTimes(1);
  });

  it('should handle drag events correctly', () => {
    const dragEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    } as unknown as DragEvent;

    component.onDragOver(dragEvent);
    expect(component.isDragging()).toBe(true);

    component.onDragLeave(dragEvent);
    expect(component.isDragging()).toBe(false);
  });
});
