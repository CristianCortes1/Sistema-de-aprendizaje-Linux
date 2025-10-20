# 🐧 PenguinPath - Sistema de Aprendizaje Linux con Docker

## 📖 Resumen de Cambios

### ✅ ¿Qué se hizo?

1. **Dockerización completa** del Frontend y Backend
2. **Reemplazo de SSH** por contenedores Docker individuales
3. **Contenedor Ubuntu por usuario**: Cada usuario obtiene su propio entorno aislado
4. **Base de datos PostgreSQL** dockerizada
5. **Docker-in-Docker**: El backend crea y gestiona contenedores de Ubuntu dinámicamente

### 🎯 Arquitectura Nueva

```
┌─────────────────────────────────────────────────────────┐
│                     Docker Host                         │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Frontend   │  │   Backend    │  │  PostgreSQL  │ │
│  │  (Vue.js)    │  │  (NestJS)    │  │              │ │
│  │  Port: 5173  │  │  Port: 3000  │  │  Port: 5432  │ │
│  └──────────────┘  └──────┬───────┘  └──────────────┘ │
│                           │                            │
│                           │ Docker Socket              │
│                           ▼                            │
│           ┌────────────────────────────────┐          │
│           │ Contenedores de Usuario       │          │
│           │ ┌──────┐ ┌──────┐ ┌──────┐   │          │
│           │ │Ubuntu│ │Ubuntu│ │Ubuntu│   │          │
│           │ │User1 │ │User2 │ │User3 │   │          │
│           │ └──────┘ └──────┘ └──────┘   │          │
│           └────────────────────────────────┘          │
└─────────────────────────────────────────────────────────┘
```

### 📦 Archivos Creados/Modificados

#### Nuevos Archivos Docker:
- `docker-compose.yml` - Orquestación de servicios
- `Backend/Dockerfile` - Imagen del backend
- `Backend/docker-entrypoint.sh` - Script de inicio del backend
- `Backend/Dockerfile.ubuntu-user` - Imagen personalizada de Ubuntu para usuarios
- `Frontend/Dockerfile` - Imagen del frontend
- `Frontend/nginx.conf` - Configuración de Nginx

#### Código Nuevo:
- `Backend/src/terminal/docker.service.ts` - Servicio para gestionar contenedores Docker
- `Backend/src/terminal/terminal.gateway.ts` - Modificado para usar Docker en lugar de SSH
- `Backend/src/terminal/terminal.module.ts` - Actualizado con DockerService

#### Scripts y Documentación:
- `start.ps1` - Script de inicio automático (Windows)
- `build-ubuntu-image.sh` - Script para construir imagen Ubuntu (Linux/Mac)
- `build-ubuntu-image.bat` - Script para construir imagen Ubuntu (Windows)
- `DOCKER_README.md` - Documentación completa
- `QUICKSTART.md` - Guía de inicio rápido
- `.gitignore` - Ignorar archivos innecesarios
- `Backend/.env.example` - Plantilla de variables de entorno

### 🔧 Cambios en Dependencias:
- ❌ Eliminado: `ssh2` (ya no se usa SSH)
- ✅ Agregado: `dockerode` (cliente Docker para Node.js)
- ✅ Agregado: `@types/dockerode` (tipos TypeScript)

---

## 🚀 Inicio Rápido

### Prerequisitos
- Docker Desktop (Windows/Mac) o Docker Engine (Linux)
- Git

### Paso 1: Clonar y Configurar

```bash
# Clonar repositorio
git clone <tu-repo-url>
cd Sistema-de-aprendizaje-Linux

# Copiar variables de entorno
cp Backend/.env.example Backend/.env

# Editar Backend/.env y cambiar JWT_SECRET
```

### Paso 2: Iniciar con Script Automático (Recomendado)

#### Windows (PowerShell)
```powershell
.\start.ps1
```

#### Linux/Mac
```bash
chmod +x build-ubuntu-image.sh
./build-ubuntu-image.sh
docker-compose up -d --build
```

### Paso 3: Acceder
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

---

## 🎯 Características Principales

### Para Cada Usuario:
✅ **Contenedor Ubuntu 22.04 aislado**
✅ **512MB RAM** (configurable)
✅ **50% CPU** (configurable)
✅ **Límite de 100 procesos**
✅ **Sin acceso a red externa** (seguridad)
✅ **Auto-eliminación** al desconectarse
✅ **Herramientas Linux preinstaladas**: bash, vim, nano, git, grep, awk, sed, etc.

### Ventajas sobre SSH:
✅ **Aislamiento total**: Cada usuario en su propio contenedor
✅ **Escalable**: Crea/destruye contenedores dinámicamente
✅ **Seguro**: Sin acceso al sistema host
✅ **Limpio**: Se eliminan automáticamente
✅ **Sin configuración SSH**: No necesita servidor SSH separado
✅ **Recursos controlados**: Límites por contenedor

---

## 📋 Comandos Útiles

### Docker Compose
```bash
# Ver servicios
docker-compose ps

# Ver logs
docker-compose logs -f
docker-compose logs -f backend

# Reiniciar
docker-compose restart

# Detener
docker-compose down

# Reconstruir
docker-compose up -d --build
```

