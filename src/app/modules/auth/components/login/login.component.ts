import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import Swal from 'sweetalert2';
import { gsap } from 'gsap';

@Component({
  selector: 'app-login',
  template: `
    <div class="login-container">
      <div class="login-card" #loginCard>
        <div class="login-header">
          <mat-icon class="logo-icon">local_shipping</mat-icon>
          <h1>Sistema de Logística</h1>
          <p>Inicia sesión para continuar</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Usuario</mat-label>
            <input matInput formControlName="username" autocomplete="username">
            <mat-icon matPrefix>person</mat-icon>
            <mat-error *ngIf="loginForm.get('username')?.hasError('required')">
              El usuario es requerido
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Contraseña</mat-label>
            <input matInput type="password" formControlName="password" autocomplete="current-password">
            <mat-icon matPrefix>lock</mat-icon>
            <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
              La contraseña es requerida
            </mat-error>
          </mat-form-field>

          <button mat-raised-button color="primary" type="submit" class="full-width login-button" [disabled]="loginForm.invalid || loading">
            <mat-spinner *ngIf="loading" diameter="20" class="spinner"></mat-spinner>
            <span *ngIf="!loading">Iniciar Sesión</span>
          </button>
        </form>

        <div class="login-footer">
          <p>Credenciales de prueba:</p>
          <small>admin / admin123 | operador / operador123 | repartidor / repartidor123</small>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: var(--background-color);
      background-image: 
        radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.15) 0px, transparent 50%),
        radial-gradient(at 100% 100%, rgba(139, 92, 246, 0.15) 0px, transparent 50%);
      padding: 20px;
      position: relative;
      overflow: hidden;
    }

    .login-container::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%);
      animation: rotate 20s linear infinite;
    }

    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .login-card {
      background: var(--glass-bg);
      backdrop-filter: blur(30px);
      -webkit-backdrop-filter: blur(30px);
      border: 1px solid var(--glass-border);
      border-radius: 24px;
      padding: 48px;
      width: 100%;
      max-width: 440px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      position: relative;
      z-index: 1;
      transition: all 0.4s ease;
    }

    .login-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 24px 80px rgba(99, 102, 241, 0.4);
      border-color: var(--primary-color);
    }

    .login-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .logo-icon {
      font-size: 72px;
      width: 72px;
      height: 72px;
      background: var(--primary-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 20px;
      filter: drop-shadow(0 0 20px rgba(99, 102, 241, 0.5));
      display: block;
      margin-left: auto;
      margin-right: auto;
    }

    .login-header h1 {
      margin: 0 0 12px;
      color: var(--text-primary);
      font-size: 28px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }

    .login-header p {
      color: var(--text-secondary);
      margin: 0;
      font-size: 14px;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .login-button {
      height: 52px;
      font-size: 16px;
      font-weight: 600;
      margin-top: 8px;
      background: var(--primary-gradient) !important;
      box-shadow: 0 4px 16px rgba(99, 102, 241, 0.4) !important;
      border-radius: 12px !important;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .login-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 24px rgba(99, 102, 241, 0.5) !important;
    }

    .spinner {
      display: inline-block;
      margin-right: 8px;
    }

    .login-footer {
      margin-top: 32px;
      text-align: center;
      padding-top: 24px;
      border-top: 1px solid var(--border-color);
    }

    .login-footer p {
      margin: 0 0 8px;
      font-size: 12px;
      color: var(--text-muted);
      font-weight: 500;
    }

    .login-footer small {
      font-size: 11px;
      color: var(--text-secondary);
      line-height: 1.6;
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  returnUrl = '/dashboard';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    
    // Animación de entrada
    const loginCard = document.querySelector('.login-card');
    if (loginCard) {
      gsap.from(loginCard, {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: 'power3.out'
      });
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      const { username, password } = this.loginForm.value;

      this.authService.login(username, password).subscribe(success => {
        this.loading = false;
        if (success) {
          Swal.fire({
            icon: 'success',
            title: '¡Bienvenido!',
            text: 'Has iniciado sesión correctamente',
            timer: 1500,
            showConfirmButton: false
          });
          
          // Animación de salida
          const loginCard = document.querySelector('.login-card');
          if (loginCard) {
            gsap.to(loginCard, {
              opacity: 0,
              y: -30,
              duration: 0.4,
              ease: 'power3.in',
              onComplete: () => {
                this.router.navigate([this.returnUrl]);
              }
            });
          } else {
            this.router.navigate([this.returnUrl]);
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Usuario o contraseña incorrectos'
          });
        }
      });
    }
  }
}

