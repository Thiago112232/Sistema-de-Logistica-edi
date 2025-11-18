import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { LocalStorageService } from './local-storage.service';
import { Paquete } from '../models/paquete.model';
import { UuidUtil } from '../utils/uuid.util';

@Injectable({
  providedIn: 'root'
})
export class PaqueteService {
  private readonly ENTITY_NAME = 'paquetes';

  constructor(private localStorage: LocalStorageService) {}

  getAll(): Observable<Paquete[]> {
    return of(this.localStorage.getAll<Paquete>(this.ENTITY_NAME)).pipe(delay(200));
  }

  getById(id: string): Observable<Paquete | null> {
    const paquete = this.localStorage.getById<Paquete>(this.ENTITY_NAME, id);
    return of(paquete).pipe(delay(100));
  }

  create(paquete: Partial<Paquete>): Observable<Paquete> {
    const newPaquete: Paquete = {
      id: UuidUtil.generate(),
      codigo: this.generateCodigo(),
      estado: 'disponible',
      createdAt: new Date().toISOString(),
      ...paquete
    } as Paquete;

    return this.localStorage.create(this.ENTITY_NAME, newPaquete);
  }

  update(paquete: Paquete): Observable<Paquete> {
    return this.localStorage.update(this.ENTITY_NAME, paquete);
  }

  delete(id: string): Observable<boolean> {
    return this.localStorage.delete(this.ENTITY_NAME, id);
  }

  private generateCodigo(): string {
    const prefix = 'PKG';
    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}-${timestamp}`;
  }

  getByEstado(estado: string): Observable<Paquete[]> {
    return this.getAll().pipe(
      map(paquetes => paquetes.filter(p => p.estado === estado))
    );
  }
}

