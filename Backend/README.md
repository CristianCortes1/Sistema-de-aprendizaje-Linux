# 🐧 PenguinPath - Backend API

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

Sistema de aprendizaje interactivo de comandos Linux construido con NestJS, Prisma y PostgreSQL.

## 📋 Descripción

Backend del sistema PenguinPath que proporciona una API REST completa para:
- 🔐 Autenticación y autorización de usuarios
- 📚 Gestión de lecciones y retos de aprendizaje
- 💻 Validación de comandos Linux
- 📊 Seguimiento de progreso del usuario
- 🎮 Sistema de gamificación (experiencia, monedas, items)
- 🏆 Sistema de rankings

## 🚀 Inicio Rápido

### Prerrequisitos

- Docker y Docker Compose (Recomendado) ⭐
- O alternativamente:
  - Node.js >= 18
  - pnpm >= 8
  - PostgreSQL >= 14

### 🐳 Opción 1: Con Docker (Recomendado)

```bash
# Desde la raíz del proyecto
cd ..

# Iniciar todos los servicios (Backend + PostgreSQL + Frontend)
docker-compose -f docker-compose.dev.yml up -d

# Ver logs del backend
docker-compose -f docker-compose.dev.yml logs -f backend

# La API estará disponible en http://localhost:3000
# Swagger UI en http://localhost:3000/api
```

**Comandos útiles:**

```bash
# Ver estado de los contenedores
docker-compose -f docker-compose.dev.yml ps

# Detener los servicios
docker-compose -f docker-compose.dev.yml down

# Reiniciar solo el backend
docker-compose -f docker-compose.dev.yml restart backend

# Ver logs en tiempo real
docker-compose -f docker-compose.dev.yml logs -f

# Acceder al contenedor del backend
docker exec -it penguinpath-backend sh

# Ejecutar migraciones de Prisma
docker exec -it penguinpath-backend npx prisma migrate dev
```

### 💻 Opción 2: Sin Docker (Desarrollo Local)

```bash
# Clonar el repositorio
git clone <repository-url>
cd Backend

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# Asegúrate de tener PostgreSQL corriendo
# Actualiza DATABASE_URL en .env

# Ejecutar migraciones de base de datos
npx prisma migrate dev

# Generar cliente Prisma
npx prisma generate

# Iniciar en modo desarrollo
pnpm run start:dev
```

### Desarrollo

**Con Docker:**
```bash
# Los cambios en el código se reflejan automáticamente con hot-reload
docker-compose -f docker-compose.dev.yml up -d

# Ver logs
docker-compose -f docker-compose.dev.yml logs -f backend
```

**Sin Docker:**
```bash
# Modo desarrollo con hot-reload
pnpm run start:dev

# Modo desarrollo con debug
pnpm run start:debug

# Compilar proyecto
pnpm run build

# Modo producción
pnpm run start:prod
```

### 🐳 Docker en Detalle

El proyecto incluye tres configuraciones de Docker Compose:

1. **docker-compose.dev.yml** - Desarrollo (Hot-reload, debug)
2. **docker-compose.yml** - Producción local
3. **docker-compose.prod.yml** - Producción en servidor

**Servicios incluidos:**
- 🐘 PostgreSQL 16
- 🚀 Backend (NestJS)
- 🎨 Frontend (Vue.js)
- 🔗 Red compartida

**Volúmenes:**
- Base de datos persistente
- Socket de Docker (para terminal virtual)

## 📚 Documentación de la API

### Swagger UI (Recomendado)

Una vez iniciado el servidor, accede a la documentación interactiva:

**URL**: `http://localhost:3000/api`

La interfaz de Swagger te permite:
- ✅ Explorar todos los endpoints disponibles
- ✅ Ver esquemas de datos y validaciones
- ✅ Probar las peticiones directamente desde el navegador
- ✅ Ver ejemplos de request/response
- ✅ Autenticarte con JWT

### Documentación Markdown

Para una guía completa de la API, consulta:
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - Guía completa de endpoints y modelos

## 🏗️ Estructura del Proyecto

```
Backend/
├── src/
│   ├── auth/              # Autenticación y autorización
│   │   ├── dto/          # Data Transfer Objects
│   │   ├── auth.controller.ts
│   │   └── auth.service.ts
│   ├── users/            # Gestión de usuarios
│   ├── lessons/          # Lecciones de aprendizaje
│   ├── challenges/       # Retos/desafíos
│   ├── commands/         # Comandos Linux
│   ├── progress/         # Progreso de usuarios
│   ├── items/            # Items de gamificación
│   ├── email/            # Servicio de emails
│   ├── terminal/         # Terminal virtual con Docker
│   ├── common/           # DTOs y utilidades comunes
│   ├── prisma.service.ts # Servicio de Prisma ORM
│   ├── app.module.ts     # Módulo principal
│   └── main.ts           # Punto de entrada
├── prisma/
│   ├── schema.prisma     # Esquema de base de datos
│   └── migrations/       # Migraciones
├── test/                 # Tests E2E
├── docker-compose.yml
├── Dockerfile
└── package.json
```

## 🔧 Tecnologías Principales

