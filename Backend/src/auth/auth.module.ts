import { Module } from '@nestjs/common';
<<<<<<< HEAD
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
=======
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma.service';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    JwtModule.register({
      secret: "kahskldjhjkefrjkew78483753478dhyu8fyew895784yf867485y8dyu8f", // 🔐 ponla en .env después
      signOptions: { expiresIn: '1d' },
    }),
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
>>>>>>> Backend
})
export class AuthModule {}
