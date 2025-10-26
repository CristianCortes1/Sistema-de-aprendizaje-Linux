# 🐧 PenguinPath - Sistema de Aprendizaje Linux

Sistema interactivo de aprendizaje de comandos Linux con gamificación y terminal virtual.

## 🚀 Inicio Rápido con Docker

### Prerrequisitos

- Docker Desktop o Docker Engine
- Docker Compose
- Git

### Pasos para Iniciar

```bash
# 1. Clonar el repositorio
git clone <repository-url>
cd Sistema-de-aprendizaje-Linux

# 2. Configurar variables de entorno (opcional)
# Puedes configurar JWT_SECRET, SENDGRID_API_KEY, etc.
# O dejar los valores por defecto para desarrollo

# 3. Iniciar todos los servicios
docker-compose -f docker-compose.dev.yml up -d

# 4. Ver logs para confirmar que todo está corriendo
docker-compose -f docker-compose.dev.yml logs -f
```

### 📊 Servicios Disponibles

Una vez iniciado, tendrás acceso a:

- 🎨 **Frontend**: http://localhost:5173
- 🚀 **Backend API**: http://localhost:3000
- 📚 **Swagger/API Docs**: http://localhost:3000/api
- 🐘 **PostgreSQL**: localhost:5432

## 📁 Estructura del Proyecto

```
Sistema-de-aprendizaje-Linux/
├── Backend/              # API NestJS
│   ├── src/             # Código fuente
│   ├── prisma/          # Base de datos
│   └── Dockerfile
├── Frontend/            # Aplicación Vue.js
│   ├── src/
│   └── Dockerfile
├── Documentacion/       # Documentación del proyecto
├── docker-compose.dev.yml    # Desarrollo
├── docker-compose.yml        # Producción local
└── docker-compose.prod.yml   # Producción servidor
```

## 🐳 Comandos Docker Útiles

### Ver estado de los servicios
```bash
docker-compose -f docker-compose.dev.yml ps
```

### Ver logs
```bash
# Todos los servicios
docker-compose -f docker-compose.dev.yml logs -f

# Solo backend
docker-compose -f docker-compose.dev.yml logs -f backend

# Solo frontend
docker-compose -f docker-compose.dev.yml logs -f frontend
```

### Reiniciar servicios
```bash
# Reiniciar todo
docker-compose -f docker-compose.dev.yml restart

# Reiniciar solo backend
docker-compose -f docker-compose.dev.yml restart backend
```

### Detener servicios
```bash
# Detener sin borrar datos
docker-compose -f docker-compose.dev.yml down

# Detener y borrar todo (incluyendo base de datos)
docker-compose -f docker-compose.dev.yml down -v
```

### Acceder a los contenedores
```bash
# Backend
docker exec -it penguinpath-backend sh

# Base de datos
docker exec -it penguinpath-db psql -U postgres -d penguinpath

# Frontend
docker exec -it penguinpath-frontend sh
```

### Ejecutar comandos en los contenedores
```bash
# Migraciones de Prisma
docker exec -it penguinpath-backend npx prisma migrate dev

# Ver base de datos con Prisma Studio
docker exec -it penguinpath-backend npx prisma studio

# Instalar dependencias en el backend
docker exec -it penguinpath-backend pnpm install
```

## 📚 Documentación

### Backend
- [Backend README](./Backend/README.md) - Guía completa del backend
- [API Documentation](./Backend/API_DOCUMENTATION.md) - Referencia de la API
- [Swagger UI](http://localhost:3000/api) - Documentación interactiva
- [Quick Start](./Backend/QUICK_START.md) - Inicio rápido

### Frontend
- [Frontend README](./Frontend/README.md) - Guía del frontend

### Proyecto
- [Documentación](./Documentacion/) - Diagramas y arquitectura

## 🛠️ Tecnologías

### Backend
- **Framework**: NestJS 11
- **Base de datos**: PostgreSQL 16
- **ORM**: Prisma 6
- **Autenticación**: JWT + Passport
- **WebSockets**: Socket.io
- **Contenedores**: Docker + Dockerode

### Frontend
- **Framework**: Vue.js 3
- **Build**: Vite
- **Estilos**: CSS/SCSS
- **HTTP**: Axios

### DevOps
- **Containerización**: Docker
- **Orquestación**: Docker Compose
- **Servidor**: Nginx (producción)

## 🔧 Desarrollo

### Modo Desarrollo

El archivo `docker-compose.dev.yml` incluye:
- ✅ Hot-reload automático
- ✅ Volúmenes montados para cambios en tiempo real
- ✅ Variables de entorno de desarrollo
- ✅ Puertos expuestos para debugging

### Trabajar sin Docker

Si prefieres trabajar sin Docker:

**Backend:**
```bash
cd Backend
pnpm install
pnpm run start:dev
```

**Frontend:**
```bash
cd Frontend
pnpm install
pnpm run dev
```

Necesitarás tener PostgreSQL instalado y configurado.

## 🧪 Testing

```bash
# Tests del backend
docker exec -it penguinpath-backend pnpm test

# Tests E2E
docker exec -it penguinpath-backend pnpm run test:e2e

# Coverage
docker exec -it penguinpath-backend pnpm run test:cov
```

## 📦 Despliegue

### Producción Local
```bash
docker-compose up -d
```

### Producción en Servidor
```bash
# Usar docker-compose.prod.yml
docker-compose -f docker-compose.prod.yml up -d
```

Ver [deploy-vps.sh](./deploy-vps.sh) para el script de despliegue automático.

## 🔐 Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# JWT
JWT_SECRET=tu-secreto-super-seguro

# Email (opcional)
SENDGRID_API_KEY=tu-api-key

# Base de datos (ya configurado en docker-compose)
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/penguinpath
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la licencia MIT.

## 👥 Equipo

- **Equipo PenguinPath**
- Website: http://penguinpath.duckdns.org

## 🆘 Solución de Problemas

### El backend no se conecta a la base de datos
```bash
# Verificar que PostgreSQL esté corriendo
docker-compose -f docker-compose.dev.yml ps

# Ver logs de la base de datos
docker-compose -f docker-compose.dev.yml logs postgres
```

### Los cambios no se reflejan
```bash
# Reiniciar el servicio
docker-compose -f docker-compose.dev.yml restart backend

# O reconstruir la imagen
docker-compose -f docker-compose.dev.yml up -d --build backend
```

### Problemas con volúmenes o permisos
```bash
# Reinicio completo
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up -d
```

### Ver todos los logs
```bash
docker-compose -f docker-compose.dev.yml logs -f
```

---

**¿Necesitas ayuda?** Consulta la [documentación completa](./Documentacion/) o contacta al equipo.
