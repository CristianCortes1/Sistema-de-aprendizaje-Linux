import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Docker = require('dockerode');
import { Readable, Writable } from 'stream';

interface ContainerSession {
    container: Docker.Container;
    stream: NodeJS.ReadWriteStream;
    userId: string;
    createdAt: Date;
    lastActivity: Date;
    connectedSockets: Set<string>; // Múltiples pestañas del mismo usuario
}

@Injectable()
export class DockerService implements OnModuleDestroy {
    private docker: Docker;
    private sessions: Map<string, ContainerSession> = new Map(); // Mapeado por userId
    private socketToUser: Map<string, string> = new Map(); // socketId -> userId
    private readonly IMAGE_NAME = 'penguinpath-ubuntu:latest'; // Imagen personalizada con herramientas
    private readonly CONTAINER_PREFIX = 'penguinpath-user-';
    private readonly INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutos en milisegundos
    
    constructor() {
        // Conectar a Docker
        const socketPath = process.env.DOCKER_HOST || '/var/run/docker.sock';
        this.docker = new Docker({ 
            socketPath: socketPath.replace('unix://', '')
        });
        
        // Asegurar que la imagen existe
        this.ensureImage();
        
        // Limpiar contenedores huérfanos al iniciar
        this.cleanupOrphanedContainers();
        
        // Limpiar sesiones inactivas cada 5 minutos
        setInterval(() => {
            this.cleanupInactiveSessions(15).catch(err => 
                console.error('Error in cleanup interval:', err)
            );
        }, 5 * 60 * 1000); // Cada 5 minutos
    }

    private async ensureImage() {
        try {
            await this.docker.getImage(this.IMAGE_NAME).inspect();
            console.log(`✅ Docker image ${this.IMAGE_NAME} already exists`);
        } catch (error) {
            console.log(`📥 Image ${this.IMAGE_NAME} not found. Falling back to ubuntu:22.04...`);
            console.log(`⚠️  For better experience, build the custom image with: npm run build:ubuntu-image`);
            
            // Intentar con ubuntu:22.04 como fallback
            try {
                await this.docker.getImage('ubuntu:22.04').inspect();
                console.log(`✅ Using ubuntu:22.04 as fallback`);
            } catch {
                console.log(`📥 Pulling ubuntu:22.04...`);
                await new Promise<void>((resolve, reject) => {
                    this.docker.pull('ubuntu:22.04', (err, stream) => {
                        if (err) return reject(err);
                        
                        this.docker.modem.followProgress(stream, (err) => {
                            if (err) return reject(err);
                            console.log(`✅ Image ubuntu:22.04 pulled successfully`);
                            resolve();
                        });
                    });
                });
            }
        }
    }

    private async cleanupOrphanedContainers() {
        try {
            const containers = await this.docker.listContainers({ all: true });
            const orphaned = containers.filter(c => 
                c.Names.some(name => name.includes(this.CONTAINER_PREFIX))
            );

            for (const containerInfo of orphaned) {
                try {
                    const container = this.docker.getContainer(containerInfo.Id);
                    await container.stop();
                    await container.remove();
                    console.log(`🧹 Cleaned up orphaned container: ${containerInfo.Names[0]}`);
                } catch (err) {
                    // Ignorar errores de contenedores ya detenidos
                }
            }
        } catch (error) {
            console.error('Error cleaning up orphaned containers:', error);
        }
    }

