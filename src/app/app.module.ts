import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';

// ngx-translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// ngx-toastr
import { ToastrModule } from 'ngx-toastr';

// Charts
import { NgChartsModule } from 'ng2-charts';

// Routing
import { AppRoutingModule } from './app-routing.module';

// Components
import { AppComponent } from './app.component';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { EnviosModule } from './modules/envios/envios.module';
import { PaquetesModule } from './modules/paquetes/paquetes.module';
import { TransportistasModule } from './modules/transportistas/transportistas.module';
import { VehiculosModule } from './modules/vehiculos/vehiculos.module';
import { ClientesModule } from './modules/clientes/clientes.module';
import { RutasModule } from './modules/rutas/rutas.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';

// Shared
import { LayoutComponent } from './shared/components/layout/layout.component';
import { LoadingComponent } from './shared/components/loading/loading.component';
import { EmptyStateComponent } from './shared/components/empty-state/empty-state.component';

// Services
import { LocalStorageService } from './core/services/local-storage.service';
import { LocalStorageDB } from './data/localstorage.db';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    LoadingComponent,
    EmptyStateComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    
    // Angular Material
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatChipsModule,
    MatBadgeModule,
    MatMenuModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatDividerModule,
    
    // Charts
    NgChartsModule,
    
    // Translate
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      defaultLanguage: 'es'
    }),
    
    // Toastr
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      timeOut: 3000
    }),
    
    // Feature Modules
    AuthModule,
    DashboardModule,
    EnviosModule,
    PaquetesModule,
    TransportistasModule,
    VehiculosModule,
    ClientesModule,
    RutasModule,
    UsuariosModule
  ],
  providers: [LocalStorageService],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private localStorage: LocalStorageService) {
    // Inicializar datos por defecto
    if (!localStorage.get('initialized')) {
      LocalStorageDB.initializeDefaultData(localStorage as any);
      localStorage.set('initialized', true);
    }
  }
}

