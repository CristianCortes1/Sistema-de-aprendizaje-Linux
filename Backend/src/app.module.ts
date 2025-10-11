import { Module } from '@nestjs/common';
<<<<<<< HEAD
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ItemsModule } from './items/items.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UsersModule, AuthModule, ItemsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
=======
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma.service';

@Module({
    imports: [AuthModule],
    controllers: [],
    providers: [PrismaService],

})
export class AppModule { }
>>>>>>> Backend
