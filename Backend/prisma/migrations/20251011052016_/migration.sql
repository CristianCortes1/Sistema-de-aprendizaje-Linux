/*
  Warnings:

  - You are about to drop the column `ultima_conexion` on the `Usuarios` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Usuarios` table without a default value. This is not possible if the table is not empty.
  - Made the column `racha` on table `Usuarios` required. This step will fail if there are existing NULL values in that column.
  - Made the column `experiencia` on table `Usuarios` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Usuarios" DROP COLUMN "ultima_conexion",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "avatar" SET DATA TYPE TEXT,
ALTER COLUMN "racha" SET NOT NULL,
ALTER COLUMN "racha" SET DEFAULT 0,
ALTER COLUMN "experiencia" SET NOT NULL,
ALTER COLUMN "experiencia" SET DEFAULT 0;
