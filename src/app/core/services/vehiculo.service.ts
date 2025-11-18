import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { LocalStorageService } from './local-storage.service';
import { Vehiculo } from '../models/vehiculo.model';
import { UuidUtil } from '../utils/uuid.util';

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {
  private readonly ENTITY_NAME = 'vehiculos';

  constructor(private localStorage: LocalStorageService) {}

  getAll(): Observable<Vehiculo[]> {
    return of(this.localStorage.getAll<Vehiculo>(this.ENTITY_NAME)).pipe(delay(200));
  }

  getById(id: string): Observable<Vehiculo | null> {
    const vehiculo = this.localStorage.getById<Vehiculo>(this.ENTITY_NAME, id);
    return of(vehiculo).pipe(delay(100));
  }

  create(vehiculo: Partial<Vehiculo>): Observable<Vehiculo> {
    const newVehiculo: Vehiculo = {
      id: UuidUtil.generate(),
      estado: 'disponible',
      kilometraje: 0,
      createdAt: new Date().toISOString(),
      ...vehiculo
    } as Vehiculo;

    return this.localStorage.create(this.ENTITY_NAME, newVehiculo);
  }

  update(vehiculo: Vehiculo): Observable<Vehiculo> {
    return this.localStorage.update(this.ENTITY_NAME, vehiculo);
  }

  delete(id: string): Observable<boolean> {
    return this.localStorage.delete(this.ENTITY_NAME, id);
  }
}

