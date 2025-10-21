# Multi-stage build
FROM node:20-alpine AS builder

# Instalar pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Copiar código fuente
COPY . .

# ARG para la URL del backend (se pasa en build time)
ARG VITE_API_URL=http://localhost:3000

# Build de producción con la variable (sin type-check para evitar errores en Docker)
RUN VITE_API_URL=$VITE_API_URL pnpm run build:prod

# Etapa de producción con Nginx
FROM nginx:alpine

# Copiar archivos compilados
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración de Nginx personalizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto 80
EXPOSE 80

# Comando de inicio
CMD ["nginx", "-g", "daemon off;"]
