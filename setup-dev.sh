#!/bin/bash

# Script de desarrollo para PenguinPath
# Usa este script para desarrollo local sin Docker

echo "🐧 PenguinPath - Development Setup"
echo "=================================="
echo ""

# Verificar Docker
echo "🔍 Checking Docker..."
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running!"
    echo "   Docker is needed for terminal functionality."
    echo "   Please start Docker and try again."
    exit 1
fi
echo "✅ Docker is running"

# Backend
echo ""
echo "🔧 Setting up Backend..."
cd Backend

if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please edit Backend/.env and set JWT_SECRET!"
fi

if [ ! -d "node_modules" ]; then
    echo "📦 Installing Backend dependencies..."
    pnpm install
fi

echo "🔧 Generating Prisma Client..."
npx prisma generate

echo "📊 Running database migrations..."
npx prisma migrate dev

cd ..

# Frontend
echo ""
echo "🎨 Setting up Frontend..."
cd Frontend

if [ ! -d "node_modules" ]; then
    echo "📦 Installing Frontend dependencies..."
    pnpm install
fi

cd ..

# Ubuntu image
echo ""
echo "🏗️  Building custom Ubuntu image..."
docker build -f Backend/Dockerfile.ubuntu-user -t penguinpath-ubuntu:latest Backend/

if [ $? -eq 0 ]; then
    echo "✅ Ubuntu image built successfully"
else
    echo "⚠️  Failed to build Ubuntu image, will use ubuntu:22.04 as fallback"
fi

# Instructions
echo ""
echo "✅ Development environment ready!"
echo ""
echo "📋 To start development:"
echo ""
echo "   Terminal 1 (Backend):"
echo "   cd Backend && pnpm run start:dev"
echo ""
echo "   Terminal 2 (Frontend):"
echo "   cd Frontend && pnpm run dev"
echo ""
echo "   Then open: http://localhost:5173"
echo ""
echo "💡 Or use Docker Compose:"
echo "   docker-compose up -d --build"
echo ""
