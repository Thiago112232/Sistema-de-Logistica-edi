import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { User, UserRole } from '../../../../core/models/user.model';
import Swal from 'sweetalert2';
import { gsap } from 'gsap';

@Component({
  selector: 'app-usuario-form',
  template: `
    <div class="form-container" #formContainer>
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ isEdit ? 'Editar Usuario' : 'Nuevo Usuario' }}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="usuarioForm" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Usuario</mat-label>
                <input matInput formControlName="username" placeholder="usuario" [readonly]="isEdit">
                <mat-error *ngIf="usuarioForm.get('username')?.hasError('required')">
                  El usuario es requerido
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Nombre Completo</mat-label>
                <input matInput formControlName="fullName" placeholder="Nombre Completo">
                <mat-error *ngIf="usuarioForm.get('fullName')?.hasError('required')">
                  El nombre es requerido
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Email</mat-label>
                <input matInput type="email" formControlName="email" placeholder="usuario@email.com">
                <mat-error *ngIf="usuarioForm.get('email')?.hasError('required')">
                  El email es requerido
                </mat-error>
                <mat-error *ngIf="usuarioForm.get('email')?.hasError('email')">
                  Email inválido
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Contraseña</mat-label>
                <input matInput type="password" formControlName="password" [required]="!isEdit">
                <mat-error *ngIf="usuarioForm.get('password')?.hasError('required')">
                  La contraseña es requerida
                </mat-error>
                <mat-hint *ngIf="isEdit">Dejar vacío para mantener la contraseña actual</mat-hint>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Rol</mat-label>
                <mat-select formControlName="role">
                  <mat-option [value]="UserRole.ADMIN">Administrador</mat-option>
                  <mat-option [value]="UserRole.OPERADOR">Operador</mat-option>
                  <mat-option [value]="UserRole.REPARTIDOR">Repartidor</mat-option>
                </mat-select>
                <mat-error *ngIf="usuarioForm.get('role')?.hasError('required')">
                  El rol es requerido
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-checkbox formControlName="active">Usuario Activo</mat-checkbox>
            </div>

            <div class="form-actions">
              <button mat-button type="button" (click)="cancelar()">Cancelar</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="usuarioForm.invalid">
                {{ isEdit ? 'Actualizar' : 'Crear' }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-container {
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
    }

    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }

    .form-row mat-form-field {
      flex: 1;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      margin-top: 24px;
    }
  `]
})
export class UsuarioFormComponent implements OnInit {
  usuarioForm: FormGroup;
  isEdit = false;
  usuarioId?: string;
  UserRole = UserRole;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.usuarioForm = this.fb.group({
      username: ['', Validators.required],
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: [UserRole.OPERADOR, Validators.required],
      active: [true]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.usuarioId = id;
      this.loadUsuario(id);
      // En modo edición, la contraseña no es requerida
      this.usuarioForm.get('password')?.clearValidators();
      this.usuarioForm.get('password')?.updateValueAndValidity();
    }

    gsap.from('.form-container', {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power3.out'
    });
  }

  loadUsuario(id: string): void {
    this.usuarioService.getById(id).subscribe(usuario => {
      if (usuario) {
        this.usuarioForm.patchValue({
          ...usuario,
          password: '' // No mostrar la contraseña
        });
      }
    });
  }

  onSubmit(): void {
    if (this.usuarioForm.valid) {
      const usuarioData = this.usuarioForm.value;
      
      // Si es edición y no se cambió la contraseña, no incluirla
      if (this.isEdit && !usuarioData.password) {
        delete usuarioData.password;
      }
      
      if (this.isEdit && this.usuarioId) {
        this.usuarioService.getById(this.usuarioId).subscribe(existingUser => {
          if (existingUser) {
            const updatedUser: User = {
              ...existingUser,
              ...usuarioData,
              id: this.usuarioId!
            };
            // Si no se proporcionó nueva contraseña, mantener la anterior
            if (!usuarioData.password) {
              updatedUser.password = existingUser.password;
            }
            this.usuarioService.update(updatedUser).subscribe(() => {
              Swal.fire('Actualizado', 'El usuario ha sido actualizado', 'success');
              this.router.navigate(['/usuarios']);
            });
          }
        });
      } else {
        this.usuarioService.create(usuarioData).subscribe(() => {
          Swal.fire('Creado', 'El usuario ha sido creado', 'success');
          this.router.navigate(['/usuarios']);
        });
      }
    }
  }

  cancelar(): void {
    this.router.navigate(['/usuarios']);
  }
}

