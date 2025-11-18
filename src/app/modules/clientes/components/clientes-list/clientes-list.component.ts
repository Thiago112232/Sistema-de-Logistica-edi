import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ClienteService } from '../../../../core/services/cliente.service';
import { Cliente } from '../../../../core/models/cliente.model';
import Swal from 'sweetalert2';
import { gsap } from 'gsap';

@Component({
  selector: 'app-clientes-list',
  template: `
    <div class="clientes-container" #container>
      <div class="header">
        <h1>Gestión de Clientes</h1>
        <button mat-raised-button color="primary" (click)="nuevoCliente()">
          <mat-icon>add</mat-icon>
          Nuevo Cliente
        </button>
      </div>

      <mat-card>
        <mat-card-content>
          <div class="filters">
            <mat-form-field appearance="outline">
              <mat-label>Buscar</mat-label>
              <input matInput (keyup)="applyFilter($event)" placeholder="Nombre, código, documento...">
              <mat-icon matPrefix>search</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Estado</mat-label>
              <mat-select [(value)]="filterActivo" (selectionChange)="applyFilter(null)">
                <mat-option value="">Todos</mat-option>
                <mat-option [value]="true">Activos</mat-option>
                <mat-option [value]="false">Inactivos</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <table mat-table [dataSource]="dataSource" matSort class="clientes-table">
            <ng-container matColumnDef="codigo">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Código</th>
              <td mat-cell *matCellDef="let cliente">{{ cliente.codigo }}</td>
            </ng-container>

            <ng-container matColumnDef="nombre">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Nombre</th>
              <td mat-cell *matCellDef="let cliente">{{ cliente.nombre }}</td>
            </ng-container>

            <ng-container matColumnDef="documento">
              <th mat-header-cell *matHeaderCellDef>Documento</th>
              <td mat-cell *matCellDef="let cliente">
                {{ cliente.tipoDocumento.toUpperCase() }}: {{ cliente.numeroDocumento }}
              </td>
            </ng-container>

            <ng-container matColumnDef="contacto">
              <th mat-header-cell *matHeaderCellDef>Contacto</th>
              <td mat-cell *matCellDef="let cliente">
                <div>{{ cliente.email }}</div>
                <div class="small">{{ cliente.telefono }}</div>
              </td>
            </ng-container>

            <ng-container matColumnDef="ubicacion">
              <th mat-header-cell *matHeaderCellDef>Ubicación</th>
              <td mat-cell *matCellDef="let cliente">
                {{ cliente.ciudad }}, {{ cliente.pais }}
              </td>
            </ng-container>

            <ng-container matColumnDef="enviosTotales">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Envíos</th>
              <td mat-cell *matCellDef="let cliente">{{ cliente.enviosTotales }}</td>
            </ng-container>

            <ng-container matColumnDef="activo">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let cliente">
                <span class="badge" [class.active]="cliente.activo" [class.inactive]="!cliente.activo">
                  {{ cliente.activo ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="acciones">
              <th mat-header-cell *matHeaderCellDef>Acciones</th>
              <td mat-cell *matCellDef="let cliente">
                <button mat-icon-button (click)="editarCliente(cliente)" matTooltip="Editar">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="eliminarCliente(cliente)" matTooltip="Eliminar">
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
    .clientes-container {
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

    .clientes-table {
      width: 100%;
      background: transparent;
    }

    .small {
      font-size: 12px;
      color: var(--text-secondary);
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
  `]
})
export class ClientesListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns = ['codigo', 'nombre', 'documento', 'contacto', 'ubicacion', 'enviosTotales', 'activo', 'acciones'];
  dataSource = new MatTableDataSource<Cliente>([]);
  filterActivo: boolean | '' = '';

  constructor(
    private clienteService: ClienteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadClientes();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    gsap.from('.clientes-container', {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power3.out'
    });
  }

  loadClientes(): void {
    this.clienteService.getAll().subscribe(clientes => {
      this.dataSource.data = clientes;
    });
  }

  applyFilter(event: any): void {
    const filterValue = event?.target?.value || '';
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.filterActivo !== '') {
      this.dataSource.filterPredicate = (data: Cliente, filter: string) => {
        const matchesFilter = !filter || 
          data.nombre.toLowerCase().includes(filter) ||
          data.codigo.toLowerCase().includes(filter) ||
          data.numeroDocumento.toLowerCase().includes(filter) ||
          data.email.toLowerCase().includes(filter);
        
        const matchesActivo = this.filterActivo === '' || data.activo === this.filterActivo;
        
        return matchesFilter && matchesActivo;
      };
    }

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  nuevoCliente(): void {
    this.router.navigate(['/clientes/nuevo']);
  }

  editarCliente(cliente: Cliente): void {
    this.router.navigate(['/clientes/editar', cliente.id]);
  }

  eliminarCliente(cliente: Cliente): void {
    Swal.fire({
      title: '¿Eliminar cliente?',
      text: `¿Estás seguro de eliminar el cliente ${cliente.nombre}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.delete(cliente.id).subscribe(() => {
          Swal.fire('Eliminado', 'El cliente ha sido eliminado', 'success');
          this.loadClientes();
        });
      }
    });
  }
}

