import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EnvioService } from '../../../../core/services/envio.service';
import { Envio, EstadoEnvio } from '../../../../core/models/envio.model';
import { EnvioFormComponent } from '../envio-form/envio-form.component';
import { TrackingComponent } from '../tracking/tracking.component';
import Swal from 'sweetalert2';
import { gsap } from 'gsap';

@Component({
  selector: 'app-envios-list',
  template: `
    <div class="envios-container" #container>
      <div class="header">
        <h1>Gestión de Envíos</h1>
        <button mat-raised-button color="primary" (click)="openForm()">
          <mat-icon>add</mat-icon>
          Nuevo Envío
        </button>
      </div>

      <mat-card>
        <div class="filters">
          <mat-form-field appearance="outline">
            <mat-label>Buscar</mat-label>
            <input matInput (keyup)="applyFilter($event)" placeholder="N° Guía, Cliente...">
            <mat-icon matPrefix>search</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Estado</mat-label>
            <mat-select (selectionChange)="filterByEstado($event.value)">
              <mat-option value="">Todos</mat-option>
              <mat-option value="creado">Creado</mat-option>
              <mat-option value="en_transito">En Tránsito</mat-option>
              <mat-option value="en_bodega">En Bodega</mat-option>
              <mat-option value="en_reparto">En Reparto</mat-option>
              <mat-option value="entregado">Entregado</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <table mat-table [dataSource]="dataSource" matSort class="envios-table">
          <ng-container matColumnDef="numeroGuia">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>N° Guía</th>
            <td mat-cell *matCellDef="let envio">{{ envio.numeroGuia }}</td>
          </ng-container>

          <ng-container matColumnDef="clienteNombre">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Cliente</th>
            <td mat-cell *matCellDef="let envio">{{ envio.clienteNombre }}</td>
          </ng-container>

          <ng-container matColumnDef="estado">
            <th mat-header-cell *matHeaderCellDef>Estado</th>
            <td mat-cell *matCellDef="let envio">
              <span class="badge" [class]="'badge-' + envio.estado">
                {{ getEstadoLabel(envio.estado) }}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="fechaCreacion">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Fecha Creación</th>
            <td mat-cell *matCellDef="let envio">{{ formatDate(envio.fechaCreacion) }}</td>
          </ng-container>

          <ng-container matColumnDef="acciones">
            <th mat-header-cell *matHeaderCellDef>Acciones</th>
            <td mat-cell *matCellDef="let envio">
              <button mat-icon-button (click)="viewTracking(envio)" matTooltip="Tracking">
                <mat-icon>location_on</mat-icon>
              </button>
              <button mat-icon-button (click)="editEnvio(envio)" matTooltip="Editar">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deleteEnvio(envio)" matTooltip="Eliminar">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <mat-paginator [pageSizeOptions]="[5, 10, 25, 100]" showFirstLastButtons></mat-paginator>
      </mat-card>
    </div>
  `,
  styles: [`
    .envios-container {
      padding: 0;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
      letter-spacing: -0.5px;
      background: var(--primary-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .header button {
      background: var(--primary-gradient) !important;
      box-shadow: 0 4px 16px rgba(99, 102, 241, 0.4) !important;
    }

    mat-card {
      background: var(--glass-bg) !important;
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--glass-border) !important;
      border-radius: 20px !important;
      padding: 24px !important;
    }

    .filters {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
    }

    .filters mat-form-field {
      flex: 1;
    }

    .envios-table {
      width: 100%;
      background: transparent;
    }

    .badge {
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: inline-flex;
      align-items: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }

    [data-theme="dark"] .badge-creado { 
      background: rgba(59, 130, 246, 0.2); 
      color: #60a5fa; 
      border: 1px solid rgba(59, 130, 246, 0.3);
    }
    [data-theme="light"] .badge-creado { 
      background: #dbeafe; 
      color: #1e40af; 
    }

    [data-theme="dark"] .badge-en_transito { 
      background: rgba(251, 146, 60, 0.2); 
      color: #fb923c; 
      border: 1px solid rgba(251, 146, 60, 0.3);
    }
    [data-theme="light"] .badge-en_transito { 
      background: #fed7aa; 
      color: #c2410c; 
    }

    [data-theme="dark"] .badge-en_bodega { 
      background: rgba(168, 85, 247, 0.2); 
      color: #a855f7; 
      border: 1px solid rgba(168, 85, 247, 0.3);
    }
    [data-theme="light"] .badge-en_bodega { 
      background: #e9d5ff; 
      color: #6b21a8; 
    }

    [data-theme="dark"] .badge-en_reparto { 
      background: rgba(34, 197, 94, 0.2); 
      color: #22c55e; 
      border: 1px solid rgba(34, 197, 94, 0.3);
    }
    [data-theme="light"] .badge-en_reparto { 
      background: #bbf7d0; 
      color: #166534; 
    }

    [data-theme="dark"] .badge-entregado { 
      background: rgba(16, 185, 129, 0.2); 
      color: #10b981; 
      border: 1px solid rgba(16, 185, 129, 0.3);
    }
    [data-theme="light"] .badge-entregado { 
      background: #a7f3d0; 
      color: #065f46; 
    }

    [data-theme="dark"] .badge-cancelado { 
      background: rgba(239, 68, 68, 0.2); 
      color: #ef4444; 
      border: 1px solid rgba(239, 68, 68, 0.3);
    }
    [data-theme="light"] .badge-cancelado { 
      background: #fee2e2; 
      color: #991b1b; 
    }
  `]
})
export class EnviosListComponent implements OnInit, AfterViewInit {
  displayedColumns = ['numeroGuia', 'clienteNombre', 'estado', 'fechaCreacion', 'acciones'];
  dataSource = new MatTableDataSource<Envio>();
  envios: Envio[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private envioService: EnvioService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadEnvios();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    // Animación de entrada
    gsap.from('.envios-container', {
      opacity: 0,
      y: 20,
      duration: 0.5
    });
  }

  loadEnvios(): void {
    this.envioService.getAll().subscribe(envios => {
      this.envios = envios;
      this.dataSource.data = envios;
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  filterByEstado(estado: string): void {
    if (estado) {
      this.dataSource.data = this.envios.filter(e => e.estado === estado);
    } else {
      this.dataSource.data = this.envios;
    }
  }

  openForm(envio?: Envio): void {
    const dialogRef = this.dialog.open(EnvioFormComponent, {
      width: '600px',
      data: envio
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadEnvios();
      }
    });
  }

  editEnvio(envio: Envio): void {
    this.openForm(envio);
  }

  viewTracking(envio: Envio): void {
    this.dialog.open(TrackingComponent, {
      width: '800px',
      data: envio
    });
  }

  deleteEnvio(envio: Envio): void {
    Swal.fire({
      title: '¿Eliminar envío?',
      text: `¿Estás seguro de eliminar el envío ${envio.numeroGuia}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.envioService.delete(envio.id).subscribe(() => {
          Swal.fire('Eliminado', 'El envío ha sido eliminado', 'success');
          this.loadEnvios();
        });
      }
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
    return new Date(date).toLocaleDateString('es-ES');
  }
}

