import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { ThemeService } from './core/services/theme.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  styles: []
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService,
    private themeService: ThemeService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    // Configurar idioma por defecto
    this.translate.setDefaultLang('es');
    const savedLang = localStorage.getItem('lang') || 'es';
    this.translate.use(savedLang);
    
    // Aplicar tema guardado (por defecto dark)
    const savedTheme = localStorage.getItem('theme') || 'dark';
    this.themeService.setTheme(savedTheme as 'light' | 'dark');
    
    // Redirigir si no está autenticado
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
    }
  }
}

