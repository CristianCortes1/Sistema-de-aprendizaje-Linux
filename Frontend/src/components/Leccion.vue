<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { io } from 'socket.io-client'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { WebLinksAddon } from 'xterm-addon-web-links'
import 'xterm/css/xterm.css'
import Header from './Header.vue'
import Footer from './Sidebar.vue'
import XPGainedAnimation from './XPGainedAnimation.vue'
import LessonService from '../services/LessonService'
import UserService from '../services/UserService'
import ProgressService from '../services/ProgressService'

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
    tipo: string // 'reto' o 'explicacion'
    descripcion: string
    contenido?: string // Solo para tipo='explicacion'
    Retroalimentacion: string
    comandos: Comando[]
}

interface Leccion {
    id_Leccion: number
    Titulo: string
    experiencia: number
    retos: Reto[]
}

export default defineComponent({
    name: 'Leccion',
    components: { Header, Footer, XPGainedAnimation },
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

        // XP Animation
        const showXPAnimation = ref(false)
        const xpGained = ref(0)

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
                const lessonId = route.params.id as string;
                const data = await LessonService.getById(parseInt(lessonId)) as Leccion;
                
                lessonData.value = data;
                
                // Cargar progreso del usuario ANTES de asignar el reto inicial
                await loadUserProgress()
                
                // Si no hay progreso cargado, empezar desde el primer reto
                if (!currentReto.value && data.retos && data.retos.length > 0) {
                    currentReto.value = data.retos[0]
                    currentRetoIndex.value = 0
                }
            } catch (error) {
                console.error('Error loading lesson:', error)
                errorMessage.value = 'No se pudo cargar la lección'
                showError.value = true
                setTimeout(() => showError.value = false, 3000)
            }
        }

        // Actualizar datos del usuario en localStorage
        const updateUserData = async () => {
            try {
                const userData = await UserService.getById(parseInt(userId!)) as any;
                
                // Actualizar localStorage con los nuevos datos
                const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
                const updatedUser = {
                    ...currentUser,
                    experiencia: userData.experiencia,
                    racha: userData.racha
                }
                localStorage.setItem('user', JSON.stringify(updatedUser))
                
                // Emitir evento para que el Header se actualice
                window.dispatchEvent(new CustomEvent('userUpdated', { detail: updatedUser }))
                
                console.log(`✅ Usuario actualizado: ${userData.experiencia} XP`)
            } catch (error) {
                console.error('Error updating user data:', error)
            }
        }

        // Cargar progreso del usuario
        const loadUserProgress = async () => {
            try {
                const progressData = await ProgressService.getByUserAndLesson(
                    parseInt(userId!),
                    parseInt(route.params.id as string)
                ) as any[];
                
                if (progressData && progressData.length > 0) {
                    const savedProgress = progressData[0].progreso
                    userProgress.value = savedProgress
                    progress.value = savedProgress
                    
                    // Si el progreso es 100%, empezar desde el inicio
                    if (savedProgress >= 100) {
                        console.log('Lección ya completada, reiniciando desde el inicio')
                        currentRetoIndex.value = 0
                        if (lessonData.value && lessonData.value.retos[0]) {
                            currentReto.value = lessonData.value.retos[0]
                        }
                        // No reiniciar el progreso, mantenerlo en 100%
                        return
                    }
                    
                    // Calcular qué reto mostrar basado en el progreso (solo si no está completado)
                    if (lessonData.value && lessonData.value.retos.length > 0) {
                        const totalRetos = lessonData.value.retos.length
                        // Calcular índice: progreso 0-99% → reto correspondiente
                        const retoIndex = Math.floor((savedProgress / 100) * totalRetos)
                        // Asegurar que no exceda el límite
                        currentRetoIndex.value = Math.min(retoIndex, totalRetos - 1)
                        currentReto.value = lessonData.value.retos[currentRetoIndex.value]
                        
                        console.log(`Progreso cargado: ${savedProgress}%, mostrando reto ${currentRetoIndex.value + 1} de ${totalRetos}`)
                    }
                } else {
                    // Sin progreso guardado, empezar desde 0
                    console.log('Sin progreso guardado, empezando desde el inicio')
                    currentRetoIndex.value = 0
                    progress.value = 0
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

        // Verificar comando (solo para tipo='reto')
        const verifyCommand = async () => {
            // No verificar si es una explicación
            if (!currentReto.value || currentReto.value.tipo === 'explicacion') return
            if (isVerifying.value || showSuccess.value) return
            
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
                
                await ProgressService.create({
                    userId: parseInt(userId!),
                    lessonId: parseInt(route.params.id as string),
                    progress: newProgress
                });
                
                progress.value = newProgress
                userProgress.value = newProgress
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
                    await ProgressService.create({
                        userId: parseInt(userId!),
                        lessonId: parseInt(route.params.id as string),
                        progress: 100
                    });
                    
                    progress.value = 100
                    userProgress.value = 100

                    // Actualizar datos del usuario en localStorage
                    await updateUserData()

                    // Mostrar animación de XP ganado
                    xpGained.value = lessonData.value.experiencia || 100
                    showXPAnimation.value = true

                    // Ocultar animación después de 3 segundos
                    setTimeout(() => {
                        showXPAnimation.value = false
                    }, 3000)
                } catch (error) {
                    console.error('Error updating final progress:', error)
                }
                
                successMessage.value = '¡Felicidades! Has completado toda la lección al 100%.'
                showSuccess.value = true
                
                setTimeout(() => {
                    router.push('/dashboard')
                }, 4000) // Aumentado a 4 segundos para dar tiempo a ver la animación
            }
        }

        // WebSocket URL - en producción usa la URL actual, en desarrollo usa localhost
        const WS_URL = import.meta.env.MODE === 'production' 
            ? `${window.location.protocol}//${window.location.host}` 
            : (import.meta.env.VITE_API_URL || 'http://localhost:3000')

        console.log('🔌 Conectando al WebSocket:', WS_URL)
        console.log('👤 User ID:', userId)

        // Terminal - conectar con autenticación
        const socket = io(WS_URL, {
            auth: {
                userId: userId
            },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5
        })
        
        let terminal: Terminal | null = null
        let fitAddon: FitAddon | null = null

        onMounted(async () => {
            // Esperar a que el DOM esté listo PRIMERO
            await nextTick()
            
            if (!terminalContainer.value) {
                console.error('Terminal container not found!')
                return
            }

            // Crear instancia de xterm ANTES de cargar los datos
            // Detectar si es móvil
            const isMobile = window.innerWidth <= 768
            
            terminal = new Terminal({
                cursorBlink: true,
                cursorStyle: 'block',
                fontFamily: '"Ubuntu Mono", "Courier New", monospace',
                fontSize: isMobile ? 11 : 15,
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
                // Opciones específicas para móviles
                screenReaderMode: false,
                disableStdin: false,
                allowTransparency: false,
            })

            // Addons
            fitAddon = new FitAddon()
            terminal.loadAddon(fitAddon)
            terminal.loadAddon(new WebLinksAddon())

            // Montar terminal en el DOM
            terminal.open(terminalContainer.value)
            
            // Ajustar tamaño
            fitAddon.fit()

            // Enfocar la terminal automáticamente en móviles cuando se toca el contenedor
            const focusTerminal = () => {
                if (terminal) {
                    terminal.focus()
                }
            }

            if (terminalContainer.value) {
                terminalContainer.value.addEventListener('click', focusTerminal)
                terminalContainer.value.addEventListener('touchstart', focusTerminal, { passive: true })
            }

            // Enfocar la terminal inmediatamente
            setTimeout(() => {
                terminal?.focus()
            }, 500)

            // Manejar input del usuario
            terminal.onData((data) => {
                captureCommand(data)
                socket.emit('input', data)
            })

            // Conexión establecida
            socket.on('connect', () => {
                console.log('✅ Socket conectado')
                isConnected.value = true
                terminalTitle.value = 'Terminal SSH'
            })

            // Desconexión
            socket.on('disconnect', (reason) => {
                console.log('❌ Socket desconectado:', reason)
                isConnected.value = false
                terminalTitle.value = 'Desconectado'
            })

            // Error de conexión
            socket.on('connect_error', (error) => {
                console.error('🔴 Error de conexión:', error.message)
                isConnected.value = false
                terminalTitle.value = 'Error de conexión'
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

            // AHORA cargar la lección después de que la terminal esté lista
            await loadLesson()
        })

        // Cleanup fuera de onMounted
        onUnmounted(() => {
            window.removeEventListener('resize', () => {})
            terminal?.dispose()
            socket.disconnect()
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
            showXPAnimation,
            xpGained,
        }
    },
})
</script>


<template>
    <div class="leccion">
        <Header />

        <!-- Animación de XP ganado -->
        <XPGainedAnimation :show="showXPAnimation" :xpAmount="xpGained ?? 0" />

        <div class="content">
            <!-- Título de la lección -->
            <div class="lesson-header">
                <h1 class="lesson-title">{{ lessonData?.Titulo || 'Cargando...' }}</h1>
            </div>

            <!-- Challenge Panel (PRIMERO en móvil) -->
            <div class="challenge-section">
                <div class="challenge-panel" v-if="currentReto">
                    <h2 class="challenge-title">
                        {{ currentReto.tipo === 'explicacion' ? '📚' : '🎯' }}
                        {{ currentReto.tipo === 'explicacion' ? 'Explicación' : 'Reto' }} 
                        {{ (lessonData?.retos.findIndex(r => r.id_Reto === currentReto?.id_Reto) || 0) + 1 }} de {{ lessonData?.retos.length || 0 }}
                    </h2>

                    <!-- VISTA DE EXPLICACIÓN -->
                    <template v-if="currentReto.tipo === 'explicacion'">
                        <h3 class="explicacion-title">{{ currentReto.descripcion }}</h3>
                        <div class="explicacion-content" v-html="currentReto.contenido"></div>
                        
                        <button class="continue-btn" @click="nextChallenge">
                            Continuar →
                        </button>
                    </template>

                    <!-- VISTA DE RETO -->
                    <template v-else>
                        <p class="challenge-description">{{ currentReto.descripcion }}</p>

                        <div class="hint-section">
                            <button class="hint-btn" @click="toggleHint">
                                {{ showHint ? 'Ocultar pista' : 'Ver pista' }} 💡
                            </button>
                            <div v-if="showHint" class="hint">
                                Comandos esperados:
                                <code v-for="cmd in currentReto.comandos" :key="cmd.id_Comando">
                                    {{ cmd.comando }}
                                </code>
                            </div>
                        </div>

                        <!-- Mensajes -->
                        <div v-if="showSuccess" class="success-message">
                            ✅ {{ successMessage }}
                        </div>

                        <!-- Botones -->
                        <button 
                            v-if="showSuccess" 
                            class="continue-btn" 
                            @click="nextChallenge"
                        >
                            Continuar →
                        </button>
                        <button 
                            v-else
                            class="verify-btn" 
                            @click="verifyCommand"
                            :disabled="isVerifying"
                        >
                            {{ isVerifying ? 'Verificando...' : 'Verificar ✓' }}
                        </button>
                    </template>
                </div>

                <!-- Progress -->
                <div class="progress-section">
                    <div class="progress-label">Progreso</div>
                    <div class="progress-bar">
                        <div class="progress-fill" :style="`width: ${progress}%`"></div>
                    </div>
                    <div class="progress-text">{{ progress }}%</div>
                </div>
            </div>

            <!-- Terminal (SEGUNDO en móvil, oculta con CSS en explicaciones) -->
            <div class="terminal-section" :class="{ 'hidden-section': currentReto?.tipo === 'explicacion' }">
                <div class="terminal-wrapper">
                    <div class="terminal-header">
                        <div class="terminal-controls">
                            <span class="dot red"></span>
                            <span class="dot yellow"></span>
                            <span class="dot green"></span>
                        </div>
                        <div class="terminal-title">{{ terminalTitle }}</div>
                        <span class="status-dot" :class="{ connected: isConnected }"></span>
                    </div>
                    
                    <div ref="terminalContainer" class="terminal-container"></div>
                    
                    <!-- Botones de atajos -->
                    <div class="terminal-shortcuts">
                        <button class="shortcut-btn" @click="sendTab">Tab</button>
                        <button class="shortcut-btn" @click="sendCtrlC">^C</button>
                        <button class="shortcut-btn" @click="sendCtrlX">^X</button>
                        <button class="shortcut-btn" @click="sendCtrlS">^S</button>
                        <button class="shortcut-btn" @click="sendCtrlZ">^Z</button>
                        <button class="shortcut-btn" @click="sendCtrlD">^D</button>
                    </div>
                </div>
            </div>
        </div>

    <Footer :goInicio="goInicio" :goBiblioteca="goBiblioteca" :goRanking="goRanking" :goConfig="goConfig" />
    </div>
</template>

<style scoped>
/* ========================================
   MOBILE FIRST - Estilos base para móvil
   ======================================== */

.leccion {
    min-height: 100vh;
    background: linear-gradient(135deg, #ef9c6c 0%, #c57da1 50%, #956eaa 100%);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    padding-bottom: 80px;
}

.content {
    padding: 12px;
    max-width: 100%;
}

/* Header */
.lesson-header {
    margin-bottom: 16px;
}

.lesson-title {
    color: white;
    font-size: 20px;
    font-weight: 600;
    margin: 0;
    line-height: 1.3;
}

/* Challenge Section - PRIMERO en móvil */
.challenge-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 16px;
}

.challenge-panel {
    background: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 16px;
    box-shadow: 0 4px 12px rgba(149, 110, 170, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
}

.challenge-title {
    color: white;
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 12px 0;
    display: flex;
    align-items: center;
    gap: 8px;
}

.challenge-description {
    color: rgba(255, 255, 255, 0.95);
    line-height: 1.6;
    margin-bottom: 16px;
    font-size: 14px;
}

/* Explicaciones */
.explicacion-title {
    color: white;
    font-size: 15px;
    font-weight: 600;
    margin: 0 0 12px 0;
    padding-bottom: 8px;
    border-bottom: 2px solid rgba(255, 255, 255, 0.3);
}

.explicacion-content {
    color: rgba(255, 255, 255, 0.95);
    line-height: 1.7;
    font-size: 14px;
}

.explicacion-content h2,
.explicacion-content h3,
.explicacion-content h4 {
    color: white;
    margin-top: 16px;
    margin-bottom: 8px;
}

.explicacion-content code {
    background: rgba(255, 255, 255, 0.15);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    font-size: 13px;
    color: #ffd700;
}

.explicacion-content pre {
    background: rgba(0, 0, 0, 0.2);
    padding: 12px;
    border-radius: 6px;
    overflow-x: auto;
    margin: 12px 0;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Hints */
.hint-section {
    margin: 12px 0;
}

.hint-btn {
    background: rgba(255, 193, 7, 0.2);
    border: 1px solid rgba(255, 193, 7, 0.4);
    color: #ffd700;
    padding: 10px 16px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    width: 100%;
    transition: all 0.2s ease;
}

.hint-btn:active {
    background: rgba(255, 193, 7, 0.3);
    transform: scale(0.98);
}

.hint {
    background: rgba(255, 255, 255, 0.15);
    border-left: 3px solid rgba(255, 193, 7, 0.6);
    padding: 12px;
    border-radius: 6px;
    margin-top: 8px;
    color: rgba(255, 255, 255, 0.95);
    font-size: 13px;
}

.hint code {
    background: rgba(0, 0, 0, 0.3);
    padding: 4px 8px;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    color: #ffd700;
    display: block;
    margin: 6px 0;
}

/* Mensajes */
.success-message {
    background: rgba(76, 175, 80, 0.15);
    border: 1px solid rgba(76, 175, 80, 0.4);
    color: #2e7d32;
    padding: 12px;
    border-radius: 8px;
    margin: 12px 0;
    font-size: 14px;
    font-weight: 500;
}

/* Botones */
.verify-btn,
.continue-btn {
    width: 100%;
    padding: 14px;
    border: none;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-top: 12px;
}

.verify-btn {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    box-shadow: 0 3px 8px rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.3);
}

.verify-btn:active:not(:disabled) {
    transform: scale(0.98);
    background: rgba(255, 255, 255, 0.3);
}

.verify-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.continue-btn {
    background: rgba(255, 255, 255, 0.25);
    color: white;
    box-shadow: 0 3px 8px rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.4);
}

.continue-btn:active {
    transform: scale(0.98);
}

/* Progress */
.progress-section {
    background: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 16px;
    box-shadow: 0 4px 12px rgba(149, 110, 170, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
}

.progress-label {
    color: white;
    font-weight: 600;
    margin-bottom: 8px;
    font-size: 14px;
}

.progress-bar {
    background: rgba(255, 255, 255, 0.2);
    height: 8px;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 6px;
}

.progress-fill {
    background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
    height: 100%;
    transition: width 0.5s ease;
    border-radius: 4px;
    box-shadow: 0 0 8px rgba(76, 175, 80, 0.4);
}

.progress-text {
    color: white;
    font-size: 13px;
    text-align: right;
}

/* Terminal Section */
.terminal-section {
    margin-bottom: 16px;
}

/* Ocultar terminal en explicaciones */
.terminal-section.hidden-section {
    display: none;
}

.terminal-wrapper {
    background: #300a24;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.terminal-header {
    background: #2c001e;
    padding: 10px 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.terminal-controls {
    display: flex;
    gap: 6px;
}

.dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
}

.dot.red { background: #e74c3c; }
.dot.yellow { background: #f39c12; }
.dot.green { background: #9b59b6; }

.terminal-title {
    color: #d4d4d4;
    font-family: 'Courier New', monospace;
    font-size: 12px;
    flex: 1;
    text-align: center;
}

.status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #e74c3c;
    transition: background 0.3s ease;
}

.status-dot.connected {
    background: #9b59b6;
    box-shadow: 0 0 8px rgba(155, 89, 182, 0.6);
}

.terminal-container {
    padding: 8px;
    min-height: 280px;
    max-height: 350px;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    cursor: text;
    position: relative;
    width: 100%;
    box-sizing: border-box;
}

/* Estilos para xterm.js */
.terminal-container :deep(.xterm) {
    height: 100%;
    font-size: 11px;
    width: 100%;
}

.terminal-container :deep(.xterm-viewport) {
    overflow-y: auto !important;
    width: 100%;
}

.terminal-container :deep(.xterm-screen) {
    width: 100%;
}

.terminal-container :deep(.xterm-helper-textarea) {
    position: absolute !important;
    opacity: 0 !important;
    left: -9999px !important;
    top: 0 !important;
    width: 0px !important;
    height: 0px !important;
    z-index: -10 !important;
    resize: none !important;
    overflow: hidden !important;
}

/* Botones de atajos */
.terminal-shortcuts {
    background: #2c001e;
    padding: 8px;
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.shortcut-btn {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #d4d4d4;
    padding: 8px 12px;
    border-radius: 6px;
    font-family: 'Courier New', monospace;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 50px;
    text-align: center;
}

.shortcut-btn:active {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(0.95);
}

/* ========================================
   TABLET - 768px y más
   ======================================== */
@media (min-width: 768px) {
    .leccion {
        padding-bottom: 120px;
    }

    .content {
        padding: 20px;
        max-width: 1400px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: auto auto;
        gap: 20px;
    }

    .lesson-title {
        font-size: 28px;
    }

    .lesson-header {
        margin-bottom: 24px;
        grid-column: 1 / -1;
    }

    /* En desktop con terminal: Layout en 2 columnas */
    .content:has(.terminal-section:not(.hidden-section)) {
        grid-template-columns: 1fr 420px;
    }

    .terminal-section {
        grid-column: 1;
        grid-row: 2;
        margin-bottom: 0;
    }

    .challenge-section {
        grid-column: 2;
        grid-row: 2;
    }

    /* En desktop sin terminal visible (explicación): Layout de 1 columna centrada */
    .content:has(.terminal-section.hidden-section) .challenge-section,
    .content:not(:has(.terminal-section)) .challenge-section {
        grid-column: 1 / -1;
        max-width: 900px;
        margin: 0 auto;
    }

    .terminal-container {
        min-height: 500px;
        max-height: 600px;
        padding: 12px;
    }

    .terminal-container :deep(.xterm) {
        font-size: 14px;
    }

    .challenge-panel {
        padding: 24px;
    }

    .challenge-title {
        font-size: 20px;
    }

    .challenge-description {
        font-size: 15px;
    }

    .verify-btn,
    .continue-btn {
        padding: 12px 24px;
        width: auto;
    }

    .hint-btn {
        width: auto;
    }

    .progress-section {
        padding: 20px;
    }
}

/* ========================================
   DESKTOP LARGE - 1200px y más
   ======================================== */
@media (min-width: 1200px) {
    .content:has(.terminal-section:not(.hidden-section)) {
        grid-template-columns: 1fr 480px;
    }

    .terminal-container {
        min-height: 550px;
        max-height: 650px;
    }

    .terminal-container :deep(.xterm) {
        font-size: 15px;
    }
}
</style>
