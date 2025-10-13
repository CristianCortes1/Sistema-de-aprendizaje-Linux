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

        // create a fresh SSH client for this websocket client
        const ssh = new Client();
        this.sshClient = ssh;

        // handle errors from the ssh client to avoid unhandled exceptions
        ssh.on('error', (err) => {
            console.error('SSH client error:', err && err.message ? err.message : err);
            client.emit('output', `SSH error: ${err && err.message ? err.message : String(err)}`);
        });

        ssh.on('ready', () => {
                console.log('✅ SSH ready');
                if (ssh) {
                    ssh.shell((err, stream) => {
                        if (err) {
                            client.emit('output', 'Error opening shell: ' + err.message);
                            return;
                        }

                        // bind this stream specifically for this client
                        this.sshStream = stream;

                        stream.on('data', (data: Buffer) => {
                            const clean = removeAnsiCodes(data.toString());
                            client.emit('output', clean);
                        });


                        client.emit('output', 'Connected to SSH server.\n');
                    });
                }
            })
            ;

        // Use environment variables with sensible defaults
        const host = process.env.TARGET_HOST || 'localhost'
        const port = Number(process.env.TARGET_PORT || 22)
        const username = process.env.TARGET_USER || 'devuser'
        const password = process.env.TARGET_PASS || '1234'

        // Attempt to connect with retries and exponential backoff
        const maxAttempts = Number(process.env.SSH_CONNECT_RETRIES || 5)
        const baseDelay = Number(process.env.SSH_CONNECT_BACKOFF_MS || 500)

        const connectWithRetry = async () => {
            for (let attempt = 1; attempt <= maxAttempts; attempt++) {
                try {
                    await new Promise<void>((resolve, reject) => {
                        let settled = false
                        ssh.once('ready', () => {
                            settled = true
                            resolve()
                        })
                        ssh.once('error', (e) => {
                            if (!settled) {
                                settled = true
                                reject(e)
                            }
                        })
                        // initiate connection
                        try {
                            ssh.connect({ host, port, username, password })
                        } catch (err) {
                            if (!settled) reject(err)
                        }
                    })
                    // success
                    return
                } catch (err: any) {
                    const msg = err && err.message ? err.message : String(err)
                    console.warn(`SSH connect attempt ${attempt} failed: ${msg}`)
                    client.emit('output', `SSH connect attempt ${attempt} failed: ${msg}\n`)
                    if (attempt < maxAttempts) {
                        const delay = baseDelay * 2 ** (attempt - 1)
                        await new Promise((r) => setTimeout(r, delay))
                    } else {
                        // final failure
                        console.error('SSH connect failed after attempts:', err)
                        client.emit('output', `SSH connect failed: ${msg}\n`)
                        // end the SSH client to cleanup
                        try { ssh.end() } catch {}
                    }
                }
            }
        }

        // start the connection attempts (do not await to avoid blocking other clients)
        void connectWithRetry()
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

