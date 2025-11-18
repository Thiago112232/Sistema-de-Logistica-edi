import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnviosListComponent } from './components/envios-list/envios-list.component';
import { EnvioFormComponent } from './components/envio-form/envio-form.component';
import { TrackingComponent } from './components/tracking/tracking.component';

const routes: Routes = [
  {
    path: '',
    component: EnviosListComponent
  },
  {
    path: 'nuevo',
    component: EnvioFormComponent
  },
  {
    path: 'editar/:id',
    component: EnvioFormComponent
  },
  {
    path: 'tracking/:id',
    component: TrackingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnviosRoutingModule { }

