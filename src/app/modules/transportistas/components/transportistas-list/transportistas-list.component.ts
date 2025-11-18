import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { TransportistaService } from '../../../../core/services/transportista.service';
import { Transportista } from '../../../../core/models/transportista.model';
import Swal from 'sweetalert2';
import { gsap } from 'gsap';

@Component({
  selector: 'app-transportistas-list',
  template: `
    <div class="transportistas-container" #container>
      <div class="header">
        <h1>Gestión de Transportistas</h1>
        <button mat-raised-button color="primary" (click)="nuevoTransportista()">
          <mat-icon>add</mat-icon>
          Nuevo Transportista
        </button>
      </div>

      <mat-card>
        <mat-card-content>
          <div class="filters">
            <mat-form-field appearance="outline">
              <mat-label>Buscar</mat-label>
              <input matInput (keyup)="applyFilter($event)" placeholder="Nombre, código...">
              <mat-icon matPrefix>search</mat-icon>
            </mat-form-field>
          </div>

          <table mat-table [dataSource]="dataSource" matSort class="transportistas-table">
            <ng-container matColumnDef="codigo">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Código</th>
              <td mat-cell *matCellDef="let t">{{ t.codigo }}</td>
            </ng-container>

            <ng-container matColumnDef="nombre">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Nombre</th>
              <td mat-cell *matCellDef="let t">{{ t.nombre }} {{ t.apellido }}</td>
            </ng-container>

            <ng-container matColumnDef="documento">
              <th mat-header-cell *matHeaderCellDef>Documento</th>
              <td mat-cell *matCellDef="let t">{{ t.documento }}</td>
            </ng-container>

            <ng-container matColumnDef="telefono">
              <th mat-header-cell *matHeaderCellDef>Teléfono</th>
              <td mat-cell *matCellDef="let t">{{ t.telefono }}</td>
            </ng-container>

            <ng-container matColumnDef="licencia">
              <th mat-header-cell *matHeaderCellDef>Licencia</th>
              <td mat-cell *matCellDef="let t">{{ t.licenciaConducir }}</td>
            </ng-container>

            <ng-container matColumnDef="calificacion">
              <th mat-header-cell *matHeaderCellDef>Calificación</th>
              <td mat-cell *matCellDef="let t">
                <span>{{ t.calificacion }}/5</span>
                <mat-icon>star</mat-icon>
              </td>
            </ng-container>

            <ng-container matColumnDef="activo">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let t">
                <span class="badge" [class.active]="t.activo" [class.inactive]="!t.activo">
                  {{ t.activo ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="acciones">
              <th mat-header-cell *matHeaderCellDef>Acciones</th>
              <td mat-cell *matCellDef="let t">
                <button mat-icon-button [matMenuTriggerFor]="menu" (click)="selectedTransportista = t">
                  <mat-icon>more_vert</mat-icon>
                </button>
                <mat-menu #menu="matMenu">
                  <button mat-menu-item (click)="editarTransportista(selectedTransportista!)">
                    <mat-icon>edit</mat-icon>
                    <span>Editar</span>
                  </button>
                  <button mat-menu-item (click)="eliminarTransportista(selectedTransportista!)" class="delete-action">
                    <mat-icon>delete</mat-icon>
                    <span>Eliminar</span>
                  </button>
                </mat-menu>
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
    .transportistas-container {
      padding: 24px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .filters {
      margin-bottom: 16px;
    }

    .filters mat-form-field {
      width: 100%;
    }

    .transportistas-container {
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

    [data-theme="dark"] .badge.active { 
      background: rgba(16, 185, 129, 0.2); 
      color: #10b981; 
      border: 1px solid rgba(16, 185, 129, 0.3);
    }
    [data-theme="light"] .badge.active { 
      background: #a7f3d0; 
      color: #065f46; 
    }

    [data-theme="dark"] .badge.inactive { 
      background: rgba(239, 68, 68, 0.2); 
      color: #ef4444; 
      border: 1px solid rgba(239, 68, 68, 0.3);
    }
    [data-theme="light"] .badge.inactive { 
      background: #fee2e2; 
      color: #991b1b; 
    }

    .delete-action {
      color: #f44336;
    }
  `]
})
export class TransportistasListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['codigo', 'nombre', 'documento', 'telefono', 'licencia', 'calificacion', 'activo', 'acciones'];
  dataSource = new MatTableDataSource<Transportista>([]);
  selectedTransportista: Transportista | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private transportistaService: TransportistaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTransportistas();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    gsap.from('.transportistas-container', {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: 'power3.out'
    });
  }

  loadTransportistas(): void {
    this.transportistaService.getAll().subscribe(transportistas => {
      this.dataSource.data = transportistas;
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  nuevoTransportista(): void {
    this.router.navigate(['/transportistas/nuevo']);
  }

  editarTransportista(transportista: Transportista): void {
    this.router.navigate(['/transportistas/editar', transportista.id]);
  }

  eliminarTransportista(transportista: Transportista): void {
    Swal.fire({
      title: '¿Eliminar transportista?',
      text: `¿Estás seguro de eliminar a ${transportista.nombre} ${transportista.apellido}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.transportistaService.delete(transportista.id).subscribe(() => {
          Swal.fire('Eliminado', 'El transportista ha sido eliminado', 'success');
          this.loadTransportistas();
        });
      }
    });
  }
}

