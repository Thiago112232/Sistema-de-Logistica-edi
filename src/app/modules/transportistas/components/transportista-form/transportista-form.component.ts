import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TransportistaService } from '../../../../core/services/transportista.service';
import { Transportista } from '../../../../core/models/transportista.model';
import { UuidUtil } from '../../../../core/utils/uuid.util';
import Swal from 'sweetalert2';
import { gsap } from 'gsap';

@Component({
  selector: 'app-transportista-form',
  template: `
    <div class="form-container" #formContainer>
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ isEdit ? 'Editar Transportista' : 'Nuevo Transportista' }}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="transportistaForm" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Código</mat-label>
                <input matInput formControlName="codigo" placeholder="TRP001">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Nombre</mat-label>
                <input matInput formControlName="nombre" required>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Apellido</mat-label>
                <input matInput formControlName="apellido" required>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Documento</mat-label>
                <input matInput formControlName="documento" required>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Teléfono</mat-label>
                <input matInput formControlName="telefono" required>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Email</mat-label>
                <input matInput type="email" formControlName="email" required>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Licencia de Conducir</mat-label>
                <input matInput formControlName="licenciaConducir" required>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Fecha Vencimiento Licencia</mat-label>
                <input matInput [matDatepicker]="picker" formControlName="fechaVencimientoLicencia">
                <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
              </mat-form-field>
            </div>

            <div class="form-actions">
              <button mat-button type="button" (click)="cancelar()">Cancelar</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="transportistaForm.invalid">
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
export class TransportistaFormComponent implements OnInit {
  transportistaForm: FormGroup;
  isEdit = false;
  transportistaId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private transportistaService: TransportistaService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.transportistaForm = this.fb.group({
      codigo: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      documento: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      licenciaConducir: ['', Validators.required],
      fechaVencimientoLicencia: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.transportistaId = this.route.snapshot.paramMap.get('id');
    if (this.transportistaId) {
      this.isEdit = true;
      this.loadTransportista();
    }

    gsap.from('.form-container', {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: 'power3.out'
    });
  }

  loadTransportista(): void {
    if (this.transportistaId) {
      this.transportistaService.getById(this.transportistaId).subscribe(transportista => {
        if (transportista) {
          this.transportistaForm.patchValue({
            ...transportista,
            fechaVencimientoLicencia: new Date(transportista.fechaVencimientoLicencia)
          });
        }
      });
    }
  }

  onSubmit(): void {
    if (this.transportistaForm.valid) {
      const transportistaData: Partial<Transportista> = {
        ...this.transportistaForm.value,
        fechaVencimientoLicencia: new Date(this.transportistaForm.value.fechaVencimientoLicencia).toISOString(),
        activo: true,
        enviosCompletados: 0,
        calificacion: 5,
        createdAt: new Date().toISOString()
      };

      if (this.isEdit && this.transportistaId) {
        this.transportistaService.update({ ...transportistaData, id: this.transportistaId } as Transportista).subscribe(() => {
          Swal.fire('Actualizado', 'El transportista ha sido actualizado', 'success');
          this.router.navigate(['/transportistas']);
        });
      } else {
        const nuevoTransportista: Transportista = {
          ...transportistaData,
          id: UuidUtil.generate()
        } as Transportista;

        this.transportistaService.create(nuevoTransportista).subscribe(() => {
          Swal.fire('Creado', 'El transportista ha sido creado', 'success');
          this.router.navigate(['/transportistas']);
        });
      }
    }
  }

  cancelar(): void {
    this.router.navigate(['/transportistas']);
  }
}

