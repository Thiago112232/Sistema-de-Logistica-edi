import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { VehiculoService } from '../../../../core/services/vehiculo.service';
import { Vehiculo, TipoVehiculo } from '../../../../core/models/vehiculo.model';
import Swal from 'sweetalert2';
import { gsap } from 'gsap';

@Component({
  selector: 'app-vehiculos-list',
  template: `
    <div class="vehiculos-container" #container>
      <div class="header">
        <h1>Gestión de Vehículos</h1>
        <button mat-raised-button color="primary" (click)="nuevoVehiculo()">
          <mat-icon>add</mat-icon>
          Nuevo Vehículo
        </button>
      </div>

      <mat-card>
        <mat-card-content>
          <div class="filters">
            <mat-form-field appearance="outline">
              <mat-label>Buscar</mat-label>
              <input matInput (keyup)="applyFilter($event)" placeholder="Placa, marca, modelo...">
              <mat-icon matPrefix>search</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Estado</mat-label>
              <mat-select [(value)]="filterEstado" (selectionChange)="applyFilter(null)">
                <mat-option value="">Todos</mat-option>
                <mat-option value="disponible">Disponible</mat-option>
                <mat-option value="en_uso">En Uso</mat-option>
                <mat-option value="mantenimiento">Mantenimiento</mat-option>
                <mat-option value="inactivo">Inactivo</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Tipo</mat-label>
              <mat-select [(value)]="filterTipo" (selectionChange)="applyFilter(null)">
                <mat-option value="">Todos</mat-option>
                <mat-option value="motocicleta">Motocicleta</mat-option>
                <mat-option value="automovil">Automóvil</mat-option>
                <mat-option value="camioneta">Camioneta</mat-option>
                <mat-option value="camion">Camión</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <table mat-table [dataSource]="dataSource" matSort class="vehiculos-table">
            <ng-container matColumnDef="placa">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Placa</th>
              <td mat-cell *matCellDef="let vehiculo">{{ vehiculo.placa }}</td>
            </ng-container>

            <ng-container matColumnDef="marca">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Marca</th>
              <td mat-cell *matCellDef="let vehiculo">{{ vehiculo.marca }}</td>
            </ng-container>

            <ng-container matColumnDef="modelo">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Modelo</th>
              <td mat-cell *matCellDef="let vehiculo">{{ vehiculo.modelo }}</td>
            </ng-container>

            <ng-container matColumnDef="tipo">
              <th mat-header-cell *matHeaderCellDef>Tipo</th>
              <td mat-cell *matCellDef="let vehiculo">
                <mat-chip>{{ getTipoLabel(vehiculo.tipo) }}</mat-chip>
              </td>
            </ng-container>

            <ng-container matColumnDef="capacidad">
              <th mat-header-cell *matHeaderCellDef>Capacidad</th>
              <td mat-cell *matCellDef="let vehiculo">
                {{ vehiculo.capacidadCarga }} kg / {{ vehiculo.capacidadVolumen }} m³
              </td>
            </ng-container>

            <ng-container matColumnDef="estado">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let vehiculo">
                <span class="badge" [class]="'badge-' + vehiculo.estado">
                  {{ getEstadoLabel(vehiculo.estado) }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="kilometraje">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Kilometraje</th>
              <td mat-cell *matCellDef="let vehiculo">{{ vehiculo.kilometraje | number }} km</td>
            </ng-container>

            <ng-container matColumnDef="acciones">
              <th mat-header-cell *matHeaderCellDef>Acciones</th>
              <td mat-cell *matCellDef="let vehiculo">
                <button mat-icon-button (click)="editarVehiculo(vehiculo)" matTooltip="Editar">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="eliminarVehiculo(vehiculo)" matTooltip="Eliminar">
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
    .vehiculos-container {
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

    .vehiculos-table {
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

    [data-theme="dark"] .badge-disponible { 
      background: rgba(16, 185, 129, 0.2); 
      color: #10b981; 
      border: 1px solid rgba(16, 185, 129, 0.3);
    }
    [data-theme="light"] .badge-disponible { 
      background: #a7f3d0; 
      color: #065f46; 
    }

    [data-theme="dark"] .badge-en_uso { 
      background: rgba(251, 146, 60, 0.2); 
      color: #fb923c; 
      border: 1px solid rgba(251, 146, 60, 0.3);
    }
    [data-theme="light"] .badge-en_uso { 
      background: #fed7aa; 
      color: #c2410c; 
    }

    [data-theme="dark"] .badge-mantenimiento { 
      background: rgba(168, 85, 247, 0.2); 
      color: #a855f7; 
      border: 1px solid rgba(168, 85, 247, 0.3);
    }
    [data-theme="light"] .badge-mantenimiento { 
      background: #e9d5ff; 
      color: #6b21a8; 
    }

    [data-theme="dark"] .badge-inactivo { 
      background: rgba(107, 114, 128, 0.2); 
      color: #9ca3af; 
      border: 1px solid rgba(107, 114, 128, 0.3);
    }
    [data-theme="light"] .badge-inactivo { 
      background: #f3f4f6; 
      color: #4b5563; 
    }
  `]
})
export class VehiculosListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns = ['placa', 'marca', 'modelo', 'tipo', 'capacidad', 'estado', 'kilometraje', 'acciones'];
  dataSource = new MatTableDataSource<Vehiculo>([]);
  filterEstado = '';
  filterTipo = '';

  constructor(
    private vehiculoService: VehiculoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadVehiculos();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    gsap.from('.vehiculos-container', {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power3.out'
    });
  }

  loadVehiculos(): void {
    this.vehiculoService.getAll().subscribe(vehiculos => {
      this.dataSource.data = vehiculos;
    });
  }

  applyFilter(event: any): void {
    const filterValue = event?.target?.value || '';
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.filterEstado) {
      this.dataSource.filterPredicate = (data: Vehiculo, filter: string) => {
        const matchesFilter = !filter || 
          data.placa.toLowerCase().includes(filter) ||
          data.marca.toLowerCase().includes(filter) ||
          data.modelo.toLowerCase().includes(filter);
        
        const matchesEstado = !this.filterEstado || data.estado === this.filterEstado;
        const matchesTipo = !this.filterTipo || data.tipo === this.filterTipo;
        
        return matchesFilter && matchesEstado && matchesTipo;
      };
    }

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  nuevoVehiculo(): void {
    this.router.navigate(['/vehiculos/nuevo']);
  }

  editarVehiculo(vehiculo: Vehiculo): void {
    this.router.navigate(['/vehiculos/editar', vehiculo.id]);
  }

  eliminarVehiculo(vehiculo: Vehiculo): void {
    Swal.fire({
      title: '¿Eliminar vehículo?',
      text: `¿Estás seguro de eliminar el vehículo ${vehiculo.placa}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.vehiculoService.delete(vehiculo.id).subscribe(() => {
          Swal.fire('Eliminado', 'El vehículo ha sido eliminado', 'success');
          this.loadVehiculos();
        });
      }
    });
  }

  getTipoLabel(tipo: TipoVehiculo): string {
    const labels: Record<TipoVehiculo, string> = {
      [TipoVehiculo.MOTOCICLETA]: 'Motocicleta',
      [TipoVehiculo.AUTOMOVIL]: 'Automóvil',
      [TipoVehiculo.CAMIONETA]: 'Camioneta',
      [TipoVehiculo.CAMION]: 'Camión'
    };
    return labels[tipo] || tipo;
  }

  getEstadoLabel(estado: string): string {
    const labels: Record<string, string> = {
      'disponible': 'Disponible',
      'en_uso': 'En Uso',
      'mantenimiento': 'Mantenimiento',
      'inactivo': 'Inactivo'
    };
    return labels[estado] || estado;
  }
}

