#!/bin/bash

# Script para ejecutar pruebas E2E de la aplicación
# Sistema de Aprendizaje Linux

echo "========================================"
echo "Pruebas E2E - Sistema de Aprendizaje Linux"
echo "========================================"
echo ""

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar que Chromium está instalado
echo "🔍 Verificando requisitos..."
if ! command -v chromium-browser &> /dev/null
then
    echo -e "${RED}❌ Chromium no está instalado${NC}"
    echo "Instalando Chromium..."
    sudo apt-get update && sudo apt-get install -y chromium-browser
fi

echo -e "${GREEN}✅ Chromium instalado${NC}"

# Verificar si el servidor de desarrollo está corriendo
echo ""
echo "🔍 Verificando servidor de desarrollo..."
if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Servidor corriendo en http://localhost:5173${NC}"
    SERVER_RUNNING=true
else
    echo -e "${YELLOW}⚠️  Servidor no detectado en http://localhost:5173${NC}"
    echo "Las pruebas de la aplicación fallarán sin el servidor corriendo."
    echo ""
    echo "Para iniciar el servidor, ejecuta en otra terminal:"
    echo "  cd Frontend && pnpm dev"
    echo ""
    read -p "¿Deseas continuar con solo las pruebas básicas? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
    SERVER_RUNNING=false
fi

echo ""
echo "========================================"
echo "Ejecutando pruebas..."
echo "========================================"
echo ""

# Ejecutar prueba básica
echo "📝 Prueba 1: Configuración básica"
pnpm test:e2e:basic
BASIC_RESULT=$?

if [ $BASIC_RESULT -eq 0 ]; then
    echo -e "${GREEN}✅ Prueba básica pasó${NC}"
else
    echo -e "${RED}❌ Prueba básica falló${NC}"
fi

echo ""

# Solo ejecutar pruebas de la app si el servidor está corriendo
if [ "$SERVER_RUNNING" = true ]; then
    echo "📝 Prueba 2: Autenticación"
    pnpm jest --config jest.config.json tests/e2e/auth.test.ts
    AUTH_RESULT=$?
    
    echo ""
    echo "📝 Prueba 3: Navegación"
    pnpm jest --config jest.config.json tests/e2e/navigation.test.ts
    NAV_RESULT=$?
    
    echo ""
    echo "📝 Prueba 4: Aplicación completa"
    pnpm jest --config jest.config.json tests/e2e/app.test.ts
    APP_RESULT=$?
    
    echo ""
    echo "========================================"
    echo "Resumen de resultados"
    echo "========================================"
    
    if [ $BASIC_RESULT -eq 0 ]; then
        echo -e "${GREEN}✅ Configuración básica${NC}"
    else
        echo -e "${RED}❌ Configuración básica${NC}"
    fi
    
    if [ $AUTH_RESULT -eq 0 ]; then
        echo -e "${GREEN}✅ Autenticación${NC}"
    else
        echo -e "${RED}❌ Autenticación${NC}"
    fi
    
    if [ $NAV_RESULT -eq 0 ]; then
        echo -e "${GREEN}✅ Navegación${NC}"
    else
        echo -e "${RED}❌ Navegación${NC}"
    fi
    
    if [ $APP_RESULT -eq 0 ]; then
        echo -e "${GREEN}✅ Aplicación completa${NC}"
    else
        echo -e "${RED}❌ Aplicación completa${NC}"
    fi
    
    # Exit code basado en todos los resultados
    if [ $BASIC_RESULT -eq 0 ] && [ $AUTH_RESULT -eq 0 ] && [ $NAV_RESULT -eq 0 ] && [ $APP_RESULT -eq 0 ]; then
        echo ""
        echo -e "${GREEN}🎉 Todas las pruebas pasaron!${NC}"
        exit 0
    else
        echo ""
        echo -e "${RED}❌ Algunas pruebas fallaron${NC}"
        exit 1
    fi
else
    echo ""
    echo "========================================"
    echo "Resumen de resultados"
    echo "========================================"
    
    if [ $BASIC_RESULT -eq 0 ]; then
        echo -e "${GREEN}✅ Configuración básica${NC}"
        echo ""
        echo -e "${YELLOW}⚠️  Pruebas de la aplicación omitidas (servidor no corriendo)${NC}"
        exit 0
    else
        echo -e "${RED}❌ Configuración básica${NC}"
        exit 1
    fi
fi
