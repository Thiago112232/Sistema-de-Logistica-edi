import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { PaqueteService } from '../../../../core/services/paquete.service';
import { Paquete } from '../../../../core/models/paquete.model';
import Swal from 'sweetalert2';
import { gsap } from 'gsap';

@Component({
  selector: 'app-paquetes-list',
  template: `
    <div class="paquetes-container" #container>
      <div class="header">
        <h1>Gestión de Paquetes</h1>
        <button mat-raised-button color="primary" (click)="nuevoPaquete()">
          <mat-icon>add</mat-icon>
          Nuevo Paquete
        </button>
      </div>

      <mat-card>
        <mat-card-content>
          <div class="filters">
            <mat-form-field appearance="outline">
              <mat-label>Buscar</mat-label>
              <input matInput (keyup)="applyFilter($event)" placeholder="Código, descripción...">
              <mat-icon matPrefix>search</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Estado</mat-label>
              <mat-select [(value)]="filterEstado" (selectionChange)="applyFilter(null)">
                <mat-option value="">Todos</mat-option>
                <mat-option value="disponible">Disponible</mat-option>
                <mat-option value="asignado">Asignado</mat-option>
                <mat-option value="en_transito">En Tránsito</mat-option>
                <mat-option value="entregado">Entregado</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <table mat-table [dataSource]="dataSource" matSort class="paquetes-table">
            <ng-container matColumnDef="codigo">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Código</th>
              <td mat-cell *matCellDef="let paquete">{{ paquete.codigo }}</td>
            </ng-container>

            <ng-container matColumnDef="descripcion">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Descripción</th>
              <td mat-cell *matCellDef="let paquete">{{ paquete.descripcion }}</td>
            </ng-container>

            <ng-container matColumnDef="peso">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Peso (kg)</th>
              <td mat-cell *matCellDef="let paquete">{{ paquete.peso }}</td>
            </ng-container>

            <ng-container matColumnDef="dimensiones">
              <th mat-header-cell *matHeaderCellDef>Dimensiones</th>
              <td mat-cell *matCellDef="let paquete">
                {{ paquete.largo }} x {{ paquete.ancho }} x {{ paquete.alto }} cm
              </td>
            </ng-container>

            <ng-container matColumnDef="valorDeclarado">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Valor</th>
              <td mat-cell *matCellDef="let paquete">{{ '$' + (paquete.valorDeclarado | number:'1.2-2') }}</td>
            </ng-container>

            <ng-container matColumnDef="fragil">
              <th mat-header-cell *matHeaderCellDef>Frágil</th>
              <td mat-cell *matCellDef="let paquete">
                <mat-icon [class.fragil]="paquete.fragil">{{ paquete.fragil ? 'warning' : 'check_circle' }}</mat-icon>
              </td>
            </ng-container>

            <ng-container matColumnDef="estado">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let paquete">
                <span class="badge" [class]="'badge-' + paquete.estado">
                  {{ paquete.estado }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="acciones">
              <th mat-header-cell *matHeaderCellDef>Acciones</th>
              <td mat-cell *matCellDef="let paquete">
                <button mat-icon-button [matMenuTriggerFor]="menu" (click)="selectedPaquete = paquete">
                  <mat-icon>more_vert</mat-icon>
                </button>
                <mat-menu #menu="matMenu">
                  <button mat-menu-item (click)="editarPaquete(selectedPaquete!)">
                    <mat-icon>edit</mat-icon>
                    <span>Editar</span>
                  </button>
                  <button mat-menu-item (click)="eliminarPaquete(selectedPaquete!)" class="delete-action">
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
    .paquetes-container {
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

    .paquetes-table {
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

    [data-theme="dark"] .badge-asignado { 
      background: rgba(251, 146, 60, 0.2); 
      color: #fb923c; 
      border: 1px solid rgba(251, 146, 60, 0.3);
    }
    [data-theme="light"] .badge-asignado { 
      background: #fed7aa; 
      color: #c2410c; 
    }

    [data-theme="dark"] .badge-en_transito { 
      background: rgba(59, 130, 246, 0.2); 
      color: #60a5fa; 
      border: 1px solid rgba(59, 130, 246, 0.3);
    }
    [data-theme="light"] .badge-en_transito { 
      background: #dbeafe; 
      color: #1e40af; 
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

    .fragil {
      color: #fb923c;
    }

    .delete-action {
      color: #ef4444;
    }
  `]
})
export class PaquetesListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['codigo', 'descripcion', 'peso', 'dimensiones', 'valorDeclarado', 'fragil', 'estado', 'acciones'];
  dataSource = new MatTableDataSource<Paquete>([]);
  selectedPaquete: Paquete | null = null;
  filterEstado = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private paqueteService: PaqueteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPaquetes();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    gsap.from('.paquetes-container', {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: 'power3.out'
    });
  }

  loadPaquetes(): void {
    this.paqueteService.getAll().subscribe(paquetes => {
      this.dataSource.data = paquetes;
    });
  }

  applyFilter(event: Event | null): void {
    const filterValue = event ? (event.target as HTMLInputElement).value : '';
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.filterEstado) {
      this.dataSource.filterPredicate = (data: Paquete, filter: string) => {
        const matchesFilter = filter === '' || 
          data.codigo.toLowerCase().includes(filter) ||
          data.descripcion.toLowerCase().includes(filter);
        return matchesFilter && data.estado === this.filterEstado;
      };
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }

  nuevoPaquete(): void {
    this.router.navigate(['/paquetes/nuevo']);
  }

  editarPaquete(paquete: Paquete): void {
    this.router.navigate(['/paquetes/editar', paquete.id]);
  }

  eliminarPaquete(paquete: Paquete): void {
    Swal.fire({
      title: '¿Eliminar paquete?',
      text: `¿Estás seguro de eliminar el paquete ${paquete.codigo}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.paqueteService.delete(paquete.id).subscribe(() => {
          Swal.fire('Eliminado', 'El paquete ha sido eliminado', 'success');
          this.loadPaquetes();
        });
      }
    });
  }
}

