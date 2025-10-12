import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
<<<<<<< HEAD

@Module({
=======
import { PrismaModule } from 'src/prisma.module';

@Module({
  imports: [PrismaModule],
>>>>>>> Backend
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
