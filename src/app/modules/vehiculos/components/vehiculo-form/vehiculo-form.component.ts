import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VehiculoService } from '../../../../core/services/vehiculo.service';
import { Vehiculo, TipoVehiculo } from '../../../../core/models/vehiculo.model';
import Swal from 'sweetalert2';
import { gsap } from 'gsap';

@Component({
  selector: 'app-vehiculo-form',
  template: `
    <div class="form-container" #formContainer>
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ isEdit ? 'Editar Vehículo' : 'Nuevo Vehículo' }}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="vehiculoForm" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Placa</mat-label>
                <input matInput formControlName="placa" placeholder="ABC-123" [readonly]="isEdit">
                <mat-error *ngIf="vehiculoForm.get('placa')?.hasError('required')">
                  La placa es requerida
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Marca</mat-label>
                <input matInput formControlName="marca" placeholder="Toyota">
                <mat-error *ngIf="vehiculoForm.get('marca')?.hasError('required')">
                  La marca es requerida
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Modelo</mat-label>
                <input matInput formControlName="modelo" placeholder="Hilux">
                <mat-error *ngIf="vehiculoForm.get('modelo')?.hasError('required')">
                  El modelo es requerido
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Año</mat-label>
                <input matInput type="number" formControlName="año" [min]="2000" [max]="2025">
                <mat-error *ngIf="vehiculoForm.get('año')?.hasError('required')">
                  El año es requerido
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Tipo</mat-label>
                <mat-select formControlName="tipo">
                  <mat-option [value]="TipoVehiculo.MOTOCICLETA">Motocicleta</mat-option>
                  <mat-option [value]="TipoVehiculo.AUTOMOVIL">Automóvil</mat-option>
                  <mat-option [value]="TipoVehiculo.CAMIONETA">Camioneta</mat-option>
                  <mat-option [value]="TipoVehiculo.CAMION">Camión</mat-option>
                </mat-select>
                <mat-error *ngIf="vehiculoForm.get('tipo')?.hasError('required')">
                  El tipo es requerido
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Estado</mat-label>
                <mat-select formControlName="estado">
                  <mat-option value="disponible">Disponible</mat-option>
                  <mat-option value="en_uso">En Uso</mat-option>
                  <mat-option value="mantenimiento">Mantenimiento</mat-option>
                  <mat-option value="inactivo">Inactivo</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Capacidad de Carga (kg)</mat-label>
                <input matInput type="number" formControlName="capacidadCarga" step="0.01">
                <mat-error *ngIf="vehiculoForm.get('capacidadCarga')?.hasError('required')">
                  La capacidad de carga es requerida
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Capacidad de Volumen (m³)</mat-label>
                <input matInput type="number" formControlName="capacidadVolumen" step="0.01">
                <mat-error *ngIf="vehiculoForm.get('capacidadVolumen')?.hasError('required')">
                  La capacidad de volumen es requerida
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Kilometraje</mat-label>
                <input matInput type="number" formControlName="kilometraje" [min]="0">
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Observaciones</mat-label>
                <textarea matInput formControlName="observaciones" rows="3"></textarea>
              </mat-form-field>
            </div>

            <div class="form-actions">
              <button mat-button type="button" (click)="cancelar()">Cancelar</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="vehiculoForm.invalid">
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
      max-width: 900px;
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
export class VehiculoFormComponent implements OnInit {
  vehiculoForm: FormGroup;
  isEdit = false;
  vehiculoId?: string;
  TipoVehiculo = TipoVehiculo;

  constructor(
    private fb: FormBuilder,
    private vehiculoService: VehiculoService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.vehiculoForm = this.fb.group({
      placa: ['', Validators.required],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      año: [new Date().getFullYear(), [Validators.required, Validators.min(2000), Validators.max(2025)]],
      tipo: [TipoVehiculo.CAMIONETA, Validators.required],
      capacidadCarga: [0, [Validators.required, Validators.min(0)]],
      capacidadVolumen: [0, [Validators.required, Validators.min(0)]],
      estado: ['disponible'],
      kilometraje: [0, [Validators.min(0)]],
      observaciones: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.vehiculoId = id;
      this.loadVehiculo(id);
    }

    gsap.from('.form-container', {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power3.out'
    });
  }

  loadVehiculo(id: string): void {
    this.vehiculoService.getById(id).subscribe(vehiculo => {
      if (vehiculo) {
        this.vehiculoForm.patchValue(vehiculo);
      }
    });
  }

  onSubmit(): void {
    if (this.vehiculoForm.valid) {
      const vehiculoData = this.vehiculoForm.value;
      
      if (this.isEdit && this.vehiculoId) {
        this.vehiculoService.update({ ...vehiculoData, id: this.vehiculoId } as Vehiculo).subscribe(() => {
          Swal.fire('Actualizado', 'El vehículo ha sido actualizado', 'success');
          this.router.navigate(['/vehiculos']);
        });
      } else {
        this.vehiculoService.create(vehiculoData).subscribe(() => {
          Swal.fire('Creado', 'El vehículo ha sido creado', 'success');
          this.router.navigate(['/vehiculos']);
        });
      }
    }
  }

  cancelar(): void {
    this.router.navigate(['/vehiculos']);
  }
}

