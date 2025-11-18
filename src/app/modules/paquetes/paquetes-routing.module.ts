import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaquetesListComponent } from './components/paquetes-list/paquetes-list.component';
import { PaqueteFormComponent } from './components/paquete-form/paquete-form.component';

const routes: Routes = [
  {
    path: '',
    component: PaquetesListComponent
  },
  {
    path: 'nuevo',
    component: PaqueteFormComponent
  },
  {
    path: 'editar/:id',
    component: PaqueteFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaquetesRoutingModule { }

