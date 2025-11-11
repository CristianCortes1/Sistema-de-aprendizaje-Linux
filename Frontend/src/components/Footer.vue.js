import { defineComponent } from 'vue';
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_export = defineComponent({
    props: {
        goInicio: { type: Function, required: true },
        goBiblioteca: { type: Function, required: true },
        goRanking: { type: Function, required: true },
        goConfig: { type: Function, required: true }
    }
});
const __VLS_self = (await import('vue')).defineComponent({
    props: {
        goInicio: { type: Function, required: true },
        goBiblioteca: { type: Function, required: true },
        goRanking: { type: Function, required: true },
        goConfig: { type: Function, required: true }
    }
});
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['footer']} */ ;
/** @type {__VLS_StyleScopedClasses['footer']} */ ;
/** @type {__VLS_StyleScopedClasses['footer']} */ ;
/** @type {__VLS_StyleScopedClasses['footer']} */ ;
__VLS_asFunctionalElement(__VLS_elements.footer, __VLS_elements.footer)({
    ...{ class: "footer" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "barra-inicio" },
});
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.goInicio) },
    type: "button",
});
// @ts-ignore
[goInicio,];
__VLS_asFunctionalElement(__VLS_elements.img)({
    src: "https://upload.wikimedia.org/wikipedia/commons/3/35/Tux.svg",
    alt: "Inicio",
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "barra" },
});
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.goBiblioteca) },
});
// @ts-ignore
[goBiblioteca,];
__VLS_asFunctionalElement(__VLS_elements.img)({
    src: "/Assets/Biblioteca.svg",
    alt: "Biblioteca",
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "barra" },
});
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.goRanking) },
    type: "button",
});
// @ts-ignore
[goRanking,];
__VLS_asFunctionalElement(__VLS_elements.img)({
    src: "/Assets/Ranking.svg",
    alt: "Ranking",
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "barra" },
});
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.goConfig) },
    type: "button",
});
// @ts-ignore
[goConfig,];
__VLS_asFunctionalElement(__VLS_elements.img)({
    src: "/Assets/Configuración.svg",
    alt: "Configuración",
});
/** @type {__VLS_StyleScopedClasses['footer']} */ ;
/** @type {__VLS_StyleScopedClasses['barra-inicio']} */ ;
/** @type {__VLS_StyleScopedClasses['barra']} */ ;
/** @type {__VLS_StyleScopedClasses['barra']} */ ;
/** @type {__VLS_StyleScopedClasses['barra']} */ ;
export default {};
