import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DockerService } from './docker.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class TerminalGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    constructor(private readonly dockerService: DockerService) {}

    async handleConnection(client: Socket) {
        console.log('🖥️ Client connected:', client.id);

        try {
            // Crear un contenedor Docker único para este cliente
            client.emit('output', '\x1b[1;33m🐧 Creating your personal Linux environment...\x1b[0m\r\n');
            
            const session = await this.dockerService.createUserContainer(
                client.id,
                client.handshake.auth?.userId
            );

            // Escuchar la salida del contenedor
            session.stream.on('data', (chunk: Buffer) => {
                client.emit('output', chunk.toString('utf-8'));
            });

            session.stream.on('end', () => {
                console.log('Container stream ended for client:', client.id);
                client.emit('output', '\x1b[1;33m\r\n🐧 Container session ended.\x1b[0m\r\n');
            });

            // Mensaje de bienvenida
            client.emit('output', '\x1b[1;32m✓ Connected to your Linux environment\x1b[0m\r\n');
            client.emit('output', '\x1b[1;36m🐧 Welcome to PenguinPath! Type your commands below.\x1b[0m\r\n\n');
        } catch (error: any) {
            console.error('Error creating container:', error);
            client.emit('output', `\x1b[1;31m✗ Failed to create container: ${error?.message || String(error)}\x1b[0m\r\n`);
        }
    }

    @SubscribeMessage('input')
    async handleInput(client: Socket, data: string) {
        try {
            await this.dockerService.writeToContainer(client.id, data);
        } catch (error) {
            console.warn('Error writing to container:', error);
        }
    }

    @SubscribeMessage('resize')
    async handleResize(client: Socket, size: { cols: number; rows: number }) {
        try {
            await this.dockerService.resizeContainer(client.id, size.rows, size.cols);
        } catch (error) {
            console.error('Error resizing terminal:', error);
        }
    }

    async handleDisconnect(client: Socket) {
        console.log('❌ Client disconnected:', client.id);
        
        try {
            await this.dockerService.destroySession(client.id);
        } catch (error) {
            console.error('Error destroying session:', error);
        }
    }
}