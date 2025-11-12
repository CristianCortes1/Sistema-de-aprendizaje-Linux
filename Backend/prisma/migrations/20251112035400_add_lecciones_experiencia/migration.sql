-- Add experiencia column to Lecciones if it does not exist
ALTER TABLE "Lecciones" ADD COLUMN IF NOT EXISTS "experiencia" INTEGER NOT NULL DEFAULT 100;