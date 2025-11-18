export interface PuntoRuta {
  id: string;
  orden: number;
  envioId: string;
  direccion: string;
  lat: number;
  lng: number;
  estado: 'pendiente' | 'en_camino' | 'completado';
  horaEstimada?: string;
  horaReal?: string;
}

export interface Ruta {
  id: string;
  codigo: string;
  nombre: string;
  transportistaId: string;
  transportistaNombre: string;
  vehiculoId: string;
  fecha: string;
  estado: 'planificada' | 'en_curso' | 'completada' | 'cancelada';
  puntos: PuntoRuta[];
  distanciaTotal: number; // en km
  tiempoEstimado: number; // en minutos
  tiempoReal?: number;
  createdAt: string;
  iniciadaAt?: string;
  completadaAt?: string;
}

