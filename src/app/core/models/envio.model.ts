export enum EstadoEnvio {
  CREADO = 'creado',
  EN_TRANSITO = 'en_transito',
  EN_BODEGA = 'en_bodega',
  EN_REPARTO = 'en_reparto',
  ENTREGADO = 'entregado',
  CANCELADO = 'cancelado'
}

export interface Envio {
  id: string;
  numeroGuia: string;
  clienteId: string;
  clienteNombre: string;
  clienteDireccion: string;
  clienteTelefono: string;
  transportistaId?: string;
  transportistaNombre?: string;
  vehiculoId?: string;
  rutaId?: string;
  estado: EstadoEnvio;
  fechaCreacion: string;
  fechaEntrega?: string;
  fechaEstimadaEntrega: string;
  paquetes: string[]; // IDs de paquetes
  pesoTotal: number;
  valorDeclarado: number;
  observaciones?: string;
  tracking: TrackingEvent[];
  ubicacionActual?: {
    lat: number;
    lng: number;
    direccion: string;
  };
}

export interface TrackingEvent {
  id: string;
  estado: EstadoEnvio;
  fecha: string;
  ubicacion?: {
    lat: number;
    lng: number;
    direccion: string;
  };
  observaciones?: string;
}

