import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // <- opcional pero recomendable si usarás Prisma en muchos módulos
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
