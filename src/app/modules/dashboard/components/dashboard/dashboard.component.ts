import { Component, OnInit, AfterViewInit } from '@angular/core';
import { EnvioService } from '../../../../core/services/envio.service';
import { PaqueteService } from '../../../../core/services/paquete.service';
import { TransportistaService } from '../../../../core/services/transportista.service';
import { RutaService } from '../../../../core/services/ruta.service';
import { Envio, EstadoEnvio } from '../../../../core/models/envio.model';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { MatTableDataSource } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { gsap } from 'gsap';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard-container" #dashboardContainer>
      <h1 class="dashboard-title">Dashboard</h1>

      <div class="stats-grid">
        <mat-card class="stat-card" *ngFor="let stat of stats" #statCard>
          <mat-card-content>
            <div class="stat-icon" [style.background]="stat.color">
              <mat-icon>{{ stat.icon }}</mat-icon>
            </div>
            <div class="stat-info">
              <h3>{{ stat.value }}</h3>
              <p>{{ stat.label }}</p>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="charts-grid">
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Envíos por Estado</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <canvas baseChart
              [data]="pieChartData"
              [type]="pieChartType"
              [options]="pieChartOptions">
            </canvas>
          </mat-card-content>
        </mat-card>

        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Envíos Mensuales</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <canvas baseChart
              [data]="barChartData"
              [type]="barChartType"
              [options]="barChartOptions">
            </canvas>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="recent-section">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Envíos Recientes</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <table mat-table [dataSource]="recentEnvios" class="recent-table">
              <ng-container matColumnDef="numeroGuia">
                <th mat-header-cell *matHeaderCellDef>N° Guía</th>
                <td mat-cell *matCellDef="let envio">{{ envio.numeroGuia }}</td>
              </ng-container>

              <ng-container matColumnDef="clienteNombre">
                <th mat-header-cell *matHeaderCellDef>Cliente</th>
                <td mat-cell *matCellDef="let envio">{{ envio.clienteNombre }}</td>
              </ng-container>

              <ng-container matColumnDef="estado">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let envio">
                  <span class="badge" [class]="'badge-' + envio.estado">
                    {{ envio.estado }}
                  </span>
                </td>
              </ng-container>

              <ng-container matColumnDef="fechaCreacion">
                <th mat-header-cell *matHeaderCellDef>Fecha</th>
                <td mat-cell *matCellDef="let envio">{{ formatDate(envio.fechaCreacion) }}</td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 0;
    }

    .dashboard-title {
      margin: 0 0 32px 0;
      font-size: 32px;
      font-weight: 700;
      letter-spacing: -0.5px;
      background: var(--primary-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }

    .stat-card {
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      background: var(--glass-bg) !important;
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--glass-border) !important;
      border-radius: 20px !important;
      overflow: hidden;
      position: relative;
    }

    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: var(--primary-gradient);
      transform: scaleX(0);
      transition: transform 0.4s ease;
    }

    .stat-card:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 12px 40px rgba(99, 102, 241, 0.3);
      border-color: var(--primary-color) !important;
    }

    .stat-card:hover::before {
      transform: scaleX(1);
    }

    .stat-card mat-card-content {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 24px !important;
    }

    .stat-icon {
      width: 72px;
      height: 72px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--primary-gradient);
      box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
      position: relative;
      overflow: hidden;
    }

    .stat-icon::after {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
      animation: shimmer 3s infinite;
    }

    @keyframes shimmer {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .stat-icon mat-icon {
      font-size: 36px;
      width: 36px;
      height: 36px;
      color: white;
      z-index: 1;
    }

    .stat-info h3 {
      margin: 0;
      font-size: 36px;
      font-weight: 700;
      color: var(--text-primary);
      line-height: 1;
    }

    .stat-info p {
      margin: 8px 0 0;
      color: var(--text-secondary);
      font-size: 13px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .charts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }

    .chart-card {
      min-height: 350px;
      background: var(--glass-bg) !important;
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--glass-border) !important;
      border-radius: 20px !important;
      padding: 24px !important;
    }

    .chart-card mat-card-header {
      margin-bottom: 20px;
    }

    .chart-card mat-card-title {
      color: var(--text-primary);
      font-weight: 600;
      font-size: 18px;
      letter-spacing: 0.3px;
    }

    .recent-section {
      margin-top: 32px;
    }

    .recent-section mat-card {
      background: var(--glass-bg) !important;
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--glass-border) !important;
      border-radius: 20px !important;
    }

    .recent-table {
      width: 100%;
      background: transparent;
    }

    .badge {
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: inline-flex;
      align-items: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }

    [data-theme="dark"] .badge-creado { 
      background: rgba(59, 130, 246, 0.2); 
      color: #60a5fa; 
      border: 1px solid rgba(59, 130, 246, 0.3);
    }
    [data-theme="light"] .badge-creado { 
      background: #dbeafe; 
      color: #1e40af; 
    }

    [data-theme="dark"] .badge-en_transito { 
      background: rgba(251, 146, 60, 0.2); 
      color: #fb923c; 
      border: 1px solid rgba(251, 146, 60, 0.3);
    }
    [data-theme="light"] .badge-en_transito { 
      background: #fed7aa; 
      color: #c2410c; 
    }

    [data-theme="dark"] .badge-en_bodega { 
      background: rgba(168, 85, 247, 0.2); 
      color: #a855f7; 
      border: 1px solid rgba(168, 85, 247, 0.3);
    }
    [data-theme="light"] .badge-en_bodega { 
      background: #e9d5ff; 
      color: #6b21a8; 
    }

    [data-theme="dark"] .badge-en_reparto { 
      background: rgba(34, 197, 94, 0.2); 
      color: #22c55e; 
      border: 1px solid rgba(34, 197, 94, 0.3);
    }
    [data-theme="light"] .badge-en_reparto { 
      background: #bbf7d0; 
      color: #166534; 
    }

    [data-theme="dark"] .badge-entregado { 
      background: rgba(16, 185, 129, 0.2); 
      color: #10b981; 
      border: 1px solid rgba(16, 185, 129, 0.3);
    }
    [data-theme="light"] .badge-entregado { 
      background: #a7f3d0; 
      color: #065f46; 
    }

    [data-theme="dark"] .badge-cancelado { 
      background: rgba(239, 68, 68, 0.2); 
      color: #ef4444; 
      border: 1px solid rgba(239, 68, 68, 0.3);
    }
    [data-theme="light"] .badge-cancelado { 
      background: #fee2e2; 
      color: #991b1b; 
    }
  `]
})
export class DashboardComponent implements OnInit, AfterViewInit {
  stats: any[] = [];
  recentEnvios = new MatTableDataSource<Envio>([]);
  displayedColumns = ['numeroGuia', 'clienteNombre', 'estado', 'fechaCreacion'];

  // Pie Chart
  pieChartType: ChartType = 'pie';
  pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
    }]
  };
  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  // Bar Chart
  barChartType: ChartType = 'bar';
  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{
      label: 'Envíos',
      data: [],
      backgroundColor: '#36A2EB'
    }]
  };
  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  constructor(
    private envioService: EnvioService,
    private paqueteService: PaqueteService,
    private transportistaService: TransportistaService,
    private rutaService: RutaService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    // Animación de entrada
    gsap.from('.stat-card', {
      opacity: 0,
      y: 20,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out'
    });
  }

  loadData(): void {
    // Cargar estadísticas
    this.envioService.getAll().subscribe(envios => {
      const totalEnvios = envios.length;
      const enTransito = envios.filter(e => e.estado === EstadoEnvio.EN_TRANSITO).length;
      const entregados = envios.filter(e => e.estado === EstadoEnvio.ENTREGADO).length;
      const pendientes = envios.filter(e => 
        e.estado === EstadoEnvio.CREADO || e.estado === EstadoEnvio.EN_BODEGA
      ).length;

      this.stats = [
        {
          label: 'Total Envíos',
          value: totalEnvios,
          icon: 'inventory',
          color: '#667eea'
        },
        {
          label: 'En Tránsito',
          value: enTransito,
          icon: 'local_shipping',
          color: '#f093fb'
        },
        {
          label: 'Entregados',
          value: entregados,
          icon: 'check_circle',
          color: '#4facfe'
        },
        {
          label: 'Pendientes',
          value: pendientes,
          icon: 'pending',
          color: '#fa709a'
        }
      ];

      // Gráfico de pastel
      const estados = ['Creado', 'En Tránsito', 'En Bodega', 'En Reparto', 'Entregado', 'Cancelado'];
      const counts = estados.map(estado => {
        const key = estado.toLowerCase().replace(' ', '_') as EstadoEnvio;
        return envios.filter(e => e.estado === key).length;
      });

      this.pieChartData = {
        labels: estados,
        datasets: [{
          data: counts,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
        }]
      };

      // Envíos recientes
      const sortedEnvios = envios
        .sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime())
        .slice(0, 5);
      this.recentEnvios.data = sortedEnvios;
    });

    this.paqueteService.getAll().subscribe(paquetes => {
      const disponibles = paquetes.filter(p => p.estado === 'disponible').length;
      this.stats.push({
        label: 'Paquetes Disponibles',
        value: disponibles,
        icon: 'package',
        color: '#43e97b'
      });
    });

    this.transportistaService.getAll().subscribe(transportistas => {
      const activos = transportistas.filter(t => t.activo).length;
      this.stats.push({
        label: 'Transportistas Activos',
        value: activos,
        icon: 'people',
        color: '#fa709a'
      });
    });

    this.rutaService.getAll().subscribe(rutas => {
      const activas = rutas.filter(r => r.estado === 'en_curso').length;
      this.stats.push({
        label: 'Rutas Activas',
        value: activas,
        icon: 'route',
        color: '#30cfd0'
      });
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('es-ES');
  }
}

