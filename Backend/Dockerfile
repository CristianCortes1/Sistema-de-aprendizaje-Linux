FROM node:20 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

# Ensure OpenSSL and tooling are available during prisma generation
RUN apt-get update && \
	apt-get install -y --no-install-recommends openssl ca-certificates libssl-dev && \
	rm -rf /var/lib/apt/lists/*

COPY . .

# ⚙️ Generar el cliente Prisma
RUN npx prisma generate

# 🏗️ Compilar el proyecto NestJS
RUN npm run build

# -------------------------------
FROM node:20-slim AS runner
WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/generated ./generated

# Ensure runtime has OpenSSL available for Prisma native library
RUN apt-get update && \
	apt-get install -y --no-install-recommends openssl ca-certificates libssl-dev && \
	rm -rf /var/lib/apt/lists/*

EXPOSE 3000
CMD ["node", "dist/main.js"]
