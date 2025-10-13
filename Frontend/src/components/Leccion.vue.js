import { defineComponent, ref, onMounted, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { io } from 'socket.io-client';
import { AnsiUp } from 'ansi_up';
import Header from './Header.vue';
import Footer from './Footer.vue';
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_export = defineComponent({
    name: 'Leccion',
    components: { Header, Footer },
    setup() {
        const router = useRouter();
        const route = useRoute();
        // Terminal
        const socket = io('http://localhost:3000');
        const command = ref('');
        const output = ref('');
        const outputRef = ref(null);
        const ansi_up = new AnsiUp();
        // UI state (lesson, hints, progress)
        const showHint = ref(false);
        const progress = ref(30);
        const lesson = ref({
            title: 'Lesson 1: Basic Navigation',
            challenge: {
                title: 'Challenge 1: Change Directory',
                description: 'Use the cd command to navigate to the "documents" directory. Type your command in the terminal and press "Run" to check your answer.',
                hint: 'The command is cd documents',
                correctCommand: 'cd documents',
                directory: 'penguin@earth:~$'
            }
        });
        onMounted(() => {
            socket.on('output', async (data) => {
                const html = ansi_up.ansi_to_html(data);
                output.value += html;
                await nextTick();
                if (outputRef.value) {
                    outputRef.value.scrollTop = outputRef.value.scrollHeight;
                }
            });
        });
        const sendCommand = () => {
            if (!command.value.trim())
                return;
            socket.emit('input', command.value);
            output.value += `<span class='prompt'>penguin@earth:~$</span> ${command.value}<br>`;
            command.value = '';
        };
        const toggleHint = () => {
            showHint.value = !showHint.value;
        };
        // Navegación
        const goBack = () => router.push('/dashboard');
        const goInicio = () => router.push('/dashboard');
        const goBiblioteca = () => router.push('/biblioteca');
        const goRanking = () => router.push('/ranking');
        const goConfig = () => router.push('/configuracion');
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
        };
    },
});
const __VLS_self = (await import('vue')).defineComponent({
    name: 'Leccion',
    components: { Header, Footer },
    setup() {
        const router = useRouter();
        const route = useRoute();
        // Terminal
        const socket = io('http://localhost:3000');
        const command = ref('');
        const output = ref('');
        const outputRef = ref(null);
        const ansi_up = new AnsiUp();
        // UI state (lesson, hints, progress)
        const showHint = ref(false);
        const progress = ref(30);
        const lesson = ref({
            title: 'Lesson 1: Basic Navigation',
            challenge: {
                title: 'Challenge 1: Change Directory',
                description: 'Use the cd command to navigate to the "documents" directory. Type your command in the terminal and press "Run" to check your answer.',
                hint: 'The command is cd documents',
                correctCommand: 'cd documents',
                directory: 'penguin@earth:~$'
            }
        });
        onMounted(() => {
            socket.on('output', async (data) => {
                const html = ansi_up.ansi_to_html(data);
                output.value += html;
                await nextTick();
                if (outputRef.value) {
                    outputRef.value.scrollTop = outputRef.value.scrollHeight;
                }
            });
        });
        const sendCommand = () => {
            if (!command.value.trim())
                return;
            socket.emit('input', command.value);
            output.value += `<span class='prompt'>penguin@earth:~$</span> ${command.value}<br>`;
            command.value = '';
        };
        const toggleHint = () => {
            showHint.value = !showHint.value;
        };
        // Navegación
        const goBack = () => router.push('/dashboard');
        const goInicio = () => router.push('/dashboard');
        const goBiblioteca = () => router.push('/biblioteca');
        const goRanking = () => router.push('/ranking');
        const goConfig = () => router.push('/configuracion');
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
        };
    },
});
const __VLS_ctx = {};
let __VLS_elements;
const __VLS_componentsOption = { Header, Footer };
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['back-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['control']} */ ;
/** @type {__VLS_StyleScopedClasses['control']} */ ;
/** @type {__VLS_StyleScopedClasses['control']} */ ;
/** @type {__VLS_StyleScopedClasses['terminal-output']} */ ;
/** @type {__VLS_StyleScopedClasses['prompt']} */ ;
/** @type {__VLS_StyleScopedClasses['command-input']} */ ;
/** @type {__VLS_StyleScopedClasses['execute-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['hint-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['hint']} */ ;
/** @type {__VLS_StyleScopedClasses['lesson-content']} */ ;
/** @type {__VLS_StyleScopedClasses['lesson-header']} */ ;
/** @type {__VLS_StyleScopedClasses['lesson-title']} */ ;
/** @type {__VLS_StyleScopedClasses['terminal-body']} */ ;
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
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.goBack) },
    ...{ class: "back-btn" },
});
// @ts-ignore
[goBack,];
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
    ...{ class: "terminal" },
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
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "terminal-body" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "terminal-output" },
    ref: "outputRef",
});
__VLS_asFunctionalDirective(__VLS_directives.vHtml)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.output) }, null, null);
/** @type {typeof __VLS_ctx.outputRef} */ ;
// @ts-ignore
[output, outputRef,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "terminal-input" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "prompt" },
});
__VLS_asFunctionalElement(__VLS_elements.input)({
    ...{ onKeyup: (__VLS_ctx.sendCommand) },
    value: (__VLS_ctx.command),
    type: "text",
    ...{ class: "command-input" },
    placeholder: "Enter a command...",
});
// @ts-ignore
[sendCommand, command,];
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
/** @type {__VLS_StyleScopedClasses['back-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['lesson-title']} */ ;
/** @type {__VLS_StyleScopedClasses['lesson-content']} */ ;
/** @type {__VLS_StyleScopedClasses['terminal-section']} */ ;
/** @type {__VLS_StyleScopedClasses['terminal']} */ ;
/** @type {__VLS_StyleScopedClasses['terminal-header']} */ ;
/** @type {__VLS_StyleScopedClasses['terminal-controls']} */ ;
/** @type {__VLS_StyleScopedClasses['control']} */ ;
/** @type {__VLS_StyleScopedClasses['red']} */ ;
/** @type {__VLS_StyleScopedClasses['control']} */ ;
/** @type {__VLS_StyleScopedClasses['yellow']} */ ;
/** @type {__VLS_StyleScopedClasses['control']} */ ;
/** @type {__VLS_StyleScopedClasses['green']} */ ;
/** @type {__VLS_StyleScopedClasses['terminal-title']} */ ;
/** @type {__VLS_StyleScopedClasses['terminal-body']} */ ;
/** @type {__VLS_StyleScopedClasses['terminal-output']} */ ;
/** @type {__VLS_StyleScopedClasses['terminal-input']} */ ;
/** @type {__VLS_StyleScopedClasses['prompt']} */ ;
/** @type {__VLS_StyleScopedClasses['command-input']} */ ;
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
