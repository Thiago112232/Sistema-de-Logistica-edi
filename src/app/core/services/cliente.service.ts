import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { LocalStorageService } from './local-storage.service';
import { Cliente } from '../models/cliente.model';
import { UuidUtil } from '../utils/uuid.util';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private readonly ENTITY_NAME = 'clientes';

  constructor(private localStorage: LocalStorageService) {}

  getAll(): Observable<Cliente[]> {
    return of(this.localStorage.getAll<Cliente>(this.ENTITY_NAME)).pipe(delay(200));
  }

  getById(id: string): Observable<Cliente | null> {
    const cliente = this.localStorage.getById<Cliente>(this.ENTITY_NAME, id);
    return of(cliente).pipe(delay(100));
  }

  create(cliente: Partial<Cliente>): Observable<Cliente> {
    const newCliente: Cliente = {
      id: UuidUtil.generate(),
      codigo: this.generateCodigo(),
      activo: true,
      createdAt: new Date().toISOString(),
      enviosTotales: 0,
      ...cliente
    } as Cliente;

    return this.localStorage.create(this.ENTITY_NAME, newCliente);
  }

  update(cliente: Cliente): Observable<Cliente> {
    return this.localStorage.update(this.ENTITY_NAME, cliente);
  }

  delete(id: string): Observable<boolean> {
    return this.localStorage.delete(this.ENTITY_NAME, id);
  }

  private generateCodigo(): string {
    const prefix = 'CLI';
    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}-${timestamp}`;
  }
}

