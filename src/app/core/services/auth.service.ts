import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocalStorageService } from './local-storage.service';
import { User, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private localStorage: LocalStorageService) {
    this.loadCurrentUser();
  }

  private loadCurrentUser(): void {
    const user = this.localStorage.get<User>('currentUser');
    if (user) {
      this.currentUserSubject.next(user);
    }
  }

  login(username: string, password: string): Observable<boolean> {
    const users = this.localStorage.getAll<User>('users');
    const user = users.find(u => u.username === username && u.password === password && u.active);

    if (user) {
      user.lastLogin = new Date().toISOString();
      this.localStorage.update('users', user).subscribe();
      this.localStorage.set('currentUser', user);
      this.currentUserSubject.next(user);
      return of(true);
    }

    return of(false);
  }

  logout(): void {
    this.localStorage.remove('currentUser');
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  hasRole(role: UserRole): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === role || false;
  }

  hasAnyRole(roles: UserRole[]): boolean {
    const user = this.currentUserSubject.value;
    return user ? roles.includes(user.role) : false;
  }

  isAdmin(): boolean {
    return this.hasRole(UserRole.ADMIN);
  }

  canAccessModule(module: string): boolean {
    const user = this.currentUserSubject.value;
    if (!user) return false;

    switch (module) {
      case 'dashboard':
        return true;
      case 'envios':
        return this.hasAnyRole([UserRole.ADMIN, UserRole.OPERADOR, UserRole.REPARTIDOR]);
      case 'paquetes':
        return this.hasAnyRole([UserRole.ADMIN, UserRole.OPERADOR]);
      case 'transportistas':
        return this.hasAnyRole([UserRole.ADMIN, UserRole.OPERADOR]);
      case 'vehiculos':
        return this.hasAnyRole([UserRole.ADMIN, UserRole.OPERADOR]);
      case 'rutas':
        return this.hasAnyRole([UserRole.ADMIN, UserRole.OPERADOR, UserRole.REPARTIDOR]);
      case 'usuarios':
        return this.isAdmin();
      default:
        return false;
    }
  }
}

