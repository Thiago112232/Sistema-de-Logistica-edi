import { Component, OnInit, Inject, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Envio, TrackingEvent } from '@core/models/envio.model';
import { DateUtil } from '@core/utils/date.util';
import { gsap } from 'gsap';

@Component({
  selector: 'app-tracking',
  template: `
    <h2 mat-dialog-title>Tracking - {{ data.numeroGuia }}</h2>
    <mat-dialog-content>
      <div class="tracking-container">
        <div class="envio-info">
          <div class="info-item">
            <strong>Cliente:</strong> {{ data.clienteNombre }}
          </div>
          <div class="info-item">
            <strong>Estado Actual:</strong>
            <span class="badge" [class]="'badge-' + data.estado">{{ data.estado }}</span>
          </div>
          <div class="info-item">
            <strong>Fecha Creación:</strong> {{ formatDate(data.fechaCreacion) }}
          </div>
          <div class="info-item" *ngIf="data.fechaEntrega">
            <strong>Fecha Entrega:</strong> {{ formatDate(data.fechaEntrega) }}
          </div>
        </div>

        <div class="timeline" #timeline>
          <div class="timeline-item" *ngFor="let event of trackingEvents; let i = index" [attr.data-index]="i">
            <div class="timeline-marker"></div>
            <div class="timeline-content">
              <div class="timeline-header">
                <span class="timeline-status">{{ getEstadoLabel(event.estado) }}</span>
                <span class="timeline-date">{{ formatDateTime(event.fecha) }}</span>
              </div>
              <div class="timeline-body" *ngIf="event.observaciones">
                {{ event.observaciones }}
              </div>
              <div class="timeline-location" *ngIf="event.ubicacion">
                <mat-icon>location_on</mat-icon>
                {{ event.ubicacion.direccion }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cerrar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .tracking-container {
      min-width: 600px;
    }

    .envio-info {
      background: var(--surface-color);
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 24px;
    }

    .info-item {
      margin-bottom: 12px;
      display: flex;
      gap: 8px;
    }

    .info-item:last-child {
      margin-bottom: 0;
    }

    .badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      margin-left: 8px;
    }

    .badge-creado { background: #e3f2fd; color: #1976d2; }
    .badge-en_transito { background: #fff3e0; color: #f57c00; }
    .badge-en_bodega { background: #f3e5f5; color: #7b1fa2; }
    .badge-en_reparto { background: #e8f5e9; color: #388e3c; }
    .badge-entregado { background: #e8f5e9; color: #2e7d32; }

    .timeline {
      position: relative;
      padding-left: 32px;
    }

    .timeline::before {
      content: '';
      position: absolute;
      left: 8px;
      top: 0;
      bottom: 0;
      width: 2px;
      background: var(--border-color);
    }

    .timeline-item {
      position: relative;
      margin-bottom: 24px;
      opacity: 0;
    }

    .timeline-marker {
      position: absolute;
      left: -24px;
      top: 4px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: var(--primary-color);
      border: 3px solid var(--surface-color);
      z-index: 1;
    }

    .timeline-content {
      background: var(--surface-color);
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .timeline-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .timeline-status {
      font-weight: 600;
      color: var(--text-primary);
    }

    .timeline-date {
      font-size: 12px;
      color: var(--text-secondary);
    }

    .timeline-body {
      color: var(--text-secondary);
      margin-bottom: 8px;
    }

    .timeline-location {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: var(--text-secondary);
    }

    .timeline-location mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
  `]
})
export class TrackingComponent implements OnInit, AfterViewInit {
  trackingEvents: TrackingEvent[] = [];
  @ViewChild('timeline') timeline!: ElementRef;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Envio) {}

  ngOnInit(): void {
    this.trackingEvents = [...this.data.tracking].reverse();
  }

  ngAfterViewInit(): void {
    // Animación de timeline
    const items = this.timeline.nativeElement.querySelectorAll('.timeline-item');
    gsap.from(items, {
      opacity: 0,
      x: -30,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power3.out'
    });
  }

  getEstadoLabel(estado: string): string {
    const labels: { [key: string]: string } = {
      'creado': 'Creado',
      'en_transito': 'En Tránsito',
      'en_bodega': 'En Bodega',
      'en_reparto': 'En Reparto',
      'entregado': 'Entregado',
      'cancelado': 'Cancelado'
    };
    return labels[estado] || estado;
  }

  formatDate(date: string): string {
    return DateUtil.format(date);
  }

  formatDateTime(date: string): string {
    return DateUtil.formatDateTime(date);
  }
}

