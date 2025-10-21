import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // CORS configuration - allow frontend URL from environment
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  
  app.enableCors({
    origin: [
      frontendUrl,
      'http://localhost:5173',
      'http://localhost:8080',
      /^http:\/\/\d+\.\d+\.\d+\.\d+(:\d+)?$/,  // Allow any IP address
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  
  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 Backend running on http://localhost:${process.env.PORT ?? 3000}`);
  console.log(`✅ CORS enabled for: ${frontendUrl}`);
}
bootstrap();
