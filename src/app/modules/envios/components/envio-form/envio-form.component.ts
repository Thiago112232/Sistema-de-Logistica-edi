import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EnvioService } from '@core/services/envio.service';
import { ClienteService } from '@core/services/cliente.service';
import { TransportistaService } from '@core/services/transportista.service';
import { VehiculoService } from '@core/services/vehiculo.service';
import { PaqueteService } from '@core/services/paquete.service';
import { Envio, EstadoEnvio } from '@core/models/envio.model';
import { Cliente } from '@core/models/cliente.model';
import { Transportista } from '@core/models/transportista.model';
import { Vehiculo } from '@core/models/vehiculo.model';
import { Paquete } from '@core/models/paquete.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-envio-form',
  template: `
    <h2 mat-dialog-title>{{ data ? 'Editar' : 'Nuevo' }} Envío</h2>
    <mat-dialog-content>
      <form [formGroup]="envioForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Cliente</mat-label>
          <mat-select formControlName="clienteId" required>
            <mat-option *ngFor="let cliente of clientes" [value]="cliente.id">
              {{ cliente.nombre }} - {{ cliente.codigo }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Dirección de Entrega</mat-label>
          <input matInput formControlName="clienteDireccion" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Teléfono</mat-label>
          <input matInput formControlName="clienteTelefono" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Transportista</mat-label>
          <mat-select formControlName="transportistaId">
            <mat-option *ngFor="let transportista of transportistas" [value]="transportista.id">
              {{ transportista.nombre }} {{ transportista.apellido }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Vehículo</mat-label>
          <mat-select formControlName="vehiculoId">
            <mat-option *ngFor="let vehiculo of vehiculos" [value]="vehiculo.id">
              {{ vehiculo.placa }} - {{ vehiculo.marca }} {{ vehiculo.modelo }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Fecha Estimada de Entrega</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="fechaEstimadaEntrega" required>
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Peso Total (kg)</mat-label>
          <input matInput type="number" formControlName="pesoTotal" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Valor Declarado</mat-label>
          <input matInput type="number" formControlName="valorDeclarado" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Paquetes</mat-label>
          <mat-select formControlName="paquetes" multiple>
            <mat-option *ngFor="let paquete of paquetesDisponibles" [value]="paquete.id">
              {{ paquete.codigo }} - {{ paquete.descripcion }} ({{ paquete.peso }} kg)
            </mat-option>
          </mat-select>
          <mat-hint>Seleccione los paquetes a incluir en este envío</mat-hint>
        </mat-form-field>

        <div *ngIf="paquetesSeleccionados.length > 0" class="paquetes-seleccionados">
          <h4>Paquetes Seleccionados ({{ paquetesSeleccionados.length }})</h4>
          <div class="paquete-item" *ngFor="let paquete of paquetesSeleccionados">
            <span>{{ paquete.codigo }} - {{ paquete.descripcion }}</span>
            <span class="peso">{{ paquete.peso }} kg</span>
          </div>
          <div class="total">
            <strong>Peso Total: {{ pesoTotalSeleccionado }} kg</strong>
          </div>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Observaciones</mat-label>
          <textarea matInput formControlName="observaciones" rows="3"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="cancel()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="envioForm.invalid">
        Guardar
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    mat-dialog-content {
      min-width: 500px;
      max-height: 80vh;
      overflow-y: auto;
    }

    .paquetes-seleccionados {
      margin: 16px 0;
      padding: 16px;
      background: #f5f5f5;
      border-radius: 8px;
    }

    .paquetes-seleccionados h4 {
      margin: 0 0 12px 0;
      font-size: 14px;
      font-weight: 500;
    }

    .paquete-item {
      display: flex;
      justify-content: space-between;
      padding: 8px;
      background: white;
      border-radius: 4px;
      margin-bottom: 8px;
    }

    .peso {
      font-weight: 500;
      color: #666;
    }

    .total {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid #ddd;
      text-align: right;
    }
  `]
})
export class EnvioFormComponent implements OnInit {
  envioForm: FormGroup;
  clientes: Cliente[] = [];
  transportistas: Transportista[] = [];
  vehiculos: Vehiculo[] = [];
  paquetesDisponibles: Paquete[] = [];
  paquetesSeleccionados: Paquete[] = [];
  pesoTotalSeleccionado = 0;

