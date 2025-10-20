#!/bin/bash

# Script de despliegue para VPS
# Uso: ./deploy-vps.sh

set -e

echo "🚀 Iniciando despliegue en producción..."

# Verificar que existe .env.production
if [ ! -f .env.production ]; then
    echo "❌ Error: No existe .env.production"
    echo "Copia .env.production.example y completa los valores:"
    echo "cp .env.production.example .env.production"
    exit 1
fi

# Pull latest changes
echo "📥 Descargando últimos cambios..."
git pull origin docker

# Cargar variables de entorno
export $(cat .env.production | xargs)

# Construir imagen de ubuntu-user si no existe
echo "🐧 Verificando imagen de Ubuntu..."
if ! docker images | grep -q "ubuntu-user"; then
    echo "Construyendo imagen ubuntu-user..."
    cd Backend
    docker build -f Dockerfile.ubuntu-user -t ubuntu-user .
    cd ..
fi

# Detener contenedores existentes
echo "⏹️  Deteniendo servicios..."
docker-compose -f docker-compose.prod.yml down

# Construir nuevas imágenes
echo "🔨 Construyendo imágenes..."
docker-compose -f docker-compose.prod.yml build --no-cache

# Iniciar servicios
echo "▶️  Iniciando servicios..."
docker-compose -f docker-compose.prod.yml up -d

# Esperar a que el backend esté listo
echo "⏳ Esperando a que el backend inicie..."
sleep 10

# Verificar estado
echo "✅ Verificando servicios..."
docker-compose -f docker-compose.prod.yml ps

# Mostrar logs
echo "📋 Últimos logs:"
docker-compose -f docker-compose.prod.yml logs --tail 20

echo ""
echo "✨ Despliegue completado!"
echo "Frontend: http://tu-servidor"
echo "Backend: http://tu-servidor:3000"
echo ""
echo "Para ver logs en tiempo real:"
echo "docker-compose -f docker-compose.prod.yml logs -f"
