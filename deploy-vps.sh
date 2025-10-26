#!/bin/bash

# Script de despliegue para VPS
# Uso: ./deploy-vps.sh

set -e

echo "🚀 Iniciando despliegue en producción..."

# Verificar que existe .env
if [ ! -f .env ]; then
    echo "❌ Error: No existe .env"
    echo "Crea el archivo .env con las configuraciones de producción"
    exit 1
fi

# Pull latest changes
echo "📥 Descargando últimos cambios..."
git pull origin docker

# Construir imagen de ubuntu-user si no existe
echo "🐧 Verificando imagen de Ubuntu..."
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
docker compose -f docker-compose.prod.yml down || true

# Construir nuevas imágenes (sin cache para asegurar nuevas variables)
echo "🔨 Construyendo imágenes..."
docker compose -f docker-compose.prod.yml build --no-cache

# Iniciar servicios
echo "▶️  Iniciando servicios..."
docker compose -f docker-compose.prod.yml up -d

# Esperar a que el backend esté listo
echo "⏳ Esperando a que los servicios inicien..."
sleep 20

# Verificar estado
echo "✅ Verificando servicios..."
docker compose -f docker-compose.prod.yml ps

# Mostrar logs
echo ""
echo "📋 Últimos logs del backend:"
docker compose -f docker-compose.prod.yml logs --tail 30 backend

echo ""
echo "📋 Últimos logs del frontend:"
docker compose -f docker-compose.prod.yml logs --tail 10 frontend

echo ""
echo "✨ ¡Despliegue completado!"
echo ""
echo "🌐 Accede a tu aplicación:"
echo "   🎨 Frontend: http://$(curl -s ifconfig.me)"
echo "   ⚠️  Backend: Solo accesible internamente (puerto 3000 no expuesto)"
echo "   📡 API: http://$(curl -s ifconfig.me)/api"
echo ""
echo "📊 Para ver logs en tiempo real:"
echo "   docker compose -f docker-compose.prod.yml logs -f"
echo ""
echo "🔍 Para ver contenedores activos:"
echo "   docker compose -f docker-compose.prod.yml ps"
echo ""
echo "🔄 Para reiniciar servicios:"
echo "   docker compose -f docker-compose.prod.yml restart"
echo ""
echo "🗄️  Para acceder a la base de datos:"
echo "   docker exec -it penguinpath-db-prod psql -U penguinpath_prod -d penguinpath_prod"
