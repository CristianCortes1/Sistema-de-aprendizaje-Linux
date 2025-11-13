import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar helmet para headers de seguridad
  app.use(helmet.default());

  // Habilitar validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades no definidas en el DTO
      forbidNonWhitelisted: true, // Lanza error si hay propiedades no permitidas
      transform: true, // Transforma los payloads a instancias de DTO
      transformOptions: {
        enableImplicitConversion: true, // Convierte tipos automáticamente
      },
    }),
  );

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

  app.enableCors({
    origin: [
      frontendUrl,
      'http://localhost:5173',
      'http://penguinpath.duckdns.org/',
      'http://localhost:8080',
      /^http:\/\/\d+\.\d+\.\d+\.\d+(:\d+)?$/,
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Sistema de Aprendizaje Linux - PenguinPath API')
    .setDescription(
      'API REST para el sistema de aprendizaje interactivo de comandos Linux. ' +
        'Incluye gestión de usuarios, lecciones, retos, comandos, progreso y sistema de gamificación.',
    )
    .setVersion('1.0')
    .addTag('auth', 'Endpoints de autenticación y registro de usuarios')
    .addTag('users', 'Gestión de usuarios y rankings')
    .addTag('lessons', 'Gestión de lecciones de aprendizaje')
    .addTag('challenges', 'Gestión de retos/desafíos')
    .addTag('commands', 'Gestión de comandos Linux')
    .addTag('progress', 'Seguimiento del progreso de usuarios')
    .addTag('items', 'Gestión de items del sistema de gamificación')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingresa el token JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .setContact(
      'Equipo PenguinPath',
      'http://penguinpath.duckdns.org',
      'contact@penguinpath.com',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'PenguinPath API Docs',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: `
      .topbar-wrapper img { content:url('https://nestjs.com/img/logo-small.svg'); width:120px; height:auto; }
      .swagger-ui .topbar { background-color: #1a1a1a; }
    `,
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(
    `🚀 Aplicación corriendo en: http://localhost:${process.env.PORT ?? 3000}`,
  );
  console.log(
    `📚 Documentación Swagger en: http://localhost:${process.env.PORT ?? 3000}/api`,
  );
}
void bootstrap();
