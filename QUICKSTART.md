# 🐧 PenguinPath - Quick Start Guide

## 🚀 Opción 1: Inicio Automático (Recomendado)

### Windows (PowerShell)
```powershell
.\start.ps1
```

Este script:
- ✅ Verifica que Docker esté corriendo
- ✅ Construye la imagen personalizada de Ubuntu
- ✅ Configura los servicios
- ✅ Inicia todo con Docker Compose

## 🛠️ Opción 2: Inicio Manual

### 1. Verificar Docker
```bash
docker --version
docker-compose --version
```

### 2. Construir imagen de Ubuntu personalizada (opcional pero recomendado)
```bash
# Windows
.\build-ubuntu-image.bat

# Linux/Mac
chmod +x build-ubuntu-image.sh
./build-ubuntu-image.sh
```

### 3. Configurar variables de entorno
```bash
# Backend
cp Backend/.env.example Backend/.env
# Editar Backend/.env y cambiar JWT_SECRET
```

### 4. Iniciar servicios
```bash
docker-compose up -d --build
```

### 5. Ver logs
```bash
docker-compose logs -f
```

## 📍 URLs de Acceso

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000
- **Base de datos**: localhost:5432

## 🎯 Características

✨ **Frontend Vue.js** con terminal interactivo (xterm.js)
✨ **Backend NestJS** con WebSockets para comunicación en tiempo real
✨ **Contenedores Docker individuales** para cada usuario (Ubuntu 22.04)
✨ **Aislamiento completo** con límites de recursos
✨ **Base de datos PostgreSQL** con Prisma ORM

## 📋 Comandos Útiles

```bash
# Ver servicios corriendo
docker-compose ps

# Ver logs de un servicio específico
docker-compose logs -f backend
docker-compose logs -f frontend

# Reiniciar un servicio
docker-compose restart backend

# Detener todo
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v

# Ver contenedores de usuarios activos
docker ps | grep penguinpath-user

# Entrar a un servicio
docker-compose exec backend sh
```

## 🐛 Solución de Problemas

### Docker no está corriendo
```bash
# Windows: Abrir Docker Desktop
# Linux: sudo systemctl start docker
```

### Puerto 3000 o 5173 ya en uso
```bash
# Cambiar puertos en docker-compose.yml
# Ejemplo: "8000:3000" para usar puerto 8000
```

### Error al crear contenedores de usuarios
```bash
# Verificar que el socket de Docker está accesible
docker ps

# Limpiar contenedores huérfanos
docker ps -a | grep penguinpath-user | awk '{print $1}' | xargs docker rm -f
```

## 📖 Documentación Completa

Ver [DOCKER_README.md](DOCKER_README.md) para documentación detallada.

## 🔄 Actualizar

```bash
git pull
docker-compose down
docker-compose up -d --build
```

## 🎓 Desarrollo

### Backend
```bash
cd Backend
pnpm install
pnpm run start:dev
```

### Frontend
```bash
cd Frontend
pnpm install
pnpm run dev
```

**Nota**: Para funcionalidad completa de terminal, Docker debe estar corriendo.

---

**¿Problemas?** Abre un issue en GitHub o consulta [DOCKER_README.md](DOCKER_README.md)
