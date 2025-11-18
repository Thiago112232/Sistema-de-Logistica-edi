import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { LocalStorageService } from './local-storage.service';
import { Transportista } from '../models/transportista.model';
import { UuidUtil } from '../utils/uuid.util';

@Injectable({
  providedIn: 'root'
})
export class TransportistaService {
  private readonly ENTITY_NAME = 'transportistas';

  constructor(private localStorage: LocalStorageService) {}

  getAll(): Observable<Transportista[]> {
    return of(this.localStorage.getAll<Transportista>(this.ENTITY_NAME)).pipe(delay(200));
  }

  getById(id: string): Observable<Transportista | null> {
    const transportista = this.localStorage.getById<Transportista>(this.ENTITY_NAME, id);
    return of(transportista).pipe(delay(100));
  }

  create(transportista: Partial<Transportista>): Observable<Transportista> {
    const newTransportista: Transportista = {
      id: UuidUtil.generate(),
      codigo: this.generateCodigo(),
      activo: true,
      createdAt: new Date().toISOString(),
      enviosCompletados: 0,
      calificacion: 5,
      ...transportista
    } as Transportista;

    return this.localStorage.create(this.ENTITY_NAME, newTransportista);
  }

  update(transportista: Transportista): Observable<Transportista> {
    return this.localStorage.update(this.ENTITY_NAME, transportista);
  }

  delete(id: string): Observable<boolean> {
    return this.localStorage.delete(this.ENTITY_NAME, id);
  }

  private generateCodigo(): string {
    const prefix = 'TRP';
    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}-${timestamp}`;
  }
}

