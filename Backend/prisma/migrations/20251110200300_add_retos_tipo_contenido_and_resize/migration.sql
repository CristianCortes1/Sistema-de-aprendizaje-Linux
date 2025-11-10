-- Prisma Migration: add fields to Retos and resize columns
-- Safe to run multiple times in different environments (idempotent for added columns)

-- Add new columns to Retos
ALTER TABLE "Retos"
    ADD COLUMN IF NOT EXISTS "tipo" VARCHAR(20) NOT NULL DEFAULT 'reto';

ALTER TABLE "Retos"
    ADD COLUMN IF NOT EXISTS "contenido" TEXT;

-- Resize columns to accommodate longer content
ALTER TABLE "Lecciones"
    ALTER COLUMN "Titulo" TYPE VARCHAR(150);

ALTER TABLE "Retos"
    ALTER COLUMN "descripcion" TYPE VARCHAR(500);

ALTER TABLE "Retos"
    ALTER COLUMN "Retroalimentacion" TYPE VARCHAR(200);

ALTER TABLE "Comandos"
    ALTER COLUMN "comando" TYPE VARCHAR(100);
