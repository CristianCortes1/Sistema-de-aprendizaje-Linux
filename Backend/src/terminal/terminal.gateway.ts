import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DockerService } from './docker.service';

@WebSocketGateway({ 
  cors: { 
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true 
  } 
})
export class TerminalGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(private readonly dockerService: DockerService) {}

  async handleConnection(client: Socket) {
    const userId = client.handshake.auth?.userId;

    // 🔒 Rechazar conexiones no autenticadas
    if (!userId) {
      client.emit(
        'output',
        '\x1b[1;31mError: Authentication required. Please login to access the terminal.\x1b[0m\r\n',
      );
      client.disconnect();
      return;
    }

    try {
      const session = await this.dockerService.createUserContainer(
        client.id,
        userId,
      );
      session.stream.removeAllListeners('data');
      session.stream.removeAllListeners('end');

      session.stream.on('data', (chunk: Buffer) => {
        for (const socketId of session.connectedSockets) {
          this.server.to(socketId).emit('output', chunk.toString('utf-8'));
        }
      });

      session.stream.on('end', () => {
        for (const socketId of session.connectedSockets) {
          this.server.to(socketId).emit('output', '\r\n');
        }
      });
    } catch (error: any) {
      client.emit('output', `\x1b[1;31mConnection error\x1b[0m\r\n`);
      client.disconnect();
    }
  }

  @SubscribeMessage('input')
  async handleInput(client: Socket, data: string) {
    try {
      await this.dockerService.writeToContainer(client.id, data);
    } catch (error) {}
  }

  @SubscribeMessage('resize')
  async handleResize(client: Socket, size: { cols: number; rows: number }) {
    try {
      await this.dockerService.resizeContainer(client.id, size.rows, size.cols);
    } catch (error) {}
  }

  async handleDisconnect(client: Socket) {
    try {
      await this.dockerService.destroySession(client.id);
    } catch (error) {}
  }
}
