import { defineComponent, ref, onMounted } from 'vue';
import AuthService from '../services/AuthService';
import { useRouter } from 'vue-router';
import Header from './Header.vue';
import Footer from './Footer.vue';
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_export = defineComponent({
    setup() {
        const router = useRouter();
        const user = ref({
            username: '',
            correo: '',
            racha: 0,
            experiencia: 0,
            avatar: ""
        });
        const modules = ref([
            { name: 'Comandos básicos', icon: '' },
            { name: 'Archivos y directorios', icon: '/Assets/Archivos.svg' },
            { name: 'Permisos', icon: '/Assets/Permisos.svg' },
            { name: 'Procesos y señales', icon: '/Assets/Procesos.svg' },
        ]);
        onMounted(() => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                user.value.username = parsed.username;
                user.value.racha = parsed.racha;
                user.value.experiencia = parsed.experiencia;
                user.value.avatar = parsed.avatar;
                user.value.correo = parsed.correo;
            }
        });
        const logout = () => {
            AuthService.logout(); // limpiar token del backend si es necesario
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
        };
        const goInicio = () => router.push('/dashboard');
        const goBiblioteca = () => router.push('/biblioteca');
        const goRanking = () => router.push('/ranking');
        const goConfig = () => router.push('/configuracion');
        const goLeccion = (id) => router.push(`/leccion/${id}`);
        return { user, modules, logout, goInicio, goBiblioteca, goRanking, goConfig, goLeccion };
    },
    components: {
        Header,
        Footer
    }
});
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        const router = useRouter();
        const user = ref({
            username: '',
            correo: '',
            racha: 0,
            experiencia: 0,
            avatar: ""
        });
        const modules = ref([
            { name: 'Comandos básicos', icon: '' },
            { name: 'Archivos y directorios', icon: '/Assets/Archivos.svg' },
            { name: 'Permisos', icon: '/Assets/Permisos.svg' },
            { name: 'Procesos y señales', icon: '/Assets/Procesos.svg' },
        ]);
        onMounted(() => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                user.value.username = parsed.username;
                user.value.racha = parsed.racha;
                user.value.experiencia = parsed.experiencia;
                user.value.avatar = parsed.avatar;
                user.value.correo = parsed.correo;
            }
        });
        const logout = () => {
            AuthService.logout(); // limpiar token del backend si es necesario
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
        };
        const goInicio = () => router.push('/dashboard');
        const goBiblioteca = () => router.push('/biblioteca');
        const goRanking = () => router.push('/ranking');
        const goConfig = () => router.push('/configuracion');
        const goLeccion = (id) => router.push(`/leccion/${id}`);
        return { user, modules, logout, goInicio, goBiblioteca, goRanking, goConfig, goLeccion };
    },
    components: {
        Header,
        Footer
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
/** @type {__VLS_StyleScopedClasses['status']} */ ;
/** @type {__VLS_StyleScopedClasses['status']} */ ;
/** @type {__VLS_StyleScopedClasses['status']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['logout-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['header']} */ ;
/** @type {__VLS_StyleScopedClasses['logo']} */ ;
/** @type {__VLS_StyleScopedClasses['brand']} */ ;
/** @type {__VLS_StyleScopedClasses['status']} */ ;
/** @type {__VLS_StyleScopedClasses['perfil']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "dashboard" },
});
const __VLS_0 = {}.Header;
/** @type {[typeof __VLS_components.Header, ]} */ ;
// @ts-ignore
Header;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    user: (__VLS_ctx.user),
    logout: (__VLS_ctx.logout),
}));
const __VLS_2 = __VLS_1({
    user: (__VLS_ctx.user),
    logout: (__VLS_ctx.logout),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
// @ts-ignore
[user, logout,];
__VLS_asFunctionalElement(__VLS_elements.h1, __VLS_elements.h1)({
    ...{ class: "titulo" },
});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
    ...{ class: "subtitulo" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "form-group" },
});
for (const [module, index] of __VLS_getVForSourceType((__VLS_ctx.modules))) {
    // @ts-ignore
    [modules,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "card" },
        key: (module.name),
    });
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (...[$event]) => {
                index === 0 ? __VLS_ctx.goLeccion(1) : null;
                // @ts-ignore
                [goLeccion,];
            } },
        type: "button",
        disabled: (index > 1),
    });
    if (module.icon) {
        __VLS_asFunctionalElement(__VLS_elements.img)({
            src: (module.icon),
            alt: (module.name),
        });
    }
    else {
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    }
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    (module.name);
}
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
/** @type {__VLS_StyleScopedClasses['dashboard']} */ ;
/** @type {__VLS_StyleScopedClasses['titulo']} */ ;
/** @type {__VLS_StyleScopedClasses['subtitulo']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
export default {};
