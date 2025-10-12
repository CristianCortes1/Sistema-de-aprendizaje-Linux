import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Header from './Header.vue';
import Footer from './Footer.vue';
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_export = defineComponent({
    name: 'Configuracion',
    components: {
        Header,
        Footer
    },
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
    components: {
        Header,
        Footer
    },
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
const __VLS_componentsOption = {
    Header,
    Footer
};
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
const __VLS_0 = {}.Header;
/** @type {[typeof __VLS_components.Header, ]} */ ;
// @ts-ignore
Header;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ style: {} },
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
const __VLS_5 = {}.Footer;
/** @type {[typeof __VLS_components.Footer, ]} */ ;
// @ts-ignore
Footer;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    goInicio: (__VLS_ctx.goBack),
    goBiblioteca: (() => __VLS_ctx.$router.push('/biblioteca')),
    goRanking: (() => __VLS_ctx.$router.push('/ranking')),
    goConfig: (() => __VLS_ctx.$router.push('/configuracion')),
}));
const __VLS_7 = __VLS_6({
    goInicio: (__VLS_ctx.goBack),
    goBiblioteca: (() => __VLS_ctx.$router.push('/biblioteca')),
    goRanking: (() => __VLS_ctx.$router.push('/ranking')),
    goConfig: (() => __VLS_ctx.$router.push('/configuracion')),
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
// @ts-ignore
[goBack, $router, $router, $router,];
/** @type {__VLS_StyleScopedClasses['page']} */ ;
/** @type {__VLS_StyleScopedClasses['back']} */ ;
/** @type {__VLS_StyleScopedClasses['form']} */ ;
/** @type {__VLS_StyleScopedClasses['save']} */ ;
export default {};
