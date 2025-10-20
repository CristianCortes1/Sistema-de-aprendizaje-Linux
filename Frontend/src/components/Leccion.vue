<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { io } from 'socket.io-client'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { WebLinksAddon } from 'xterm-addon-web-links'
import 'xterm/css/xterm.css'
import Header from './Header.vue'
import Footer from './Footer.vue'

// Función inline para obtener o crear guestId
function getOrCreateGuestId(): string {
    let guestId = localStorage.getItem('guestId')
    
    if (!guestId) {
        // Generar nuevo ID único para invitado
        guestId = `guest-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
        localStorage.setItem('guestId', guestId)
        console.log('✨ Created new guest ID:', guestId)
    } else {
        console.log('♻️ Using existing guest ID:', guestId)
    }
    
    return guestId
}

// Función inline para obtener userId (de token o guestId)
function getUserIdForTerminal(): string {
    const token = localStorage.getItem('token')
    
    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]))
            if (payload && payload.sub) {
                // Convertir a string por si el ID viene como número
                const userId = String(payload.sub)
                console.log('👤 Using logged-in user ID:', userId)
                return userId
            }
        } catch (error) {
            console.warn('⚠️ Error parsing token:', error)
        }
    }
    
    // Si no hay token o falló el parsing, usar guestId
    const guestId = getOrCreateGuestId()
    return guestId
}

export default defineComponent({
    name: 'Leccion',
    components: { Header, Footer },
    setup() {
        const router = useRouter()
        const route = useRoute()

        // Obtener userId del token (puede ser null si no está logueado)
        // Si no hay usuario logueado, se genera un guestId persistente
        const userId = getUserIdForTerminal()
        console.log('🔌 User ID for terminal connection:', userId)

        // Terminal - conectar con autenticación
        const socket = io('http://localhost:3000', {
            auth: {
                userId: userId
            }
        })
        const terminalContainer = ref<HTMLElement | null>(null)
        let terminal: Terminal | null = null
        let fitAddon: FitAddon | null = null
        
        // Estado de la terminal
        const isConnected = ref(false)
        const terminalTitle = ref('Conectando...')

        // UI state (lesson, hints, progress)
        const showHint = ref(false)
        const progress = ref(30)
        const lesson = ref({
            title: 'Leccion 1: comandos basicos',
            challenge: {
                title: 'Challenge 1: Change Directory',
                description: 'Use the cd command to navigate to the "documents" directory. Type your command in the terminal and press "Run" to check your answer.',
                hint: 'The command is cd documents',
                correctCommand: 'cd documents',
                directory: '~'
            }
        })

        onMounted(async () => {
            await nextTick()
            
            if (!terminalContainer.value) return

            // Crear instancia de xterm
            terminal = new Terminal({
                cursorBlink: true,
                cursorStyle: 'block',
                fontFamily: '"Ubuntu Mono", "Courier New", monospace',
                fontSize: 15,
                lineHeight: 1.4,
                theme: {
                    background: '#300a24',
                    foreground: '#d3d7cf',
                    cursor: '#d3d7cf',
                    cursorAccent: '#300a24',
                    black: '#2e3436',
                    red: '#cc0000',
                    green: '#4e9a06',
                    yellow: '#c4a000',
                    blue: '#3465a4',
                    magenta: '#75507b',
                    cyan: '#06989a',
                    white: '#d3d7cf',
                    brightBlack: '#555753',
                    brightRed: '#ef2929',
                    brightGreen: '#8ae234',
                    brightYellow: '#fce94f',
                    brightBlue: '#729fcf',
                    brightMagenta: '#ad7fa8',
                    brightCyan: '#34e2e2',
                    brightWhite: '#eeeeec'
                },
                allowProposedApi: true,
            })

            // Addons
            fitAddon = new FitAddon()
            terminal.loadAddon(fitAddon)
            terminal.loadAddon(new WebLinksAddon())

            // Montar terminal en el DOM
            terminal.open(terminalContainer.value)
            fitAddon.fit()

            // Manejar input del usuario
            terminal.onData((data) => {
                socket.emit('input', data)
            })

            // Conexión establecida
            socket.on('connect', () => {
                isConnected.value = true
                terminalTitle.value = 'Terminal SSH'
                terminal?.writeln('\x1b[1;32m✓ Conectado al servidor SSH\x1b[0m')
            })

            // Desconexión
            socket.on('disconnect', () => {
                isConnected.value = false
                terminalTitle.value = 'Desconectado'
                terminal?.writeln('\x1b[1;31m✗ Desconectado del servidor\x1b[0m')
            })

            // Recibir output del servidor
            socket.on('output', (data: string) => {
                terminal?.write(data)
            })

            // Redimensionar terminal cuando cambia el tamaño de la ventana
            const handleResize = () => {
                if (fitAddon && terminal) {
                    fitAddon.fit()
                    // Enviar nuevo tamaño al servidor
                    socket.emit('resize', {
                        cols: terminal.cols,
                        rows: terminal.rows
                    })
                }
            }

            window.addEventListener('resize', handleResize)

            // Enviar tamaño inicial al servidor
            if (terminal) {
                socket.emit('resize', {
                    cols: terminal.cols,
                    rows: terminal.rows
                })
            }

            // Cleanup
            onUnmounted(() => {
                window.removeEventListener('resize', handleResize)
                terminal?.dispose()
                socket.disconnect()
            })
        })

        const toggleHint = () => {
            showHint.value = !showHint.value
        }

        const clearTerminal = () => {
            terminal?.clear()
        }

        // Navegación
        const goBack = () => router.push('/dashboard')
        const goInicio = () => router.push('/dashboard')
        const goBiblioteca = () => router.push('/biblioteca')
        const goRanking = () => router.push('/ranking')
        const goConfig = () => router.push('/configuracion')

        return {
            terminalContainer,
            showHint,
            toggleHint,
            progress,
            lesson,
            goBack,
            goInicio,
            goBiblioteca,
            goRanking,
            goConfig,
            isConnected,
            terminalTitle,
            clearTerminal,
        }
    },
})
</script>


<template>
    <div class="leccion">
        <Header />

        <div class="content">
            <!-- Título de la lección -->
            <div class="lesson-header">
                <h1 class="lesson-title">{{ lesson.title }}</h1>
            </div>

            <div class="lesson-content">
                <!-- Terminal -->
                <div class="terminal-section">
                    <div class="terminal-wrapper">
                        <div class="terminal-header">
                            <div class="terminal-controls">
                                <span class="control red"></span>
                                <span class="control yellow"></span>
                                <span class="control green"></span>
                            </div>
                            <div class="terminal-title">{{ terminalTitle }}</div>
                            <div class="connection-status">
                                <span class="status-indicator" :class="{ connected: isConnected }"></span>
                            </div>
                        </div>
                        <div ref="terminalContainer" class="terminal-container"></div>
                    </div>
                    <div class="terminal-help">
                        <span class="help-item">Terminal real con soporte completo para nano, vim, htop y más</span>
                    </div>
                </div>

                <!-- Challenge Panel -->
                <div class="challenge-section">
                    <div class="challenge-panel">
                        <h2 class="challenge-title">{{ lesson.challenge.title }}</h2>
                        <p class="challenge-description">{{ lesson.challenge.description }}</p>

                        <div class="hint-section">
                            <button class="hint-btn" @click="toggleHint">
                                {{ showHint ? 'Ocultar pista' : 'Mostrar pista' }} 💡
                            </button>
                            <div v-if="showHint" class="hint">
                                Pista: El comando es <code>{{ lesson.challenge.hint }}</code>
                            </div>
                        </div>
                    </div>

                    <!-- Progress -->
                    <div class="progress-section">
                        <div class="progress-label">Progress</div>
                        <div class="progress-bar">
                            <div class="progress-fill" :style="`width: ${progress}%`"></div>
                        </div>
                        <div class="progress-text">{{ progress }}%</div>
                    </div>
                </div>
            </div>
        </div>

        <Footer :goInicio="goInicio" :goBiblioteca="goBiblioteca" :goRanking="goRanking" :goConfig="goConfig" />
    </div>
</template>

<style scoped>
.leccion {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #ef9c6c 0%, #c57da1 50%, #956eaa 100%);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    overflow-y: auto;
}

.content {
    padding: 20px;
    padding-top: 20px;
    padding-bottom: 120px;
    max-width: 1400px;
    margin: 0 auto;
}

.lesson-header {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 30px;
}

.lesson-title {
    color: white;
    font-size: 28px;
    font-weight: 300;
    margin: 0;
}

.lesson-content {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 30px;
    align-items: start;
}

.terminal-section {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.terminal-wrapper {
    background: #300a24;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.terminal-header {
    background: #2c001e;
    padding: 8px 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(0, 0, 0, 0.3);
}

.terminal-controls {
    display: flex;
    gap: 8px;
}

.control {
    width: 12px;
    height: 12px;
    border-radius: 50%;
}

.control.red {
    background: #ff5f57;
}

.control.yellow {
    background: #ffbd2e;
}

.control.green {
    background: #28ca42;
}

.terminal-title {
    color: #d3d7cf;
    font-family: 'Ubuntu Mono', 'Courier New', monospace;
    font-size: 13px;
    font-weight: normal;
    flex: 1;
    text-align: center;
}

.connection-status {
    display: flex;
    align-items: center;
}

.status-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #ff5f57;
    transition: background 0.3s ease;
}

.status-indicator.connected {
    background: #28ca42;
    box-shadow: 0 0 8px rgba(40, 202, 66, 0.6);
}

.terminal-container {
    padding: 10px;
    min-height: 500px;
    max-height: 600px;
    overflow: hidden;
}

/* Estilos para xterm.js */
.terminal-container :deep(.xterm) {
    height: 100%;
}

.terminal-container :deep(.xterm-viewport) {
    overflow-y: auto;
}

.terminal-help {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
    padding: 8px 12px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 6px;
    font-size: 12px;
}

.help-item {
    color: rgba(255, 255, 255, 0.7);
    display: flex;
    align-items: center;
    gap: 5px;
}

.challenge-section {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.challenge-panel {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 16px;
    padding: 25px;
}

.challenge-title {
    color: white;
    font-size: 20px;
    font-weight: 600;
    margin: 0 0 15px 0;
}

.challenge-description {
    color: rgba(255, 255, 255, 0.9);
    line-height: 1.6;
    margin-bottom: 20px;
    font-size: 14px;
}

.hint-section {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.hint-btn {
    background: rgba(255, 193, 7, 0.2);
    border: 1px solid rgba(255, 193, 7, 0.4);
    color: #ffc107;
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s ease;
    align-self: flex-start;
}

.hint-btn:hover {
    background: rgba(255, 193, 7, 0.3);
}

.hint {
    background: rgba(76, 175, 80, 0.2);
    border-left: 4px solid #4caf50;
    padding: 12px;
    border-radius: 6px;
    color: white;
    font-size: 14px;
}

.hint code {
    background: rgba(0, 0, 0, 0.3);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    color: #00ff88;
}

.progress-section {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 16px;
    padding: 20px;
}

.progress-label {
    color: white;
    font-weight: 600;
    margin-bottom: 10px;
}

.progress-bar {
    background: rgba(0, 0, 0, 0.3);
    height: 8px;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 8px;
}

.progress-fill {
    background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
    height: 100%;
    transition: width 0.5s ease;
    border-radius: 4px;
}

.progress-text {
    color: rgba(255, 255, 255, 0.8);
    font-size: 14px;
    text-align: right;
}

@media (max-width: 768px) {
    .lesson-content {
        grid-template-columns: 1fr;
        gap: 20px;
    }

    .lesson-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
    }

    .lesson-title {
        font-size: 24px;
    }

    .terminal-container {
        min-height: 400px;
    }
}
</style>