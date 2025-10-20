# 🐧 PenguinPath - Dockerized Setup

Este proyecto usa Docker para ejecutar todo el stack de la aplicación, incluyendo contenedores individuales de Ubuntu para cada usuario.

## 📋 Requisitos Previos

- Docker Desktop instalado (Windows/Mac) o Docker Engine (Linux)
- Docker Compose
- Al menos 4GB de RAM disponible
- Git

## 🚀 Inicio Rápido

### 1. Clonar el repositorio

```bash
git clone <your-repo-url>
cd Sistema-de-aprendizaje-Linux
```

### 2. Configurar variables de entorno

```bash
# Backend
cp Backend/.env.example Backend/.env

# Editar Backend/.env y configurar:
# - JWT_SECRET (usa un secreto fuerte)
# - SENDGRID_API_KEY (si usas email)
```

### 3. Iniciar todo con Docker Compose

```bash
# Construir e iniciar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f backend
```

### 4. Acceder a la aplicación

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Base de datos**: localhost:5432 (postgres/postgres)

## 🛠️ Comandos Útiles

### Gestión de contenedores

```bash
# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes (⚠️ elimina la BD)
docker-compose down -v

# Reconstruir e iniciar
docker-compose up -d --build

# Ver estado
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f
```

### Gestión de base de datos

```bash
# Ejecutar migraciones manualmente
docker-compose exec backend npx prisma migrate deploy

# Abrir Prisma Studio
docker-compose exec backend npx prisma studio

# Reiniciar BD (⚠️ elimina todos los datos)
docker-compose exec backend npx prisma migrate reset
```

### Desarrollo

```bash
# Entrar al contenedor del backend
docker-compose exec backend sh

# Entrar al contenedor del frontend
docker-compose exec frontend sh

# Ver contenedores de usuarios activos
docker ps | grep penguinpath-user
```

## 🐳 Arquitectura Docker

### Servicios

1. **postgres**: Base de datos PostgreSQL
2. **backend**: NestJS API + WebSocket Gateway
3. **frontend**: Vue.js SPA servido por Nginx

### Docker-in-Docker

El backend tiene acceso al socket de Docker del host (`/var/run/docker.sock`) para crear contenedores individuales de Ubuntu para cada usuario que se conecta.

Cada usuario obtiene:
- ✅ Contenedor Ubuntu 22.04 aislado
- ✅ 512MB de RAM
- ✅ 50% de un CPU
- ✅ Terminal interactivo con bash
- ✅ Sin acceso a red externa (seguridad)
- ✅ Límite de 100 procesos

## 🔧 Configuración de Producción

### Variables de entorno importantes

```env
# Backend/.env
DATABASE_URL="postgresql://user:pass@host:5432/db"
JWT_SECRET="<secreto-fuerte-aqui>"
SENDGRID_API_KEY="<tu-api-key>"
PORT=3000
```

### Consideraciones de seguridad

1. **JWT_SECRET**: Usa un secreto fuerte y único
2. **Base de datos**: Cambia las credenciales por defecto
3. **CORS**: Configura dominios específicos en `main.ts`
4. **Docker socket**: En producción, considera usar Docker API remoto

### Despliegue

Para producción, recomendamos:

1. **Usar Docker Swarm o Kubernetes** para orquestación
2. **Separar la base de datos** en un servicio gestionado (AWS RDS, Google Cloud SQL)
3. **Usar secrets** en lugar de variables de entorno
4. **Configurar límites de recursos** por usuario
5. **Implementar monitoreo** (Prometheus, Grafana)
6. **Usar un reverse proxy** (Traefik, Nginx) con SSL

## 📊 Monitoreo

### Ver contenedores de usuarios activos

```bash
# Listar contenedores de usuarios
docker ps --filter "name=penguinpath-user"

# Ver recursos usados
docker stats $(docker ps --filter "name=penguinpath-user" -q)
```

### Limpiar contenedores huérfanos

```bash
# Limpiar contenedores detenidos
docker container prune -f

# Limpiar todos los contenedores de usuarios
docker ps -a | grep penguinpath-user | awk '{print $1}' | xargs docker rm -f
```

## 🐛 Troubleshooting

### El backend no puede crear contenedores

**Error**: `Cannot connect to Docker daemon`

**Solución**: Asegúrate de que Docker Desktop está corriendo y que el socket está montado correctamente.

### Base de datos no conecta

**Error**: `Can't reach database server`

**Solución**: 
```bash
# Verifica que postgres está corriendo
docker-compose ps postgres

# Reinicia el servicio
docker-compose restart postgres
```

### Frontend no carga

**Error**: 404 o página en blanco

**Solución**:
```bash
# Reconstruir el frontend
docker-compose up -d --build frontend

# Ver logs para errores de build
docker-compose logs frontend
```

### Contenedores de usuarios no se eliminan

**Problema**: Los contenedores persisten después de desconectar

**Solución**: El servicio limpia automáticamente al reiniciar. Manual:
```bash
docker ps -a | grep penguinpath-user | awk '{print $1}' | xargs docker rm -f
```

## 🔄 Actualización

```bash
# Obtener últimos cambios
git pull

# Reconstruir y reiniciar
docker-compose down
docker-compose up -d --build

# Aplicar migraciones
docker-compose exec backend npx prisma migrate deploy
```

## 📝 Desarrollo Local (sin Docker)

Si prefieres desarrollar sin Docker:

### Backend
```bash
cd Backend
pnpm install
npx prisma generate
npx prisma migrate dev
pnpm run start:dev
```

### Frontend
```bash
cd Frontend
pnpm install
pnpm run dev
```

**Nota**: Para la funcionalidad de terminal, necesitarás Docker corriendo de todas formas.

## 📄 Licencia

[Tu licencia aquí]

## 🤝 Contribuir

[Instrucciones de contribución]

## 📞 Soporte

[Información de contacto o issues]
