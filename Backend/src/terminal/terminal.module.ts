import { Module } from '@nestjs/common';
import { TerminalGateway } from './terminal.gateway';
import { DockerService } from './docker.service';

@Module({
    providers: [TerminalGateway, DockerService],
    exports: [DockerService],
})
export class TerminalModule { }