    async createUserContainer(socketId: string, userId?: string): Promise<ContainerSession> {
        // Si no hay userId, el frontend debería enviar un guestId persistente
        // Si aún así no hay nada, usar el socketId (fallback)
        // IMPORTANTE: Convertir a string para que Docker labels funcionen correctamente
        const effectiveUserId = userId ? String(userId) : `guest-${socketId}`;
        
        // Verificar si ya existe una sesión para este usuario
        const existingSession = this.sessions.get(effectiveUserId);
        if (existingSession) {
            // Reutilizar el contenedor existente
            console.log(`♻️  Reusing existing container for user ${effectiveUserId}`);
            existingSession.connectedSockets.add(socketId);
            existingSession.lastActivity = new Date();
            this.socketToUser.set(socketId, effectiveUserId);
            return existingSession;
        }
        
        const containerName = `${this.CONTAINER_PREFIX}${effectiveUserId}`;
        
        try {
            // Crear contenedor con bash interactivo
            const container = await this.docker.createContainer({
                Image: this.IMAGE_NAME,
                name: containerName,
                Tty: true,
                OpenStdin: true,
                AttachStdin: true,
                AttachStdout: true,
                AttachStderr: true,
                Cmd: ['/bin/bash'],
                Env: [
                    'TERM=xterm-256color',
                    'PS1=\\[\\033[01;32m\\]penguinpath\\[\\033[00m\\]:\\[\\033[01;34m\\]\\w\\[\\033[00m\\]\\$ ',
                ],
                HostConfig: {
                    // Limitar recursos
                    Memory: 512 * 1024 * 1024, // 512 MB
                    MemorySwap: 512 * 1024 * 1024, // Sin swap adicional
                    CpuQuota: 50000, // 50% de un CPU
                    CpuPeriod: 100000,
                    PidsLimit: 100, // Limitar procesos
                    // Seguridad: sin privilegios
                    Privileged: false,
                    ReadonlyRootfs: false,
                    // Restricciones de red (cambia a 'bridge' si necesitas acceso a internet)
                    NetworkMode: 'none', // Sin acceso a red externa por seguridad
                    AutoRemove: false, // NO auto-eliminar para persistencia
                },
                // Labels para identificar fácilmente (deben ser strings)
                Labels: {
                    'penguinpath.user': String(effectiveUserId),
                    'penguinpath.created': new Date().toISOString(),
                },
            });

            // Iniciar el contenedor
            await container.start();

            // Adjuntar stream (para TTY no necesitamos demux)
            const stream = await container.attach({
                stream: true,
                stdin: true,
                stdout: true,
                stderr: true,
                hijack: true,
            }) as NodeJS.ReadWriteStream;

            const now = new Date();
            const session: ContainerSession = {
                container,
                stream,
                userId: effectiveUserId,
                createdAt: now,
                lastActivity: now,
                connectedSockets: new Set([socketId]),
            };

            this.sessions.set(effectiveUserId, session);
            this.socketToUser.set(socketId, effectiveUserId);
            
            console.log(`🐳 Created new container ${containerName} for user ${effectiveUserId}`);
            
            return session;
        } catch (error) {
            console.error(`Error creating container for user ${effectiveUserId}:`, error);
            throw error;
        }
    }

    getSession(socketId: string): ContainerSession | undefined {
        const userId = this.socketToUser.get(socketId);
        if (!userId) return undefined;
        
        const session = this.sessions.get(userId);
        if (session) {
            session.lastActivity = new Date(); // Actualizar actividad
        }
        return session;
    }

    async resizeContainer(socketId: string, rows: number, cols: number): Promise<void> {
        const userId = this.socketToUser.get(socketId);
        if (!userId) {
            throw new Error(`No user mapping found for socket ${socketId}`);
        }
        
        const session = this.sessions.get(userId);
        if (!session) {
            throw new Error(`No session found for user ${userId}`);
        }

        try {
            await session.container.resize({ h: rows, w: cols });
            session.lastActivity = new Date();
            console.log(`📐 Resized container for user ${userId} to ${cols}x${rows}`);
        } catch (error) {
            console.error(`Error resizing container for user ${userId}:`, error);
        }
    }

    async writeToContainer(socketId: string, data: string): Promise<void> {
        const userId = this.socketToUser.get(socketId);
        if (!userId) {
            throw new Error(`No user mapping found for socket ${socketId}`);
        }
        
        const session = this.sessions.get(userId);
        if (!session || !session.stream) {
            throw new Error(`No active stream for user ${userId}`);
        }

        session.stream.write(data);
        session.lastActivity = new Date(); // Actualizar actividad con cada escritura
    }

