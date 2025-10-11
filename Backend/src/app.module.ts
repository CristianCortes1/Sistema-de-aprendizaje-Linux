import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma.service';
import { UsersModule } from './users/users.module';

@Module({
    imports: [AuthModule, UsersModule],
    controllers: [],
    providers: [PrismaService],

})
export class AppModule { }
