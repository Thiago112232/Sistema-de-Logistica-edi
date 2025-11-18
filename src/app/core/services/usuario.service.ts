import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { LocalStorageService } from './local-storage.service';
import { User, UserRole } from '../models/user.model';
import { UuidUtil } from '../utils/uuid.util';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private readonly ENTITY_NAME = 'users';

  constructor(private localStorage: LocalStorageService) {}

  getAll(): Observable<User[]> {
    return of(this.localStorage.getAll<User>(this.ENTITY_NAME)).pipe(delay(200));
  }

  getById(id: string): Observable<User | null> {
    const user = this.localStorage.getById<User>(this.ENTITY_NAME, id);
    return of(user).pipe(delay(100));
  }

  create(usuario: Partial<User>): Observable<User> {
    const newUsuario: User = {
      id: UuidUtil.generate(),
      active: true,
      createdAt: new Date().toISOString(),
      ...usuario
    } as User;

    return this.localStorage.create(this.ENTITY_NAME, newUsuario);
  }

  update(usuario: User): Observable<User> {
    return this.localStorage.update(this.ENTITY_NAME, usuario);
  }

  delete(id: string): Observable<boolean> {
    return this.localStorage.delete(this.ENTITY_NAME, id);
  }
}

