# -------------------------------
# 1️⃣ Build stage
# -------------------------------
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# -------------------------------
# 2️⃣ Production stage
# -------------------------------
FROM node:20-slim AS runner

WORKDIR /app

# Copiar solo lo necesario para producción
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Ejecutar prisma generate (si lo usas)
RUN npx prisma generate

EXPOSE 3000
CMD ["node", "dist/main.js"]
