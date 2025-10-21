#!/bin/bash

echo "🔍 Diagnóstico de Terminal - PenguinPath"
echo "========================================"
echo ""

# 1. Verificar que Docker está corriendo
echo "1️⃣  Verificando Docker daemon..."
if docker ps > /dev/null 2>&1; then
    echo "✅ Docker daemon está corriendo"
else
    echo "❌ Docker daemon NO está corriendo o no hay permisos"
    echo "   Intenta: sudo systemctl start docker"
    exit 1
fi

echo ""

# 2. Verificar imagen penguinpath-ubuntu
echo "2️⃣  Verificando imagen penguinpath-ubuntu..."
if docker images | grep -q "penguinpath-ubuntu"; then
    echo "✅ Imagen penguinpath-ubuntu existe"
    docker images | grep penguinpath-ubuntu
else
    echo "⚠️  Imagen penguinpath-ubuntu NO existe"
    echo "   Construyendo imagen..."
    cd ~/Sistema-de-aprendizaje-Linux/Backend
    docker build -f Dockerfile.ubuntu-user -t penguinpath-ubuntu:latest .
    if [ $? -eq 0 ]; then
        echo "✅ Imagen construida exitosamente"
    else
        echo "❌ Error construyendo imagen"
        exit 1
    fi
fi

echo ""

# 3. Verificar contenedor backend
echo "3️⃣  Verificando contenedor backend..."
BACKEND_CONTAINER=$(docker ps --filter "name=backend" --format "{{.Names}}" | head -n 1)
if [ -n "$BACKEND_CONTAINER" ]; then
    echo "✅ Contenedor backend encontrado: $BACKEND_CONTAINER"
else
    echo "❌ Contenedor backend NO está corriendo"
    echo "   Inicia los servicios con: docker compose -f docker-compose.prod.yml up -d"
    exit 1
fi

echo ""

# 4. Verificar que el backend puede acceder a Docker socket
echo "4️⃣  Verificando acceso a Docker socket desde backend..."
docker exec $BACKEND_CONTAINER ls -la /var/run/docker.sock 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ Backend tiene acceso a Docker socket"
else
    echo "❌ Backend NO tiene acceso a Docker socket"
    echo "   El volumen /var/run/docker.sock debe estar montado"
    echo "   Verifica docker-compose.prod.yml"
fi

echo ""

# 5. Verificar logs del backend
echo "5️⃣  Últimos logs del backend (buscando errores de terminal)..."
docker logs $BACKEND_CONTAINER --tail 50 2>&1 | grep -i "docker\|terminal\|container\|error" | tail -20

echo ""

# 6. Verificar variables de entorno del backend
echo "6️⃣  Verificando variable DOCKER_HOST..."
docker exec $BACKEND_CONTAINER env | grep DOCKER_HOST
if [ $? -ne 0 ]; then
    echo "⚠️  DOCKER_HOST no está configurada (usando default: /var/run/docker.sock)"
fi

echo ""

# 7. Verificar contenedores de usuarios activos
echo "7️⃣  Contenedores de usuarios activos..."
docker ps --filter "name=penguinpath-user" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
USER_CONTAINERS=$(docker ps --filter "name=penguinpath-user" -q | wc -l)
echo "   Total: $USER_CONTAINERS contenedor(es) activo(s)"

echo ""

# 8. Test rápido: intentar crear un contenedor de prueba
echo "8️⃣  Test: Creando contenedor de prueba..."
TEST_CONTAINER="penguinpath-test-$$"
docker run --rm -d --name $TEST_CONTAINER penguinpath-ubuntu:latest sleep 10 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Contenedor de prueba creado exitosamente"
    docker stop $TEST_CONTAINER > /dev/null 2>&1
else
    echo "❌ Error creando contenedor de prueba"
fi

echo ""
echo "=========================================="
echo "✨ Diagnóstico completado"
echo ""
echo "💡 Soluciones comunes:"
echo "   1. Si falta la imagen: cd Backend && docker build -f Dockerfile.ubuntu-user -t penguinpath-ubuntu:latest ."
echo "   2. Si falta el socket: Verifica volumes en docker-compose.prod.yml"
echo "   3. Si hay errores de permisos: sudo chmod 666 /var/run/docker.sock"
echo "   4. Ver logs completos: docker logs $BACKEND_CONTAINER -f"
