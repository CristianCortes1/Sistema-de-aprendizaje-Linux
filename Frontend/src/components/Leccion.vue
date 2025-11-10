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
import { API_URL } from '../config/api'

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

interface Comando {
    id_Comando: number
    comando: string
}

interface Reto {
    id_Reto: number
    descripcion: string
    Retroalimentacion: string
    comandos: Comando[]
}

interface Leccion {
    id_Leccion: number
    Titulo: string
    retos: Reto[]
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
        const progress = ref(0)
        const lessonData = ref<Leccion | null>(null)
        const currentRetoIndex = ref(0)
        const commandHistory = ref<string[]>([])
        const lastCommand = ref('')
        const isVerifying = ref(false)
        const showSuccess = ref(false)
        const successMessage = ref('')
        const showError = ref(false)
        const errorMessage = ref('')
        const userProgress = ref(0)

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
                lessonData,
                currentReto: ref(null),
                goBack: () => {},
                goInicio: () => {},
                goBiblioteca: () => {},
                goRanking: () => {},
                goConfig: () => {},
                isConnected,
                terminalTitle,
                clearTerminal: () => {},
                verifyCommand: () => {},
                nextChallenge: () => {},
                showSuccess,
                successMessage,
                showError,
                errorMessage,
                isVerifying,
            }
        }

        // Computed: Reto actual
        const currentReto = ref<Reto | null>(null)

        // Cargar lección desde el backend
        const loadLesson = async () => {
            try {
                const lessonId = route.params.id
                const response = await fetch(`${API_URL}/lessons/${lessonId}`)
                
                if (!response.ok) {
                    throw new Error('Error loading lesson')
                }
                
                const data = await response.json()
                lessonData.value = data
                
                if (data.retos && data.retos.length > 0) {
                    currentReto.value = data.retos[0]
                }

                // Cargar progreso del usuario
                await loadUserProgress()
            } catch (error) {
                console.error('Error loading lesson:', error)
                errorMessage.value = 'No se pudo cargar la lección'
                showError.value = true
                setTimeout(() => showError.value = false, 3000)
            }
        }

        // Cargar progreso del usuario
        const loadUserProgress = async () => {
            try {
                const response = await fetch(`${API_URL}/progress?userId=${userId}&lessonId=${route.params.id}`)
                
                if (response.ok) {
                    const progressData = await response.json()
                    if (progressData && progressData.length > 0) {
                        userProgress.value = progressData[0].progreso
                        progress.value = progressData[0].progreso
                        
                        // Si hay progreso, calcular qué reto mostrar
                        const retosCompletados = Math.floor((userProgress.value / 100) * (lessonData.value?.retos.length || 1))
                        currentRetoIndex.value = Math.min(retosCompletados, (lessonData.value?.retos.length || 1) - 1)
                        
                        if (lessonData.value && lessonData.value.retos[currentRetoIndex.value]) {
                            currentReto.value = lessonData.value.retos[currentRetoIndex.value]
                        }
                    }
                }
            } catch (error) {
                console.error('Error loading progress:', error)
            }
        }

        // Capturar último comando ejecutado
        const captureCommand = (data: string) => {
            if (data === '\r') {
                // Enter pressed - comando completo
                const cmd = lastCommand.value.trim()
                if (cmd) {
                    commandHistory.value.push(cmd)
                    
                    // Verificar automáticamente cuando presiona Enter
                    setTimeout(() => {
                        verifyCommand()
                    }, 500) // Pequeño delay para dar tiempo a la terminal de procesar
                }
                lastCommand.value = ''
            } else if (data === '\x7F') {
                // Backspace
                lastCommand.value = lastCommand.value.slice(0, -1)
            } else if (data.charCodeAt(0) >= 32 && data.charCodeAt(0) <= 126) {
                // Caracter imprimible
                lastCommand.value += data
            }
        }

        // Verificar comando
        const verifyCommand = async () => {
            if (!currentReto.value || isVerifying.value || showSuccess.value) return
            
            isVerifying.value = true
            
            // Obtener el último comando ejecutado
            const lastCmd = commandHistory.value[commandHistory.value.length - 1]
            if (!lastCmd) {
                isVerifying.value = false
                return
            }
            
            const expectedCommands = currentReto.value.comandos.map(c => c.comando.toLowerCase().trim())
            
            // Verificar si el último comando coincide
            const cmdClean = lastCmd.toLowerCase().trim()
            const isCorrect = expectedCommands.some(expected => 
                cmdClean === expected || cmdClean.includes(expected)
            )
            
            if (isCorrect) {
                successMessage.value = currentReto.value.Retroalimentacion || '¡Correcto! Comando ejecutado exitosamente.'
                showSuccess.value = true
                showError.value = false
                
                // Actualizar progreso en el backend
                await updateProgress()
            } else {
                // No mostrar error, solo quedarse en silencio
                // El usuario puede intentar de nuevo
            }
            
            isVerifying.value = false
        }

        // Actualizar progreso en el backend
        const updateProgress = async () => {
            try {
                if (!lessonData.value) return
                
                const totalRetos = lessonData.value.retos.length
                const retosCompletados = currentRetoIndex.value + 1
                const newProgress = Math.round((retosCompletados / totalRetos) * 100)
                
                const response = await fetch(`${API_URL}/progress`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: parseInt(userId!),
                        lessonId: parseInt(route.params.id as string),
                        progress: newProgress,
                    }),
                })
                
                if (response.ok) {
                    progress.value = newProgress
                    userProgress.value = newProgress
                }
            } catch (error) {
                console.error('Error updating progress:', error)
            }
        }

        // Continuar al siguiente reto
        const nextChallenge = async () => {
            if (!lessonData.value) return
            
            showSuccess.value = false
            currentRetoIndex.value++
            
            if (currentRetoIndex.value < lessonData.value.retos.length) {
                currentReto.value = lessonData.value.retos[currentRetoIndex.value]
                commandHistory.value = []
            } else {
                // Lección completada - Asegurar que se guarde al 100%
                try {
                    const response = await fetch(`${API_URL}/progress`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            userId: parseInt(userId!),
                            lessonId: parseInt(route.params.id as string),
                            progress: 100,
                        }),
                    })
                    
                    if (response.ok) {
                        progress.value = 100
                        userProgress.value = 100
                    }
                } catch (error) {
                    console.error('Error updating final progress:', error)
                }
                
                successMessage.value = '¡Felicidades! Has completado toda la lección al 100%.'
                showSuccess.value = true
                
                setTimeout(() => {
                    router.push('/dashboard')
                }, 3000)
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
            // Cargar lección primero
            await loadLesson()
            
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
                captureCommand(data)
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
            lessonData,
            currentReto,
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
            verifyCommand,
            nextChallenge,
            showSuccess,
            successMessage,
            showError,
            errorMessage,
            isVerifying,
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
                <h1 class="lesson-title">{{ lessonData?.Titulo || 'Cargando lección...' }}</h1>
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
                    <div class="challenge-panel" v-if="currentReto">
                        <h2 class="challenge-title">Reto {{ (lessonData?.retos.findIndex(r => r.id_Reto === currentReto?.id_Reto) || 0) + 1 }} de {{ lessonData?.retos.length || 0 }}</h2>
                        <p class="challenge-description">{{ currentReto.descripcion }}</p>

                        <div class="hint-section">
                            <button class="hint-btn" @click="toggleHint">
                                {{ showHint ? 'Ocultar pista' : 'Mostrar pista' }} 💡
                            </button>
                            <div v-if="showHint" class="hint">
                                Comandos esperados:
                                <code v-for="cmd in currentReto.comandos" :key="cmd.id_Comando">
                                    {{ cmd.comando }}
                                </code>
                            </div>
                        </div>

                        <!-- Mensajes de éxito/error -->
                        <div v-if="showSuccess" class="success-message">
                            ✅ {{ successMessage }}
                        </div>

                        <!-- Botones de acción -->
                        <div class="action-buttons">
                            <button 
                                v-if="showSuccess" 
                                class="continue-btn" 
                                @click="nextChallenge"
                            >
                                Continuar →
                            </button>
                            <button 
                                v-else
                                class="verify-btn manual" 
                                @click="verifyCommand"
                                :disabled="isVerifying"
                                title="También se verifica automáticamente al presionar Enter"
                            >
                                {{ isVerifying ? 'Verificando...' : 'Verificar comando ✓' }}
                            </button>
                        </div>
                    </div>
                    <div class="challenge-panel" v-else>
                        <p class="challenge-description">Cargando reto...</p>
                    </div>

                    <!-- Progress -->
                    <div class="progress-section">
                        <div class="progress-label">Progreso de la Lección</div>
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
    display: block;
    margin: 4px 0;
}

