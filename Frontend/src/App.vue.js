import Login from './components/Login.vue';
import Dashboard from './components/Dashboard.vue';
import Biblioteca from './components/Biblioteca.vue';
export default (await import('vue')).defineComponent({
    name: 'AppContainer',
    components: { Login, Dashboard, Biblioteca },
    data() {
        return {
            currentPage: window.location.hash.replace('#', '') || 'login',
            isAuthenticated: false // 👈 nuevo estado de sesión
        };
    },
    methods: {
        setPage(page) {
            // 👇 Seguridad: si intenta ir al dashboard/biblioteca sin login, redirige a login
            if (!this.isAuthenticated && page !== 'login') {
                console.warn('⛔ Acceso denegado, vuelve a login');
                this.currentPage = 'login';
                window.location.hash = 'login';
                return;
            }
            this.currentPage = page;
            window.location.hash = page;
        },
        handleUserLogin() {
            // 🔑 aquí deberías validar credenciales reales
            this.isAuthenticated = true;
            this.setPage('dashboard');
        },
        handleUserLogout() {
            this.isAuthenticated = false;
            this.setPage('login');
        }
    },
    mounted() {
        window.addEventListener('hashchange', () => {
            const page = window.location.hash.replace('#', '') || 'login';
            // 👇 aplica validación al navegar con flechitas
            if (!this.isAuthenticated && page !== 'login') {
                console.warn('⛔ Intento de entrar sin login');
                this.setPage('login');
            }
            else {
                this.currentPage = page;
            }
        });
    }
});
const __VLS_ctx = {};
let __VLS_elements;
const __VLS_componentsOption = { Login, Dashboard, Biblioteca };
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
if (__VLS_ctx.currentPage === 'login') {
    // @ts-ignore
    [currentPage,];
    const __VLS_0 = {}.Login;
    /** @type {[typeof __VLS_components.Login, ]} */ ;
    // @ts-ignore
    Login;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        ...{ 'onLogin': {} },
    }));
    const __VLS_2 = __VLS_1({
        ...{ 'onLogin': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    let __VLS_4;
    let __VLS_5;
    const __VLS_6 = ({ login: {} },
        { onLogin: (__VLS_ctx.handleUserLogin) });
    // @ts-ignore
    [handleUserLogin,];
    var __VLS_3;
}
else if (__VLS_ctx.currentPage === 'dashboard') {
    // @ts-ignore
    [currentPage,];
    const __VLS_8 = {}.Dashboard;
    /** @type {[typeof __VLS_components.Dashboard, ]} */ ;
    // @ts-ignore
    Dashboard;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
        ...{ 'onGoBiblioteca': {} },
        ...{ 'onLogout': {} },
    }));
    const __VLS_10 = __VLS_9({
        ...{ 'onGoBiblioteca': {} },
        ...{ 'onLogout': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    let __VLS_12;
    let __VLS_13;
    const __VLS_14 = ({ goBiblioteca: {} },
        { onGoBiblioteca: (...[$event]) => {
                if (!!(__VLS_ctx.currentPage === 'login'))
                    return;
                if (!(__VLS_ctx.currentPage === 'dashboard'))
                    return;
                __VLS_ctx.setPage('biblioteca');
                // @ts-ignore
                [setPage,];
            } });
    const __VLS_15 = ({ logout: {} },
        { onLogout: (__VLS_ctx.handleUserLogout) });
    // @ts-ignore
    [handleUserLogout,];
    var __VLS_11;
}
else if (__VLS_ctx.currentPage === 'biblioteca') {
    // @ts-ignore
    [currentPage,];
    const __VLS_17 = {}.Biblioteca;
    /** @type {[typeof __VLS_components.Biblioteca, ]} */ ;
    // @ts-ignore
    Biblioteca;
    // @ts-ignore
    const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
        ...{ 'onLogout': {} },
    }));
    const __VLS_19 = __VLS_18({
        ...{ 'onLogout': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_18));
    let __VLS_21;
    let __VLS_22;
    const __VLS_23 = ({ logout: {} },
        { onLogout: (__VLS_ctx.handleUserLogout) });
    // @ts-ignore
    [handleUserLogout,];
    var __VLS_20;
}
var __VLS_dollars;
let __VLS_self;