- **Framework**: NestJS 11
- **ORM**: Prisma 6
- **Base de datos**: PostgreSQL
- **Autenticación**: JWT + Passport
- **Validación**: class-validator, class-transformer
- **Documentación**: Swagger/OpenAPI
- **Emails**: SendGrid / Nodemailer
- **Contenedores**: Docker + Dockerode

## 🧪 Testing

```bash
# Tests unitarios
pnpm run test

# Tests en modo watch
pnpm run test:watch

# Coverage de tests
pnpm run test:cov

# Tests E2E
pnpm run test:e2e
```

## 📊 Base de Datos

### Gestión con Prisma

```bash
# Crear una nueva migración
npx prisma migrate dev --name <nombre-migracion>

# Aplicar migraciones en producción
npx prisma migrate deploy

# Abrir Prisma Studio (interfaz visual)
npx prisma studio

# Resetear base de datos (solo desarrollo)
npx prisma migrate reset
```

### Modelos Principales

- **User**: Usuarios del sistema
- **Leccion**: Lecciones de aprendizaje
- **Reto**: Desafíos dentro de lecciones
- **Comando**: Comandos Linux esperados
- **Progreso**: Seguimiento de progreso
- **Item**: Items de gamificación

## 🔑 Variables de Entorno

### Con Docker

Las variables de entorno se configuran en el archivo `docker-compose.dev.yml` o `docker-compose.yml`.

Las más importantes ya están configuradas:
- `DATABASE_URL`: Apunta al contenedor de PostgreSQL
- `JWT_SECRET`: Usa el valor por defecto o configura uno propio
- `PORT`: 3000 (ya configurado)

Para variables opcionales (como email), puedes:

**Opción 1: Archivo .env en la raíz del proyecto**
```env
JWT_SECRET=tu-secreto-super-seguro
SENDGRID_API_KEY=tu-sendgrid-api-key
```

**Opción 2: Directamente en docker-compose.dev.yml**
```yaml
environment:
  JWT_SECRET: tu-secreto-aqui
  SENDGRID_API_KEY: tu-api-key-aqui
```

### Sin Docker

Crea un archivo `.env` en la carpeta Backend:

```env
# Base de datos (asegúrate de tener PostgreSQL corriendo)
DATABASE_URL="postgresql://user:password@localhost:5432/penguinpath?schema=public"

# JWT - Autenticación
JWT_SECRET="change-this-to-a-random-secret-key-in-production"
JWT_EXPIRES_IN="7d"

# Email - SendGrid (Opción 1)
SENDGRID_API_KEY="your-sendgrid-api-key-here"
EMAIL_FROM="noreply@penguinpath.com"

# Frontend URL - Para CORS
FRONTEND_URL="http://localhost:5173"

# Puerto del servidor
PORT=3000

# Entorno
NODE_ENV="development"
```

## 📝 Scripts Disponibles

```json
{
  "start": "nest start",
  "start:dev": "nest start --watch",
  "start:debug": "nest start --debug --watch",
  "start:prod": "node dist/main",
  "build": "nest build",
  "test": "jest",
  "test:watch": "jest --watch",
  "test:cov": "jest --coverage",
  "test:e2e": "jest --config ./test/jest-e2e.json",
  "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
  "format": "prettier --write \"src/**/*.ts\"",
  "docker:build": "docker-compose build",
  "docker:up": "docker-compose up -d",
  "docker:down": "docker-compose down",
  "docker:logs": "docker-compose logs -f"
}
```

## 🌐 Endpoints Principales

### Autenticación
- `POST /auth/register` - Registrar usuario
- `POST /auth/login` - Iniciar sesión
- `GET /auth/confirm-email?token=` - Confirmar email

### Usuarios
- `GET /users` - Lista de usuarios
- `GET /users/ranking` - Ranking por experiencia
- `GET /users/:id` - Obtener usuario

### Lecciones
- `GET /lessons` - Lista de lecciones
- `POST /lessons` - Crear lección
- `GET /lessons/:id` - Obtener lección

### Retos
- `GET /challenges` - Lista de retos
- `POST /challenges` - Crear reto

### Progreso
- `GET /progress` - Obtener progresos
- `POST /progress` - Crear progreso

## 🔒 Seguridad

- ✅ Autenticación JWT
- ✅ Validación de datos con class-validator
- ✅ Encriptación de contraseñas con bcrypt
- ✅ CORS configurado
- ✅ Rate limiting (próximamente)
- ✅ Helmet para headers de seguridad (próximamente)

## 📦 Despliegue

### Producción

```bash
# Build de producción
pnpm run build

# Ejecutar en producción
pnpm run start:prod

# Con PM2 (recomendado)
pm2 start dist/main.js --name penguinpath-api
```

### Docker en Producción

```bash
# Usar docker-compose.prod.yml
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

## 👥 Equipo

- **Equipo PenguinPath** - [penguinpath.duckdns.org](http://penguinpath.duckdns.org)

## 📞 Soporte

- 📧 Email: contact@penguinpath.com
- 🌐 Website: http://penguinpath.duckdns.org
- 📚 Docs: http://localhost:3000/api

---

Construido con ❤️ usando [NestJS](https://nestjs.com/)

