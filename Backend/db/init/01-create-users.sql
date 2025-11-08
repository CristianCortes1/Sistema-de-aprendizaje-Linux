-- Esperar a que las migraciones de Prisma se completen
DO $$
BEGIN
    -- Intentar insertar usuarios solo si la tabla existe
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'Usuarios') THEN
        -- Insertar usuario administrador si no existe
        INSERT INTO "Usuarios" (
            username,
            correo,
            contraseña,
            rol,
            activo,
            avatar,
            racha,
            experiencia,
            "createdAt",
            "updatedAt"
        )
        SELECT
            'admin',
            'admin@example.com',
            -- Contraseña: Admin123! (hasheada)
            '$2b$10$XOPbrlUPQdwdJUpSrIF6X.HbxYxEWZJKYb53s8RQCyYNGBpqgzXIS',
            'administrador',
            true,
            '/Assets/Avatar1.svg',
            0,
            100,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        WHERE NOT EXISTS (
            SELECT 1 FROM "Usuarios" WHERE correo = 'admin@example.com'
        );

        -- Insertar usuario normal si no existe
        INSERT INTO "Usuarios" (
            username,
            correo,
            contraseña,
            rol,
            activo,
            avatar,
            racha,
            experiencia,
            "createdAt",
            "updatedAt"
        )
        SELECT
            'usuario',
            'usuario@example.com',
            -- Contraseña: Usuario123! (hasheada)
            '$2b$10$Vihm8uDIW/lzxsZSyABnWejvPiXbfz4zXrnTrfyX4PxAWVGYxF.4W',
            'usuario',
            true,
            '/Assets/Avatar2.svg',
            0,
            50,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        WHERE NOT EXISTS (
            SELECT 1 FROM "Usuarios" WHERE correo = 'usuario@example.com'
        );
    END IF;
END $$;