  constructor(
    private fb: FormBuilder,
    private envioService: EnvioService,
    private clienteService: ClienteService,
    private transportistaService: TransportistaService,
    private vehiculoService: VehiculoService,
    private paqueteService: PaqueteService,
    private dialogRef: MatDialogRef<EnvioFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Envio | null
  ) {
    this.envioForm = this.fb.group({
      clienteId: ['', Validators.required],
      clienteNombre: [''],
      clienteDireccion: ['', Validators.required],
      clienteTelefono: ['', Validators.required],
      transportistaId: [''],
      vehiculoId: [''],
      fechaEstimadaEntrega: ['', Validators.required],
      pesoTotal: [0, [Validators.required, Validators.min(0.1)]],
      valorDeclarado: [0, [Validators.required, Validators.min(0)]],
      paquetes: [[]],
      observaciones: ['']
    });
  }

  ngOnInit(): void {
    this.loadData();
    if (this.data) {
      this.envioForm.patchValue({
        ...this.data,
        fechaEstimadaEntrega: this.data.fechaEstimadaEntrega ? new Date(this.data.fechaEstimadaEntrega) : null,
        paquetes: this.data.paquetes || []
      });
      this.cargarPaquetesSeleccionados(this.data.paquetes || []);
    }

    // Actualizar nombre del cliente cuando se selecciona
    this.envioForm.get('clienteId')?.valueChanges.subscribe(clienteId => {
      const cliente = this.clientes.find(c => c.id === clienteId);
      if (cliente) {
        this.envioForm.patchValue({
          clienteNombre: cliente.nombre,
          clienteDireccion: cliente.direccion,
          clienteTelefono: cliente.telefono
        });
      }
    });

    // Actualizar paquetes seleccionados y peso total
    this.envioForm.get('paquetes')?.valueChanges.subscribe(paqueteIds => {
      this.cargarPaquetesSeleccionados(paqueteIds || []);
      this.calcularPesoTotal();
      this.envioForm.patchValue({
        pesoTotal: this.pesoTotalSeleccionado
      }, { emitEvent: false });
    });
  }

  loadData(): void {
    this.clienteService.getAll().subscribe(clientes => {
      this.clientes = clientes.filter(c => c.activo);
    });

    this.transportistaService.getAll().subscribe(transportistas => {
      this.transportistas = transportistas.filter(t => t.activo);
    });

    this.vehiculoService.getAll().subscribe(vehiculos => {
      this.vehiculos = vehiculos.filter(v => v.estado === 'disponible');
    });

    this.paqueteService.getByEstado('disponible').subscribe(paquetes => {
      this.paquetesDisponibles = paquetes;
    });
  }

  cargarPaquetesSeleccionados(paqueteIds: string[]): void {
    this.paquetesSeleccionados = this.paquetesDisponibles.filter(p => paqueteIds.includes(p.id));
  }

  calcularPesoTotal(): void {
    this.pesoTotalSeleccionado = this.paquetesSeleccionados.reduce((total, p) => total + p.peso, 0);
  }

  save(): void {
    if (this.envioForm.valid) {
      const envioData = this.envioForm.value;
      
      // Convertir fecha a ISO string
      if (envioData.fechaEstimadaEntrega instanceof Date) {
        envioData.fechaEstimadaEntrega = envioData.fechaEstimadaEntrega.toISOString();
      }

      // Actualizar estado de paquetes
      const paqueteIds = envioData.paquetes || [];
      this.actualizarEstadoPaquetes(paqueteIds, 'asignado');

      // Calcular valor total si hay paquetes
      if (paqueteIds.length > 0 && envioData.valorDeclarado === 0) {
        const valorTotal = this.paquetesSeleccionados.reduce((total, p) => total + p.valorDeclarado, 0);
        envioData.valorDeclarado = valorTotal;
      }
      
      if (this.data) {
        this.envioService.update({ ...this.data, ...envioData }).subscribe(() => {
          Swal.fire('Actualizado', 'El envío ha sido actualizado', 'success');
          this.dialogRef.close(true);
        });
      } else {
        this.envioService.create(envioData).subscribe(() => {
          Swal.fire('Creado', 'El envío ha sido creado', 'success');
          this.dialogRef.close(true);
        });
      }
    }
  }

  actualizarEstadoPaquetes(paqueteIds: string[], estado: 'disponible' | 'asignado' | 'en_transito' | 'entregado'): void {
    paqueteIds.forEach(id => {
      this.paqueteService.getById(id).subscribe(paquete => {
        if (paquete) {
          paquete.estado = estado;
          this.paqueteService.update(paquete).subscribe();
        }
      });
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}