    async destroySession(socketId: string): Promise<void> {
        const userId = this.socketToUser.get(socketId);
        if (!userId) {
            console.log(`⚠️  No user mapping found for socket ${socketId}`);
            return;
        }
        
        const session = this.sessions.get(userId);
        if (!session) {
            this.socketToUser.delete(socketId);
            return;
        }

        // Remover el socket de la lista de sockets conectados
        session.connectedSockets.delete(socketId);
        this.socketToUser.delete(socketId);
        
        console.log(`🔌 Socket ${socketId} disconnected from user ${userId}. Remaining connections: ${session.connectedSockets.size}`);

        // Si todavía hay sockets conectados, no destruir el contenedor
        if (session.connectedSockets.size > 0) {
            console.log(`⏳ Container for user ${userId} kept alive (${session.connectedSockets.size} connections remaining)`);
            return;
        }

        // Si no hay más sockets, marcar última actividad pero NO destruir aún
        session.lastActivity = new Date();
        console.log(`⏰ Container for user ${userId} marked for cleanup after 15 minutes of inactivity`);
    }

    // Nueva función para destruir un contenedor por userId
    private async destroyUserContainer(userId: string): Promise<void> {
        const session = this.sessions.get(userId);
        if (!session) return;

        try {
            // Cerrar todos los sockets asociados
            for (const socketId of session.connectedSockets) {
                this.socketToUser.delete(socketId);
            }
            
            // Detener y eliminar el contenedor
            await session.container.stop({ t: 2 }); // 2 segundos de gracia
            await session.container.remove();
            
            this.sessions.delete(userId);
            
            console.log(`🗑️  Destroyed container for user ${userId} after inactivity`);
        } catch (error) {
            console.error(`Error destroying container for user ${userId}:`, error);
            // Intentar eliminar de todas formas
            try {
                await session.container.remove({ force: true });
                this.sessions.delete(userId);
            } catch (e) {
                console.error(`Failed to force remove container:`, e);
            }
        }
    }

    // Limpiar todas las sesiones al cerrar el módulo
    async onModuleDestroy() {
        console.log('🧹 Cleaning up all Docker sessions...');
        const destroyPromises = Array.from(this.sessions.keys()).map(userId =>
            this.destroyUserContainer(userId).catch(err => 
                console.error(`Error destroying session for user ${userId}:`, err)
            )
        );
        await Promise.all(destroyPromises);
    }

    // Método para limpiar sesiones inactivas (modificado para 15 minutos)
    async cleanupInactiveSessions(maxAgeMinutes: number = 15): Promise<void> {
        const now = new Date();
        const sessionsToDestroy: string[] = [];

        for (const [userId, session] of this.sessions.entries()) {
            // Solo limpiar si no hay sockets conectados Y ha pasado el tiempo de inactividad
            if (session.connectedSockets.size === 0) {
                const inactiveMinutes = (now.getTime() - session.lastActivity.getTime()) / (1000 * 60);
                if (inactiveMinutes >= maxAgeMinutes) {
                    sessionsToDestroy.push(userId);
                }
            }
        }

        for (const userId of sessionsToDestroy) {
            await this.destroyUserContainer(userId);
        }

        if (sessionsToDestroy.length > 0) {
            console.log(`🧹 Cleaned up ${sessionsToDestroy.length} inactive session(s) older than ${maxAgeMinutes} minutes`);
        }
    }

    // Método para obtener estadísticas
    async getStats(socketId: string): Promise<any> {
        const userId = this.socketToUser.get(socketId);
        if (!userId) return null;
        
        const session = this.sessions.get(userId);
        if (!session) return null;

        try {
            const stats = await session.container.stats({ stream: false });
            return stats;
        } catch (error) {
            console.error(`Error getting stats for user ${userId}:`, error);
            return null;
        }
    }

    // Listar todas las sesiones activas
    getActiveSessions(): { 
        userId: string; 
        createdAt: Date; 
        lastActivity: Date;
        connectedSockets: number;
        inactiveMinutes: number;
    }[] {
        const now = new Date();
        return Array.from(this.sessions.entries()).map(([userId, session]) => ({
            userId,
            createdAt: session.createdAt,
            lastActivity: session.lastActivity,
            connectedSockets: session.connectedSockets.size,
            inactiveMinutes: (now.getTime() - session.lastActivity.getTime()) / (1000 * 60),
        }));
    }
}
