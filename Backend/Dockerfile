# Multi-stage build para optimizar el tamaño final
FROM node:20-alpine AS builder

# Instalar OpenSSL y dependencias necesarias para Prisma
RUN apk add --no-cache openssl openssl-dev libc6-compat

# Instalar pnpm
RUN npm install -g pnpm

# Directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Copiar el código fuente
COPY . .

# Generar Prisma Client
RUN npx prisma generate

# Compilar la aplicación
RUN pnpm run build

# Etapa de producción
FROM node:20-alpine

# Instalar OpenSSL, Docker CLI y dependencias necesarias
RUN apk add --no-cache \
    openssl \
    openssl-dev \
    libc6-compat \
    docker-cli

# Instalar pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copiar package.json y pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Instalar solo dependencias de producción
RUN pnpm install --prod --frozen-lockfile

# Copiar archivos compilados desde builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Crear script de inicio que ejecute migraciones
COPY docker-entrypoint.sh /app/
RUN chmod +x /app/docker-entrypoint.sh

# Crear directorio para Prisma Client y dar permisos al usuario node
RUN mkdir -p /app/generated && chown -R node:node /app

# Exponer puerto
EXPOSE 3000

# Usuario no-root para seguridad
USER node

# Comando de inicio
ENTRYPOINT ["/app/docker-entrypoint.sh"]
