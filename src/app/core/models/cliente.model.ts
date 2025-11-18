export interface Cliente {
  id: string;
  codigo: string;
  nombre: string;
  tipoDocumento: 'dni' | 'ruc' | 'pasaporte';
  numeroDocumento: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  pais: string;
  activo: boolean;
  createdAt: string;
  enviosTotales: number;
  ultimoEnvio?: string;
}

