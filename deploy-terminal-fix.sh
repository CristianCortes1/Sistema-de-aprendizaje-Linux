#!/bin/bash

# Script completo para subir cambios y aplicar fix en VPS
echo "🚀 Proceso completo de solución de terminal"
echo "=========================================="
echo ""

# Parte 1: Commit y push local
echo "📦 Parte 1: Subiendo cambios al repositorio..."
git add diagnose-terminal.sh fix-terminal.sh TERMINAL_TROUBLESHOOTING.md
git commit -m "Fix: Add terminal troubleshooting tools and scripts"
git push origin docker

if [ $? -ne 0 ]; then
    echo "❌ Error al hacer push. Revisa tu conexión y credenciales"
    exit 1
fi

echo "✅ Cambios subidos al repositorio"
echo ""

# Parte 2: Conectar al VPS y aplicar fix
echo "📡 Parte 2: Conectando al VPS para aplicar solución..."
echo ""
echo "Ejecutando comandos en VPS..."

ssh -i ~/.ssh/PenguinPath.pem ubuntu@3.14.29.219 << 'ENDSSH'
    cd ~/Sistema-de-aprendizaje-Linux
    
    echo "📥 Descargando últimos cambios..."
    git pull origin docker
    
    echo ""
    echo "🔧 Aplicando solución de terminal..."
    sudo bash fix-terminal.sh
    
    echo ""
    echo "✅ Proceso completado en VPS"
    echo ""
    echo "🧪 Puedes probar la terminal en tu navegador ahora"
ENDSSH

echo ""
echo "=========================================="
echo "✨ Proceso completo finalizado"
echo ""
echo "🌐 Accede a: http://3.14.29.219"
