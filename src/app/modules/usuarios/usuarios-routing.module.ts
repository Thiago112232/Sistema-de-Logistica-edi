import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuariosListComponent } from './components/usuarios-list/usuarios-list.component';
import { UsuarioFormComponent } from './components/usuario-form/usuario-form.component';

const routes: Routes = [
  {
    path: '',
    component: UsuariosListComponent
  },
  {
    path: 'nuevo',
    component: UsuarioFormComponent
  },
  {
    path: 'editar/:id',
    component: UsuarioFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }

