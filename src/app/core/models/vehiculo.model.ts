export enum TipoVehiculo {
  MOTOCICLETA = 'motocicleta',
  AUTOMOVIL = 'automovil',
  CAMIONETA = 'camioneta',
  CAMION = 'camion'
}

export interface Vehiculo {
  id: string;
  placa: string;
  marca: string;
  modelo: string;
  año: number;
  tipo: TipoVehiculo;
  capacidadCarga: number; // en kg
  capacidadVolumen: number; // en m³
  transportistaAsignadoId?: string;
  estado: 'disponible' | 'en_uso' | 'mantenimiento' | 'inactivo';
  kilometraje: number;
  ultimaRevision?: string;
  proximaRevision?: string;
  createdAt: string;
  observaciones?: string;
}

