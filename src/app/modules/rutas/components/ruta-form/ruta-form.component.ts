import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RutaService } from '../../../../core/services/ruta.service';
import { TransportistaService } from '../../../../core/services/transportista.service';
import { EnvioService } from '../../../../core/services/envio.service';
import { Ruta } from '../../../../core/models/ruta.model';
import { Transportista } from '../../../../core/models/transportista.model';
import { Envio } from '../../../../core/models/envio.model';
import Swal from 'sweetalert2';
import { gsap } from 'gsap';

@Component({
  selector: 'app-ruta-form',
  template: `
    <div class="form-container" #formContainer>
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ isEdit ? 'Editar Ruta' : 'Nueva Ruta' }}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="rutaForm" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Nombre de la Ruta</mat-label>
                <input matInput formControlName="nombre" placeholder="Ruta Centro - Norte">
                <mat-error *ngIf="rutaForm.get('nombre')?.hasError('required')">
                  El nombre es requerido
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Transportista</mat-label>
                <mat-select formControlName="transportistaId">
                  <mat-option *ngFor="let t of transportistas" [value]="t.id">
                    {{ t.nombre }} {{ t.apellido }} - {{ t.codigo }}
                  </mat-option>
                </mat-select>
                <mat-error *ngIf="rutaForm.get('transportistaId')?.hasError('required')">
                  El transportista es requerido
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Fecha</mat-label>
                <input matInput [matDatepicker]="picker" formControlName="fecha">
                <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
                <mat-error *ngIf="rutaForm.get('fecha')?.hasError('required')">
                  La fecha es requerida
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Distancia Total (km)</mat-label>
                <input matInput type="number" formControlName="distanciaTotal" step="0.1" [min]="0">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Tiempo Estimado (minutos)</mat-label>
                <input matInput type="number" formControlName="tiempoEstimado" [min]="0">
              </mat-form-field>
            </div>

            <div class="form-actions">
              <button mat-button type="button" (click)="cancelar()">Cancelar</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="rutaForm.invalid">
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
export class RutaFormComponent implements OnInit {
  rutaForm: FormGroup;
  isEdit = false;
  rutaId?: string;
  transportistas: Transportista[] = [];

  constructor(
    private fb: FormBuilder,
    private rutaService: RutaService,
    private transportistaService: TransportistaService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.rutaForm = this.fb.group({
      nombre: ['', Validators.required],
      transportistaId: ['', Validators.required],
      fecha: [new Date(), Validators.required],
      distanciaTotal: [0, [Validators.min(0)]],
      tiempoEstimado: [0, [Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadTransportistas();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.rutaId = id;
      this.loadRuta(id);
    }

    gsap.from('.form-container', {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power3.out'
    });
  }

  loadTransportistas(): void {
    this.transportistaService.getAll().subscribe(transportistas => {
      this.transportistas = transportistas.filter(t => t.activo);
    });
  }

  loadRuta(id: string): void {
    this.rutaService.getById(id).subscribe(ruta => {
      if (ruta) {
        this.rutaForm.patchValue({
          ...ruta,
          fecha: new Date(ruta.fecha)
        });
      }
    });
  }

  onSubmit(): void {
    if (this.rutaForm.valid) {
      const rutaData = this.rutaForm.value;
      const transportista = this.transportistas.find(t => t.id === rutaData.transportistaId);
      
      const ruta: Partial<Ruta> = {
        ...rutaData,
        fecha: rutaData.fecha.toISOString(),
        transportistaNombre: transportista ? `${transportista.nombre} ${transportista.apellido}` : '',
        estado: 'planificada',
        puntos: []
      };
      
      if (this.isEdit && this.rutaId) {
        this.rutaService.update({ ...ruta, id: this.rutaId } as Ruta).subscribe(() => {
          Swal.fire('Actualizada', 'La ruta ha sido actualizada', 'success');
          this.router.navigate(['/rutas']);
        });
      } else {
        this.rutaService.create(ruta).subscribe(() => {
          Swal.fire('Creada', 'La ruta ha sido creada', 'success');
          this.router.navigate(['/rutas']);
        });
      }
    }
  }

  cancelar(): void {
    this.router.navigate(['/rutas']);
  }
}

