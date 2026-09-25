import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  effect,
  input,
  signal,
  viewChild,
} from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-gpx';

@Component({
  selector: 'app-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="map-wrapper">
      @if (hasError()) {
        <p class="error-note">Die GPX-Routendaten konnten nicht dargestellt werden.</p>
      }

      @if (hasStats()) {
        <div class="gpx-stats">
          @if (routeName()) {
            <span class="stat-pill stat-name">
              <span class="material-icons" style="font-size: 1rem;" aria-hidden="true">place</span>
              {{ routeName() }}
            </span>
          }
          @if (distanceKm() !== null) {
            <span class="stat-pill">
              <span class="material-icons" style="font-size: 1rem;" aria-hidden="true">straighten</span>
              {{ distanceKm() }} km
            </span>
          }
          @if (elevationGain() !== null) {
            <span class="stat-pill">
              <span class="material-icons" style="font-size: 1rem;" aria-hidden="true">trending_up</span>
              +{{ elevationGain() }} m
            </span>
          }
          @if (elevationLoss() !== null) {
            <span class="stat-pill">
              <span class="material-icons" style="font-size: 1rem;" aria-hidden="true">trending_down</span>
              -{{ elevationLoss() }} m
            </span>
          }
        </div>
      }

      <div
        #mapContainer
        class="map-container"
        [style.height]="height()"
      ></div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
    }

    .map-wrapper {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      width: 100%;
    }

    .gpx-stats {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      font-size: 0.85rem;
    }

    .stat-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.35rem 0.65rem;
      background: var(--color-bg-surface-subtle);
      color: var(--color-text-main);
      border: 1px solid var(--color-border-default);
      border-radius: var(--radius-full);
    }

    .stat-name {
      background: var(--color-info-bg);
      color: var(--color-info-text);
      border-color: var(--color-info-border);
      font-weight: 500;
    }

    .map-container {
      width: 100%;
      border-radius: var(--radius-lg);
      overflow: hidden;
      border: 1px solid var(--color-border-default);
      box-shadow: var(--shadow-sm);
      z-index: 0;
    }

    .error-note {
      color: var(--color-danger);
      font-size: 0.85rem;
      margin: 0;
    }
  `,
})
export class MapComponent implements AfterViewInit, OnDestroy {
  readonly gpxData = input<string | undefined>();
  readonly height = input<string>('450px');

  private readonly mapContainer =
    viewChild.required<ElementRef<HTMLDivElement>>('mapContainer');

  private map?: L.Map;
  private currentGpxLayer?: any;
  private isMapReady = false;

  readonly distanceKm = signal<number | null>(null);
  readonly elevationGain = signal<number | null>(null);
  readonly elevationLoss = signal<number | null>(null);
  readonly routeName = signal<string | null>(null);
  readonly hasError = signal<boolean>(false);

  constructor() {
    effect(() => {
      const gpx = this.gpxData();
      if (this.isMapReady) {
        if (gpx) {
          this.loadGpx(gpx);
        } else {
          this.clearGpx();
        }
      }
    });
  }

  hasStats(): boolean {
    return (
      this.distanceKm() !== null ||
      this.elevationGain() !== null ||
      this.elevationLoss() !== null ||
      this.routeName() !== null
    );
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.isMapReady = true;

    const gpx = this.gpxData();
    if (gpx) {
      this.loadGpx(gpx);
    }

    setTimeout(() => {
      this.map?.invalidateSize();
    }, 150);
  }

  ngOnDestroy(): void {
    this.clearGpx();
    if (this.map) {
      this.map.remove();
      this.map = undefined;
    }
  }

  private initMap(): void {
    const el = this.mapContainer().nativeElement;
    // Schweiz Koordinaten als Standard-Zentrum
    this.map = L.map(el).setView([46.8182, 8.2275], 8);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);
  }

  private loadGpx(gpxContent: string): void {
    if (!this.map || !gpxContent.trim()) {
      return;
    }

    this.clearGpx();
    this.hasError.set(false);

    const startIcon = L.divIcon({
      className: 'gpx-marker gpx-start-marker',
      html: '<div style="background-color:var(--color-success);width:14px;height:14px;border-radius:50%;border:2px solid var(--color-bg-surface);box-shadow:var(--shadow-pin);" title="Start"></div>',
      iconSize: [14, 14],
      iconAnchor: [7, 7],
    });

    const endIcon = L.divIcon({
      className: 'gpx-marker gpx-end-marker',
      html: '<div style="background-color:var(--color-danger);width:14px;height:14px;border-radius:50%;border:2px solid var(--color-bg-surface);box-shadow:var(--shadow-pin);" title="Ziel"></div>',
      iconSize: [14, 14],
      iconAnchor: [7, 7],
    });

    const routeColor = typeof window !== 'undefined'
      ? getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() || '#4f46a5'
      : '#4f46a5';

    try {
      const gpxLayer = new (L as any).GPX(gpxContent, {
        async: true,
        marker_options: {
          startIcon,
          endIcon,
          wptIcons: {},
        },
        polyline_options: {
          color: routeColor,
          weight: 4,
          opacity: 0.85,
          lineCap: 'round',
          lineJoin: 'round',
        },
      });

      gpxLayer.on('loaded', (e: any) => {
        if (this.map) {
          this.map.fitBounds(e.target.getBounds(), { padding: [30, 30] });
          this.map.invalidateSize();
        }

        const dist = e.target.get_distance();
        if (typeof dist === 'number' && !isNaN(dist) && dist > 0) {
          this.distanceKm.set(Math.round((dist / 1000) * 10) / 10);
        }

        const gain = e.target.get_elevation_gain();
        if (typeof gain === 'number' && !isNaN(gain) && gain > 0) {
          this.elevationGain.set(Math.round(gain));
        }

        const loss = e.target.get_elevation_loss();
        if (typeof loss === 'number' && !isNaN(loss) && loss > 0) {
          this.elevationLoss.set(Math.round(loss));
        }

        const name = e.target.get_name();
        if (name && typeof name === 'string' && name.trim().length > 0) {
          this.routeName.set(name.trim());
        }
      });

      gpxLayer.on('error', (err: any) => {
        console.error('Fehler beim Parsen der GPX-Daten:', err);
        this.hasError.set(true);
      });

      this.currentGpxLayer = gpxLayer;
      gpxLayer.addTo(this.map);
    } catch (err) {
      console.error('Fehler beim Initialisieren des GPX Layers:', err);
      this.hasError.set(true);
    }
  }

  private clearGpx(): void {
    if (this.currentGpxLayer && this.map) {
      this.map.removeLayer(this.currentGpxLayer);
      this.currentGpxLayer = undefined;
    }
    this.distanceKm.set(null);
    this.elevationGain.set(null);
    this.elevationLoss.set(null);
    this.routeName.set(null);
    this.hasError.set(false);
  }
}