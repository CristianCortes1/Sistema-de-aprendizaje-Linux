-- AlterTable
ALTER TABLE "Usuarios" ADD COLUMN "resetPasswordToken" VARCHAR(100),
ADD COLUMN "resetPasswordExpires" TIMESTAMP(3);
