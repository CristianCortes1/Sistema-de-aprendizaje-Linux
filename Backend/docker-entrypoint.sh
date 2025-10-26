#!/bin/sh
set -e

echo "🚀 Starting Backend..."

# Esperar a que la base de datos esté lista
echo "⏳ Waiting for database..."
sleep 5

# Ejecutar migraciones de Prisma
echo "📊 Running database migrations..."
npx prisma migrate deploy

# Generar Prisma Client (por si acaso)
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Iniciar la aplicación
echo "✅ Starting NestJS application..."
exec node dist/main.js
