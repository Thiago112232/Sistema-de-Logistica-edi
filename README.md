# 🚚 Sistema de Gestión Logística - Angular

Sistema completo de gestión logística desarrollado con **Angular 17+**, utilizando **LocalStorage** como base de datos y múltiples librerías modernas.

## ✨ Características

- ✅ **Dashboard** con gráficos estadísticos (Chart.js)
- ✅ **CRUD completo** para todas las entidades:
  - Envíos
  - Paquetes
  - Transportistas
  - Vehículos
  - Clientes
  - Rutas
- ✅ **Sistema de Tracking** con timeline animado
- ✅ **Autenticación** con roles (Admin, Operador, Repartidor)
- ✅ **Mapas interactivos** con Leaflet
- ✅ **Animaciones** con GSAP
- ✅ **Tema claro/oscuro**
- ✅ **Internacionalización** (Español/Inglés)
- ✅ **Diseño responsive** y profesional

## 🛠️ Tecnologías

- **Angular 17+**
- **Angular Material**
- **Chart.js / ng2-charts**
- **Leaflet** (Mapas)
- **GSAP** (Animaciones)
- **SweetAlert2** (Alertas)
- **ngx-translate** (i18n)
- **ngx-toastr** (Notificaciones)
- **Day.js** (Fechas)
- **RxJS**

## 📦 Instalación

### Prerrequisitos

- Node.js 18+ y npm
- Angular CLI 17+

### Pasos

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Iniciar el servidor de desarrollo:**
   ```bash
   npm start
   # o
   ng serve
   ```

3. **Abrir en el navegador:**
   ```
   http://localhost:4200
   ```

## 🔐 Credenciales de Acceso

El sistema incluye usuarios de prueba:

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| `admin` | `admin123` | Administrador |
| `operador` | `operador123` | Operador |
| `repartidor` | `repartidor123` | Repartidor |

## 📁 Estructura del Proyecto

```
src/app/
├── core/              # Servicios, guards, modelos, utils
│   ├── guards/        # Guards de autenticación y roles
│   ├── models/        # Modelos TypeScript
│   ├── services/      # Servicios de negocio
│   └── utils/         # Utilidades
├── modules/           # Módulos de funcionalidad
│   ├── auth/          # Autenticación
│   ├── dashboard/     # Dashboard principal
│   ├── envios/        # Gestión de envíos
│   ├── paquetes/      # Gestión de paquetes
│   ├── transportistas/# Gestión de transportistas
│   ├── vehiculos/     # Gestión de vehículos
│   ├── clientes/      # Gestión de clientes
│   └── rutas/         # Gestión de rutas
├── shared/            # Componentes compartidos
│   └── components/    # Layout, loading, etc.
└── data/              # Datos iniciales (LocalStorage)
```

## 🎯 Funcionalidades Principales

### Dashboard
- Estadísticas en tiempo real
- Gráficos de envíos por estado
- Gráficos de envíos mensuales
- Lista de envíos recientes

### Gestión de Envíos
- Crear, editar, eliminar envíos
- Sistema de tracking con timeline
- Cambio de estados
- Asignación de transportistas y vehículos

### Gestión de Paquetes
- CRUD completo de paquetes
- Dimensiones y peso
- Valor declarado
- Estado de fragilidad

### Gestión de Transportistas
- Información personal
- Licencia de conducir
- Calificaciones
- Historial de envíos

### Gestión de Vehículos
- Información del vehículo
- Capacidad de carga y volumen
- Estado (disponible, en uso, mantenimiento)
- Kilometraje

### Gestión de Clientes
- Información de contacto
- Direcciones
- Historial de envíos

### Gestión de Rutas
- Planificación de rutas
- Múltiples puntos de entrega
- Visualización en mapa
- Seguimiento de estado

## 🎨 Temas y Personalización

El sistema incluye soporte para tema claro y oscuro. Puedes cambiar el tema desde el menú de usuario en la barra superior.

## 🌍 Internacionalización

El sistema está configurado para español e inglés. Puedes cambiar el idioma desde el menú de usuario.

## 📊 LocalStorage como Base de Datos

Todos los datos se almacenan en el **LocalStorage** del navegador. Esto incluye:
- Usuarios
- Envíos
- Paquetes
- Transportistas
- Vehículos
- Clientes
- Rutas

### Exportar/Importar Datos

Puedes exportar e importar datos desde el servicio `LocalStorageService`:
- `exportData()`: Exporta todos los datos en JSON
- `importData(jsonData)`: Importa datos desde JSON

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm start          # Inicia servidor de desarrollo
ng serve           # Alternativa

# Build
npm run build      # Build de producción
ng build           # Alternativa

# Testing
npm test           # Ejecutar tests
ng test            # Alternativa
```

## 📝 Notas Importantes

1. **LocalStorage**: Todos los datos se guardan en el navegador. Al limpiar el caché, se perderán los datos.

2. **Mapas**: Los mapas usan OpenStreetMap. Para producción, considera usar un servicio de mapas con API key.

3. **Autenticación**: La autenticación es simulada en frontend. Para producción, implementa un backend real.

4. **Tracking GPS**: El tracking GPS está simulado. Para producción, integra con un servicio de geolocalización real.

## 🐛 Solución de Problemas

### Error: "Cannot find module"
```bash
npm install
```

### Error: "Port 4200 already in use"
```bash
ng serve --port 4201
```

### Error: "Module not found"
Verifica que todos los módulos estén correctamente importados en `app.module.ts`.

## 📄 Licencia

Este proyecto es de código abierto y está disponible para uso educativo y comercial.

## 👨‍💻 Desarrollo

Este proyecto fue desarrollado como ejemplo completo de una aplicación Angular profesional con:
- Arquitectura limpia y modular
- Servicios reutilizables
- Guards de seguridad
- Formularios reactivos
- Animaciones profesionales
- Diseño responsive

---

**¡Disfruta del sistema de logística!** 🚚✨
