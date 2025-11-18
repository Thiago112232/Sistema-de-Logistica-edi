export interface Transportista {
  id: string;
  codigo: string;
  nombre: string;
  apellido: string;
  documento: string;
  telefono: string;
  email: string;
  licenciaConducir: string;
  fechaVencimientoLicencia: string;
  vehiculoAsignadoId?: string;
  activo: boolean;
  createdAt: string;
  enviosCompletados: number;
  calificacion: number;
}

