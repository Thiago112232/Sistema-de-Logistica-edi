import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { LocalStorageService } from './local-storage.service';
import { Ruta } from '../models/ruta.model';
import { UuidUtil } from '../utils/uuid.util';

@Injectable({
  providedIn: 'root'
})
export class RutaService {
  private readonly ENTITY_NAME = 'rutas';

  constructor(private localStorage: LocalStorageService) {}

  getAll(): Observable<Ruta[]> {
    return of(this.localStorage.getAll<Ruta>(this.ENTITY_NAME)).pipe(delay(200));
  }

  getById(id: string): Observable<Ruta | null> {
    const ruta = this.localStorage.getById<Ruta>(this.ENTITY_NAME, id);
    return of(ruta).pipe(delay(100));
  }

  create(ruta: Partial<Ruta>): Observable<Ruta> {
    const newRuta: Ruta = {
      id: UuidUtil.generate(),
      codigo: this.generateCodigo(),
      estado: 'planificada',
      puntos: [],
      distanciaTotal: 0,
      tiempoEstimado: 0,
      createdAt: new Date().toISOString(),
      ...ruta
    } as Ruta;

    return this.localStorage.create(this.ENTITY_NAME, newRuta);
  }

  update(ruta: Ruta): Observable<Ruta> {
    return this.localStorage.update(this.ENTITY_NAME, ruta);
  }

  delete(id: string): Observable<boolean> {
    return this.localStorage.delete(this.ENTITY_NAME, id);
  }

  private generateCodigo(): string {
    const prefix = 'RUT';
    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}-${timestamp}`;
  }
}

