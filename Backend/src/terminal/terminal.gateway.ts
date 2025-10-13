import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Client } from 'ssh2';


@WebSocketGateway({ cors: { origin: '*' } })
export class TerminalGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    private sshClient: Client | null = null;
    private sshStream: any;

    async handleConnection(client: Socket) {
        console.log('🖥️ Client connected:', client.id);

        this.sshClient = new Client();
        this.sshClient
            .on('ready', () => {
                console.log('✅ SSH ready');

                if (this.sshClient) {
                    this.sshClient.shell((err, stream) => {
                        if (err) {
                            client.emit('output', 'Error opening shell: ' + err.message);
                            return;
                        }

                        this.sshStream = stream;

                        stream.on('data', (data: Buffer) => {
                            const clean = removeAnsiCodes(data.toString());
                            client.emit('output', clean);
                        });


                        client.emit('output', 'Connected to SSH server.\n');
                    });
                }
            })
            .connect({
                host: 'ubuntu-service', // o 'localhost' si no usas docker-compose
                port: 22,           // o 2222 si lo expones así
                username: 'devuser',
                password: '1234',
            });
    }

    @SubscribeMessage('input')
    handleInput(client: Socket, data: string) {
        if (this.sshStream) {
            this.sshStream.write(data + '\n');
        }
    }

    handleDisconnect(client: Socket) {
        console.log('❌ Client disconnected:', client.id);
        if (this.sshClient) {
            this.sshClient.end();
        }
    }
}

function removeAnsiCodes(input: string): string {
    // Removes ANSI escape codes (colors, formatting, etc.)
    return input.replace(
        // eslint-disable-next-line no-control-regex
        /\x1b\[[0-9;]*[a-zA-Z]/g,
        ''
    );
}

