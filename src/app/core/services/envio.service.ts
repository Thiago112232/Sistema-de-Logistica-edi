import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { LocalStorageService } from './local-storage.service';
import { Envio, EstadoEnvio, TrackingEvent } from '../models/envio.model';
import { UuidUtil } from '../utils/uuid.util';

@Injectable({
  providedIn: 'root'
})
export class EnvioService {
  private readonly ENTITY_NAME = 'envios';

  constructor(private localStorage: LocalStorageService) {}

  getAll(): Observable<Envio[]> {
    return of(this.localStorage.getAll<Envio>(this.ENTITY_NAME)).pipe(
      delay(300) // Simular latencia de red
    );
  }

  getById(id: string): Observable<Envio | null> {
    const envio = this.localStorage.getById<Envio>(this.ENTITY_NAME, id);
    return of(envio).pipe(delay(200));
  }

  create(envio: Partial<Envio>): Observable<Envio> {
    const newEnvio: Envio = {
      id: UuidUtil.generate(),
      numeroGuia: this.generateNumeroGuia(),
      estado: EstadoEnvio.CREADO,
      fechaCreacion: new Date().toISOString(),
      tracking: [{
        id: UuidUtil.generate(),
        estado: EstadoEnvio.CREADO,
        fecha: new Date().toISOString(),
        observaciones: 'Envío creado'
      }],
      paquetes: [],
      pesoTotal: 0,
      valorDeclarado: 0,
      ...envio
    } as Envio;

    return this.localStorage.create(this.ENTITY_NAME, newEnvio);
  }

  update(envio: Envio): Observable<Envio> {
    return this.localStorage.update(this.ENTITY_NAME, envio);
  }

  delete(id: string): Observable<boolean> {
    return this.localStorage.delete(this.ENTITY_NAME, id);
  }

  updateEstado(id: string, nuevoEstado: EstadoEnvio, observaciones?: string): Observable<Envio> {
    return this.getById(id).pipe(
      map(envio => {
        if (!envio) throw new Error('Envío no encontrado');
        
        envio.estado = nuevoEstado;
        envio.tracking.push({
          id: UuidUtil.generate(),
          estado: nuevoEstado,
          fecha: new Date().toISOString(),
          observaciones: observaciones || `Estado cambiado a ${nuevoEstado}`,
          ubicacion: envio.ubicacionActual
        });

        if (nuevoEstado === EstadoEnvio.ENTREGADO) {
          envio.fechaEntrega = new Date().toISOString();
        }

        return envio;
      }),
      map(envio => {
        this.update(envio).subscribe();
        return envio;
      })
    );
  }

  private generateNumeroGuia(): string {
    const prefix = 'GUI';
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${timestamp}-${random}`;
  }

  getByEstado(estado: EstadoEnvio): Observable<Envio[]> {
    return this.getAll().pipe(
      map(envios => envios.filter(e => e.estado === estado))
    );
  }

  getByTransportista(transportistaId: string): Observable<Envio[]> {
    return this.getAll().pipe(
      map(envios => envios.filter(e => e.transportistaId === transportistaId))
    );
  }
}

