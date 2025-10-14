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

    // Map para mantener SSH clients por cada socket
    private clientConnections = new Map<string, { ssh: Client; stream: any }>();

    async handleConnection(client: Socket) {
        console.log('🖥️ Client connected:', client.id);

        // Crear un cliente SSH único para este cliente WebSocket
        const ssh = new Client();

        // Manejar errores del cliente SSH
        ssh.on('error', (err) => {
            console.error('SSH client error:', err?.message || err);
            client.emit('output', `\x1b[1;31mSSH error: ${err?.message || String(err)}\x1b[0m\r\n`);
        });

        ssh.on('ready', () => {
            console.log('✅ SSH ready for client:', client.id);
            
            // Abrir shell con opciones PTY para aplicaciones interactivas
            ssh.shell({
                term: 'xterm-256color',
                cols: 80,
                rows: 24,
                modes: {
                    // Habilitar modo raw para aplicaciones interactivas
                }
            }, (err, stream) => {
                if (err) {
                    console.error('Error opening shell:', err);
                    client.emit('output', `\x1b[1;31mError opening shell: ${err.message}\x1b[0m\r\n`);
                    return;
                }

                // Guardar la conexión
                this.clientConnections.set(client.id, { ssh, stream });

                // IMPORTANTE: NO eliminar códigos ANSI - enviar data cruda
                stream.on('data', (data: Buffer) => {
                    client.emit('output', data.toString('utf-8'));
                });

                stream.on('close', () => {
                    console.log('SSH stream closed for client:', client.id);
                    client.emit('output', '\x1b[1;33m\r\nSSH connection closed.\x1b[0m\r\n');
                });

                stream.stderr.on('data', (data: Buffer) => {
                    client.emit('output', data.toString('utf-8'));
                });

                // Mensaje de bienvenida
                client.emit('output', '\x1b[1;32m✓ Connected to SSH server\x1b[0m\r\n');
            });
        });

        // Variables de entorno con valores por defecto
        const host = process.env.TARGET_HOST || 'localhost';
        const port = Number(process.env.TARGET_PORT || 22);
        const username = process.env.TARGET_USER || 'devuser';
        const password = process.env.TARGET_PASS || '1234';

        // Reintentos con backoff exponencial
        const maxAttempts = Number(process.env.SSH_CONNECT_RETRIES || 5);
        const baseDelay = Number(process.env.SSH_CONNECT_BACKOFF_MS || 500);

        const connectWithRetry = async () => {
            for (let attempt = 1; attempt <= maxAttempts; attempt++) {
                try {
                    await new Promise<void>((resolve, reject) => {
                        let settled = false;
                        
                        const readyHandler = () => {
                            if (!settled) {
                                settled = true;
                                resolve();
                            }
                        };

                        const errorHandler = (e: Error) => {
                            if (!settled) {
                                settled = true;
                                reject(e);
                            }
                        };

                        ssh.once('ready', readyHandler);
                        ssh.once('error', errorHandler);

                        try {
                            ssh.connect({
                                host,
                                port,
                                username,
                                password,
                                keepaliveInterval: 30000, // Keep alive cada 30s
                                keepaliveCountMax: 3,
                                readyTimeout: 20000, // 20s timeout
                            });
                        } catch (err) {
                            if (!settled) reject(err);
                        }
                    });
                    // Conexión exitosa
                    console.log(`✅ SSH connected on attempt ${attempt}`);
                    return;
                } catch (err: any) {
                    const msg = err?.message || String(err);
                    console.warn(`⚠️ SSH connect attempt ${attempt}/${maxAttempts} failed: ${msg}`);
                    client.emit('output', `\x1b[1;33mAttempt ${attempt}/${maxAttempts}: ${msg}\x1b[0m\r\n`);
                    
                    if (attempt < maxAttempts) {
                        const delay = baseDelay * 2 ** (attempt - 1);
                        await new Promise((r) => setTimeout(r, delay));
                    } else {
                        // Fallo final
                        console.error('❌ SSH connect failed after all attempts');
                        client.emit('output', `\x1b[1;31m✗ Connection failed: ${msg}\x1b[0m\r\n`);
                        try { ssh.end(); } catch {}
                    }
                }
            }
        };

        // Iniciar conexión (sin await para no bloquear)
        void connectWithRetry();
    }

    @SubscribeMessage('input')
    handleInput(client: Socket, data: string) {
        const connection = this.clientConnections.get(client.id);
        
        if (connection?.stream) {
            // CRÍTICO: NO agregar \n automáticamente
            // El cliente envía exactamente lo que necesita (incluyendo \n cuando presiona Enter)
            connection.stream.write(data);
        } else {
            console.warn('No SSH stream available for client:', client.id);
        }
    }

    @SubscribeMessage('resize')
    handleResize(client: Socket, size: { cols: number; rows: number }) {
        const connection = this.clientConnections.get(client.id);
        
        if (connection?.stream) {
            try {
                // Redimensionar el PTY en el servidor SSH
                connection.stream.setWindow(size.rows, size.cols, size.rows, size.cols);
                console.log(`📐 Terminal resized to ${size.cols}x${size.rows} for client:`, client.id);
            } catch (err) {
                console.error('Error resizing terminal:', err);
            }
        }
    }

    handleDisconnect(client: Socket) {
        console.log('❌ Client disconnected:', client.id);
        
        const connection = this.clientConnections.get(client.id);
        
        if (connection) {
            try {
                // Cerrar stream primero
                if (connection.stream) {
                    connection.stream.end();
                }
                // Luego cerrar SSH
                if (connection.ssh) {
                    connection.ssh.end();
                }
            } catch (err) {
                console.error('Error closing SSH connection:', err);
            }
            
            // Limpiar del Map
            this.clientConnections.delete(client.id);
        }
    }
}