<script lang="ts">
import { defineComponent, ref, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { io } from 'socket.io-client'
import { AnsiUp } from 'ansi_up'
import Header from './Header.vue'
import Footer from './Footer.vue'

export default defineComponent({
    name: 'Leccion',
    components: { Header, Footer },
    setup() {
        const router = useRouter()
        const route = useRoute()

        // Terminal
        const socket = io('https://sistema-de-aprendizaje-linux-production.up.railway.app')
        const command = ref('')
        const output = ref('')
        const outputRef = ref<HTMLElement | null>(null)
        const ansi_up = new AnsiUp()

        // UI state (lesson, hints, progress)
        const showHint = ref(false)
        const progress = ref(30)
        const lesson = ref({
            title: 'Lesson 1: Basic Navigation',
            challenge: {
                title: 'Challenge 1: Change Directory',
                description: 'Use the cd command to navigate to the "documents" directory. Type your command in the terminal and press "Run" to check your answer.',
                hint: 'The command is cd documents',
                correctCommand: 'cd documents',
                directory: 'penguin@earth:~$'
            }
        })

        onMounted(() => {
            socket.on('output', async (data: string) => {
                const html = ansi_up.ansi_to_html(data)
                output.value += html
                await nextTick()
                if (outputRef.value) {
                    outputRef.value.scrollTop = outputRef.value.scrollHeight
                }
            })
        })

        const sendCommand = () => {
            if (!command.value.trim()) return
            socket.emit('input', command.value)
            output.value += `<span class='prompt'>penguin@earth:~$</span> ${command.value}<br>`
            command.value = ''
        }

        const toggleHint = () => {
            showHint.value = !showHint.value
        }

        // Navegación
        const goBack = () => router.push('/dashboard')
        const goInicio = () => router.push('/dashboard')
        const goBiblioteca = () => router.push('/biblioteca')
        const goRanking = () => router.push('/ranking')
        const goConfig = () => router.push('/configuracion')

        return {
            command,
            output,
            outputRef,
            sendCommand,
            showHint,
            toggleHint,
            progress,
            lesson,
            goBack,
            goInicio,
            goBiblioteca,
            goRanking,
            goConfig,
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
                    <div class="terminal">
                        <div class="terminal-header">
                            <div class="terminal-controls">
                                <span class="control red"></span>
                                <span class="control yellow"></span>
                                <span class="control green"></span>
                            </div>
                            <div class="terminal-title">penguin@earth:~$</div>
                        </div>
                        <div class="terminal-body">
                            <div class="terminal-output" ref="outputRef" v-html="output"></div>
                            <div class="terminal-input">
                                <span class="prompt">$</span>
                                <input v-model="command" @keyup.enter="sendCommand" type="text" class="command-input"
                                    placeholder="Enter a command..." />
                            </div>
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
}

.prompt {
    color: #00ff88;
    font-weight: bold;
}

.terminal-output {
    color: #dcddde;
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow-y: auto;
    min-height: 250px;
    max-height: 400px;
    font-family: 'Courier New', monospace;
    font-size: 14px;
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
    gap: 15px;
}

.terminal {
    background: #1e2124;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.terminal-header {
    background: #2f3136;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
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
    color: #8e9297;
    font-family: 'Courier New', monospace;
    font-size: 14px;
}

.terminal-body {
    padding: 20px;
    min-height: 300px;
    font-family: 'Courier New', monospace;
}

.terminal-output {
    color: #dcddde;
    white-space: pre-wrap;
    margin-bottom: 10px;
    font-size: 14px;
}

.terminal-input {
    display: flex;
    align-items: center;
    gap: 8px;
}

.prompt {
    color: #00ff88;
    font-weight: bold;
}

.command-input {
    flex: 1;
    background: transparent;
    border: none;
    color: #dcddde;
    font-family: 'Courier New', monospace;
    font-size: 14px;
    outline: none;
}

.command-input::placeholder {
    color: #72767d;
}

.execute-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.execute-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
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

    .terminal-body {
        padding: 15px;
        min-height: 200px;
    }
}
</style>
