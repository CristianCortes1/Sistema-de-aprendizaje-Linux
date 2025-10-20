# Multi-stage build para optimizar el tamaño final
FROM node:20-alpine AS builder

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

# Instalar Docker CLI para poder crear contenedores
RUN apk add --no-cache docker-cli

# Instalar pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copiar package.json y pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Instalar solo dependencias de producción
RUN pnpm install --prod --frozen-lockfile

# Copiar archivos compilados desde builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

# Crear script de inicio que ejecute migraciones
COPY docker-entrypoint.sh /app/
RUN chmod +x /app/docker-entrypoint.sh

# Exponer puerto
EXPOSE 3000

# Usuario no-root para seguridad
USER node

# Comando de inicio
ENTRYPOINT ["/app/docker-entrypoint.sh"]
