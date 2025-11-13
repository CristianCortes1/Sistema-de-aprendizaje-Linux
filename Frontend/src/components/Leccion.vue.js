import { defineComponent, ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { io } from 'socket.io-client';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import 'xterm/css/xterm.css';
import Header from './Header.vue';
import Footer from './Footer.vue';
import XPGainedAnimation from './XPGainedAnimation.vue';
import LessonService from '../services/LessonService';
import UserService from '../services/UserService';
import ProgressService from '../services/ProgressService';
// Función para obtener userId del token JWT
function getUserIdForTerminal() {
    const token = localStorage.getItem('token');
    if (!token) {
        // ❌ Sin token = sin acceso al terminal
        return null;
    }
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload && payload.sub) {
            // Convertir a string por si el ID viene como número
            return String(payload.sub);
        }
    }
    catch (error) {
        console.error('Error decoding token:', error);
    }
    return null;
}
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_export = defineComponent({
    name: 'Leccion',
    components: { Header, Footer, XPGainedAnimation },
    setup() {
        const router = useRouter();
        const route = useRoute();
        // Obtener userId del token (REQUERIDO para terminal)
        const userId = getUserIdForTerminal();
        // Estado de la terminal
        const isConnected = ref(false);
        const terminalTitle = ref('Conectando...');
        const terminalContainer = ref(null);
        // UI state (lesson, hints, progress)
        const showHint = ref(false);
        const progress = ref(0);
        const lessonData = ref(null);
        const currentRetoIndex = ref(0);
        const commandHistory = ref([]);
        const lastCommand = ref('');
        const isVerifying = ref(false);
        const showSuccess = ref(false);
        const successMessage = ref('');
        const showError = ref(false);
        const errorMessage = ref('');
        const userProgress = ref(0);
        // XP Animation
        const showXPAnimation = ref(false);
        const xpGained = ref(0);
        // ❌ Redirigir a login si no está autenticado
        if (!userId) {
            console.warn('No authenticated user - redirecting to login');
            router.push('/login');
            // Retornar objeto mínimo para evitar errores
            return {
                terminalContainer,
                showHint,
                toggleHint: () => { },
                progress,
                lessonData,
                currentReto: ref(null),
                goBack: () => { },
                goInicio: () => { },
                goBiblioteca: () => { },
                goRanking: () => { },
                goConfig: () => { },
                isConnected,
                terminalTitle,
                clearTerminal: () => { },
                verifyCommand: () => { },
                nextChallenge: () => { },
                showSuccess,
                successMessage,
                showError,
                errorMessage,
                isVerifying,
            };
        }
        // Computed: Reto actual
        const currentReto = ref(null);
        // Cargar lección desde el backend
        const loadLesson = async () => {
            try {
                const lessonId = route.params.id;
                const data = await LessonService.getById(parseInt(lessonId));
                lessonData.value = data;
                // Cargar progreso del usuario ANTES de asignar el reto inicial
                await loadUserProgress();
                // Si no hay progreso cargado, empezar desde el primer reto
                if (!currentReto.value && data.retos && data.retos.length > 0) {
                    currentReto.value = data.retos[0];
                    currentRetoIndex.value = 0;
                }
            }
            catch (error) {
                console.error('Error loading lesson:', error);
                errorMessage.value = 'No se pudo cargar la lección';
                showError.value = true;
                setTimeout(() => showError.value = false, 3000);
            }
        };
        // Actualizar datos del usuario en localStorage
        const updateUserData = async () => {
            try {
                const userData = await UserService.getById(parseInt(userId));
                // Actualizar localStorage con los nuevos datos
                const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                const updatedUser = {
                    ...currentUser,
                    experiencia: userData.experiencia,
                    racha: userData.racha
                };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                // Emitir evento para que el Header se actualice
                window.dispatchEvent(new CustomEvent('userUpdated', { detail: updatedUser }));
                console.log(`✅ Usuario actualizado: ${userData.experiencia} XP`);
            }
            catch (error) {
                console.error('Error updating user data:', error);
            }
        };
        // Cargar progreso del usuario
        const loadUserProgress = async () => {
            try {
                const progressData = await ProgressService.getByUserAndLesson(parseInt(userId), parseInt(route.params.id));
                if (progressData && progressData.length > 0) {
                    const savedProgress = progressData[0].progreso;
                    userProgress.value = savedProgress;
                    progress.value = savedProgress;
                    // Si el progreso es 100%, empezar desde el inicio
                    if (savedProgress >= 100) {
                        console.log('Lección ya completada, reiniciando desde el inicio');
                        currentRetoIndex.value = 0;
                        if (lessonData.value && lessonData.value.retos[0]) {
                            currentReto.value = lessonData.value.retos[0];
                        }
                        // No reiniciar el progreso, mantenerlo en 100%
                        return;
                    }
                    // Calcular qué reto mostrar basado en el progreso (solo si no está completado)
                    if (lessonData.value && lessonData.value.retos.length > 0) {
                        const totalRetos = lessonData.value.retos.length;
                        // Calcular índice: progreso 0-99% → reto correspondiente
                        const retoIndex = Math.floor((savedProgress / 100) * totalRetos);
                        // Asegurar que no exceda el límite
                        currentRetoIndex.value = Math.min(retoIndex, totalRetos - 1);
                        currentReto.value = lessonData.value.retos[currentRetoIndex.value];
                        console.log(`Progreso cargado: ${savedProgress}%, mostrando reto ${currentRetoIndex.value + 1} de ${totalRetos}`);
                    }
                }
                else {
                    // Sin progreso guardado, empezar desde 0
                    console.log('Sin progreso guardado, empezando desde el inicio');
                    currentRetoIndex.value = 0;
                    progress.value = 0;
                }
            }
            catch (error) {
                console.error('Error loading progress:', error);
            }
        };
        // Capturar último comando ejecutado
        const captureCommand = (data) => {
            if (data === '\r') {
                // Enter pressed - comando completo
                const cmd = lastCommand.value.trim();
                if (cmd) {
                    commandHistory.value.push(cmd);
                    // Verificar automáticamente cuando presiona Enter
                    setTimeout(() => {
                        verifyCommand();
                    }, 500); // Pequeño delay para dar tiempo a la terminal de procesar
                }
                lastCommand.value = '';
            }
            else if (data === '\x7F') {
                // Backspace
                lastCommand.value = lastCommand.value.slice(0, -1);
            }
            else if (data.charCodeAt(0) >= 32 && data.charCodeAt(0) <= 126) {
                // Caracter imprimible
                lastCommand.value += data;
            }
        };
        // Verificar comando (solo para tipo='reto')
        const verifyCommand = async () => {
            // No verificar si es una explicación
            if (!currentReto.value || currentReto.value.tipo === 'explicacion')
                return;
            if (isVerifying.value || showSuccess.value)
                return;
            isVerifying.value = true;
            // Obtener el último comando ejecutado
            const lastCmd = commandHistory.value[commandHistory.value.length - 1];
            if (!lastCmd) {
                isVerifying.value = false;
                return;
            }
            const expectedCommands = currentReto.value.comandos.map(c => c.comando.toLowerCase().trim());
            // Verificar si el último comando coincide
            const cmdClean = lastCmd.toLowerCase().trim();
            const isCorrect = expectedCommands.some(expected => cmdClean === expected || cmdClean.includes(expected));
            if (isCorrect) {
                successMessage.value = currentReto.value.Retroalimentacion || '¡Correcto! Comando ejecutado exitosamente.';
                showSuccess.value = true;
                showError.value = false;
                // Actualizar progreso en el backend
                await updateProgress();
            }
            else {
                // No mostrar error, solo quedarse en silencio
                // El usuario puede intentar de nuevo
            }
            isVerifying.value = false;
        };
        // Actualizar progreso en el backend
        const updateProgress = async () => {
            try {
                if (!lessonData.value)
                    return;
                const totalRetos = lessonData.value.retos.length;
                const retosCompletados = currentRetoIndex.value + 1;
                const newProgress = Math.round((retosCompletados / totalRetos) * 100);
                await ProgressService.create({
                    userId: parseInt(userId),
                    lessonId: parseInt(route.params.id),
                    progress: newProgress
                });
                progress.value = newProgress;
                userProgress.value = newProgress;
            }
            catch (error) {
                console.error('Error updating progress:', error);
            }
        };
        // Continuar al siguiente reto
        const nextChallenge = async () => {
            if (!lessonData.value)
                return;
            showSuccess.value = false;
            currentRetoIndex.value++;
            if (currentRetoIndex.value < lessonData.value.retos.length) {
                currentReto.value = lessonData.value.retos[currentRetoIndex.value];
                commandHistory.value = [];
            }
            else {
                // Lección completada - Asegurar que se guarde al 100%
                try {
                    await ProgressService.create({
                        userId: parseInt(userId),
                        lessonId: parseInt(route.params.id),
                        progress: 100
                    });
                    progress.value = 100;
                    userProgress.value = 100;
                    // Actualizar datos del usuario en localStorage
                    await updateUserData();
                    // Mostrar animación de XP ganado
                    xpGained.value = lessonData.value.experiencia || 100;
                    showXPAnimation.value = true;
                    // Ocultar animación después de 3 segundos
                    setTimeout(() => {
                        showXPAnimation.value = false;
                    }, 3000);
                }
                catch (error) {
                    console.error('Error updating final progress:', error);
                }
                successMessage.value = '¡Felicidades! Has completado toda la lección al 100%.';
                showSuccess.value = true;
                setTimeout(() => {
                    router.push('/dashboard');
                }, 4000); // Aumentado a 4 segundos para dar tiempo a ver la animación
            }
        };
        // API URL usando la configuración centralizada
        const WS_URL = import.meta.env.MODE === 'production' ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:3000');
        console.log('🔌 Conectando al WebSocket:', WS_URL);
        console.log('👤 User ID:', userId);
        // Terminal - conectar con autenticación
        const socket = io(WS_URL, {
            auth: {
                userId: userId
            },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5
        });
        let terminal = null;
        let fitAddon = null;
        onMounted(async () => {
            // Esperar a que el DOM esté listo PRIMERO
            await nextTick();
            if (!terminalContainer.value) {
                console.error('Terminal container not found!');
                return;
            }
            // Crear instancia de xterm ANTES de cargar los datos
            // Detectar si es móvil
            const isMobile = window.innerWidth <= 768;
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
            });
            // Addons
            fitAddon = new FitAddon();
            terminal.loadAddon(fitAddon);
            terminal.loadAddon(new WebLinksAddon());
            // Montar terminal en el DOM
            terminal.open(terminalContainer.value);
            // Ajustar tamaño
            fitAddon.fit();
            // Enfocar la terminal automáticamente en móviles cuando se toca el contenedor
            const focusTerminal = () => {
                if (terminal) {
                    terminal.focus();
                }
            };
            if (terminalContainer.value) {
                terminalContainer.value.addEventListener('click', focusTerminal);
                terminalContainer.value.addEventListener('touchstart', focusTerminal, { passive: true });
            }
            // Enfocar la terminal inmediatamente
            setTimeout(() => {
                terminal?.focus();
            }, 500);
            // Manejar input del usuario
            terminal.onData((data) => {
                captureCommand(data);
                socket.emit('input', data);
            });
            // Conexión establecida
            socket.on('connect', () => {
                console.log('✅ Socket conectado');
                isConnected.value = true;
                terminalTitle.value = 'Terminal SSH';
            });
            // Desconexión
            socket.on('disconnect', (reason) => {
                console.log('❌ Socket desconectado:', reason);
                isConnected.value = false;
                terminalTitle.value = 'Desconectado';
            });
            // Error de conexión
            socket.on('connect_error', (error) => {
                console.error('🔴 Error de conexión:', error.message);
                isConnected.value = false;
                terminalTitle.value = 'Error de conexión';
            });
            // Recibir output del servidor
            socket.on('output', (data) => {
                terminal?.write(data);
            });
            // Redimensionar terminal cuando cambia el tamaño de la ventana
            const handleResize = () => {
                if (fitAddon && terminal) {
                    // Pequeño delay para que el DOM se actualice primero
                    setTimeout(() => {
                        fitAddon?.fit();
                        // Enviar nuevo tamaño al servidor
                        if (terminal) {
                            socket.emit('resize', {
                                cols: terminal.cols,
                                rows: terminal.rows
                            });
                        }
                    }, 100);
                }
            };
            window.addEventListener('resize', handleResize);
            // Enviar tamaño inicial al servidor (con delay para asegurar renderizado)
            setTimeout(() => {
                if (fitAddon && terminal) {
                    fitAddon.fit();
                    socket.emit('resize', {
                        cols: terminal.cols,
                        rows: terminal.rows
                    });
                }
            }, 200);
            // AHORA cargar la lección después de que la terminal esté lista
            await loadLesson();
        });
        // Cleanup fuera de onMounted
        onUnmounted(() => {
            window.removeEventListener('resize', () => { });
            terminal?.dispose();
            socket.disconnect();
        });
        const toggleHint = () => {
            showHint.value = !showHint.value;
        };
        const clearTerminal = () => {
            terminal?.clear();
        };
        const sendTab = () => {
            socket.emit('input', '\t');
        };
        const sendCtrlC = () => {
            socket.emit('input', '\x03'); // Ctrl+C - interrumpir proceso
        };
        const sendCtrlX = () => {
            socket.emit('input', '\x18'); // Ctrl+X - salir de nano
        };
        const sendCtrlS = () => {
            socket.emit('input', '\x13'); // Ctrl+S - guardar (en algunos editores)
        };
        const sendCtrlZ = () => {
            socket.emit('input', '\x1a'); // Ctrl+Z - suspender proceso
        };
        const sendCtrlD = () => {
            socket.emit('input', '\x04'); // Ctrl+D - EOF / salir shell
        };
        // Navegación
        const goBack = () => router.push('/dashboard');
        const goInicio = () => router.push('/dashboard');
        const goBiblioteca = () => router.push('/biblioteca');
        const goRanking = () => router.push('/ranking');
        const goConfig = () => router.push('/configuracion');
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
        };
    },
});
const __VLS_self = (await import('vue')).defineComponent({
    name: 'Leccion',
    components: { Header, Footer, XPGainedAnimation },
    setup() {
        const router = useRouter();
        const route = useRoute();
        // Obtener userId del token (REQUERIDO para terminal)
        const userId = getUserIdForTerminal();
        // Estado de la terminal
        const isConnected = ref(false);
        const terminalTitle = ref('Conectando...');
        const terminalContainer = ref(null);
        // UI state (lesson, hints, progress)
        const showHint = ref(false);
        const progress = ref(0);
        const lessonData = ref(null);
        const currentRetoIndex = ref(0);
        const commandHistory = ref([]);
        const lastCommand = ref('');
        const isVerifying = ref(false);
        const showSuccess = ref(false);
        const successMessage = ref('');
        const showError = ref(false);
        const errorMessage = ref('');
        const userProgress = ref(0);
        // XP Animation
        const showXPAnimation = ref(false);
        const xpGained = ref(0);
        // ❌ Redirigir a login si no está autenticado
        if (!userId) {
            console.warn('No authenticated user - redirecting to login');
            router.push('/login');
            // Retornar objeto mínimo para evitar errores
            return {
                terminalContainer,
                showHint,
                toggleHint: () => { },
                progress,
                lessonData,
                currentReto: ref(null),
                goBack: () => { },
                goInicio: () => { },
                goBiblioteca: () => { },
                goRanking: () => { },
                goConfig: () => { },
                isConnected,
                terminalTitle,
                clearTerminal: () => { },
                verifyCommand: () => { },
                nextChallenge: () => { },
                showSuccess,
                successMessage,
                showError,
                errorMessage,
                isVerifying,
            };
        }
        // Computed: Reto actual
        const currentReto = ref(null);
        // Cargar lección desde el backend
        const loadLesson = async () => {
            try {
                const lessonId = route.params.id;
                const data = await LessonService.getById(parseInt(lessonId));
                lessonData.value = data;
                // Cargar progreso del usuario ANTES de asignar el reto inicial
                await loadUserProgress();
                // Si no hay progreso cargado, empezar desde el primer reto
                if (!currentReto.value && data.retos && data.retos.length > 0) {
                    currentReto.value = data.retos[0];
                    currentRetoIndex.value = 0;
                }
            }
            catch (error) {
                console.error('Error loading lesson:', error);
                errorMessage.value = 'No se pudo cargar la lección';
                showError.value = true;
                setTimeout(() => showError.value = false, 3000);
            }
        };
        // Actualizar datos del usuario en localStorage
        const updateUserData = async () => {
            try {
                const userData = await UserService.getById(parseInt(userId));
                // Actualizar localStorage con los nuevos datos
                const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                const updatedUser = {
                    ...currentUser,
                    experiencia: userData.experiencia,
                    racha: userData.racha
                };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                // Emitir evento para que el Header se actualice
                window.dispatchEvent(new CustomEvent('userUpdated', { detail: updatedUser }));
                console.log(`✅ Usuario actualizado: ${userData.experiencia} XP`);
            }
            catch (error) {
                console.error('Error updating user data:', error);
            }
        };
        // Cargar progreso del usuario
        const loadUserProgress = async () => {
            try {
                const progressData = await ProgressService.getByUserAndLesson(parseInt(userId), parseInt(route.params.id));
                if (progressData && progressData.length > 0) {
                    const savedProgress = progressData[0].progreso;
                    userProgress.value = savedProgress;
                    progress.value = savedProgress;
                    // Si el progreso es 100%, empezar desde el inicio
                    if (savedProgress >= 100) {
                        console.log('Lección ya completada, reiniciando desde el inicio');
                        currentRetoIndex.value = 0;
                        if (lessonData.value && lessonData.value.retos[0]) {
                            currentReto.value = lessonData.value.retos[0];
                        }
                        // No reiniciar el progreso, mantenerlo en 100%
                        return;
                    }
                    // Calcular qué reto mostrar basado en el progreso (solo si no está completado)
                    if (lessonData.value && lessonData.value.retos.length > 0) {
                        const totalRetos = lessonData.value.retos.length;
                        // Calcular índice: progreso 0-99% → reto correspondiente
                        const retoIndex = Math.floor((savedProgress / 100) * totalRetos);
                        // Asegurar que no exceda el límite
                        currentRetoIndex.value = Math.min(retoIndex, totalRetos - 1);
                        currentReto.value = lessonData.value.retos[currentRetoIndex.value];
                        console.log(`Progreso cargado: ${savedProgress}%, mostrando reto ${currentRetoIndex.value + 1} de ${totalRetos}`);
                    }
                }
                else {
                    // Sin progreso guardado, empezar desde 0
                    console.log('Sin progreso guardado, empezando desde el inicio');
                    currentRetoIndex.value = 0;
                    progress.value = 0;
                }
            }
            catch (error) {
                console.error('Error loading progress:', error);
            }
        };
        // Capturar último comando ejecutado
        const captureCommand = (data) => {
            if (data === '\r') {
                // Enter pressed - comando completo
                const cmd = lastCommand.value.trim();
                if (cmd) {
                    commandHistory.value.push(cmd);
                    // Verificar automáticamente cuando presiona Enter
                    setTimeout(() => {
                        verifyCommand();
                    }, 500); // Pequeño delay para dar tiempo a la terminal de procesar
                }
                lastCommand.value = '';
            }
            else if (data === '\x7F') {
                // Backspace
                lastCommand.value = lastCommand.value.slice(0, -1);
            }
            else if (data.charCodeAt(0) >= 32 && data.charCodeAt(0) <= 126) {
                // Caracter imprimible
                lastCommand.value += data;
            }
        };
        // Verificar comando (solo para tipo='reto')
        const verifyCommand = async () => {
            // No verificar si es una explicación
            if (!currentReto.value || currentReto.value.tipo === 'explicacion')
                return;
            if (isVerifying.value || showSuccess.value)
                return;
            isVerifying.value = true;
            // Obtener el último comando ejecutado
            const lastCmd = commandHistory.value[commandHistory.value.length - 1];
            if (!lastCmd) {
                isVerifying.value = false;
                return;
            }
            const expectedCommands = currentReto.value.comandos.map(c => c.comando.toLowerCase().trim());
            // Verificar si el último comando coincide
            const cmdClean = lastCmd.toLowerCase().trim();
            const isCorrect = expectedCommands.some(expected => cmdClean === expected || cmdClean.includes(expected));
            if (isCorrect) {
                successMessage.value = currentReto.value.Retroalimentacion || '¡Correcto! Comando ejecutado exitosamente.';
                showSuccess.value = true;
                showError.value = false;
                // Actualizar progreso en el backend
                await updateProgress();
            }
            else {
                // No mostrar error, solo quedarse en silencio
                // El usuario puede intentar de nuevo
            }
            isVerifying.value = false;
        };
        // Actualizar progreso en el backend
        const updateProgress = async () => {
            try {
                if (!lessonData.value)
                    return;
                const totalRetos = lessonData.value.retos.length;
                const retosCompletados = currentRetoIndex.value + 1;
                const newProgress = Math.round((retosCompletados / totalRetos) * 100);
                await ProgressService.create({
                    userId: parseInt(userId),
                    lessonId: parseInt(route.params.id),
                    progress: newProgress
                });
                progress.value = newProgress;
                userProgress.value = newProgress;
            }
            catch (error) {
                console.error('Error updating progress:', error);
            }
        };
        // Continuar al siguiente reto
        const nextChallenge = async () => {
            if (!lessonData.value)
                return;
            showSuccess.value = false;
            currentRetoIndex.value++;
            if (currentRetoIndex.value < lessonData.value.retos.length) {
                currentReto.value = lessonData.value.retos[currentRetoIndex.value];
                commandHistory.value = [];
            }
            else {
                // Lección completada - Asegurar que se guarde al 100%
                try {
                    await ProgressService.create({
                        userId: parseInt(userId),
                        lessonId: parseInt(route.params.id),
                        progress: 100
                    });
                    progress.value = 100;
                    userProgress.value = 100;
                    // Actualizar datos del usuario en localStorage
                    await updateUserData();
                    // Mostrar animación de XP ganado
                    xpGained.value = lessonData.value.experiencia || 100;
                    showXPAnimation.value = true;
                    // Ocultar animación después de 3 segundos
                    setTimeout(() => {
                        showXPAnimation.value = false;
                    }, 3000);
                }
                catch (error) {
                    console.error('Error updating final progress:', error);
                }
                successMessage.value = '¡Felicidades! Has completado toda la lección al 100%.';
                showSuccess.value = true;
                setTimeout(() => {
                    router.push('/dashboard');
                }, 4000); // Aumentado a 4 segundos para dar tiempo a ver la animación
            }
        };
        // API URL usando la configuración centralizada
        const WS_URL = import.meta.env.MODE === 'production' ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:3000');
        console.log('🔌 Conectando al WebSocket:', WS_URL);
        console.log('👤 User ID:', userId);
        // Terminal - conectar con autenticación
        const socket = io(WS_URL, {
            auth: {
                userId: userId
            },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5
        });
        let terminal = null;
        let fitAddon = null;
        onMounted(async () => {
            // Esperar a que el DOM esté listo PRIMERO
            await nextTick();
            if (!terminalContainer.value) {
                console.error('Terminal container not found!');
                return;
            }
            // Crear instancia de xterm ANTES de cargar los datos
            // Detectar si es móvil
            const isMobile = window.innerWidth <= 768;
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
            });
            // Addons
            fitAddon = new FitAddon();
            terminal.loadAddon(fitAddon);
            terminal.loadAddon(new WebLinksAddon());
            // Montar terminal en el DOM
            terminal.open(terminalContainer.value);
            // Ajustar tamaño
            fitAddon.fit();
            // Enfocar la terminal automáticamente en móviles cuando se toca el contenedor
            const focusTerminal = () => {
                if (terminal) {
                    terminal.focus();
                }
            };
            if (terminalContainer.value) {
                terminalContainer.value.addEventListener('click', focusTerminal);
                terminalContainer.value.addEventListener('touchstart', focusTerminal, { passive: true });
            }
            // Enfocar la terminal inmediatamente
            setTimeout(() => {
                terminal?.focus();
            }, 500);
            // Manejar input del usuario
            terminal.onData((data) => {
                captureCommand(data);
                socket.emit('input', data);
            });
            // Conexión establecida
            socket.on('connect', () => {
                console.log('✅ Socket conectado');
                isConnected.value = true;
                terminalTitle.value = 'Terminal SSH';
            });
            // Desconexión
            socket.on('disconnect', (reason) => {
                console.log('❌ Socket desconectado:', reason);
                isConnected.value = false;
                terminalTitle.value = 'Desconectado';
            });
            // Error de conexión
            socket.on('connect_error', (error) => {
                console.error('🔴 Error de conexión:', error.message);
                isConnected.value = false;
                terminalTitle.value = 'Error de conexión';
            });
            // Recibir output del servidor
            socket.on('output', (data) => {
                terminal?.write(data);
            });
            // Redimensionar terminal cuando cambia el tamaño de la ventana
            const handleResize = () => {
                if (fitAddon && terminal) {
                    // Pequeño delay para que el DOM se actualice primero
                    setTimeout(() => {
                        fitAddon?.fit();
                        // Enviar nuevo tamaño al servidor
                        if (terminal) {
                            socket.emit('resize', {
                                cols: terminal.cols,
                                rows: terminal.rows
                            });
                        }
                    }, 100);
                }
            };
            window.addEventListener('resize', handleResize);
            // Enviar tamaño inicial al servidor (con delay para asegurar renderizado)
            setTimeout(() => {
                if (fitAddon && terminal) {
                    fitAddon.fit();
                    socket.emit('resize', {
                        cols: terminal.cols,
                        rows: terminal.rows
                    });
                }
            }, 200);
            // AHORA cargar la lección después de que la terminal esté lista
            await loadLesson();
        });
        // Cleanup fuera de onMounted
        onUnmounted(() => {
            window.removeEventListener('resize', () => { });
            terminal?.dispose();
            socket.disconnect();
        });
        const toggleHint = () => {
            showHint.value = !showHint.value;
        };
        const clearTerminal = () => {
            terminal?.clear();
        };
        const sendTab = () => {
            socket.emit('input', '\t');
        };
        const sendCtrlC = () => {
            socket.emit('input', '\x03'); // Ctrl+C - interrumpir proceso
        };
        const sendCtrlX = () => {
            socket.emit('input', '\x18'); // Ctrl+X - salir de nano
        };
        const sendCtrlS = () => {
            socket.emit('input', '\x13'); // Ctrl+S - guardar (en algunos editores)
        };
        const sendCtrlZ = () => {
            socket.emit('input', '\x1a'); // Ctrl+Z - suspender proceso
        };
        const sendCtrlD = () => {
            socket.emit('input', '\x04'); // Ctrl+D - EOF / salir shell
        };
        // Navegación
        const goBack = () => router.push('/dashboard');
        const goInicio = () => router.push('/dashboard');
        const goBiblioteca = () => router.push('/biblioteca');
        const goRanking = () => router.push('/ranking');
        const goConfig = () => router.push('/configuracion');
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
        };
    },
});
const __VLS_ctx = {};
let __VLS_elements;
const __VLS_componentsOption = { Header, Footer, XPGainedAnimation };
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['explicacion-content']} */ ;
/** @type {__VLS_StyleScopedClasses['explicacion-content']} */ ;
/** @type {__VLS_StyleScopedClasses['explicacion-content']} */ ;
/** @type {__VLS_StyleScopedClasses['explicacion-content']} */ ;
/** @type {__VLS_StyleScopedClasses['explicacion-content']} */ ;
/** @type {__VLS_StyleScopedClasses['hint-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['hint']} */ ;
/** @type {__VLS_StyleScopedClasses['verify-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['verify-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['verify-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['continue-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['continue-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['terminal-section']} */ ;
/** @type {__VLS_StyleScopedClasses['dot']} */ ;
/** @type {__VLS_StyleScopedClasses['dot']} */ ;
/** @type {__VLS_StyleScopedClasses['dot']} */ ;
/** @type {__VLS_StyleScopedClasses['status-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['terminal-container']} */ ;
/** @type {__VLS_StyleScopedClasses['terminal-container']} */ ;
/** @type {__VLS_StyleScopedClasses['terminal-container']} */ ;
/** @type {__VLS_StyleScopedClasses['terminal-container']} */ ;
/** @type {__VLS_StyleScopedClasses['shortcut-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['leccion']} */ ;
/** @type {__VLS_StyleScopedClasses['content']} */ ;
/** @type {__VLS_StyleScopedClasses['lesson-title']} */ ;
/** @type {__VLS_StyleScopedClasses['lesson-header']} */ ;
/** @type {__VLS_StyleScopedClasses['content']} */ ;
/** @type {__VLS_StyleScopedClasses['terminal-section']} */ ;
/** @type {__VLS_StyleScopedClasses['hidden-section']} */ ;
/** @type {__VLS_StyleScopedClasses['terminal-section']} */ ;
/** @type {__VLS_StyleScopedClasses['challenge-section']} */ ;
/** @type {__VLS_StyleScopedClasses['content']} */ ;
/** @type {__VLS_StyleScopedClasses['terminal-section']} */ ;
/** @type {__VLS_StyleScopedClasses['hidden-section']} */ ;
/** @type {__VLS_StyleScopedClasses['challenge-section']} */ ;
/** @type {__VLS_StyleScopedClasses['content']} */ ;
/** @type {__VLS_StyleScopedClasses['terminal-section']} */ ;
/** @type {__VLS_StyleScopedClasses['challenge-section']} */ ;
/** @type {__VLS_StyleScopedClasses['terminal-container']} */ ;
/** @type {__VLS_StyleScopedClasses['terminal-container']} */ ;
/** @type {__VLS_StyleScopedClasses['xterm']} */ ;
/** @type {__VLS_StyleScopedClasses['challenge-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['challenge-title']} */ ;
/** @type {__VLS_StyleScopedClasses['challenge-description']} */ ;
/** @type {__VLS_StyleScopedClasses['verify-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['continue-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['hint-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-section']} */ ;
/** @type {__VLS_StyleScopedClasses['content']} */ ;
/** @type {__VLS_StyleScopedClasses['terminal-section']} */ ;
/** @type {__VLS_StyleScopedClasses['hidden-section']} */ ;
/** @type {__VLS_StyleScopedClasses['terminal-container']} */ ;
/** @type {__VLS_StyleScopedClasses['terminal-container']} */ ;
/** @type {__VLS_StyleScopedClasses['xterm']} */ ;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "leccion" },
});
const __VLS_0 = {}.Header;
/** @type {[typeof __VLS_components.Header, ]} */ ;
// @ts-ignore
Header;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const __VLS_5 = {}.XPGainedAnimation;
/** @type {[typeof __VLS_components.XPGainedAnimation, ]} */ ;
// @ts-ignore
XPGainedAnimation;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    show: (__VLS_ctx.showXPAnimation),
    xpAmount: (__VLS_ctx.xpGained ?? 0),
}));
const __VLS_7 = __VLS_6({
    show: (__VLS_ctx.showXPAnimation),
    xpAmount: (__VLS_ctx.xpGained ?? 0),
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
// @ts-ignore
[showXPAnimation, xpGained,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "content" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "lesson-header" },
});
__VLS_asFunctionalElement(__VLS_elements.h1, __VLS_elements.h1)({
    ...{ class: "lesson-title" },
});
(__VLS_ctx.lessonData?.Titulo || 'Cargando...');
// @ts-ignore
[lessonData,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "challenge-section" },
});
if (__VLS_ctx.currentReto) {
    // @ts-ignore
    [currentReto,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "challenge-panel" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({
        ...{ class: "challenge-title" },
    });
    (__VLS_ctx.currentReto.tipo === 'explicacion' ? '📚' : '🎯');
    (__VLS_ctx.currentReto.tipo === 'explicacion' ? 'Explicación' : 'Reto');
    ((__VLS_ctx.lessonData?.retos.findIndex(r => r.id_Reto === __VLS_ctx.currentReto?.id_Reto) || 0) + 1);
    (__VLS_ctx.lessonData?.retos.length || 0);
    // @ts-ignore
    [lessonData, lessonData, currentReto, currentReto, currentReto,];
    if (__VLS_ctx.currentReto.tipo === 'explicacion') {
        // @ts-ignore
        [currentReto,];
        __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({
            ...{ class: "explicacion-title" },
        });
        (__VLS_ctx.currentReto.descripcion);
        // @ts-ignore
        [currentReto,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "explicacion-content" },
        });
        __VLS_asFunctionalDirective(__VLS_directives.vHtml)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.currentReto.contenido) }, null, null);
        // @ts-ignore
        [currentReto,];
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
            ...{ onClick: (__VLS_ctx.nextChallenge) },
            ...{ class: "continue-btn" },
        });
        // @ts-ignore
        [nextChallenge,];
    }
    else {
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
            ...{ class: "challenge-description" },
        });
        (__VLS_ctx.currentReto.descripcion);
        // @ts-ignore
        [currentReto,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "hint-section" },
        });
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
            ...{ onClick: (__VLS_ctx.toggleHint) },
            ...{ class: "hint-btn" },
        });
        // @ts-ignore
        [toggleHint,];
        (__VLS_ctx.showHint ? 'Ocultar pista' : 'Ver pista');
        // @ts-ignore
        [showHint,];
        if (__VLS_ctx.showHint) {
            // @ts-ignore
            [showHint,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                ...{ class: "hint" },
            });
            for (const [cmd] of __VLS_getVForSourceType((__VLS_ctx.currentReto.comandos))) {
                // @ts-ignore
                [currentReto,];
                __VLS_asFunctionalElement(__VLS_elements.code, __VLS_elements.code)({
                    key: (cmd.id_Comando),
                });
                (cmd.comando);
            }
        }
        if (__VLS_ctx.showSuccess) {
            // @ts-ignore
            [showSuccess,];
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                ...{ class: "success-message" },
            });
            (__VLS_ctx.successMessage);
            // @ts-ignore
            [successMessage,];
        }
        if (__VLS_ctx.showSuccess) {
            // @ts-ignore
            [showSuccess,];
            __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
                ...{ onClick: (__VLS_ctx.nextChallenge) },
                ...{ class: "continue-btn" },
            });
            // @ts-ignore
            [nextChallenge,];
        }
        else {
            __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
                ...{ onClick: (__VLS_ctx.verifyCommand) },
                ...{ class: "verify-btn" },
                disabled: (__VLS_ctx.isVerifying),
            });
            // @ts-ignore
            [verifyCommand, isVerifying,];
            (__VLS_ctx.isVerifying ? 'Verificando...' : 'Verificar ✓');
            // @ts-ignore
            [isVerifying,];
        }
    }
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "progress-section" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "progress-label" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "progress-bar" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "progress-fill" },
    ...{ style: (`width: ${__VLS_ctx.progress}%`) },
});
// @ts-ignore
[progress,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "progress-text" },
});
(__VLS_ctx.progress);
// @ts-ignore
[progress,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "terminal-section" },
    ...{ class: ({ 'hidden-section': __VLS_ctx.currentReto?.tipo === 'explicacion' }) },
});
// @ts-ignore
[currentReto,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "terminal-wrapper" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "terminal-header" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "terminal-controls" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "dot red" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "dot yellow" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "dot green" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "terminal-title" },
});
(__VLS_ctx.terminalTitle);
// @ts-ignore
[terminalTitle,];
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "status-dot" },
    ...{ class: ({ connected: __VLS_ctx.isConnected }) },
});
// @ts-ignore
[isConnected,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ref: "terminalContainer",
    ...{ class: "terminal-container" },
});
/** @type {typeof __VLS_ctx.terminalContainer} */ ;
// @ts-ignore
[terminalContainer,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "terminal-shortcuts" },
});
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.sendTab) },
    ...{ class: "shortcut-btn" },
});
// @ts-ignore
[sendTab,];
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.sendCtrlC) },
    ...{ class: "shortcut-btn" },
});
// @ts-ignore
[sendCtrlC,];
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.sendCtrlX) },
    ...{ class: "shortcut-btn" },
});
// @ts-ignore
[sendCtrlX,];
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.sendCtrlS) },
    ...{ class: "shortcut-btn" },
});
// @ts-ignore
[sendCtrlS,];
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.sendCtrlZ) },
    ...{ class: "shortcut-btn" },
});
// @ts-ignore
[sendCtrlZ,];
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.sendCtrlD) },
    ...{ class: "shortcut-btn" },
});
// @ts-ignore
[sendCtrlD,];
const __VLS_10 = {}.Footer;
/** @type {[typeof __VLS_components.Footer, ]} */ ;
// @ts-ignore
Footer;
// @ts-ignore
const __VLS_11 = __VLS_asFunctionalComponent(__VLS_10, new __VLS_10({
    goInicio: (__VLS_ctx.goInicio),
    goBiblioteca: (__VLS_ctx.goBiblioteca),
    goRanking: (__VLS_ctx.goRanking),
    goConfig: (__VLS_ctx.goConfig),
}));
const __VLS_12 = __VLS_11({
    goInicio: (__VLS_ctx.goInicio),
    goBiblioteca: (__VLS_ctx.goBiblioteca),
    goRanking: (__VLS_ctx.goRanking),
    goConfig: (__VLS_ctx.goConfig),
}, ...__VLS_functionalComponentArgsRest(__VLS_11));
// @ts-ignore
[goInicio, goBiblioteca, goRanking, goConfig,];
/** @type {__VLS_StyleScopedClasses['leccion']} */ ;
/** @type {__VLS_StyleScopedClasses['content']} */ ;
/** @type {__VLS_StyleScopedClasses['lesson-header']} */ ;
/** @type {__VLS_StyleScopedClasses['lesson-title']} */ ;
/** @type {__VLS_StyleScopedClasses['challenge-section']} */ ;
/** @type {__VLS_StyleScopedClasses['challenge-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['challenge-title']} */ ;
/** @type {__VLS_StyleScopedClasses['explicacion-title']} */ ;
/** @type {__VLS_StyleScopedClasses['explicacion-content']} */ ;
/** @type {__VLS_StyleScopedClasses['continue-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['challenge-description']} */ ;
/** @type {__VLS_StyleScopedClasses['hint-section']} */ ;
/** @type {__VLS_StyleScopedClasses['hint-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['hint']} */ ;
/** @type {__VLS_StyleScopedClasses['success-message']} */ ;
/** @type {__VLS_StyleScopedClasses['continue-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['verify-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-section']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-label']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-fill']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-text']} */ ;
/** @type {__VLS_StyleScopedClasses['terminal-section']} */ ;
/** @type {__VLS_StyleScopedClasses['hidden-section']} */ ;
/** @type {__VLS_StyleScopedClasses['terminal-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['terminal-header']} */ ;
/** @type {__VLS_StyleScopedClasses['terminal-controls']} */ ;
/** @type {__VLS_StyleScopedClasses['dot']} */ ;
/** @type {__VLS_StyleScopedClasses['red']} */ ;
/** @type {__VLS_StyleScopedClasses['dot']} */ ;
/** @type {__VLS_StyleScopedClasses['yellow']} */ ;
/** @type {__VLS_StyleScopedClasses['dot']} */ ;
/** @type {__VLS_StyleScopedClasses['green']} */ ;
/** @type {__VLS_StyleScopedClasses['terminal-title']} */ ;
/** @type {__VLS_StyleScopedClasses['status-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['connected']} */ ;
/** @type {__VLS_StyleScopedClasses['terminal-container']} */ ;
/** @type {__VLS_StyleScopedClasses['terminal-shortcuts']} */ ;
/** @type {__VLS_StyleScopedClasses['shortcut-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['shortcut-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['shortcut-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['shortcut-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['shortcut-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['shortcut-btn']} */ ;
export default {};
