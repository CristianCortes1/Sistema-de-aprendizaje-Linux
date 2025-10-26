# Sistema de Aprendizaje Linux - Frontend

Este es el frontend de la aplicación Sistema de Aprendizaje Linux, una plataforma interactiva para aprender comandos y conceptos de Linux.

## Características

- **Sistema de Autenticación**: Login, registro y confirmación de email
- **Dashboard Interactivo**: Vista principal con módulos de aprendizaje
- **Terminal Interactiva**: Práctica en tiempo real de comandos Linux
- **Biblioteca de Comandos**: Referencia completa de comandos Linux
- **Sistema de Ranking**: Tabla de clasificación de usuarios
- **Perfil y Configuración**: Gestión de cuenta y preferencias
- **Panel de Administración**: Gestión de usuarios y lecciones

## Tecnologías Utilizadas

- **Vue.js 3**: Framework principal
- **TypeScript**: Soporte de tipado
- **Vue Router**: Enrutamiento de la aplicación
- **Socket.io-client**: Comunicación en tiempo real
- **xterm.js**: Emulador de terminal web
- **Vite**: Bundler y herramienta de desarrollo

## Estructura del Proyecto

```
src/
├── components/       # Componentes Vue
│   ├── AdminDashboard.vue
│   ├── Biblioteca.vue
│   ├── Configuracion.vue
│   ├── Dashboard.vue
│   ├── Header.vue
│   ├── Leccion.vue
│   ├── Login.vue
│   ├── Ranking.vue
│   └── Registro.vue
├── router/          # Configuración de rutas
├── services/        # Servicios de API
├── App.vue          # Componente raíz
└── main.ts         # Punto de entrada
```

## Configuración del Entorno de Desarrollo

### Requisitos Previos

- Node.js (versión recomendada: >=18)
- pnpm (gestor de paquetes)
- IDE Recomendado: VS Code + Volar

### Instalación

1. Clonar el repositorio
```sh
git clone https://github.com/CristianCortes1/Sistema-de-aprendizaje-Linux.git
cd Sistema-de-aprendizaje-Linux/Frontend
```

2. Instalar dependencias
```sh
pnpm install
```

3. Iniciar servidor de desarrollo
```sh
pnpm dev
```

4. Compilar para producción
```sh
pnpm build
```

## Rutas de la Aplicación

- `/`: Página de login
- `/registro`: Registro de nuevos usuarios
- `/dashboard`: Panel principal
- `/biblioteca`: Biblioteca de comandos
- `/ranking`: Tabla de clasificación
- `/configuracion`: Ajustes de usuario
- `/leccion/:id`: Visualización de lecciones
- `/admin`: Panel de administración

## Roles de Usuario

- **Usuario Regular**: Acceso a lecciones, biblioteca y ranking
- **Administrador**: Gestión de usuarios y contenido del sistema

## Características de la Interfaz

- Diseño responsivo
- Tema oscuro/claro
- Terminal interactiva
- Notificaciones en tiempo real
- Seguimiento de progreso
- Sistema de puntuación y experiencia
