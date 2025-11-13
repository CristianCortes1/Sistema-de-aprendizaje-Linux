import { defineComponent, ref, onMounted } from 'vue';
import AuthService from '../services/AuthService';
import LessonService from '../services/LessonService';
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
            avatar: "",
            id: 0,
            rol: ''
        });
        const modules = ref([]);
        const selectedPage = ref('');
        const pickIcon = (title) => {
            const t = (title || '').toLowerCase();
            if (t.includes('archivo'))
                return '/Assets/Archivos.svg';
            if (t.includes('permiso'))
                return '/Assets/Permisos.svg';
            if (t.includes('proceso') || t.includes('señal') || t.includes('senial'))
                return '/Assets/Procesos.svg';
            if (t.includes('comando'))
                return ''; // usa símbolo >_
            return '';
        };
        const fetchLessons = async () => {
            try {
                const userId = user.value.id;
                if (!userId) {
                    console.error('No user ID found');
                    return;
                }
                const data = await LessonService.getAvailableForUser(userId);
                modules.value = (Array.isArray(data) ? data : []).map((l) => ({
                    id: l.id,
                    name: l.titulo,
                    icon: pickIcon(l.titulo),
                    locked: l.locked,
                    progreso: l.progreso || 0
                }));
            }
            catch (e) {
                console.error('Error cargando lecciones:', e);
                modules.value = [];
            }
        };
        onMounted(() => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                user.value.username = parsed.username;
                user.value.racha = parsed.racha;
                user.value.experiencia = parsed.experiencia;
                user.value.avatar = parsed.avatar;
                user.value.correo = parsed.correo;
                user.value.id = parsed.id_Usuario || parsed.id;
                user.value.rol = parsed.rol || parsed.role || '';
            }
            // Cargar lecciones después de obtener el usuario
            fetchLessons();
        });
        const logout = () => {
            AuthService.logout();
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
        };
        const goInicio = () => router.push('/dashboard');
        const goBiblioteca = () => router.push('/biblioteca');
        const goRanking = () => router.push('/ranking');
        const goConfig = () => router.push('/configuracion');
        const goLeccion = (module) => {
            if (!module.locked) {
                router.push(`/leccion/${module.id}`);
            }
        };
        const navigateToPage = () => {
            if (!selectedPage.value)
                return;
            if (selectedPage.value === 'admin') {
                router.push({ name: 'AdminDashboard' });
            }
            else if (selectedPage.value === 'dashboard') {
                router.push({ name: 'Dashboard' });
            }
            selectedPage.value = '';
        };
        const isAdmin = () => user.value.rol === 'admin';
        return { user, modules, logout, goInicio, goBiblioteca, goRanking, goConfig, goLeccion, selectedPage, navigateToPage, isAdmin };
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
            avatar: "",
            id: 0,
            rol: ''
        });
        const modules = ref([]);
        const selectedPage = ref('');
        const pickIcon = (title) => {
            const t = (title || '').toLowerCase();
            if (t.includes('archivo'))
                return '/Assets/Archivos.svg';
            if (t.includes('permiso'))
                return '/Assets/Permisos.svg';
            if (t.includes('proceso') || t.includes('señal') || t.includes('senial'))
                return '/Assets/Procesos.svg';
            if (t.includes('comando'))
                return ''; // usa símbolo >_
            return '';
        };
        const fetchLessons = async () => {
            try {
                const userId = user.value.id;
                if (!userId) {
                    console.error('No user ID found');
                    return;
                }
                const data = await LessonService.getAvailableForUser(userId);
                modules.value = (Array.isArray(data) ? data : []).map((l) => ({
                    id: l.id,
                    name: l.titulo,
                    icon: pickIcon(l.titulo),
                    locked: l.locked,
                    progreso: l.progreso || 0
                }));
            }
            catch (e) {
                console.error('Error cargando lecciones:', e);
                modules.value = [];
            }
        };
        onMounted(() => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                user.value.username = parsed.username;
                user.value.racha = parsed.racha;
                user.value.experiencia = parsed.experiencia;
                user.value.avatar = parsed.avatar;
                user.value.correo = parsed.correo;
                user.value.id = parsed.id_Usuario || parsed.id;
                user.value.rol = parsed.rol || parsed.role || '';
            }
            // Cargar lecciones después de obtener el usuario
            fetchLessons();
        });
        const logout = () => {
            AuthService.logout();
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
        };
        const goInicio = () => router.push('/dashboard');
        const goBiblioteca = () => router.push('/biblioteca');
        const goRanking = () => router.push('/ranking');
        const goConfig = () => router.push('/configuracion');
        const goLeccion = (module) => {
            if (!module.locked) {
                router.push(`/leccion/${module.id}`);
            }
        };
        const navigateToPage = () => {
            if (!selectedPage.value)
                return;
            if (selectedPage.value === 'admin') {
                router.push({ name: 'AdminDashboard' });
            }
            else if (selectedPage.value === 'dashboard') {
                router.push({ name: 'Dashboard' });
            }
            selectedPage.value = '';
        };
        const isAdmin = () => user.value.rol === 'admin';
        return { user, modules, logout, goInicio, goBiblioteca, goRanking, goConfig, goLeccion, selectedPage, navigateToPage, isAdmin };
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
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['locked']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['logout-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-select']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-select']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-select']} */ ;
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
if (__VLS_ctx.isAdmin()) {
    // @ts-ignore
    [isAdmin,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "nav-selector" },
    });
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
        for: "pagina",
        ...{ class: "nav-label" },
    });
    __VLS_asFunctionalElement(__VLS_elements.select, __VLS_elements.select)({
        ...{ onChange: (__VLS_ctx.navigateToPage) },
        id: "pagina",
        value: (__VLS_ctx.selectedPage),
        ...{ class: "nav-select" },
    });
    // @ts-ignore
    [navigateToPage, selectedPage,];
    __VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
        value: "",
    });
    __VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
        value: "admin",
    });
    __VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
        value: "dashboard",
    });
}
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
        key: (module.id),
        ...{ class: ({ 'locked': module.locked }) },
    });
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.goLeccion(module);
                // @ts-ignore
                [goLeccion,];
            } },
        type: "button",
        disabled: (module.locked),
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
    if (module.locked) {
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
            ...{ class: "lock-icon" },
        });
    }
    if (!module.locked && module.progreso > 0) {
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
            ...{ class: "progress-indicator" },
        });
        (module.progreso);
    }
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
/** @type {__VLS_StyleScopedClasses['nav-selector']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-label']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-select']} */ ;
/** @type {__VLS_StyleScopedClasses['titulo']} */ ;
/** @type {__VLS_StyleScopedClasses['subtitulo']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['locked']} */ ;
/** @type {__VLS_StyleScopedClasses['lock-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-indicator']} */ ;
export default {};
