import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { RutaService } from '../../../../core/services/ruta.service';
import { Ruta } from '../../../../core/models/ruta.model';
import Swal from 'sweetalert2';
import { gsap } from 'gsap';

@Component({
  selector: 'app-rutas-list',
  template: `
    <div class="rutas-container" #container>
      <div class="header">
        <h1>Gestión de Rutas</h1>
        <button mat-raised-button color="primary" (click)="nuevaRuta()">
          <mat-icon>add</mat-icon>
          Nueva Ruta
        </button>
      </div>

      <mat-card>
        <mat-card-content>
          <div class="filters">
            <mat-form-field appearance="outline">
              <mat-label>Buscar</mat-label>
              <input matInput (keyup)="applyFilter($event)" placeholder="Código, nombre, transportista...">
              <mat-icon matPrefix>search</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Estado</mat-label>
              <mat-select [(value)]="filterEstado" (selectionChange)="applyFilter(null)">
                <mat-option value="">Todos</mat-option>
                <mat-option value="planificada">Planificada</mat-option>
                <mat-option value="en_curso">En Curso</mat-option>
                <mat-option value="completada">Completada</mat-option>
                <mat-option value="cancelada">Cancelada</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <table mat-table [dataSource]="dataSource" matSort class="rutas-table">
            <ng-container matColumnDef="codigo">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Código</th>
              <td mat-cell *matCellDef="let ruta">{{ ruta.codigo }}</td>
            </ng-container>

            <ng-container matColumnDef="nombre">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Nombre</th>
              <td mat-cell *matCellDef="let ruta">{{ ruta.nombre }}</td>
            </ng-container>

            <ng-container matColumnDef="transportista">
              <th mat-header-cell *matHeaderCellDef>Transportista</th>
              <td mat-cell *matCellDef="let ruta">{{ ruta.transportistaNombre }}</td>
            </ng-container>

            <ng-container matColumnDef="puntos">
              <th mat-header-cell *matHeaderCellDef>Puntos</th>
              <td mat-cell *matCellDef="let ruta">{{ ruta.puntos.length }} paradas</td>
            </ng-container>

            <ng-container matColumnDef="distancia">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Distancia</th>
              <td mat-cell *matCellDef="let ruta">{{ ruta.distanciaTotal }} km</td>
            </ng-container>

            <ng-container matColumnDef="tiempo">
              <th mat-header-cell *matHeaderCellDef>Tiempo Estimado</th>
              <td mat-cell *matCellDef="let ruta">{{ ruta.tiempoEstimado }} min</td>
            </ng-container>

            <ng-container matColumnDef="estado">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let ruta">
                <span class="badge" [class]="'badge-' + ruta.estado">
                  {{ getEstadoLabel(ruta.estado) }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="fecha">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Fecha</th>
              <td mat-cell *matCellDef="let ruta">{{ formatDate(ruta.fecha) }}</td>
            </ng-container>

            <ng-container matColumnDef="acciones">
              <th mat-header-cell *matHeaderCellDef>Acciones</th>
              <td mat-cell *matCellDef="let ruta">
                <button mat-icon-button (click)="verMapa(ruta)" matTooltip="Ver Mapa">
                  <mat-icon>map</mat-icon>
                </button>
                <button mat-icon-button (click)="editarRuta(ruta)" matTooltip="Editar">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="eliminarRuta(ruta)" matTooltip="Eliminar">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>

          <mat-paginator [pageSizeOptions]="[5, 10, 20, 50]" showFirstLastButtons></mat-paginator>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .rutas-container {
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

    .rutas-table {
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

    [data-theme="dark"] .badge-planificada { 
      background: rgba(59, 130, 246, 0.2); 
      color: #60a5fa; 
      border: 1px solid rgba(59, 130, 246, 0.3);
    }
    [data-theme="light"] .badge-planificada { 
      background: #dbeafe; 
      color: #1e40af; 
    }

    [data-theme="dark"] .badge-en_curso { 
      background: rgba(251, 146, 60, 0.2); 
      color: #fb923c; 
      border: 1px solid rgba(251, 146, 60, 0.3);
    }
    [data-theme="light"] .badge-en_curso { 
      background: #fed7aa; 
      color: #c2410c; 
    }

    [data-theme="dark"] .badge-completada { 
      background: rgba(16, 185, 129, 0.2); 
      color: #10b981; 
      border: 1px solid rgba(16, 185, 129, 0.3);
    }
    [data-theme="light"] .badge-completada { 
      background: #a7f3d0; 
      color: #065f46; 
    }

    [data-theme="dark"] .badge-cancelada { 
      background: rgba(239, 68, 68, 0.2); 
      color: #ef4444; 
      border: 1px solid rgba(239, 68, 68, 0.3);
    }
    [data-theme="light"] .badge-cancelada { 
      background: #fee2e2; 
      color: #991b1b; 
    }
  `]
})
export class RutasListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns = ['codigo', 'nombre', 'transportista', 'puntos', 'distancia', 'tiempo', 'estado', 'fecha', 'acciones'];
  dataSource = new MatTableDataSource<Ruta>([]);
  filterEstado = '';

  constructor(
    private rutaService: RutaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRutas();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    gsap.from('.rutas-container', {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power3.out'
    });
  }

  loadRutas(): void {
    this.rutaService.getAll().subscribe(rutas => {
      this.dataSource.data = rutas;
    });
  }

  applyFilter(event: any): void {
    const filterValue = event?.target?.value || '';
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.filterEstado) {
      this.dataSource.filterPredicate = (data: Ruta, filter: string) => {
        const matchesFilter = !filter || 
          data.codigo.toLowerCase().includes(filter) ||
          data.nombre.toLowerCase().includes(filter) ||
          data.transportistaNombre.toLowerCase().includes(filter);
        
        const matchesEstado = !this.filterEstado || data.estado === this.filterEstado;
        
        return matchesFilter && matchesEstado;
      };
    }

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  nuevaRuta(): void {
    this.router.navigate(['/rutas/nuevo']);
  }

  editarRuta(ruta: Ruta): void {
    this.router.navigate(['/rutas/editar', ruta.id]);
  }

  verMapa(ruta: Ruta): void {
    this.router.navigate(['/rutas/mapa', ruta.id]);
  }

  eliminarRuta(ruta: Ruta): void {
    Swal.fire({
      title: '¿Eliminar ruta?',
      text: `¿Estás seguro de eliminar la ruta ${ruta.codigo}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.rutaService.delete(ruta.id).subscribe(() => {
          Swal.fire('Eliminada', 'La ruta ha sido eliminada', 'success');
          this.loadRutas();
        });
      }
    });
  }

  getEstadoLabel(estado: string): string {
    const labels: Record<string, string> = {
      'planificada': 'Planificada',
      'en_curso': 'En Curso',
      'completada': 'Completada',
      'cancelada': 'Cancelada'
    };
    return labels[estado] || estado;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('es-ES');
  }
}

