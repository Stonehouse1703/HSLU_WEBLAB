import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  effect,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { MapComponent } from '../../../tour-management/dumb_components/map/map';

export interface GpxLoadedEvent {
  content: string;
  fileName: string;
  suggestedName?: string;
  suggestedAltitude?: number;
}

@Component({
  selector: 'app-gpx-upload',
  imports: [MapComponent],
  template: `
    <div class="gpx-upload-container">
      <h3>GPX-Route (optional)</h3>

      @if (!fileName()) {
        <div
          class="dropzone"
          [class.drag-over]="isDragging()"
          (dragover)="onDragOver($event)"
          (dragleave)="onDragLeave($event)"
          (drop)="onDrop($event)"
          (click)="triggerFileInput()"
          role="button"
          tabindex="0"
          (keydown.enter)="triggerFileInput()"
          (keydown.space)="triggerFileInput()"
        >
          <input
            #fileInput
            type="file"
            accept=".gpx,application/gpx+xml"
            class="hidden-input"
            (change)="onFileInputChange($event)"
          />
          <p class="primary-text">GPX-Datei auswählen oder hierher ziehen</p>
          <p class="secondary-text">Unterstützt .gpx Dateien</p>
        </div>
      } @else {
        <div class="file-card">
          <div class="file-info-header">
            <div class="file-details">
              <div>
                <span class="file-name">{{ fileName() }}</span>
                <span class="file-size">({{ fileSize() }})</span>
              </div>
            </div>

            <button
              type="button"
              class="remove-button"
              (click)="clearFile()"
              aria-label="GPX-Datei entfernen"
            >
              Entfernen
            </button>
          </div>

          @if (gpxContent()) {
            <div class="map-preview-wrap">
              <span class="preview-label">Vorschau der Route:</span>
              <app-map [gpxData]="gpxContent()!" height="240px" />
            </div>
          }
        </div>
      }

      @if (errorMessage()) {
        <p class="error-message" role="alert">{{ errorMessage() }}</p>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
    }

    .gpx-upload-container {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      width: 100%;
    }

    h3 {
      margin: 0;
      color: #253c38;
      font-size: 1.1rem;
      font-weight: 600;
    }

    .dropzone {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem 1.5rem;
      border: 2px dashed #cbd5e1;
      border-radius: 12px;
      background: #f8fafc;
      cursor: pointer;
      text-align: center;
      transition: border-color 0.2s ease, background-color 0.2s ease;
    }

    .dropzone:hover,
    .dropzone.drag-over {
      border-color: #4f46a5;
      background: #f5f3ff;
    }

    .hidden-input {
      display: none;
    }

    .upload-icon {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    .primary-text {
      margin: 0;
      font-size: 0.95rem;
      font-weight: 500;
      color: #334155;
    }

    .secondary-text {
      margin: 0.25rem 0 0;
      font-size: 0.8rem;
      color: #64748b;
    }

    .file-card {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      padding: 1rem;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      background: #f8fafc;
    }

    .file-info-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .file-details {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .file-icon {
      font-size: 1.25rem;
    }

    .file-name {
      font-weight: 600;
      color: #1e293b;
      font-size: 0.95rem;
    }

    .file-size {
      color: #64748b;
      font-size: 0.85rem;
      margin-left: 0.35rem;
    }

    .remove-button {
      padding: 0.35rem 0.75rem;
      border: 1px solid #fca5a5;
      background: #fff;
      color: #dc2626;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.15s ease;
    }

    .remove-button:hover {
      background: #fef2f2;
    }

    .map-preview-wrap {
      margin-top: 0.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .preview-label {
      font-size: 0.85rem;
      font-weight: 500;
      color: #475569;
    }

    .error-message {
      color: #dc2626;
      font-size: 0.85rem;
      margin: 0;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GpxUpload {
  readonly initialGpx = input<string | null | undefined>(undefined);
  readonly gpxLoaded = output<GpxLoadedEvent>();
  readonly gpxCleared = output<void>();

  private readonly fileInput =
    viewChild<ElementRef<HTMLInputElement>>('fileInput');

  readonly isDragging = signal(false);
  readonly fileName = signal<string | null>(null);
  readonly fileSize = signal<string | null>(null);
  readonly gpxContent = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  constructor() {
    effect(() => {
      const gpx = this.initialGpx();
      if (gpx && !this.gpxContent()) {
        this.gpxContent.set(gpx);
        this.fileName.set('Hinterlegte GPX-Route');
        this.fileSize.set(this.formatFileSize(new Blob([gpx]).size));
      }
    });
  }

  triggerFileInput(): void {
    const input = this.fileInput()?.nativeElement;
    if (input) {
      input.value = '';
      input.click();
    }
  }

  onFileInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.processFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.processFile(files[0]);
    }
  }

  clearFile(): void {
    this.fileName.set(null);
    this.fileSize.set(null);
    this.gpxContent.set(null);
    this.errorMessage.set(null);
    this.gpxCleared.emit();
  }

  private processFile(file: File): void {
    this.errorMessage.set(null);

    if (!file.name.toLowerCase().endsWith('.gpx')) {
      this.errorMessage.set(
        'Bitte wählen Sie eine gültige Datei mit der Endung .gpx aus.',
      );
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const content = reader.result as string;
      if (!content || !content.trim().startsWith('<')) {
        this.errorMessage.set('Die Datei enthält keine gültigen XML/GPX Daten.');
        return;
      }

      this.fileName.set(file.name);
      this.fileSize.set(this.formatFileSize(file.size));
      this.gpxContent.set(content);

      const metadata = this.extractGpxMetadata(content);

      this.gpxLoaded.emit({
        content,
        fileName: file.name,
        suggestedName: metadata.suggestedName,
        suggestedAltitude: metadata.suggestedAltitude,
      });
    };

    reader.onerror = () => {
      this.errorMessage.set('Die Datei konnte nicht gelesen werden.');
    };

    reader.readAsText(file);
  }

  private formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  private extractGpxMetadata(xmlText: string): {
    suggestedName?: string;
    suggestedAltitude?: number;
  } {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xmlText, 'text/xml');

      let suggestedName: string | undefined;
      const trkName = doc.querySelector('trk > name');
      const metaName = doc.querySelector('metadata > name');
      if (trkName?.textContent?.trim()) {
        suggestedName = trkName.textContent.trim();
      } else if (metaName?.textContent?.trim()) {
        suggestedName = metaName.textContent.trim();
      }

      let suggestedAltitude: number | undefined;
      const eleNodes = doc.querySelectorAll('trkpt > ele');
      if (eleNodes.length > 0) {
        let maxEle = -Infinity;
        let minEle = Infinity;
        let totalGain = 0;
        let lastEle: number | null = null;

        eleNodes.forEach(node => {
          const ele = parseFloat(node.textContent ?? '');
          if (!isNaN(ele)) {
            if (ele > maxEle) maxEle = ele;
            if (ele < minEle) minEle = ele;
            if (lastEle !== null && ele > lastEle) {
              totalGain += ele - lastEle;
            }
            lastEle = ele;
          }
        });

        if (totalGain > 0) {
          suggestedAltitude = Math.round(totalGain);
        } else if (maxEle !== -Infinity && minEle !== Infinity && maxEle > minEle) {
          suggestedAltitude = Math.round(maxEle - minEle);
        }
      }

      return { suggestedName, suggestedAltitude };
    } catch {
      return {};
    }
  }
}
