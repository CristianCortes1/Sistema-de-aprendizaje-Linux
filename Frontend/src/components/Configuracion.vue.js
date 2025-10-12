import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_export = defineComponent({
    name: 'Configuracion',
    setup() {
        const router = useRouter();
        const prefs = ref({
            temaOscuro: true,
            notificaciones: true,
            idioma: 'es'
        });
        onMounted(() => {
            const saved = localStorage.getItem('prefs');
            if (saved)
                prefs.value = JSON.parse(saved);
        });
        const save = () => {
            localStorage.setItem('prefs', JSON.stringify(prefs.value));
            router.push('/dashboard');
        };
        const goBack = () => router.push('/dashboard');
        return { prefs, save, goBack };
    }
});
const __VLS_self = (await import('vue')).defineComponent({
    name: 'Configuracion',
    setup() {
        const router = useRouter();
        const prefs = ref({
            temaOscuro: true,
            notificaciones: true,
            idioma: 'es'
        });
        onMounted(() => {
            const saved = localStorage.getItem('prefs');
            if (saved)
                prefs.value = JSON.parse(saved);
        });
        const save = () => {
            localStorage.setItem('prefs', JSON.stringify(prefs.value));
            router.push('/dashboard');
        };
        const goBack = () => router.push('/dashboard');
        return { prefs, save, goBack };
    }
});
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['back']} */ ;
/** @type {__VLS_StyleScopedClasses['form']} */ ;
/** @type {__VLS_StyleScopedClasses['form']} */ ;
/** @type {__VLS_StyleScopedClasses['form']} */ ;
/** @type {__VLS_StyleScopedClasses['save']} */ ;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "page" },
});
__VLS_asFunctionalElement(__VLS_elements.header, __VLS_elements.header)({
    ...{ class: "header" },
});
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.goBack) },
    ...{ class: "back" },
});
// @ts-ignore
[goBack,];
__VLS_asFunctionalElement(__VLS_elements.h1, __VLS_elements.h1)({});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "form" },
});
__VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({});
__VLS_asFunctionalElement(__VLS_elements.input)({
    type: "checkbox",
});
(__VLS_ctx.prefs.temaOscuro);
// @ts-ignore
[prefs,];
__VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({});
__VLS_asFunctionalElement(__VLS_elements.input)({
    type: "checkbox",
});
(__VLS_ctx.prefs.notificaciones);
// @ts-ignore
[prefs,];
__VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({});
__VLS_asFunctionalElement(__VLS_elements.select, __VLS_elements.select)({
    value: (__VLS_ctx.prefs.idioma),
});
// @ts-ignore
[prefs,];
__VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
    value: "es",
});
__VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
    value: "en",
});
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.save) },
    ...{ class: "save" },
});
// @ts-ignore
[save,];
/** @type {__VLS_StyleScopedClasses['page']} */ ;
/** @type {__VLS_StyleScopedClasses['header']} */ ;
/** @type {__VLS_StyleScopedClasses['back']} */ ;
/** @type {__VLS_StyleScopedClasses['form']} */ ;
/** @type {__VLS_StyleScopedClasses['save']} */ ;
export default {};
