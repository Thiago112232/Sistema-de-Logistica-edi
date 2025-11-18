import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RutaService } from '../../../../core/services/ruta.service';
import { Ruta } from '../../../../core/models/ruta.model';
import * as L from 'leaflet';
import { gsap } from 'gsap';

@Component({
  selector: 'app-ruta-map',
  template: `
    <div class="map-container">
      <div class="header">
        <button mat-icon-button (click)="volver()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>Mapa de Ruta: {{ ruta?.codigo }}</h1>
      </div>

      <mat-card>
        <mat-card-content>
          <div *ngIf="ruta">
            <div class="ruta-info">
              <div class="info-item">
                <strong>Nombre:</strong> {{ ruta.nombre }}
              </div>
              <div class="info-item">
                <strong>Transportista:</strong> {{ ruta.transportistaNombre }}
              </div>
              <div class="info-item">
                <strong>Estado:</strong> 
                <span class="badge" [class]="'badge-' + ruta.estado">
                  {{ ruta.estado }}
                </span>
              </div>
              <div class="info-item">
                <strong>Puntos:</strong> {{ ruta.puntos.length }}
              </div>
              <div class="info-item">
                <strong>Distancia:</strong> {{ ruta.distanciaTotal }} km
              </div>
            </div>

            <div id="map" class="map"></div>
          </div>

          <div *ngIf="!ruta" class="loading">
            <mat-spinner></mat-spinner>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .map-container {
      padding: 24px;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
    }

    .header h1 {
      margin: 0;
      color: var(--text-primary);
    }

    .ruta-info {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 16px;
      padding: 16px;
      background: var(--surface-color);
      border-radius: 8px;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .map {
      height: 500px;
      width: 100%;
      border-radius: 8px;
    }

    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 500px;
    }

    .badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      text-transform: capitalize;
    }

    .badge-planificada { background: #e3f2fd; color: #1976d2; }
    .badge-en_curso { background: #fff3e0; color: #f57c00; }
    .badge-completada { background: #e8f5e9; color: #2e7d32; }
    .badge-cancelada { background: #ffebee; color: #c62828; }
  `]
})
export class RutaMapComponent implements OnInit, AfterViewInit {
  ruta: Ruta | null = null;
  map: L.Map | null = null;

  constructor(
    private rutaService: RutaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadRuta(id);
    }
  }

  ngAfterViewInit(): void {
    gsap.from('.map-container', {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power3.out'
    });
  }

  loadRuta(id: string): void {
    this.rutaService.getById(id).subscribe(ruta => {
      this.ruta = ruta;
      if (ruta && ruta.puntos.length > 0) {
        setTimeout(() => this.initMap(), 100);
      }
    });
  }

  initMap(): void {
    if (!this.ruta || !this.ruta.puntos.length) return;

    // Coordenadas por defecto (Lima, Perú)
    const defaultLat = -12.0464;
    const defaultLng = -77.0428;

    // Usar el primer punto como centro, o coordenadas por defecto
    const firstPoint = this.ruta.puntos[0];
    const centerLat = firstPoint?.lat || defaultLat;
    const centerLng = firstPoint?.lng || defaultLng;

    this.map = L.map('map').setView([centerLat, centerLng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Agregar marcadores para cada punto
    this.ruta.puntos.forEach((punto, index) => {
      const marker = L.marker([punto.lat, punto.lng]).addTo(this.map!);
      marker.bindPopup(`
        <strong>Punto ${index + 1}</strong><br>
        ${punto.direccion}<br>
        Estado: ${punto.estado}
      `);
    });

    // Crear polyline si hay más de un punto
    if (this.ruta.puntos.length > 1) {
      const latlngs = this.ruta.puntos.map(p => [p.lat, p.lng] as [number, number]);
      const polyline = L.polyline(latlngs, { color: '#3f51b5', weight: 4 }).addTo(this.map!);
      this.map.fitBounds(polyline.getBounds());
    }
  }

  volver(): void {
    this.router.navigate(['/rutas']);
  }
}

