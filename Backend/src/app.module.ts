import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma.service';
import { UsersModule } from './users/users.module';
import { LessonsModule } from './lessons/lessons.module';
import { ChallengesModule } from './challenges/challenges.module';
import { CommandsModule } from './commands/commands.module';
import { ProgressModule } from './progress/progress.module';
import { TerminalGateway } from './terminal/terminal.gateway';

@Module({
    imports: [AuthModule, UsersModule, LessonsModule, ChallengesModule, CommandsModule, ProgressModule, TerminalGateway],
    controllers: [],
    providers: [PrismaService],

})
export class AppModule { }