### Gestión de Contenedores de Usuario
```bash
# Ver contenedores de usuarios activos
docker ps | grep penguinpath-user

# Ver recursos usados por usuarios
docker stats $(docker ps --filter "name=penguinpath-user" -q)

# Limpiar contenedores huérfanos
docker ps -a | grep penguinpath-user | awk '{print $1}' | xargs docker rm -f
```

### Base de Datos
```bash
# Ejecutar migraciones
docker-compose exec backend npx prisma migrate deploy

# Abrir Prisma Studio
docker-compose exec backend npx prisma studio

# Backup
docker-compose exec postgres pg_dump -U postgres penguinpath > backup.sql
```

---

## 🔒 Seguridad

### Configuración de Contenedores de Usuario:
- ✅ Sin privilegios (no root)
- ✅ Sin acceso a red externa
- ✅ Límites de recursos (RAM, CPU, procesos)
- ✅ Auto-eliminación al desconectar
- ✅ Aislamiento completo del host
- ✅ Solo acceso a su propio filesystem

### Variables de Entorno Importantes:
```env
JWT_SECRET="<cambiar-por-secreto-fuerte>"
DATABASE_URL="<url-base-de-datos>"
DOCKER_HOST="unix:///var/run/docker.sock"
```

---

## 🛠️ Configuración Avanzada

### Modificar Límites de Recursos

Edita `Backend/src/terminal/docker.service.ts`:

```typescript
HostConfig: {
    Memory: 512 * 1024 * 1024, // 512 MB (cambiar aquí)
    CpuQuota: 50000,            // 50% CPU (cambiar aquí)
    PidsLimit: 100,             // Máx procesos (cambiar aquí)
    NetworkMode: 'none',        // 'bridge' para dar internet
}
```

### Personalizar Imagen Ubuntu

Edita `Backend/Dockerfile.ubuntu-user` para agregar más herramientas:

```dockerfile
RUN apt-get update && apt-get install -y \
    python3 \
    nodejs \
    gcc \
    # ... más herramientas
```

Luego reconstruye:
```bash
docker build -f Backend/Dockerfile.ubuntu-user -t penguinpath-ubuntu:latest Backend/
```

### Habilitar Acceso a Internet para Usuarios

En `docker.service.ts`:
```typescript
NetworkMode: 'bridge', // Cambia de 'none' a 'bridge'
```

---

## 🐛 Solución de Problemas

### Error: "Cannot connect to Docker daemon"
**Causa**: Docker no está corriendo
**Solución**: Inicia Docker Desktop

### Error: "Port already in use"
**Causa**: Puertos 3000 o 5173 ocupados
**Solución**: Cambia puertos en `docker-compose.yml`

### Contenedores no se eliminan
**Causa**: Desconexión abrupta
**Solución**: Se limpian automáticamente al reiniciar backend, o manualmente:
```bash
docker ps -a | grep penguinpath-user | awk '{print $1}' | xargs docker rm -f
```

### Backend no puede crear contenedores
**Causa**: Permisos del socket Docker
**Solución** (Linux): Agregar usuario al grupo docker:
```bash
sudo usermod -aG docker $USER
```

---

## 🚢 Despliegue a Producción

### Recomendaciones:
1. Usa **secretos** para credenciales sensibles
2. Configura un **dominio** con SSL (Let's Encrypt)
3. Usa **Docker Swarm** o **Kubernetes** para orquestación
4. Separa la **base de datos** (AWS RDS, Cloud SQL)
5. Implementa **monitoreo** (Prometheus, Grafana)
6. Configura **backups automáticos**
7. Usa un **reverse proxy** (Traefik, Nginx)

### Ejemplo con Traefik:
```yaml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.app.rule=Host(`penguinpath.com`)"
  - "traefik.http.routers.app.tls.certresolver=letsencrypt"
```

---

## 📊 Monitoreo

### Métricas Disponibles:
- Contenedores activos por usuario
- Uso de RAM/CPU por contenedor
- Tiempo de vida de contenedores
- Número de sesiones simultáneas

### Ver estadísticas:
```bash
# Estadísticas en tiempo real
docker stats

# Solo usuarios de PenguinPath
docker stats $(docker ps --filter "name=penguinpath-user" -q)
```

---

## 📚 Documentación Adicional

- [DOCKER_README.md](DOCKER_README.md) - Documentación completa
- [QUICKSTART.md](QUICKSTART.md) - Guía de inicio rápido
- [Backend/README.md](Backend/README.md) - Documentación del backend
- [Frontend/README.md](Frontend/README.md) - Documentación del frontend

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## ⚖️ Licencia

[Tu licencia aquí]

---

## 🙏 Agradecimientos

- NestJS por el framework backend
- Vue.js por el framework frontend
- Dockerode por el cliente Docker
- xterm.js por el emulador de terminal

---

## 📞 Contacto

- GitHub: [@cristianCortes1](https://github.com/cristianCortes1)
- Issues: [Sistema-de-aprendizaje-Linux/issues](https://github.com/cristianCortes1/Sistema-de-aprendizaje-Linux/issues)

---

**¡Feliz aprendizaje de Linux! 🐧**
