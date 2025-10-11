import { defineComponent, ref, onMounted } from 'vue';
import AuthService from '../services/AuthService';
import { useRouter } from 'vue-router';
const router = useRouter();
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_export = defineComponent({
    setup() {
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
        const goBiblioteca = () => {
            router.push('/biblioteca');
        };
        return { user, modules, logout, goBiblioteca };
    }
});
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
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
        const goBiblioteca = () => {
            router.push('/biblioteca');
        };
        return { user, modules, logout, goBiblioteca };
    }
});
const __VLS_ctx = {};
let __VLS_elements;
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
/** @type {__VLS_StyleScopedClasses['footer']} */ ;
/** @type {__VLS_StyleScopedClasses['footer']} */ ;
/** @type {__VLS_StyleScopedClasses['footer']} */ ;
/** @type {__VLS_StyleScopedClasses['header']} */ ;
/** @type {__VLS_StyleScopedClasses['header']} */ ;
/** @type {__VLS_StyleScopedClasses['logo']} */ ;
/** @type {__VLS_StyleScopedClasses['brand']} */ ;
/** @type {__VLS_StyleScopedClasses['status']} */ ;
/** @type {__VLS_StyleScopedClasses['perfil']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['footer']} */ ;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "dashboard" },
});
__VLS_asFunctionalElement(__VLS_elements.header, __VLS_elements.header)({
    ...{ class: "header" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "logo" },
});
__VLS_asFunctionalElement(__VLS_elements.img)({
    src: "https://upload.wikimedia.org/wikipedia/commons/3/35/Tux.svg",
    alt: "Penguin",
    ...{ class: "logo" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "brand" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "status" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "streak" },
});
__VLS_asFunctionalElement(__VLS_elements.img)({
    src: "/Assets/Racha.svg",
    alt: "Racha",
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
(__VLS_ctx.user.racha);
// @ts-ignore
[user,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "xp" },
});
__VLS_asFunctionalElement(__VLS_elements.img)({
    src: "/Assets/xp.svg",
    alt: "XP",
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
(__VLS_ctx.user.experiencia);
// @ts-ignore
[user,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "perfil" },
});
__VLS_asFunctionalElement(__VLS_elements.img)({
    src: (__VLS_ctx.user.avatar),
    alt: "Perfil",
});
// @ts-ignore
[user,];
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
(__VLS_ctx.user.username);
// @ts-ignore
[user,];
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.logout) },
    ...{ class: "logout-btn" },
});
// @ts-ignore
[logout,];
__VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)({
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    fill: "none",
    stroke: "currentColor",
    'stroke-width': "2",
    'stroke-linecap': "round",
    'stroke-linejoin': "round",
    ...{ class: "feather feather-log-out" },
});
__VLS_asFunctionalElement(__VLS_elements.path)({
    d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",
});
__VLS_asFunctionalElement(__VLS_elements.polyline)({
    points: "16 17 21 12 16 7",
});
__VLS_asFunctionalElement(__VLS_elements.line)({
    x1: "21",
    y1: "12",
    x2: "9",
    y2: "12",
});
__VLS_asFunctionalElement(__VLS_elements.h1, __VLS_elements.h1)({
    ...{ class: "titulo" },
});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
    ...{ class: "subtitulo" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "form-group" },
});
for (const [module] of __VLS_getVForSourceType((__VLS_ctx.modules))) {
    // @ts-ignore
    [modules,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "card" },
        key: (module.name),
    });
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        type: "button",
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
__VLS_asFunctionalElement(__VLS_elements.footer, __VLS_elements.footer)({
    ...{ class: "footer" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "barra-inicio" },
});
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    type: "button",
});
__VLS_asFunctionalElement(__VLS_elements.img)({
    src: "/Assets/Inicio.svg",
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
/** @type {__VLS_StyleScopedClasses['dashboard']} */ ;
/** @type {__VLS_StyleScopedClasses['header']} */ ;
/** @type {__VLS_StyleScopedClasses['logo']} */ ;
/** @type {__VLS_StyleScopedClasses['logo']} */ ;
/** @type {__VLS_StyleScopedClasses['brand']} */ ;
/** @type {__VLS_StyleScopedClasses['status']} */ ;
/** @type {__VLS_StyleScopedClasses['streak']} */ ;
/** @type {__VLS_StyleScopedClasses['xp']} */ ;
/** @type {__VLS_StyleScopedClasses['perfil']} */ ;
/** @type {__VLS_StyleScopedClasses['logout-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['feather']} */ ;
/** @type {__VLS_StyleScopedClasses['feather-log-out']} */ ;
/** @type {__VLS_StyleScopedClasses['titulo']} */ ;
/** @type {__VLS_StyleScopedClasses['subtitulo']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['footer']} */ ;
/** @type {__VLS_StyleScopedClasses['barra-inicio']} */ ;
/** @type {__VLS_StyleScopedClasses['barra']} */ ;
/** @type {__VLS_StyleScopedClasses['barra']} */ ;
/** @type {__VLS_StyleScopedClasses['barra']} */ ;
export default {};
