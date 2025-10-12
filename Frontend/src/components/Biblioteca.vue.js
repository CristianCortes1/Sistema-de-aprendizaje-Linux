debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_export = (await import('vue')).defineComponent({
    name: 'Biblioteca',
    emits: ['goInicio'],
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
    emits: ['goInicio'],
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
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "header" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "logo" },
});
__VLS_asFunctionalElement(__VLS_elements.img)({
    src: "/Assets/Biblioteca.svg",
    alt: "Libro",
    ...{ class: "logo" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "brand" },
});
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
__VLS_asFunctionalElement(__VLS_elements.th, __VLS_elements.th)({
    ...{ class: "titulo" },
});
__VLS_asFunctionalElement(__VLS_elements.tbody, __VLS_elements.tbody)({});
__VLS_asFunctionalElement(__VLS_elements.tr, __VLS_elements.tr)({});
__VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.toggleDescripcion('ls', $event);
            // @ts-ignore
            [toggleDescripcion,];
        } },
});
__VLS_asFunctionalElement(__VLS_elements.tr, __VLS_elements.tr)({});
__VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.toggleDescripcion('pwd', $event);
            // @ts-ignore
            [toggleDescripcion,];
        } },
});
__VLS_asFunctionalElement(__VLS_elements.tr, __VLS_elements.tr)({});
__VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.toggleDescripcion('cd', $event);
            // @ts-ignore
            [toggleDescripcion,];
        } },
});
__VLS_asFunctionalElement(__VLS_elements.tr, __VLS_elements.tr)({});
__VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.toggleDescripcion('echo', $event);
            // @ts-ignore
            [toggleDescripcion,];
        } },
});
__VLS_asFunctionalElement(__VLS_elements.tr, __VLS_elements.tr)({});
__VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.toggleDescripcion('clear', $event);
            // @ts-ignore
            [toggleDescripcion,];
        } },
});
__VLS_asFunctionalElement(__VLS_elements.tr, __VLS_elements.tr)({});
__VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.toggleDescripcion('cat', $event);
            // @ts-ignore
            [toggleDescripcion,];
        } },
});
__VLS_asFunctionalElement(__VLS_elements.tr, __VLS_elements.tr)({});
__VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.toggleDescripcion('nano', $event);
            // @ts-ignore
            [toggleDescripcion,];
        } },
});
__VLS_asFunctionalElement(__VLS_elements.tr, __VLS_elements.tr)({});
__VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.toggleDescripcion('grep', $event);
            // @ts-ignore
            [toggleDescripcion,];
        } },
});
__VLS_asFunctionalElement(__VLS_elements.tr, __VLS_elements.tr)({});
__VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.toggleDescripcion('sudo', $event);
            // @ts-ignore
            [toggleDescripcion,];
        } },
});
__VLS_asFunctionalElement(__VLS_elements.tr, __VLS_elements.tr)({});
__VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.toggleDescripcion('chmod', $event);
            // @ts-ignore
            [toggleDescripcion,];
        } },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "archivos-y-directorios" },
});
__VLS_asFunctionalElement(__VLS_elements.table, __VLS_elements.table)({});
__VLS_asFunctionalElement(__VLS_elements.thead, __VLS_elements.thead)({});
__VLS_asFunctionalElement(__VLS_elements.tr, __VLS_elements.tr)({});
__VLS_asFunctionalElement(__VLS_elements.th, __VLS_elements.th)({
    ...{ class: "titulo" },
});
__VLS_asFunctionalElement(__VLS_elements.tbody, __VLS_elements.tbody)({});
__VLS_asFunctionalElement(__VLS_elements.tr, __VLS_elements.tr)({});
__VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.toggleDescripcion('touch', $event);
            // @ts-ignore
            [toggleDescripcion,];
        } },
});
__VLS_asFunctionalElement(__VLS_elements.tr, __VLS_elements.tr)({});
__VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.toggleDescripcion('mkdir', $event);
            // @ts-ignore
            [toggleDescripcion,];
        } },
});
__VLS_asFunctionalElement(__VLS_elements.tr, __VLS_elements.tr)({});
__VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.toggleDescripcion('rm', $event);
            // @ts-ignore
            [toggleDescripcion,];
        } },
});
__VLS_asFunctionalElement(__VLS_elements.tr, __VLS_elements.tr)({});
__VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.toggleDescripcion('rmdir', $event);
            // @ts-ignore
            [toggleDescripcion,];
        } },
});
__VLS_asFunctionalElement(__VLS_elements.tr, __VLS_elements.tr)({});
__VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.toggleDescripcion('cp', $event);
            // @ts-ignore
            [toggleDescripcion,];
        } },
});
__VLS_asFunctionalElement(__VLS_elements.tr, __VLS_elements.tr)({});
__VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.toggleDescripcion('mv', $event);
            // @ts-ignore
            [toggleDescripcion,];
        } },
});
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
__VLS_asFunctionalElement(__VLS_elements.footer, __VLS_elements.footer)({
    ...{ class: "footer" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "barra-inicio" },
});
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.$emit('goInicio');
            // @ts-ignore
            [$emit,];
        } },
});
__VLS_asFunctionalElement(__VLS_elements.img)({
    src: "/Assets/Inicio.svg",
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "barra" },
});
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    type: "button",
});
__VLS_asFunctionalElement(__VLS_elements.img)({
    src: "/Assets/Biblioteca.svg",
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "barra" },
});
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    type: "button",
});
__VLS_asFunctionalElement(__VLS_elements.img)({
    src: "/Assets/Ranking.svg",
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "barra" },
});
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    type: "button",
});
__VLS_asFunctionalElement(__VLS_elements.img)({
    src: "/Assets/Configuración.svg",
});
/** @type {__VLS_StyleScopedClasses['biblioteca']} */ ;
/** @type {__VLS_StyleScopedClasses['header']} */ ;
/** @type {__VLS_StyleScopedClasses['logo']} */ ;
/** @type {__VLS_StyleScopedClasses['logo']} */ ;
/** @type {__VLS_StyleScopedClasses['brand']} */ ;
/** @type {__VLS_StyleScopedClasses['modulos']} */ ;
/** @type {__VLS_StyleScopedClasses['tablas-container']} */ ;
/** @type {__VLS_StyleScopedClasses['comandos-basicos']} */ ;
/** @type {__VLS_StyleScopedClasses['titulo']} */ ;
/** @type {__VLS_StyleScopedClasses['archivos-y-directorios']} */ ;
/** @type {__VLS_StyleScopedClasses['titulo']} */ ;
/** @type {__VLS_StyleScopedClasses['bloqueados']} */ ;
/** @type {__VLS_StyleScopedClasses['permisos']} */ ;
/** @type {__VLS_StyleScopedClasses['permiso']} */ ;
/** @type {__VLS_StyleScopedClasses['procesos']} */ ;
/** @type {__VLS_StyleScopedClasses['proceso']} */ ;
/** @type {__VLS_StyleScopedClasses['footer']} */ ;
/** @type {__VLS_StyleScopedClasses['barra-inicio']} */ ;
/** @type {__VLS_StyleScopedClasses['barra']} */ ;
/** @type {__VLS_StyleScopedClasses['barra']} */ ;
/** @type {__VLS_StyleScopedClasses['barra']} */ ;
export default {};
