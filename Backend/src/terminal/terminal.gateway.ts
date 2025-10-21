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
        const userId = client.handshake.auth?.userId;
        console.log('🖥️ Client connected:', client.id, 'User:', userId || 'guest');

        try {
            const session = await this.dockerService.createUserContainer(
                client.id,
                userId
            );

            // Verificar si es una reconexión (el contenedor ya existía)
            const isReconnection = session.connectedSockets.size > 1 || 
                                   session.createdAt.getTime() < Date.now() - 5000;

            if (isReconnection) {
                // Reconexión - el contenedor ya existía
                client.emit('output', '\x1b[1;32m♻️  Reconnected to your existing Linux environment\x1b[0m\r\n');
                client.emit('output', '\x1b[1;36m🐧 Your previous session has been restored!\x1b[0m\r\n\n');
            } else {
                // Nueva sesión
                client.emit('output', '\x1b[1;33m🐧 Creating your personal Linux environment...\x1b[0m\r\n');
                client.emit('output', '\x1b[1;32m✓ Connected to your Linux environment\x1b[0m\r\n');
                client.emit('output', '\x1b[1;36m🐧 Welcome to PenguinPath! Type your commands below.\x1b[0m\r\n');
                client.emit('output', '\x1b[2m(Your session will persist for 15 minutes after disconnection)\x1b[0m\r\n\n');
            }

            // Escuchar la salida del contenedor (solo si no está ya conectado)
            // Para evitar múltiples listeners en el mismo stream
            session.stream.removeAllListeners('data');
            session.stream.removeAllListeners('end');
            
            session.stream.on('data', (chunk: Buffer) => {
                // Emitir a todos los sockets conectados de este usuario
                for (const socketId of session.connectedSockets) {
                    this.server.to(socketId).emit('output', chunk.toString('utf-8'));
                }
            });

            session.stream.on('end', () => {
                console.log('Container stream ended for user:', userId || client.id);
                for (const socketId of session.connectedSockets) {
                    this.server.to(socketId).emit('output', '\x1b[1;33m\r\n🐧 Container session ended.\x1b[0m\r\n');
                }
            });

        } catch (error: any) {
            console.error('Error creating/reconnecting container:', error);
            client.emit('output', `\x1b[1;31m✗ Failed to connect: ${error?.message || String(error)}\x1b[0m\r\n`);
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
            // Ignorar errores de resize si la sesión no existe aún (timing issue)
            // Solo loggear otros errores
            if (error instanceof Error && !error.message.includes('No session found')) {
                console.error('Error resizing terminal:', error);
            }
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