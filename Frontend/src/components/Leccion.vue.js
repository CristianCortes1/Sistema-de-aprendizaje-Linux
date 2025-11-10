import { defineComponent, ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { io } from 'socket.io-client';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import 'xterm/css/xterm.css';
import Header from './Header.vue';
import Footer from './Footer.vue';
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
    components: { Header, Footer },
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
        const progress = ref(30);
        const lesson = ref({
            title: 'Leccion 1: comandos basicos',
            challenge: {
                title: 'Challenge 1: Change Directory',
                description: 'Use the cd command to navigate to the "documents" directory. Type your command in the terminal and press "Run" to check your answer.',
                hint: 'The command is cd documents',
                correctCommand: 'cd documents',
                directory: '~'
            }
        });
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
                lesson,
                goBack: () => { },
                goInicio: () => { },
                goBiblioteca: () => { },
                goRanking: () => { },
                goConfig: () => { },
                isConnected,
                terminalTitle,
                clearTerminal: () => { },
            };
        }
        // API URL usando la configuración centralizada
        const WS_URL = import.meta.env.MODE === 'production' ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:3000');
        // Terminal - conectar con autenticación
        const socket = io(WS_URL, {
            auth: {
                userId: userId
            }
        });
        let terminal = null;
        let fitAddon = null;
        onMounted(async () => {
            await nextTick();
            if (!terminalContainer.value)
                return;
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
            });
            // Addons
            fitAddon = new FitAddon();
            terminal.loadAddon(fitAddon);
            terminal.loadAddon(new WebLinksAddon());
            // Montar terminal en el DOM
            terminal.open(terminalContainer.value);
            // Ajustar tamaño según pantalla
            if (window.innerWidth <= 768) {
                // Móvil: reducir fuente para más columnas
                terminal.options.fontSize = 9;
            }
            fitAddon.fit();
            // Manejar input del usuario
            terminal.onData((data) => {
                socket.emit('input', data);
            });
            // Conexión establecida
            socket.on('connect', () => {
                isConnected.value = true;
                terminalTitle.value = 'Terminal SSH';
            });
            // Desconexión
            socket.on('disconnect', () => {
                isConnected.value = false;
                terminalTitle.value = 'Desconectado';
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
            // Cleanup
            onUnmounted(() => {
                window.removeEventListener('resize', handleResize);
                terminal?.dispose();
                socket.disconnect();
            });
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
        };
    },
});
const __VLS_self = (await import('vue')).defineComponent({
    name: 'Leccion',
    components: { Header, Footer },
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
        const progress = ref(30);
        const lesson = ref({
            title: 'Leccion 1: comandos basicos',
            challenge: {
                title: 'Challenge 1: Change Directory',
                description: 'Use the cd command to navigate to the "documents" directory. Type your command in the terminal and press "Run" to check your answer.',
                hint: 'The command is cd documents',
                correctCommand: 'cd documents',
                directory: '~'
            }
        });
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
                lesson,
                goBack: () => { },
                goInicio: () => { },
                goBiblioteca: () => { },
                goRanking: () => { },
                goConfig: () => { },
                isConnected,
                terminalTitle,
                clearTerminal: () => { },
            };
        }
        // API URL usando la configuración centralizada
        const WS_URL = import.meta.env.MODE === 'production' ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:3000');
        // Terminal - conectar con autenticación
        const socket = io(WS_URL, {
            auth: {
                userId: userId
            }
        });
        let terminal = null;
        let fitAddon = null;
        onMounted(async () => {
            await nextTick();
            if (!terminalContainer.value)
                return;
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
            });
            // Addons
            fitAddon = new FitAddon();
            terminal.loadAddon(fitAddon);
            terminal.loadAddon(new WebLinksAddon());
            // Montar terminal en el DOM
            terminal.open(terminalContainer.value);
            // Ajustar tamaño según pantalla
            if (window.innerWidth <= 768) {
                // Móvil: reducir fuente para más columnas
                terminal.options.fontSize = 9;
            }
            fitAddon.fit();
            // Manejar input del usuario
            terminal.onData((data) => {
                socket.emit('input', data);
            });
            // Conexión establecida
            socket.on('connect', () => {
                isConnected.value = true;
                terminalTitle.value = 'Terminal SSH';
            });
            // Desconexión
            socket.on('disconnect', () => {
                isConnected.value = false;
                terminalTitle.value = 'Desconectado';
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
            // Cleanup
            onUnmounted(() => {
                window.removeEventListener('resize', handleResize);
                terminal?.dispose();
                socket.disconnect();
            });
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
        };
    },
});
const __VLS_ctx = {};
let __VLS_elements;
const __VLS_componentsOption = { Header, Footer };
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['control']} */ ;
/** @type {__VLS_StyleScopedClasses['control']} */ ;
/** @type {__VLS_StyleScopedClasses['control']} */ ;
/** @type {__VLS_StyleScopedClasses['status-indicator']} */ ;
/** @type {__VLS_StyleScopedClasses['terminal-container']} */ ;
/** @type {__VLS_StyleScopedClasses['terminal-container']} */ ;
/** @type {__VLS_StyleScopedClasses['terminal-container']} */ ;
/** @type {__VLS_StyleScopedClasses['terminal-container']} */ ;
/** @type {__VLS_StyleScopedClasses['terminal-container']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['shortcut-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['hint-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['hint']} */ ;
/** @type {__VLS_StyleScopedClasses['leccion']} */ ;
/** @type {__VLS_StyleScopedClasses['content']} */ ;
/** @type {__VLS_StyleScopedClasses['lesson-content']} */ ;
/** @type {__VLS_StyleScopedClasses['lesson-header']} */ ;
/** @type {__VLS_StyleScopedClasses['lesson-title']} */ ;
/** @type {__VLS_StyleScopedClasses['terminal-section']} */ ;
/** @type {__VLS_StyleScopedClasses['terminal-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['terminal-header']} */ ;
/** @type {__VLS_StyleScopedClasses['terminal-controls']} */ ;
/** @type {__VLS_StyleScopedClasses['control']} */ ;
/** @type {__VLS_StyleScopedClasses['terminal-title']} */ ;
/** @type {__VLS_StyleScopedClasses['status-indicator']} */ ;
/** @type {__VLS_StyleScopedClasses['terminal-container']} */ ;
/** @type {__VLS_StyleScopedClasses['terminal-container']} */ ;
/** @type {__VLS_StyleScopedClasses['xterm']} */ ;
/** @type {__VLS_StyleScopedClasses['terminal-container']} */ ;
/** @type {__VLS_StyleScopedClasses['xterm-viewport']} */ ;
/** @type {__VLS_StyleScopedClasses['terminal-container']} */ ;
/** @type {__VLS_StyleScopedClasses['xterm-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['terminal-container']} */ ;
/** @type {__VLS_StyleScopedClasses['xterm-rows']} */ ;
/** @type {__VLS_StyleScopedClasses['terminal-container']} */ ;
/** @type {__VLS_StyleScopedClasses['terminal-container']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-controls']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['challenge-section']} */ ;
/** @type {__VLS_StyleScopedClasses['challenge-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['challenge-title']} */ ;
/** @type {__VLS_StyleScopedClasses['challenge-description']} */ ;
/** @type {__VLS_StyleScopedClasses['hint-section']} */ ;
/** @type {__VLS_StyleScopedClasses['hint-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['hint']} */ ;
/** @type {__VLS_StyleScopedClasses['hint']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-section']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-label']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-text']} */ ;
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
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "content" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "lesson-header" },
});
__VLS_asFunctionalElement(__VLS_elements.h1, __VLS_elements.h1)({
    ...{ class: "lesson-title" },
});
(__VLS_ctx.lesson.title);
// @ts-ignore
[lesson,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "lesson-content" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "terminal-section" },
});
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
    ...{ class: "control red" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "control yellow" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "control green" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "terminal-title" },
});
(__VLS_ctx.terminalTitle);
// @ts-ignore
[terminalTitle,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "connection-status" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "status-indicator" },
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
    ...{ class: "mobile-controls" },
});
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.sendTab) },
    ...{ class: "mobile-btn" },
    title: "Tab - Autocompletar",
});
// @ts-ignore
[sendTab,];
__VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)({
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    'stroke-width': "2",
});
__VLS_asFunctionalElement(__VLS_elements.path)({
    d: "M5 12h14M12 5l7 7-7 7",
});
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.sendCtrlC) },
    ...{ class: "mobile-btn shortcut-btn" },
    title: "Ctrl+C - Interrumpir proceso",
});
// @ts-ignore
[sendCtrlC,];
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.sendCtrlX) },
    ...{ class: "mobile-btn shortcut-btn" },
    title: "Ctrl+X - Salir de nano",
});
// @ts-ignore
[sendCtrlX,];
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.sendCtrlS) },
    ...{ class: "mobile-btn shortcut-btn" },
    title: "Ctrl+S - Guardar",
});
// @ts-ignore
[sendCtrlS,];
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.sendCtrlZ) },
    ...{ class: "mobile-btn shortcut-btn" },
    title: "Ctrl+Z - Suspender proceso",
});
// @ts-ignore
[sendCtrlZ,];
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.sendCtrlD) },
    ...{ class: "mobile-btn shortcut-btn" },
    title: "Ctrl+D - EOF / Salir",
});
// @ts-ignore
[sendCtrlD,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "challenge-section" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "challenge-panel" },
});
__VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({
    ...{ class: "challenge-title" },
});
(__VLS_ctx.lesson.challenge.title);
// @ts-ignore
[lesson,];
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
    ...{ class: "challenge-description" },
});
(__VLS_ctx.lesson.challenge.description);
// @ts-ignore
[lesson,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "hint-section" },
});
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.toggleHint) },
    ...{ class: "hint-btn" },
});
// @ts-ignore
[toggleHint,];
(__VLS_ctx.showHint ? 'Ocultar pista' : 'Mostrar pista');
// @ts-ignore
[showHint,];
if (__VLS_ctx.showHint) {
    // @ts-ignore
    [showHint,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "hint" },
    });
    __VLS_asFunctionalElement(__VLS_elements.code, __VLS_elements.code)({});
    (__VLS_ctx.lesson.challenge.hint);
    // @ts-ignore
    [lesson,];
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
const __VLS_5 = {}.Footer;
/** @type {[typeof __VLS_components.Footer, ]} */ ;
// @ts-ignore
Footer;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    goInicio: (__VLS_ctx.goInicio),
    goBiblioteca: (__VLS_ctx.goBiblioteca),
    goRanking: (__VLS_ctx.goRanking),
    goConfig: (__VLS_ctx.goConfig),
}));
const __VLS_7 = __VLS_6({
    goInicio: (__VLS_ctx.goInicio),
    goBiblioteca: (__VLS_ctx.goBiblioteca),
    goRanking: (__VLS_ctx.goRanking),
    goConfig: (__VLS_ctx.goConfig),
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
// @ts-ignore
[goInicio, goBiblioteca, goRanking, goConfig,];
/** @type {__VLS_StyleScopedClasses['leccion']} */ ;
/** @type {__VLS_StyleScopedClasses['content']} */ ;
/** @type {__VLS_StyleScopedClasses['lesson-header']} */ ;
/** @type {__VLS_StyleScopedClasses['lesson-title']} */ ;
/** @type {__VLS_StyleScopedClasses['lesson-content']} */ ;
/** @type {__VLS_StyleScopedClasses['terminal-section']} */ ;
/** @type {__VLS_StyleScopedClasses['terminal-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['terminal-header']} */ ;
/** @type {__VLS_StyleScopedClasses['terminal-controls']} */ ;
/** @type {__VLS_StyleScopedClasses['control']} */ ;
/** @type {__VLS_StyleScopedClasses['red']} */ ;
/** @type {__VLS_StyleScopedClasses['control']} */ ;
/** @type {__VLS_StyleScopedClasses['yellow']} */ ;
/** @type {__VLS_StyleScopedClasses['control']} */ ;
/** @type {__VLS_StyleScopedClasses['green']} */ ;
/** @type {__VLS_StyleScopedClasses['terminal-title']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-status']} */ ;
/** @type {__VLS_StyleScopedClasses['status-indicator']} */ ;
/** @type {__VLS_StyleScopedClasses['connected']} */ ;
/** @type {__VLS_StyleScopedClasses['terminal-container']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-controls']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['shortcut-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['shortcut-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['shortcut-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['shortcut-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['mobile-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['shortcut-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['challenge-section']} */ ;
/** @type {__VLS_StyleScopedClasses['challenge-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['challenge-title']} */ ;
/** @type {__VLS_StyleScopedClasses['challenge-description']} */ ;
/** @type {__VLS_StyleScopedClasses['hint-section']} */ ;
/** @type {__VLS_StyleScopedClasses['hint-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['hint']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-section']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-label']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-fill']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-text']} */ ;
export default {};
