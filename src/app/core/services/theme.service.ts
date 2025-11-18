import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeSubject = new BehaviorSubject<'light' | 'dark'>('dark');
  public theme$ = this.themeSubject.asObservable();

  constructor() {
    this.loadTheme();
  }

  private loadTheme(): void {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const theme = savedTheme || 'dark';
    this.setTheme(theme);
  }

  setTheme(theme: 'light' | 'dark'): void {
    this.themeSubject.next(theme);
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }

  toggleTheme(): void {
    const currentTheme = this.themeSubject.value;
    this.setTheme(currentTheme === 'light' ? 'dark' : 'light');
  }

  getCurrentTheme(): 'light' | 'dark' {
    return this.themeSubject.value;
  }
}

