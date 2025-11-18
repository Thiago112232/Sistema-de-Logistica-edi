import { Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { User } from '../../../core/models/user.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-layout',
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #sidenav mode="side" opened class="sidenav" [class.dark-theme]="isDarkTheme">
        <div class="sidenav-header">
          <mat-icon class="logo-icon">local_shipping</mat-icon>
          <h2>Sistema Logística</h2>
        </div>

        <mat-nav-list>
          <a mat-list-item routerLink="/dashboard" routerLinkActive="active" (click)="closeSidenavOnMobile()">
            <mat-icon>dashboard</mat-icon>
            <span>{{ 'MENU.DASHBOARD' | translate }}</span>
          </a>

          <a mat-list-item routerLink="/envios" routerLinkActive="active" (click)="closeSidenavOnMobile()" *ngIf="canAccess('envios')">
            <mat-icon>inventory</mat-icon>
            <span>{{ 'MENU.ENVIOS' | translate }}</span>
          </a>

          <a mat-list-item routerLink="/paquetes" routerLinkActive="active" (click)="closeSidenavOnMobile()" *ngIf="canAccess('paquetes')">
            <mat-icon>package</mat-icon>
            <span>{{ 'MENU.PAQUETES' | translate }}</span>
          </a>

          <a mat-list-item routerLink="/transportistas" routerLinkActive="active" (click)="closeSidenavOnMobile()" *ngIf="canAccess('transportistas')">
            <mat-icon>people</mat-icon>
            <span>{{ 'MENU.TRANSPORTISTAS' | translate }}</span>
          </a>

          <a mat-list-item routerLink="/vehiculos" routerLinkActive="active" (click)="closeSidenavOnMobile()" *ngIf="canAccess('vehiculos')">
            <mat-icon>directions_car</mat-icon>
            <span>{{ 'MENU.VEHICULOS' | translate }}</span>
          </a>

          <a mat-list-item routerLink="/rutas" routerLinkActive="active" (click)="closeSidenavOnMobile()" *ngIf="canAccess('rutas')">
            <mat-icon>route</mat-icon>
            <span>{{ 'MENU.RUTAS' | translate }}</span>
          </a>

          <a mat-list-item routerLink="/usuarios" routerLinkActive="active" (click)="closeSidenavOnMobile()" *ngIf="canAccess('usuarios')">
            <mat-icon>admin_panel_settings</mat-icon>
            <span>{{ 'MENU.USUARIOS' | translate }}</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        <mat-toolbar color="primary" class="toolbar">
          <button mat-icon-button (click)="sidenav.toggle()" class="menu-button">
            <mat-icon>menu</mat-icon>
          </button>

          <span class="spacer"></span>

          <button mat-icon-button [matMenuTriggerFor]="themeMenu">
            <mat-icon>{{ isDarkTheme ? 'light_mode' : 'dark_mode' }}</mat-icon>
          </button>

          <button mat-icon-button [matMenuTriggerFor]="languageMenu">
            <mat-icon>language</mat-icon>
          </button>

          <button mat-icon-button [matMenuTriggerFor]="userMenu">
            <mat-icon>account_circle</mat-icon>
          </button>
        </mat-toolbar>

        <div class="content">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>

    <mat-menu #themeMenu="matMenu">
      <button mat-menu-item (click)="toggleTheme()">
        <mat-icon>{{ isDarkTheme ? 'light_mode' : 'dark_mode' }}</mat-icon>
        <span>{{ isDarkTheme ? 'Tema Claro' : 'Tema Oscuro' }}</span>
      </button>
    </mat-menu>

    <mat-menu #languageMenu="matMenu">
      <button mat-menu-item (click)="changeLanguage('es')">
        <span>Español</span>
      </button>
      <button mat-menu-item (click)="changeLanguage('en')">
        <span>English</span>
      </button>
    </mat-menu>

    <mat-menu #userMenu="matMenu">
      <div class="user-info" *ngIf="currentUser">
        <div class="user-name">{{ currentUser.fullName }}</div>
        <div class="user-role">{{ currentUser.role }}</div>
      </div>
      <mat-divider></mat-divider>
      <button mat-menu-item (click)="logout()">
        <mat-icon>logout</mat-icon>
        <span>{{ 'MENU.LOGOUT' | translate }}</span>
      </button>
    </mat-menu>
  `,
  styles: [`
    .sidenav-container {
      height: 100vh;
      background: var(--background-color);
    }

    .sidenav {
      width: 280px;
      background: var(--glass-bg);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-right: 1px solid var(--glass-border);
      box-shadow: 4px 0 24px rgba(0, 0, 0, 0.2);
    }

    .sidenav-header {
      padding: 32px 24px;
      text-align: center;
      border-bottom: 1px solid var(--glass-border);
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
    }

    .logo-icon {
      font-size: 56px;
      width: 56px;
      height: 56px;
      background: var(--primary-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 12px;
      filter: drop-shadow(0 0 10px rgba(99, 102, 241, 0.5));
    }

    .sidenav-header h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 700;
      letter-spacing: 1px;
      color: var(--text-primary);
      text-transform: uppercase;
    }

    mat-nav-list {
      padding: 16px 8px;
    }

    mat-nav-list a {
      color: var(--text-secondary);
      border-radius: 12px;
      margin: 4px 8px;
      padding: 12px 16px !important;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    mat-nav-list a::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 3px;
      background: var(--primary-gradient);
      transform: scaleY(0);
      transition: transform 0.3s ease;
    }

    mat-nav-list a:hover {
      background: var(--surface-elevated);
      color: var(--text-primary);
      transform: translateX(4px);
    }

    mat-nav-list a:hover::before {
      transform: scaleY(1);
    }

    mat-nav-list a.active {
      background: var(--primary-gradient);
      color: white;
      box-shadow: 0 4px 16px rgba(99, 102, 241, 0.4);
    }

    mat-nav-list a.active::before {
      display: none;
    }

    mat-nav-list a.active mat-icon {
      color: white;
    }

    mat-nav-list a mat-icon {
      margin-right: 12px;
      transition: transform 0.3s ease;
    }

    mat-nav-list a:hover mat-icon {
      transform: scale(1.1);
    }

    .toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: var(--glass-bg) !important;
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--glass-border);
      box-shadow: 0 2px 16px rgba(0, 0, 0, 0.1);
    }

    .toolbar button {
      transition: all 0.3s ease;
    }

    .toolbar button:hover {
      transform: scale(1.1);
      background: var(--surface-elevated);
      border-radius: 8px;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .content {
      padding: 32px;
      min-height: calc(100vh - 64px);
      background: var(--background-color);
    }

    .user-info {
      padding: 20px;
      text-align: center;
      background: var(--surface-elevated);
      border-radius: 12px;
      margin: 8px;
    }

    .user-name {
      font-weight: 600;
      margin-bottom: 6px;
      color: var(--text-primary);
      font-size: 14px;
    }

    .user-role {
      font-size: 11px;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 500;
    }

    mat-menu {
      background: var(--glass-bg) !important;
      backdrop-filter: blur(20px);
      border: 1px solid var(--glass-border);
      border-radius: 12px;
    }

    mat-menu button {
      color: var(--text-primary) !important;
    }

    mat-menu button:hover {
      background: var(--surface-elevated) !important;
    }
  `]
})
export class LayoutComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  currentUser: User | null = null;
  isDarkTheme = false;
  isHandset$: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private themeService: ThemeService,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private translate: TranslateService
  ) {
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(map(result => result.matches));
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.themeService.theme$.subscribe(theme => {
      this.isDarkTheme = theme === 'dark';
    });
  }

  canAccess(module: string): boolean {
    return this.authService.canAccessModule(module);
  }

  closeSidenavOnMobile(): void {
    this.isHandset$.subscribe(isHandset => {
      if (isHandset && this.sidenav) {
        this.sidenav.close();
      }
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  changeLanguage(lang: string): void {
    localStorage.setItem('lang', lang);
    this.translate.use(lang);
  }

  logout(): void {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: '¿Estás seguro de que deseas salir?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout();
        this.router.navigate(['/auth/login']);
      }
    });
  }
}

