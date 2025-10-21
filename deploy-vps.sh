#!/bin/bash

# Script de despliegue para VPS
# Uso: ./deploy-vps.sh

set -e

echo "� Iniciando despliegue en producción..."

# Verificar que existe .env.production
if [ ! -f .env.production ]; then
    echo "❌ Error: No existe .env.production"
    echo "Copia .env.production.example y completa los valores:"
    echo "cp .env.production.example .env.production"
    exit 1
fi

# Pull latest changes
echo "� Descargando últimos cambios..."
git pull origin docker

# Cargar variables de entorno (filtrar comentarios y líneas vacías)
echo "⚙️  Cargando variables de entorno..."
set -a
source <(grep -v '^#' .env.production | grep -v '^$' | sed 's/\r$//')
set +a

# Construir imagen de ubuntu-user si no existe
echo "� Verificando imagen de Ubuntu..."
if ! docker images | grep -q "penguinpath-ubuntu"; then
    echo "Construyendo imagen penguinpath-ubuntu..."
    cd Backend
    docker build -f Dockerfile.ubuntu-user -t penguinpath-ubuntu:latest .
    cd ..
else
    echo "✅ Imagen penguinpath-ubuntu ya existe"
fi

# Detener contenedores existentes
echo "⏹️  Deteniendo servicios anteriores..."
docker-compose -f docker-compose.prod.yml down || true

# Construir nuevas imágenes
echo "� Construyendo imágenes..."
docker-compose -f docker-compose.prod.yml build --no-cache

# Iniciar servicios
echo "▶️  Iniciando servicios..."
docker-compose -f docker-compose.prod.yml up -d

# Esperar a que el backend esté listo
echo "⏳ Esperando a que los servicios inicien..."
sleep 15

# Verificar estado
echo "✅ Verificando servicios..."
docker-compose -f docker-compose.prod.yml ps

# Mostrar logs
echo ""
echo "� Últimos logs del backend:"
docker-compose -f docker-compose.prod.yml logs --tail 30 backend

echo ""
echo "� Últimos logs del frontend:"
docker-compose -f docker-compose.prod.yml logs --tail 10 frontend

echo ""
echo "✨ ¡Despliegue completado!"
echo ""
echo "� Accede a tu aplicación:"
echo "   Frontend: http://$(curl -s ifconfig.me)"
echo "   Backend:  http://$(curl -s ifconfig.me):3000"
echo ""
echo "� Para ver logs en tiempo real:"
echo "   docker-compose -f docker-compose.prod.yml logs -f"
echo ""
echo "� Para ver contenedores activos:"
echo "   docker-compose -f docker-compose.prod.yml ps"
echo ""
echo "� Para reiniciar servicios:"
echo "   docker-compose -f docker-compose.prod.yml restart"