.success-message {
    background: rgba(76, 175, 80, 0.15);
    border: 1px solid rgba(76, 175, 80, 0.3);
    color: #66bb6a;
    padding: 12px;
    border-radius: 8px;
    margin-top: 15px;
    font-size: 14px;
    animation: slideIn 0.3s ease;
}

.error-message {
    background: rgba(244, 67, 54, 0.2);
    border: 1px solid rgba(244, 67, 54, 0.4);
    color: #f44336;
    padding: 12px;
    border-radius: 8px;
    margin-top: 15px;
    font-size: 14px;
    animation: slideIn 0.3s ease;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.action-buttons {
    display: flex;
    gap: 10px;
    margin-top: 15px;
}

.verify-btn,
.continue-btn {
    flex: 1;
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
}

.verify-btn {
    background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
}

.verify-btn.manual {
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: rgba(255, 255, 255, 0.9);
    box-shadow: none;
    font-size: 13px;
}

.verify-btn.manual:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
}

.verify-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(33, 150, 243, 0.4);
}

.verify-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.continue-btn {
    background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
    animation: pulse 2s infinite;
}

.continue-btn:hover {
    background: linear-gradient(135deg, #45a049 0%, #388e3c 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(76, 175, 80, 0.4);
}

@keyframes pulse {
    0%, 100% {
        box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
    }
    50% {
        box-shadow: 0 4px 20px rgba(76, 175, 80, 0.5);
    }
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

    .success-message,
    .error-message {
        font-size: 11px;
        padding: 8px;
        margin-top: 10px;
    }

    .action-buttons {
        flex-direction: column;
        gap: 8px;
        margin-top: 10px;
    }

    .verify-btn,
    .continue-btn {
        padding: 10px 18px;
        font-size: 13px;
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