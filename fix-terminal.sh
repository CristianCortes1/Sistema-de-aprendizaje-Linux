#!/bin/bash

# Script para solucionar problemas de terminal en PenguinPath
# Ejecutar en el VPS: sudo bash fix-terminal.sh

set -e

echo "🔧 Solucionando problemas de terminal - PenguinPath"
echo "===================================================="
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -d "Backend" ]; then
    echo "❌ Error: Ejecuta este script desde ~/Sistema-de-aprendizaje-Linux"
    exit 1
fi

# 1. Construir imagen penguinpath-ubuntu si no existe
echo "1️⃣  Construyendo imagen penguinpath-ubuntu..."
cd Backend
docker build -f Dockerfile.ubuntu-user -t penguinpath-ubuntu:latest .
if [ $? -eq 0 ]; then
    echo "✅ Imagen penguinpath-ubuntu construida"
else
    echo "❌ Error construyendo imagen"
    exit 1
fi
cd ..

echo ""

# 2. Asegurar permisos correctos en Docker socket
echo "2️⃣  Configurando permisos de Docker socket..."
sudo chmod 666 /var/run/docker.sock
echo "✅ Permisos configurados"

echo ""

# 3. Reiniciar el backend para que detecte la nueva imagen
echo "3️⃣  Reiniciando servicios..."
docker compose -f docker-compose.prod.yml restart backend

echo ""

# 4. Esperar a que el backend esté listo
echo "4️⃣  Esperando a que el backend inicie..."
sleep 10

echo ""

# 5. Verificar logs
echo "5️⃣  Verificando logs del backend..."
docker compose -f docker-compose.prod.yml logs --tail 30 backend | grep -i "docker\|terminal\|ubuntu"

echo ""
echo "===================================================="
echo "✅ Proceso completado"
echo ""
echo "🧪 Para probar la terminal:"
echo "   1. Abre la aplicación en tu navegador"
echo "   2. Ve a la sección de terminal"
echo "   3. Debería conectarse automáticamente"
echo ""
echo "📊 Para ver logs en tiempo real:"
echo "   docker compose -f docker-compose.prod.yml logs -f backend"
echo ""
echo "🔍 Para ver contenedores de usuarios activos:"
echo "   docker ps --filter 'name=penguinpath-user'"
