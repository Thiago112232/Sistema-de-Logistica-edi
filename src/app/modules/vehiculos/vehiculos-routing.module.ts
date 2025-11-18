import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehiculosListComponent } from './components/vehiculos-list/vehiculos-list.component';
import { VehiculoFormComponent } from './components/vehiculo-form/vehiculo-form.component';

const routes: Routes = [
  {
    path: '',
    component: VehiculosListComponent
  },
  {
    path: 'nuevo',
    component: VehiculoFormComponent
  },
  {
    path: 'editar/:id',
    component: VehiculoFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehiculosRoutingModule { }

