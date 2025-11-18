import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransportistasListComponent } from './components/transportistas-list/transportistas-list.component';
import { TransportistaFormComponent } from './components/transportista-form/transportista-form.component';

const routes: Routes = [
  {
    path: '',
    component: TransportistasListComponent
  },
  {
    path: 'nuevo',
    component: TransportistaFormComponent
  },
  {
    path: 'editar/:id',
    component: TransportistaFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransportistasRoutingModule { }

