import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { LayoutComponent } from './shared/components/layout/layout.component';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'envios',
        loadChildren: () => import('./modules/envios/envios.module').then(m => m.EnviosModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'paquetes',
        loadChildren: () => import('./modules/paquetes/paquetes.module').then(m => m.PaquetesModule),
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['admin', 'operador'] }
      },
      {
        path: 'transportistas',
        loadChildren: () => import('./modules/transportistas/transportistas.module').then(m => m.TransportistasModule),
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['admin', 'operador'] }
      },
      {
        path: 'vehiculos',
        loadChildren: () => import('./modules/vehiculos/vehiculos.module').then(m => m.VehiculosModule),
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['admin', 'operador'] }
      },
      {
        path: 'clientes',
        loadChildren: () => import('./modules/clientes/clientes.module').then(m => m.ClientesModule),
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['admin', 'operador'] }
      },
      {
        path: 'rutas',
        loadChildren: () => import('./modules/rutas/rutas.module').then(m => m.RutasModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'usuarios',
        loadChildren: () => import('./modules/usuarios/usuarios.module').then(m => m.UsuariosModule),
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['admin'] }
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

