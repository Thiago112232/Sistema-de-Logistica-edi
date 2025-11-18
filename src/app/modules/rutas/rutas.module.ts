import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Leaflet - Usaremos leaflet directamente sin el wrapper de Angular por ahora
// import { LeafletModule } from '@asymmetrik/ngx-leaflet';

// Components
import { RutasListComponent } from './components/rutas-list/rutas-list.component';
import { RutaFormComponent } from './components/ruta-form/ruta-form.component';
import { RutaMapComponent } from './components/ruta-map/ruta-map.component';

// Routing
import { RutasRoutingModule } from './rutas-routing.module';

@NgModule({
  declarations: [
    RutasListComponent,
    RutaFormComponent,
    RutaMapComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    RutasRoutingModule,
    
    // Material
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatTooltipModule,
    MatTabsModule,
    MatProgressSpinnerModule
  ]
})
export class RutasModule { }

