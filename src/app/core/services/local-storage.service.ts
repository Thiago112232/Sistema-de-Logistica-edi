import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private readonly PREFIX = 'logistica_';

  constructor() {
    this.initializeData();
  }

  private initializeData(): void {
    // Inicializar datos si no existen
    if (!this.get('initialized')) {
      this.set('initialized', true);
      this.initializeDefaultData();
    }
  }

  private initializeDefaultData(): void {
    // Datos iniciales se cargarán desde el servicio de datos
    import('../../data/localstorage.db').then(module => {
      module.LocalStorageDB.initializeDefaultData(this);
    });
  }

  // Métodos genéricos
  set(key: string, value: any): void {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(this.PREFIX + key, serialized);
    } catch (error) {
      console.error('Error saving to localStorage', error);
    }
  }

  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.PREFIX + key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage', error);
      return null;
    }
  }

  remove(key: string): void {
    localStorage.removeItem(this.PREFIX + key);
  }

  clear(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }

  // Métodos específicos para entidades
  getAll<T>(entityName: string): T[] {
    return this.get<T[]>(entityName) || [];
  }

  getById<T extends { id: string }>(entityName: string, id: string): T | null {
    const items = this.getAll<T>(entityName);
    return items.find(item => item.id === id) || null;
  }

  create<T extends { id: string }>(entityName: string, item: T): Observable<T> {
    const items = this.getAll<T>(entityName);
    items.push(item);
    this.set(entityName, items);
    return of(item);
  }

  update<T extends { id: string }>(entityName: string, item: T): Observable<T> {
    const items = this.getAll<T>(entityName);
    const index = items.findIndex(i => i.id === item.id);
    if (index !== -1) {
      items[index] = item;
      this.set(entityName, items);
      return of(item);
    }
    return of(item);
  }

  delete(entityName: string, id: string): Observable<boolean> {
    const items = this.getAll<any>(entityName);
    const filtered = items.filter(item => item.id !== id);
    this.set(entityName, filtered);
    return of(true);
  }

  // Backup y Restore
  exportData(): string {
    const data: any = {};
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.PREFIX)) {
        const entityName = key.replace(this.PREFIX, '');
        data[entityName] = this.get(entityName);
      }
    });
    return JSON.stringify(data, null, 2);
  }

  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      Object.keys(data).forEach(key => {
        this.set(key, data[key]);
      });
      return true;
    } catch (error) {
      console.error('Error importing data', error);
      return false;
    }
  }
}

