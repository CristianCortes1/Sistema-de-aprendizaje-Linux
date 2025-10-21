#!/bin/bash

# Script de despliegue para VPS
# Uso: ./deploy-vps.sh

set -e

echo "Ì∫Ä Iniciando despliegue en producci√≥n..."

# Verificar que existe .env.production
if [ ! -f .env.production ]; then
    echo "‚ùå Error: No existe .env.production"
    echo "Copia .env.production.example y completa los valores:"
    echo "cp .env.production.example .env.production"
    exit 1
fi

# Pull latest changes
echo "Ì≥• Descargando √∫ltimos cambios..."
git pull origin docker

# Cargar variables de entorno (filtrar comentarios y l√≠neas vac√≠as)
echo "‚öôÔ∏è  Cargando variables de entorno..."
set -a
source <(grep -v '^#' .env.production | grep -v '^$' | sed 's/\r$//')
set +a

# Construir imagen de ubuntu-user si no existe
echo "Ì∞ß Verificando imagen de Ubuntu..."
if ! docker images | grep -q "penguinpath-ubuntu"; then
    echo "Construyendo imagen penguinpath-ubuntu..."
    cd Backend
    docker build -f Dockerfile.ubuntu-user -t penguinpath-ubuntu:latest .
    cd ..
else
    echo "‚úÖ Imagen penguinpath-ubuntu ya existe"
fi

# Detener contenedores existentes
echo "‚èπÔ∏è  Deteniendo servicios anteriores..."
docker-compose -f docker-compose.prod.yml down || true

# Construir nuevas im√°genes
echo "Ì¥® Construyendo im√°genes..."
docker-compose -f docker-compose.prod.yml build --no-cache

# Iniciar servicios
echo "‚ñ∂Ô∏è  Iniciando servicios..."
docker-compose -f docker-compose.prod.yml up -d

# Esperar a que el backend est√© listo
echo "‚è≥ Esperando a que los servicios inicien..."
sleep 15

# Verificar estado
echo "‚úÖ Verificando servicios..."
docker-compose -f docker-compose.prod.yml ps

# Mostrar logs
echo ""
echo "Ì≥ã √öltimos logs del backend:"
docker-compose -f docker-compose.prod.yml logs --tail 30 backend

echo ""
echo "Ì≥ã √öltimos logs del frontend:"
docker-compose -f docker-compose.prod.yml logs --tail 10 frontend

echo ""
echo "‚ú® ¬°Despliegue completado!"
echo ""
echo "Ìºê Accede a tu aplicaci√≥n:"
echo "   Frontend: http://$(curl -s ifconfig.me)"
echo "   Backend:  http://$(curl -s ifconfig.me):3000"
echo ""
echo "Ì≥ä Para ver logs en tiempo real:"
echo "   docker-compose -f docker-compose.prod.yml logs -f"
echo ""
echo "Ì≥¶ Para ver contenedores activos:"
echo "   docker-compose -f docker-compose.prod.yml ps"
echo ""
echo "Ì¥Ñ Para reiniciar servicios:"
echo "   docker-compose -f docker-compose.prod.yml restart"
