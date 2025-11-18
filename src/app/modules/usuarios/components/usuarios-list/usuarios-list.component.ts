import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { User, UserRole } from '../../../../core/models/user.model';
import Swal from 'sweetalert2';
import { gsap } from 'gsap';

@Component({
  selector: 'app-usuarios-list',
  template: `
    <div class="usuarios-container" #container>
      <div class="header">
        <h1>Gestión de Usuarios</h1>
        <button mat-raised-button color="primary" (click)="nuevoUsuario()">
          <mat-icon>add</mat-icon>
          Nuevo Usuario
        </button>
      </div>

      <mat-card>
        <mat-card-content>
          <div class="filters">
            <mat-form-field appearance="outline">
              <mat-label>Buscar</mat-label>
              <input matInput (keyup)="applyFilter($event)" placeholder="Usuario, nombre, email...">
              <mat-icon matPrefix>search</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Rol</mat-label>
              <mat-select [(value)]="filterRol" (selectionChange)="applyFilter(null)">
                <mat-option value="">Todos</mat-option>
                <mat-option [value]="UserRole.ADMIN">Administrador</mat-option>
                <mat-option [value]="UserRole.OPERADOR">Operador</mat-option>
                <mat-option [value]="UserRole.REPARTIDOR">Repartidor</mat-option>
              </mat-select>
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

          <table mat-table [dataSource]="dataSource" matSort class="usuarios-table">
            <ng-container matColumnDef="username">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Usuario</th>
              <td mat-cell *matCellDef="let usuario">{{ usuario.username }}</td>
            </ng-container>

            <ng-container matColumnDef="fullName">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Nombre Completo</th>
              <td mat-cell *matCellDef="let usuario">{{ usuario.fullName }}</td>
            </ng-container>

            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Email</th>
              <td mat-cell *matCellDef="let usuario">{{ usuario.email }}</td>
            </ng-container>

            <ng-container matColumnDef="role">
              <th mat-header-cell *matHeaderCellDef>Rol</th>
              <td mat-cell *matCellDef="let usuario">
                <mat-chip>{{ getRoleLabel(usuario.role) }}</mat-chip>
              </td>
            </ng-container>

            <ng-container matColumnDef="active">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let usuario">
                <span class="badge" [class.active]="usuario.active" [class.inactive]="!usuario.active">
                  {{ usuario.active ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="lastLogin">
              <th mat-header-cell *matHeaderCellDef>Último Acceso</th>
              <td mat-cell *matCellDef="let usuario">
                {{ usuario.lastLogin ? formatDate(usuario.lastLogin) : 'Nunca' }}
              </td>
            </ng-container>

            <ng-container matColumnDef="acciones">
              <th mat-header-cell *matHeaderCellDef>Acciones</th>
              <td mat-cell *matCellDef="let usuario">
                <button mat-icon-button (click)="editarUsuario(usuario)" matTooltip="Editar">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="eliminarUsuario(usuario)" matTooltip="Eliminar" [disabled]="usuario.role === UserRole.ADMIN && usuario.username === 'admin'">
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
    .usuarios-container {
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

    .usuarios-table {
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
export class UsuariosListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns = ['username', 'fullName', 'email', 'role', 'active', 'lastLogin', 'acciones'];
  dataSource = new MatTableDataSource<User>([]);
  filterRol: UserRole | '' = '';
  filterActivo: boolean | '' = '';
  UserRole = UserRole;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsuarios();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    gsap.from('.usuarios-container', {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power3.out'
    });
  }

  loadUsuarios(): void {
    this.usuarioService.getAll().subscribe(usuarios => {
      this.dataSource.data = usuarios;
    });
  }

  applyFilter(event: any): void {
    const filterValue = event?.target?.value || '';
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.filterRol || this.filterActivo !== '') {
      this.dataSource.filterPredicate = (data: User, filter: string) => {
        const matchesFilter = !filter || 
          data.username.toLowerCase().includes(filter) ||
          data.fullName.toLowerCase().includes(filter) ||
          data.email.toLowerCase().includes(filter);
        
        const matchesRol = !this.filterRol || data.role === this.filterRol;
        const matchesActivo = this.filterActivo === '' || data.active === this.filterActivo;
        
        return matchesFilter && matchesRol && matchesActivo;
      };
    }

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  nuevoUsuario(): void {
    this.router.navigate(['/usuarios/nuevo']);
  }

  editarUsuario(usuario: User): void {
    this.router.navigate(['/usuarios/editar', usuario.id]);
  }

  eliminarUsuario(usuario: User): void {
    if (usuario.role === UserRole.ADMIN && usuario.username === 'admin') {
      Swal.fire('Error', 'No se puede eliminar el usuario administrador principal', 'error');
      return;
    }

    Swal.fire({
      title: '¿Eliminar usuario?',
      text: `¿Estás seguro de eliminar el usuario ${usuario.username}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.delete(usuario.id).subscribe(() => {
          Swal.fire('Eliminado', 'El usuario ha sido eliminado', 'success');
          this.loadUsuarios();
        });
      }
    });
  }

  getRoleLabel(role: UserRole): string {
    const labels: Record<UserRole, string> = {
      [UserRole.ADMIN]: 'Administrador',
      [UserRole.OPERADOR]: 'Operador',
      [UserRole.REPARTIDOR]: 'Repartidor'
    };
    return labels[role] || role;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString('es-ES');
  }
}

