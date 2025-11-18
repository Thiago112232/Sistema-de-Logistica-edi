export enum UserRole {
  ADMIN = 'admin',
  OPERADOR = 'operador',
  REPARTIDOR = 'repartidor'
}

export interface User {
  id: string;
  username: string;
  password: string;
  email: string;
  fullName: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
  lastLogin?: string;
}

