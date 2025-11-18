import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaqueteService } from '../../../../core/services/paquete.service';
import { Paquete } from '../../../../core/models/paquete.model';
import { UuidUtil } from '../../../../core/utils/uuid.util';
import Swal from 'sweetalert2';
import { gsap } from 'gsap';

@Component({
  selector: 'app-paquete-form',
  template: `
    <div class="form-container" #formContainer>
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ isEdit ? 'Editar Paquete' : 'Nuevo Paquete' }}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="paqueteForm" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Código</mat-label>
                <input matInput formControlName="codigo" placeholder="PKG001">
                <mat-error *ngIf="paqueteForm.get('codigo')?.hasError('required')">
                  El código es requerido
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Descripción</mat-label>
                <textarea matInput formControlName="descripcion" rows="3"></textarea>
                <mat-error *ngIf="paqueteForm.get('descripcion')?.hasError('required')">
                  La descripción es requerida
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Peso (kg)</mat-label>
                <input matInput type="number" formControlName="peso" step="0.01">
                <mat-error *ngIf="paqueteForm.get('peso')?.hasError('required')">
                  El peso es requerido
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Largo (cm)</mat-label>
                <input matInput type="number" formControlName="largo">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Ancho (cm)</mat-label>
                <input matInput type="number" formControlName="ancho">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Alto (cm)</mat-label>
                <input matInput type="number" formControlName="alto">
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Valor Declarado</mat-label>
                <input matInput type="number" formControlName="valorDeclarado" step="0.01">
                <span matPrefix>$&nbsp;</span>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-checkbox formControlName="fragil">Paquete Frágil</mat-checkbox>
            </div>

            <div class="form-actions">
              <button mat-button type="button" (click)="cancelar()">Cancelar</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="paqueteForm.invalid">
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
export class PaqueteFormComponent implements OnInit {
  paqueteForm: FormGroup;
  isEdit = false;
  paqueteId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private paqueteService: PaqueteService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.paqueteForm = this.fb.group({
      codigo: ['', Validators.required],
      descripcion: ['', Validators.required],
      peso: [0, [Validators.required, Validators.min(0.01)]],
      largo: [0, Validators.min(0)],
      ancho: [0, Validators.min(0)],
      alto: [0, Validators.min(0)],
      valorDeclarado: [0, Validators.min(0)],
      fragil: [false]
    });
  }

  ngOnInit(): void {
    this.paqueteId = this.route.snapshot.paramMap.get('id');
    if (this.paqueteId) {
      this.isEdit = true;
      this.loadPaquete();
    }

    gsap.from('.form-container', {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: 'power3.out'
    });
  }

  loadPaquete(): void {
    if (this.paqueteId) {
      this.paqueteService.getById(this.paqueteId).subscribe(paquete => {
        if (paquete) {
          this.paqueteForm.patchValue(paquete);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.paqueteForm.valid) {
      const paqueteData: Partial<Paquete> = {
        ...this.paqueteForm.value,
        estado: 'disponible',
        createdAt: new Date().toISOString()
      };

      if (this.isEdit && this.paqueteId) {
        this.paqueteService.update({ ...paqueteData, id: this.paqueteId } as Paquete).subscribe(() => {
          Swal.fire('Actualizado', 'El paquete ha sido actualizado', 'success');
          this.router.navigate(['/paquetes']);
        });
      } else {
        const nuevoPaquete: Paquete = {
          ...paqueteData,
          id: UuidUtil.generate()
        } as Paquete;

        this.paqueteService.create(nuevoPaquete).subscribe(() => {
          Swal.fire('Creado', 'El paquete ha sido creado', 'success');
          this.router.navigate(['/paquetes']);
        });
      }
    }
  }

  cancelar(): void {
    this.router.navigate(['/paquetes']);
  }
}

