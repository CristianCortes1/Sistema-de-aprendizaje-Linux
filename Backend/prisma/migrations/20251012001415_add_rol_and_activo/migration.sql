-- AlterTable
ALTER TABLE "Usuarios" ADD COLUMN     "activo" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "rol" TEXT NOT NULL DEFAULT 'usuario';
