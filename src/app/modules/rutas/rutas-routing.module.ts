import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RutasListComponent } from './components/rutas-list/rutas-list.component';
import { RutaFormComponent } from './components/ruta-form/ruta-form.component';
import { RutaMapComponent } from './components/ruta-map/ruta-map.component';

const routes: Routes = [
  {
    path: '',
    component: RutasListComponent
  },
  {
    path: 'nuevo',
    component: RutaFormComponent
  },
  {
    path: 'editar/:id',
    component: RutaFormComponent
  },
  {
    path: 'mapa/:id',
    component: RutaMapComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RutasRoutingModule { }

