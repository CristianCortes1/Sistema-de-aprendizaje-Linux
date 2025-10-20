import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Dockerode from 'dockerode';
import { Readable, Writable } from 'stream';

interface ContainerSession {
    container: Dockerode.Container;
    stream: NodeJS.ReadWriteStream;
    userId: string;
    createdAt: Date;
}

@Injectable()
export class DockerService implements OnModuleDestroy {
    private docker: Dockerode;
    private sessions: Map<string, ContainerSession> = new Map();
    private readonly IMAGE_NAME = 'penguinpath-ubuntu:latest'; // Imagen personalizada con herramientas
    private readonly CONTAINER_PREFIX = 'penguinpath-user-';
    
    constructor() {
        // Conectar a Docker
        const socketPath = process.env.DOCKER_HOST || '/var/run/docker.sock';
        this.docker = new Dockerode({ 
            socketPath: socketPath.replace('unix://', '')
        });
        
        // Asegurar que la imagen existe
        this.ensureImage();
        
        // Limpiar contenedores huérfanos al iniciar
        this.cleanupOrphanedContainers();
        
        // Limpiar sesiones inactivas cada hora
        setInterval(() => {
            this.cleanupInactiveSessions(60).catch(err => 
                console.error('Error in cleanup interval:', err)
            );
        }, 60 * 60 * 1000); // 1 hora
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
        const containerName = `${this.CONTAINER_PREFIX}${socketId}`;
        
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
                    AutoRemove: true, // Auto-eliminar al detenerse
                },
                // Labels para identificar fácilmente
                Labels: {
                    'penguinpath.user': userId || 'anonymous',
                    'penguinpath.socket': socketId,
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

            const session: ContainerSession = {
                container,
                stream,
                userId: userId || 'anonymous',
                createdAt: new Date(),
            };

            this.sessions.set(socketId, session);
            
            console.log(`🐳 Created container ${containerName} for socket ${socketId}`);
            
            return session;
        } catch (error) {
            console.error(`Error creating container for ${socketId}:`, error);
            throw error;
        }
    }

    getSession(socketId: string): ContainerSession | undefined {
        return this.sessions.get(socketId);
    }

    async resizeContainer(socketId: string, rows: number, cols: number): Promise<void> {
        const session = this.sessions.get(socketId);
        if (!session) {
            throw new Error(`No session found for socket ${socketId}`);
        }

        try {
            await session.container.resize({ h: rows, w: cols });
            console.log(`📐 Resized container for ${socketId} to ${cols}x${rows}`);
        } catch (error) {
            console.error(`Error resizing container for ${socketId}:`, error);
        }
    }

    async writeToContainer(socketId: string, data: string): Promise<void> {
        const session = this.sessions.get(socketId);
        if (!session || !session.stream) {
            throw new Error(`No active stream for socket ${socketId}`);
        }

        session.stream.write(data);
    }

    async destroySession(socketId: string): Promise<void> {
        const session = this.sessions.get(socketId);
        if (!session) return;

        try {
            // Detener y eliminar el contenedor
            await session.container.stop({ t: 2 }); // 2 segundos de gracia
            await session.container.remove();
            
            this.sessions.delete(socketId);
            
            console.log(`🗑️ Destroyed container for socket ${socketId}`);
        } catch (error) {
            console.error(`Error destroying container for ${socketId}:`, error);
            // Intentar eliminar de todas formas
            try {
                await session.container.remove({ force: true });
                this.sessions.delete(socketId);
            } catch (e) {
                console.error(`Failed to force remove container:`, e);
            }
        }
    }

    // Limpiar todas las sesiones al cerrar el módulo
    async onModuleDestroy() {
        console.log('🧹 Cleaning up all Docker sessions...');
        const destroyPromises = Array.from(this.sessions.keys()).map(socketId =>
            this.destroySession(socketId).catch(err => 
                console.error(`Error destroying session ${socketId}:`, err)
            )
        );
        await Promise.all(destroyPromises);
    }

    // Método para limpiar sesiones inactivas
    async cleanupInactiveSessions(maxAgeMinutes: number = 60): Promise<void> {
        const now = new Date();
        const sessionsToDestroy: string[] = [];

        for (const [socketId, session] of this.sessions.entries()) {
            const ageMinutes = (now.getTime() - session.createdAt.getTime()) / (1000 * 60);
            if (ageMinutes > maxAgeMinutes) {
                sessionsToDestroy.push(socketId);
            }
        }

        for (const socketId of sessionsToDestroy) {
            await this.destroySession(socketId);
        }

        if (sessionsToDestroy.length > 0) {
            console.log(`🧹 Cleaned up ${sessionsToDestroy.length} inactive sessions`);
        }
    }

    // Método para obtener estadísticas
    async getStats(socketId: string): Promise<any> {
        const session = this.sessions.get(socketId);
        if (!session) return null;

        try {
            const stats = await session.container.stats({ stream: false });
            return stats;
        } catch (error) {
            console.error(`Error getting stats for ${socketId}:`, error);
            return null;
        }
    }

    // Listar todas las sesiones activas
    getActiveSessions(): { socketId: string; userId: string; createdAt: Date }[] {
        return Array.from(this.sessions.entries()).map(([socketId, session]) => ({
            socketId,
            userId: session.userId,
            createdAt: session.createdAt,
        }));
    }
}
