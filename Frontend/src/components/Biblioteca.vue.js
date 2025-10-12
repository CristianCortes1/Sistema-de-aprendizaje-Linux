import { useRouter } from 'vue-router';
import Header from './Header.vue';
import Footer from './Footer.vue';
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
            descripciones: {
                ls: "Muestra el contenido de un directorio.",
                pwd: "Muestra el directorio actual del archivo.",
                cd: "Cambia el directorio de trabajo.",
                echo: "Muestra un mensaje o valor de variable.",
                clear: "Limpia la pantalla del terminal.",
                touch: "Crea un archivo vacío.",
                mkdir: "Crea un nuevo directorio.",
                rm: "Elimina archivos.",
                rmdir: "Elimina directorios vacíos.",
                cp: "Copia archivos o directorios.",
                mv: "Mueve o renombra archivos o directorios.",
                cat: "Muestra el contenido de un archivo.",
                nano: "Editor de texto en línea de comandos.",
                grep: "Busca texto dentro de archivos.",
                sudo: "Ejecuta comandos con privilegios de superusuario.",
                chmod: "Cambia los permisos de archivos o directorios."
            }
        };
    },
    methods: {
        toggleDescripcion(comando, event) {
            const row = event.target.closest('tr');
            const table = event.target.closest('table');
            // Si ya existe una descripción justo después, la eliminamos (cerrar)
            if (row.nextElementSibling && row.nextElementSibling.classList.contains('descripcion')) {
                row.nextElementSibling.remove();
                return;
            }
            // Remover cualquier otra descripción abierta
            table.querySelectorAll('.descripcion').forEach(r => r.remove());
            // Crear nueva descripción
            const descRow = document.createElement('tr');
            descRow.className = 'descripcion';
            const descCell = document.createElement('td');
            descCell.colSpan = 1; // Una sola columna ahora
            descCell.textContent = this.descripciones[comando] || 'Descripción no disponible.';
            descRow.appendChild(descCell);
            row.insertAdjacentElement('afterend', descRow);
        }
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
            descripciones: {
                ls: "Muestra el contenido de un directorio.",
                pwd: "Muestra el directorio actual del archivo.",
                cd: "Cambia el directorio de trabajo.",
                echo: "Muestra un mensaje o valor de variable.",
                clear: "Limpia la pantalla del terminal.",
                touch: "Crea un archivo vacío.",
                mkdir: "Crea un nuevo directorio.",
                rm: "Elimina archivos.",
                rmdir: "Elimina directorios vacíos.",
                cp: "Copia archivos o directorios.",
                mv: "Mueve o renombra archivos o directorios.",
                cat: "Muestra el contenido de un archivo.",
                nano: "Editor de texto en línea de comandos.",
                grep: "Busca texto dentro de archivos.",
                sudo: "Ejecuta comandos con privilegios de superusuario.",
                chmod: "Cambia los permisos de archivos o directorios."
            }
        };
    },
    methods: {
        toggleDescripcion(comando, event) {
            const row = event.target.closest('tr');
            const table = event.target.closest('table');
            // Si ya existe una descripción justo después, la eliminamos (cerrar)
            if (row.nextElementSibling && row.nextElementSibling.classList.contains('descripcion')) {
                row.nextElementSibling.remove();
                return;
            }
            // Remover cualquier otra descripción abierta
            table.querySelectorAll('.descripcion').forEach(r => r.remove());
            // Crear nueva descripción
            const descRow = document.createElement('tr');
            descRow.className = 'descripcion';
            const descCell = document.createElement('td');
            descCell.colSpan = 1; // Una sola columna ahora
            descCell.textContent = this.descripciones[comando] || 'Descripción no disponible.';
            descRow.appendChild(descCell);
            row.insertAdjacentElement('afterend', descRow);
        }
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
/** @type {__VLS_StyleScopedClasses['permisos']} */ ;
/** @type {__VLS_StyleScopedClasses['procesos']} */ ;
/** @type {__VLS_StyleScopedClasses['footer']} */ ;
/** @type {__VLS_StyleScopedClasses['footer']} */ ;
/** @type {__VLS_StyleScopedClasses['footer']} */ ;
/** @type {__VLS_StyleScopedClasses['biblioteca']} */ ;
/** @type {__VLS_StyleScopedClasses['header']} */ ;
/** @type {__VLS_StyleScopedClasses['logo']} */ ;
/** @type {__VLS_StyleScopedClasses['brand']} */ ;
/** @type {__VLS_StyleScopedClasses['modulos']} */ ;
/** @type {__VLS_StyleScopedClasses['tablas-container']} */ ;
/** @type {__VLS_StyleScopedClasses['comandos-basicos']} */ ;
/** @type {__VLS_StyleScopedClasses['archivos-y-directorios']} */ ;
/** @type {__VLS_StyleScopedClasses['descripcion']} */ ;
/** @type {__VLS_StyleScopedClasses['bloqueados']} */ ;
/** @type {__VLS_StyleScopedClasses['permisos']} */ ;
/** @type {__VLS_StyleScopedClasses['procesos']} */ ;
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
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    user: ({ username: '', correo: '', racha: 0, experiencia: 0, avatar: '' }),
    logout: (() => { }),
}));
const __VLS_2 = __VLS_1({
    user: ({ username: '', correo: '', racha: 0, experiencia: 0, avatar: '' }),
    logout: (() => { }),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "modulos" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "tablas-container" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "comandos-basicos" },
});
__VLS_asFunctionalElement(__VLS_elements.table, __VLS_elements.table)({});
__VLS_asFunctionalElement(__VLS_elements.thead, __VLS_elements.thead)({});
__VLS_asFunctionalElement(__VLS_elements.tr, __VLS_elements.tr)({});
__VLS_asFunctionalElement(__VLS_elements.tbody, __VLS_elements.tbody)({});
__VLS_asFunctionalElement(__VLS_elements.tr, __VLS_elements.tr)({});
__VLS_asFunctionalElement(__VLS_elements.tr, __VLS_elements.tr)({});
__VLS_asFunctionalElement(__VLS_elements.tr, __VLS_elements.tr)({});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "archivos-y-directorios" },
});
__VLS_asFunctionalElement(__VLS_elements.table, __VLS_elements.table)({});
__VLS_asFunctionalElement(__VLS_elements.thead, __VLS_elements.thead)({});
__VLS_asFunctionalElement(__VLS_elements.tbody, __VLS_elements.tbody)({});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "bloqueados" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "permisos" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "permiso" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "procesos" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "proceso" },
});
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
/** @type {__VLS_StyleScopedClasses['biblioteca']} */ ;
/** @type {__VLS_StyleScopedClasses['modulos']} */ ;
/** @type {__VLS_StyleScopedClasses['tablas-container']} */ ;
/** @type {__VLS_StyleScopedClasses['comandos-basicos']} */ ;
/** @type {__VLS_StyleScopedClasses['archivos-y-directorios']} */ ;
/** @type {__VLS_StyleScopedClasses['bloqueados']} */ ;
/** @type {__VLS_StyleScopedClasses['permisos']} */ ;
/** @type {__VLS_StyleScopedClasses['permiso']} */ ;
/** @type {__VLS_StyleScopedClasses['procesos']} */ ;
/** @type {__VLS_StyleScopedClasses['proceso']} */ ;
export default {};
