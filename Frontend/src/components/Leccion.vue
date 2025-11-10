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

// Función para obtener userId del token JWT
function getUserIdForTerminal(): string | null {
    const token = localStorage.getItem('token')
    
    if (!token) {
        // ❌ Sin token = sin acceso al terminal
        return null
    }
    
    try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        if (payload && payload.sub) {
            // Convertir a string por si el ID viene como número
            return String(payload.sub)
        }
    } catch (error) {
        console.error('Error decoding token:', error)
    }
    
    return null
}

export default defineComponent({
    name: 'Leccion',
    components: { Header, Footer },
    setup() {
        const router = useRouter()
        const route = useRoute()

        // Obtener userId del token (REQUERIDO para terminal)
        const userId = getUserIdForTerminal()

        // Estado de la terminal
        const isConnected = ref(false)
        const terminalTitle = ref('Conectando...')
        const terminalContainer = ref<HTMLElement | null>(null)

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

        // ❌ Redirigir a login si no está autenticado
        if (!userId) {
            console.warn('No authenticated user - redirecting to login')
            router.push('/login')
            
            // Retornar objeto mínimo para evitar errores
            return {
                terminalContainer,
                showHint,
                toggleHint: () => {},
                progress,
                lesson,
                goBack: () => {},
                goInicio: () => {},
                goBiblioteca: () => {},
                goRanking: () => {},
                goConfig: () => {},
                isConnected,
                terminalTitle,
                clearTerminal: () => {},
            }
        }

        // API URL usando la configuración centralizada
        const WS_URL = import.meta.env.MODE === 'production' ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:3000')

        // Terminal - conectar con autenticación
        const socket = io(WS_URL, {
            auth: {
                userId: userId
            }
        })
        
        let terminal: Terminal | null = null
        let fitAddon: FitAddon | null = null

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
                scrollback: 1000,
                convertEol: true,
            })

            // Addons
            fitAddon = new FitAddon()
            terminal.loadAddon(fitAddon)
            terminal.loadAddon(new WebLinksAddon())

            // Montar terminal en el DOM
            terminal.open(terminalContainer.value)
            
            // Ajustar tamaño según pantalla
            if (window.innerWidth <= 768) {
                // Móvil: reducir fuente para más columnas
                terminal.options.fontSize = 9
            }
            
            fitAddon.fit()

            // Manejar input del usuario
            terminal.onData((data) => {
                socket.emit('input', data)
            })

            // Conexión establecida
            socket.on('connect', () => {
                isConnected.value = true
                terminalTitle.value = 'Terminal SSH'
            })

            // Desconexión
            socket.on('disconnect', () => {
                isConnected.value = false
                terminalTitle.value = 'Desconectado'
            })

            // Recibir output del servidor
            socket.on('output', (data: string) => {
                terminal?.write(data)
            })

            // Redimensionar terminal cuando cambia el tamaño de la ventana
            const handleResize = () => {
                if (fitAddon && terminal) {
                    // Pequeño delay para que el DOM se actualice primero
                    setTimeout(() => {
                        fitAddon?.fit()
                        // Enviar nuevo tamaño al servidor
                        if (terminal) {
                            socket.emit('resize', {
                                cols: terminal.cols,
                                rows: terminal.rows
                            })
                        }
                    }, 100)
                }
            }

            window.addEventListener('resize', handleResize)

            // Enviar tamaño inicial al servidor (con delay para asegurar renderizado)
            setTimeout(() => {
                if (fitAddon && terminal) {
                    fitAddon.fit()
                    socket.emit('resize', {
                        cols: terminal.cols,
                        rows: terminal.rows
                    })
                }
            }, 200)

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

        const sendTab = () => {
            socket.emit('input', '\t')
        }

        const sendCtrlC = () => {
            socket.emit('input', '\x03') // Ctrl+C - interrumpir proceso
        }

        const sendCtrlX = () => {
            socket.emit('input', '\x18') // Ctrl+X - salir de nano
        }

        const sendCtrlS = () => {
            socket.emit('input', '\x13') // Ctrl+S - guardar (en algunos editores)
        }

        const sendCtrlZ = () => {
            socket.emit('input', '\x1a') // Ctrl+Z - suspender proceso
        }

        const sendCtrlD = () => {
            socket.emit('input', '\x04') // Ctrl+D - EOF / salir shell
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
            sendTab,
            sendCtrlC,
            sendCtrlX,
            sendCtrlS,
            sendCtrlZ,
            sendCtrlD,
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
                        
                        <!-- Botones táctiles para móvil -->
                        <div class="mobile-controls">
                            <button class="mobile-btn" @click="sendTab" title="Tab - Autocompletar">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M5 12h14M12 5l7 7-7 7"/>
                                </svg>
                                Tab
                            </button>
                            <button 
                                class="mobile-btn shortcut-btn" 
                                @click="sendCtrlC" 
                                title="Ctrl+C - Interrumpir proceso"
                            >
                                ^C
                            </button>
                            <button 
                                class="mobile-btn shortcut-btn" 
                                @click="sendCtrlX" 
                                title="Ctrl+X - Salir de nano"
                            >
                                ^X
                            </button>
                            <button 
                                class="mobile-btn shortcut-btn" 
                                @click="sendCtrlS" 
                                title="Ctrl+S - Guardar"
                            >
                                ^S
                            </button>
                            <button 
                                class="mobile-btn shortcut-btn" 
                                @click="sendCtrlZ" 
                                title="Ctrl+Z - Suspender proceso"
                            >
                                ^Z
                            </button>
                            <button 
                                class="mobile-btn shortcut-btn" 
                                @click="sendCtrlD" 
                                title="Ctrl+D - EOF / Salir"
                            >
                                ^D
                            </button>
                        </div>
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
    overflow-x: hidden;
    width: 100%;
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
    width: 100%;
    box-sizing: border-box;
}

/* Estilos para xterm.js */
.terminal-container :deep(.xterm) {
    height: 100%;
    width: 100% !important;
    max-width: 100% !important;
}

.terminal-container :deep(.xterm-viewport) {
    overflow-y: auto;
    overflow-x: hidden;
    width: 100% !important;
    max-width: 100% !important;
}

.terminal-container :deep(.xterm-screen) {
    width: 100% !important;
    max-width: 100% !important;
}

.terminal-container :deep(.xterm-rows) {
    width: 100% !important;
    max-width: 100% !important;
}

.terminal-container :deep(canvas) {
    max-width: 100% !important;
}

/* Botones táctiles para móvil */
.mobile-controls {
    display: none; /* Oculto por defecto en desktop */
    background: #2c001e;
    padding: 8px;
    gap: 6px;
    border-top: 1px solid rgba(0, 0, 0, 0.3);
    flex-wrap: wrap;
    justify-content: flex-start;
}

.mobile-btn {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #d3d7cf;
    padding: 8px 12px;
    border-radius: 6px;
    font-family: 'Ubuntu Mono', 'Courier New', monospace;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 4px;
    justify-content: center;
    touch-action: manipulation;
    user-select: none;
    flex: 0 0 auto;
}

.mobile-btn:active {
    background: rgba(255, 255, 255, 0.25);
    transform: scale(0.95);
}

.mobile-btn.shortcut-btn {
    min-width: 50px;
    padding: 8px 10px;
    background: rgba(76, 175, 80, 0.15);
    border-color: rgba(76, 175, 80, 0.3);
    color: #8ae234;
}

.mobile-btn.shortcut-btn:active {
    background: rgba(76, 175, 80, 0.3);
}

.mobile-btn svg {
    width: 14px;
    height: 14px;
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
    .leccion {
        overflow-x: hidden !important;
    }

    .content {
        padding: 6px;
        padding-top: 10px;
        padding-bottom: 85px;
        max-width: 100vw;
        width: 100vw;
        margin: 0;
        box-sizing: border-box;
        overflow-x: hidden;
    }

    .lesson-content {
        grid-template-columns: 1fr;
        gap: 12px;
        width: 100%;
        max-width: 100%;
        overflow-x: hidden;
    }

    .lesson-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
        margin-bottom: 12px;
    }

    .lesson-title {
        font-size: 18px;
        word-break: break-word;
        line-height: 1.3;
    }

    .terminal-section {
        width: 100%;
        max-width: 100%;
        margin: 0;
        overflow-x: hidden;
    }

    .terminal-wrapper {
        border-radius: 8px;
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
        margin: 0;
        overflow-x: hidden;
    }

    .terminal-header {
        padding: 5px 8px;
    }

    .terminal-controls {
        gap: 5px;
    }

    .control {
        width: 9px;
        height: 9px;
    }

    .terminal-title {
        font-size: 10px;
    }

    .status-indicator {
        width: 6px;
        height: 6px;
    }

    .terminal-container {
        min-height: 250px;
        max-height: 320px;
        padding: 3px;
        width: 100%;
        max-width: 100%;
        overflow-x: hidden !important;
        box-sizing: border-box;
    }

    .terminal-container :deep(.xterm) {
        font-size: 9px;
        width: 100% !important;
        max-width: 100% !important;
        overflow-x: hidden !important;
    }

    .terminal-container :deep(.xterm-viewport) {
        width: 100% !important;
        max-width: 100% !important;
        overflow-x: hidden !important;
    }

    .terminal-container :deep(.xterm-screen) {
        width: 100% !important;
        max-width: 100% !important;
        overflow-x: hidden !important;
    }

    .terminal-container :deep(.xterm-rows) {
        width: 100% !important;
        max-width: 100% !important;
        overflow-x: hidden !important;
    }

    .terminal-container :deep(canvas) {
        max-width: 100% !important;
        width: 100% !important;
    }

    /* Forzar que ningún elemento hijo exceda el ancho */
    .terminal-container :deep(*) {
        max-width: 100% !important;
        box-sizing: border-box !important;
    }

    /* Mostrar botones táctiles en móvil */
    .mobile-controls {
        display: flex;
        padding: 5px;
        gap: 4px;
        flex-wrap: wrap;
    }

    .mobile-btn {
        font-size: 10px;
        padding: 5px 7px;
        min-width: 42px;
        flex: 0 0 auto;
    }

    .mobile-btn svg {
        width: 11px;
        height: 11px;
    }

    .challenge-section {
        width: 100%;
        gap: 12px;
        max-width: 100%;
    }

    .challenge-panel {
        padding: 12px;
        border-radius: 10px;
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
        margin: 0;
    }

    .challenge-title {
        font-size: 16px;
        margin-bottom: 10px;
        line-height: 1.3;
    }

    .challenge-description {
        font-size: 12px;
        line-height: 1.4;
        margin-bottom: 12px;
    }

    .hint-section {
        gap: 7px;
    }

    .hint-btn {
        font-size: 11px;
        padding: 6px 10px;
    }

    .hint {
        font-size: 11px;
        padding: 8px;
    }

    .hint code {
        font-size: 10px;
        padding: 2px 4px;
    }

    .progress-section {
        padding: 12px;
        border-radius: 10px;
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
        margin: 0;
    }

    .progress-label {
        font-size: 13px;
        margin-bottom: 7px;
    }

    .progress-bar {
        height: 5px;
        margin-bottom: 5px;
    }

    .progress-text {
        font-size: 12px;
    }
}
</style>