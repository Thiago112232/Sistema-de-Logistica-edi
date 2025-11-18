import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from '../../../../core/services/cliente.service';
import { Cliente } from '../../../../core/models/cliente.model';
import Swal from 'sweetalert2';
import { gsap } from 'gsap';

@Component({
  selector: 'app-cliente-form',
  template: `
    <div class="form-container" #formContainer>
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ isEdit ? 'Editar Cliente' : 'Nuevo Cliente' }}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="clienteForm" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Nombre</mat-label>
                <input matInput formControlName="nombre" placeholder="Nombre o Razón Social">
                <mat-error *ngIf="clienteForm.get('nombre')?.hasError('required')">
                  El nombre es requerido
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Tipo de Documento</mat-label>
                <mat-select formControlName="tipoDocumento">
                  <mat-option value="dni">DNI</mat-option>
                  <mat-option value="ruc">RUC</mat-option>
                  <mat-option value="pasaporte">Pasaporte</mat-option>
                </mat-select>
                <mat-error *ngIf="clienteForm.get('tipoDocumento')?.hasError('required')">
                  El tipo de documento es requerido
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Número de Documento</mat-label>
                <input matInput formControlName="numeroDocumento" placeholder="12345678">
                <mat-error *ngIf="clienteForm.get('numeroDocumento')?.hasError('required')">
                  El número de documento es requerido
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Email</mat-label>
                <input matInput type="email" formControlName="email" placeholder="cliente@email.com">
                <mat-error *ngIf="clienteForm.get('email')?.hasError('required')">
                  El email es requerido
                </mat-error>
                <mat-error *ngIf="clienteForm.get('email')?.hasError('email')">
                  Email inválido
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Teléfono</mat-label>
                <input matInput formControlName="telefono" placeholder="+51 987654321">
                <mat-error *ngIf="clienteForm.get('telefono')?.hasError('required')">
                  El teléfono es requerido
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Dirección</mat-label>
                <input matInput formControlName="direccion" placeholder="Av. Principal 123">
                <mat-error *ngIf="clienteForm.get('direccion')?.hasError('required')">
                  La dirección es requerida
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Ciudad</mat-label>
                <input matInput formControlName="ciudad" placeholder="Lima">
                <mat-error *ngIf="clienteForm.get('ciudad')?.hasError('required')">
                  La ciudad es requerida
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>País</mat-label>
                <input matInput formControlName="pais" placeholder="Perú">
                <mat-error *ngIf="clienteForm.get('pais')?.hasError('required')">
                  El país es requerido
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-checkbox formControlName="activo">Cliente Activo</mat-checkbox>
            </div>

            <div class="form-actions">
              <button mat-button type="button" (click)="cancelar()">Cancelar</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="clienteForm.invalid">
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

    .full-width {
      width: 100%;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      margin-top: 24px;
    }
  `]
})
export class ClienteFormComponent implements OnInit {
  clienteForm: FormGroup;
  isEdit = false;
  clienteId?: string;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.clienteForm = this.fb.group({
      nombre: ['', Validators.required],
      tipoDocumento: ['dni', Validators.required],
      numeroDocumento: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
      ciudad: ['', Validators.required],
      pais: ['Perú', Validators.required],
      activo: [true]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.clienteId = id;
      this.loadCliente(id);
    }

    gsap.from('.form-container', {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power3.out'
    });
  }

  loadCliente(id: string): void {
    this.clienteService.getById(id).subscribe(cliente => {
      if (cliente) {
        this.clienteForm.patchValue(cliente);
      }
    });
  }

  onSubmit(): void {
    if (this.clienteForm.valid) {
      const clienteData = this.clienteForm.value;
      
      if (this.isEdit && this.clienteId) {
        this.clienteService.update({ ...clienteData, id: this.clienteId } as Cliente).subscribe(() => {
          Swal.fire('Actualizado', 'El cliente ha sido actualizado', 'success');
          this.router.navigate(['/clientes']);
        });
      } else {
        this.clienteService.create(clienteData).subscribe(() => {
          Swal.fire('Creado', 'El cliente ha sido creado', 'success');
          this.router.navigate(['/clientes']);
        });
      }
    }
  }

  cancelar(): void {
    this.router.navigate(['/clientes']);
  }
}

