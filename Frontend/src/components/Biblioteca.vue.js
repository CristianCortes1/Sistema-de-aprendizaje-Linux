import { useRouter } from 'vue-router';
import Header from './Header.vue';
import Footer from './Footer.vue';
import CommandService from '../services/CommandService';
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_export = (await import('vue')).defineComponent({
    name: 'Biblioteca',
    components: {
        Header,
        Footer
    },
    setup() {
        const router = useRouter();
        const goInicio = () => router.push('/dashboard');
        const goBiblioteca = () => router.push('/biblioteca');
        const goRanking = () => router.push('/ranking');
        const goConfig = () => router.push('/configuracion');
        return {
            goInicio,
            goBiblioteca,
            goRanking,
            goConfig
        };
    },
    data() {
        return {
            isLoading: false,
            error: '',
            commands: [],
            openCommandId: null,
        };
    },
    mounted() {
        this.fetchCommands();
    },
    methods: {
        async fetchCommands() {
            this.isLoading = true;
            this.error = '';
            try {
                const data = await CommandService.getAll();
                // Mapear resultados del backend al formato usado en la UI
                this.commands = (Array.isArray(data) ? data : []).map((d, i) => ({
                    id: d.id ?? d.id_Comando ?? `${d.comando}-${i}`,
                    comando: d.comando,
                    descripcion: d.descripcion || ''
                })).sort((a, b) => a.comando.localeCompare(b.comando));
            }
            catch (err) {
                console.error('Error cargando comandos:', err);
                this.error = 'No se pudieron cargar los comandos.';
                this.commands = [];
            }
            finally {
                this.isLoading = false;
            }
        },
        toggleDescripcion(cmd) {
            this.openCommandId = this.openCommandId === cmd.id ? null : cmd.id;
        },
    }
});
const __VLS_self = (await import('vue')).defineComponent({
    name: 'Biblioteca',
    components: {
        Header,
        Footer
    },
    setup() {
        const router = useRouter();
        const goInicio = () => router.push('/dashboard');
        const goBiblioteca = () => router.push('/biblioteca');
        const goRanking = () => router.push('/ranking');
        const goConfig = () => router.push('/configuracion');
        return {
            goInicio,
            goBiblioteca,
            goRanking,
            goConfig
        };
    },
    data() {
        return {
            isLoading: false,
            error: '',
            commands: [],
            openCommandId: null,
        };
    },
    mounted() {
        this.fetchCommands();
    },
    methods: {
        async fetchCommands() {
            this.isLoading = true;
            this.error = '';
            try {
                const data = await CommandService.getAll();
                // Mapear resultados del backend al formato usado en la UI
                this.commands = (Array.isArray(data) ? data : []).map((d, i) => ({
                    id: d.id ?? d.id_Comando ?? `${d.comando}-${i}`,
                    comando: d.comando,
                    descripcion: d.descripcion || ''
                })).sort((a, b) => a.comando.localeCompare(b.comando));
            }
            catch (err) {
                console.error('Error cargando comandos:', err);
                this.error = 'No se pudieron cargar los comandos.';
                this.commands = [];
            }
            finally {
                this.isLoading = false;
            }
        },
        toggleDescripcion(cmd) {
            this.openCommandId = this.openCommandId === cmd.id ? null : cmd.id;
        },
    }
});
const __VLS_ctx = {};
let __VLS_elements;
const __VLS_componentsOption = {
    Header,
    Footer
};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['logo']} */ ;
/** @type {__VLS_StyleScopedClasses['descripcion']} */ ;
/** @type {__VLS_StyleScopedClasses['descripcion']} */ ;
/** @type {__VLS_StyleScopedClasses['desc-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['desc-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['desc-text']} */ ;
/** @type {__VLS_StyleScopedClasses['footer']} */ ;
/** @type {__VLS_StyleScopedClasses['footer']} */ ;
/** @type {__VLS_StyleScopedClasses['footer']} */ ;
/** @type {__VLS_StyleScopedClasses['biblioteca']} */ ;
/** @type {__VLS_StyleScopedClasses['logo']} */ ;
/** @type {__VLS_StyleScopedClasses['brand']} */ ;
/** @type {__VLS_StyleScopedClasses['modulos']} */ ;
/** @type {__VLS_StyleScopedClasses['tablas-container']} */ ;
/** @type {__VLS_StyleScopedClasses['comandos-basicos']} */ ;
/** @type {__VLS_StyleScopedClasses['archivos-y-directorios']} */ ;
/** @type {__VLS_StyleScopedClasses['descripcion']} */ ;
/** @type {__VLS_StyleScopedClasses['desc-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['desc-header']} */ ;
/** @type {__VLS_StyleScopedClasses['cmd-label']} */ ;
/** @type {__VLS_StyleScopedClasses['desc-text']} */ ;
/** @type {__VLS_StyleScopedClasses['footer']} */ ;
/** @type {__VLS_StyleScopedClasses['footer']} */ ;
/** @type {__VLS_StyleScopedClasses['footer']} */ ;
/** @type {__VLS_StyleScopedClasses['footer']} */ ;
/** @type {__VLS_StyleScopedClasses['barra-inicio']} */ ;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "biblioteca" },
});
const __VLS_0 = {}.Header;
/** @type {[typeof __VLS_components.Header, ]} */ ;
// @ts-ignore
Header;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "modulos" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "tablas-container" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "comandos-basicos" },
    ...{ style: {} },
});
__VLS_asFunctionalElement(__VLS_elements.table, __VLS_elements.table)({});
__VLS_asFunctionalElement(__VLS_elements.thead, __VLS_elements.thead)({});
__VLS_asFunctionalElement(__VLS_elements.tr, __VLS_elements.tr)({});
__VLS_asFunctionalElement(__VLS_elements.th, __VLS_elements.th)({
    ...{ class: "titulo" },
});
__VLS_asFunctionalElement(__VLS_elements.tbody, __VLS_elements.tbody)({});
if (__VLS_ctx.isLoading || __VLS_ctx.error) {
    // @ts-ignore
    [isLoading, error,];
    __VLS_asFunctionalElement(__VLS_elements.tr, __VLS_elements.tr)({});
    __VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({});
    if (__VLS_ctx.isLoading) {
        // @ts-ignore
        [isLoading,];
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    }
    else {
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
        (__VLS_ctx.error);
        // @ts-ignore
        [error,];
    }
}
for (const [cmd] of __VLS_getVForSourceType((__VLS_ctx.commands))) {
    (cmd.id);
    // @ts-ignore
    [commands,];
    __VLS_asFunctionalElement(__VLS_elements.tr, __VLS_elements.tr)({});
    __VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.toggleDescripcion(cmd);
                // @ts-ignore
                [toggleDescripcion,];
            } },
    });
    (cmd.comando);
    if (__VLS_ctx.openCommandId === cmd.id) {
        // @ts-ignore
        [openCommandId,];
        __VLS_asFunctionalElement(__VLS_elements.tr, __VLS_elements.tr)({
            ...{ class: "descripcion" },
        });
        __VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({});
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "desc-wrapper" },
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "desc-header" },
        });
        __VLS_asFunctionalElement(__VLS_elements.strong, __VLS_elements.strong)({
            ...{ class: "cmd-label" },
        });
        (cmd.comando);
        if (cmd.descripcion && cmd.descripcion.trim()) {
            __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
                ...{ class: "desc-text" },
            });
            (cmd.descripcion);
        }
        else {
            __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
                ...{ class: "desc-text muted" },
            });
        }
    }
}
if (!__VLS_ctx.isLoading && __VLS_ctx.commands.length === 0 && !__VLS_ctx.error) {
    // @ts-ignore
    [isLoading, error, commands,];
    __VLS_asFunctionalElement(__VLS_elements.tr, __VLS_elements.tr)({});
    __VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({});
}
const __VLS_5 = {}.Footer;
/** @type {[typeof __VLS_components.Footer, ]} */ ;
// @ts-ignore
Footer;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    goInicio: (() => __VLS_ctx.$router.push('/dashboard')),
    goBiblioteca: (() => __VLS_ctx.$router.push('/biblioteca')),
    goRanking: (() => __VLS_ctx.$router.push('/ranking')),
    goConfig: (() => __VLS_ctx.$router.push('/configuracion')),
}));
const __VLS_7 = __VLS_6({
    goInicio: (() => __VLS_ctx.$router.push('/dashboard')),
    goBiblioteca: (() => __VLS_ctx.$router.push('/biblioteca')),
    goRanking: (() => __VLS_ctx.$router.push('/ranking')),
    goConfig: (() => __VLS_ctx.$router.push('/configuracion')),
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
// @ts-ignore
[$router, $router, $router, $router,];
/** @type {__VLS_StyleScopedClasses['biblioteca']} */ ;
/** @type {__VLS_StyleScopedClasses['modulos']} */ ;
/** @type {__VLS_StyleScopedClasses['tablas-container']} */ ;
/** @type {__VLS_StyleScopedClasses['comandos-basicos']} */ ;
/** @type {__VLS_StyleScopedClasses['titulo']} */ ;
/** @type {__VLS_StyleScopedClasses['descripcion']} */ ;
/** @type {__VLS_StyleScopedClasses['desc-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['desc-header']} */ ;
/** @type {__VLS_StyleScopedClasses['cmd-label']} */ ;
/** @type {__VLS_StyleScopedClasses['desc-text']} */ ;
/** @type {__VLS_StyleScopedClasses['desc-text']} */ ;
/** @type {__VLS_StyleScopedClasses['muted']} */ ;
export default {};
