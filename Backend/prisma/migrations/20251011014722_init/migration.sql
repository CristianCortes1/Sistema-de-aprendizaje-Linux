-- CreateTable
CREATE TABLE "Usuarios" (
    "id_Usuario" SERIAL NOT NULL,
    "username" VARCHAR(25) NOT NULL,
    "correo" VARCHAR(60) NOT NULL,
    "contraseña" VARCHAR(45) NOT NULL,
    "avatar" INTEGER,
    "racha" INTEGER,
    "experiencia" INTEGER,
    "ultima_conexion" TIMESTAMP(3),

    CONSTRAINT "Usuarios_pkey" PRIMARY KEY ("id_Usuario")
);

-- CreateTable
CREATE TABLE "Progresos" (
    "id" SERIAL NOT NULL,
    "progreso" INTEGER NOT NULL,
    "Usuarios_id_Usuario" INTEGER NOT NULL,
    "Lecciones_id_Leccion" INTEGER NOT NULL,

    CONSTRAINT "Progresos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lecciones" (
    "id_Leccion" SERIAL NOT NULL,
    "Titulo" VARCHAR(45) NOT NULL,

    CONSTRAINT "Lecciones_pkey" PRIMARY KEY ("id_Leccion")
);

-- CreateTable
CREATE TABLE "Retos" (
    "id_Reto" SERIAL NOT NULL,
    "descripcion" VARCHAR(300) NOT NULL,
    "Retroalimentacion" VARCHAR(100),
    "Lecciones_id_Leccion" INTEGER NOT NULL,

    CONSTRAINT "Retos_pkey" PRIMARY KEY ("id_Reto")
);

-- CreateTable
CREATE TABLE "Comandos" (
    "id_Comando" SERIAL NOT NULL,
    "comando" VARCHAR(45) NOT NULL,
    "Retos_id_Reto" INTEGER NOT NULL,

    CONSTRAINT "Comandos_pkey" PRIMARY KEY ("id_Comando")
);

-- AddForeignKey
ALTER TABLE "Progresos" ADD CONSTRAINT "Progresos_Usuarios_id_Usuario_fkey" FOREIGN KEY ("Usuarios_id_Usuario") REFERENCES "Usuarios"("id_Usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progresos" ADD CONSTRAINT "Progresos_Lecciones_id_Leccion_fkey" FOREIGN KEY ("Lecciones_id_Leccion") REFERENCES "Lecciones"("id_Leccion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Retos" ADD CONSTRAINT "Retos_Lecciones_id_Leccion_fkey" FOREIGN KEY ("Lecciones_id_Leccion") REFERENCES "Lecciones"("id_Leccion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comandos" ADD CONSTRAINT "Comandos_Retos_id_Reto_fkey" FOREIGN KEY ("Retos_id_Reto") REFERENCES "Retos"("id_Reto") ON DELETE RESTRICT ON UPDATE CASCADE;
