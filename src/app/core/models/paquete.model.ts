export interface Paquete {
  id: string;
  codigo: string;
  descripcion: string;
  peso: number;
  largo: number;
  ancho: number;
  alto: number;
  valorDeclarado: number;
  fragil: boolean;
  envioId?: string;
  estado: 'disponible' | 'asignado' | 'en_transito' | 'entregado';
  createdAt: string;
  observaciones?: string;
}

