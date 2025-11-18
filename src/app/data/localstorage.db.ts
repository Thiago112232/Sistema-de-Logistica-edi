import { User, UserRole } from '../core/models/user.model';
import { Cliente } from '../core/models/cliente.model';
import { Transportista } from '../core/models/transportista.model';
import { Vehiculo, TipoVehiculo } from '../core/models/vehiculo.model';
import { Paquete } from '../core/models/paquete.model';
import { Envio, EstadoEnvio } from '../core/models/envio.model';
import { Ruta } from '../core/models/ruta.model';
import { UuidUtil } from '../core/utils/uuid.util';

export class LocalStorageDB {
  static initializeDefaultData(localStorageService: any): void {
    // Usuarios por defecto
    const users: User[] = [
      {
        id: UuidUtil.generate(),
        username: 'admin',
        password: 'admin123',
        email: 'admin@logistica.com',
        fullName: 'Administrador Sistema',
        role: UserRole.ADMIN,
        active: true,
        createdAt: new Date().toISOString()
      },
      {
        id: UuidUtil.generate(),
        username: 'operador',
        password: 'operador123',
        email: 'operador@logistica.com',
        fullName: 'Operador Principal',
        role: UserRole.OPERADOR,
        active: true,
        createdAt: new Date().toISOString()
      },
      {
        id: UuidUtil.generate(),
        username: 'repartidor',
        password: 'repartidor123',
        email: 'repartidor@logistica.com',
        fullName: 'Repartidor Demo',
        role: UserRole.REPARTIDOR,
        active: true,
        createdAt: new Date().toISOString()
      }
    ];

    // Clientes de ejemplo
    const clientes: Cliente[] = [
      {
        id: UuidUtil.generate(),
        codigo: 'CLI001',
        nombre: 'Empresa ABC S.A.',
        tipoDocumento: 'ruc',
        numeroDocumento: '20123456789',
        email: 'contacto@abc.com',
        telefono: '+51 987654321',
        direccion: 'Av. Principal 123',
        ciudad: 'Lima',
        pais: 'Perú',
        activo: true,
        createdAt: new Date().toISOString(),
        enviosTotales: 0
      },
      {
        id: UuidUtil.generate(),
        codigo: 'CLI002',
        nombre: 'Juan Pérez',
        tipoDocumento: 'dni',
        numeroDocumento: '12345678',
        email: 'juan@email.com',
        telefono: '+51 987654322',
        direccion: 'Jr. Los Olivos 456',
        ciudad: 'Lima',
        pais: 'Perú',
        activo: true,
        createdAt: new Date().toISOString(),
        enviosTotales: 0
      }
    ];

    // Transportistas
    const transportistas: Transportista[] = [
      {
        id: UuidUtil.generate(),
        codigo: 'TRP001',
        nombre: 'Carlos',
        apellido: 'Rodríguez',
        documento: '87654321',
        telefono: '+51 987654323',
        email: 'carlos@logistica.com',
        licenciaConducir: 'LIC123456',
        fechaVencimientoLicencia: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        activo: true,
        createdAt: new Date().toISOString(),
        enviosCompletados: 0,
        calificacion: 5
      },
      {
        id: UuidUtil.generate(),
        codigo: 'TRP002',
        nombre: 'María',
        apellido: 'González',
        documento: '76543210',
        telefono: '+51 987654324',
        email: 'maria@logistica.com',
        licenciaConducir: 'LIC234567',
        fechaVencimientoLicencia: new Date(Date.now() + 300 * 24 * 60 * 60 * 1000).toISOString(),
        activo: true,
        createdAt: new Date().toISOString(),
        enviosCompletados: 0,
        calificacion: 4.5
      }
    ];

    // Vehículos
    const vehiculos: Vehiculo[] = [
      {
        id: UuidUtil.generate(),
        placa: 'ABC-123',
        marca: 'Toyota',
        modelo: 'Hilux',
        año: 2022,
        tipo: TipoVehiculo.CAMIONETA,
        capacidadCarga: 1500,
        capacidadVolumen: 8,
        estado: 'disponible',
        kilometraje: 15000,
        createdAt: new Date().toISOString()
      },
      {
        id: UuidUtil.generate(),
        placa: 'XYZ-456',
        marca: 'Honda',
        modelo: 'CB250',
        año: 2023,
        tipo: TipoVehiculo.MOTOCICLETA,
        capacidadCarga: 50,
        capacidadVolumen: 0.5,
        estado: 'disponible',
        kilometraje: 5000,
        createdAt: new Date().toISOString()
      }
    ];

    // Paquetes
    const paquetes: Paquete[] = [
      {
        id: UuidUtil.generate(),
        codigo: 'PKG001',
        descripcion: 'Electrodoméstico',
        peso: 25,
        largo: 60,
        ancho: 50,
        alto: 40,
        valorDeclarado: 500,
        fragil: true,
        estado: 'disponible',
        createdAt: new Date().toISOString()
      },
      {
        id: UuidUtil.generate(),
        codigo: 'PKG002',
        descripcion: 'Documentos',
        peso: 0.5,
        largo: 30,
        ancho: 20,
        alto: 5,
        valorDeclarado: 100,
        fragil: false,
        estado: 'disponible',
        createdAt: new Date().toISOString()
      }
    ];

    // Guardar en localStorage usando el servicio
    localStorageService.set('users', users);
    localStorageService.set('clientes', clientes);
    localStorageService.set('transportistas', transportistas);
    localStorageService.set('vehiculos', vehiculos);
    localStorageService.set('paquetes', paquetes);
    localStorageService.set('envios', []);
    localStorageService.set('rutas', []);
  }
}

