import Login from './components/Login.vue';
import Dashboard from './components/Dashboard.vue';
import Biblioteca from './components/Biblioteca.vue';
export default (await import('vue')).defineComponent({
    name: 'AppContainer',
    components: {
        Login,
        Dashboard,
        Biblioteca
    },
    data() {
        return {
            currentPage: 'login' // 👈 empezamos en login
        };
    },
    methods: {
        handleUserLogin() {
            console.log('🚀 Usuario logueado! Cambiando a Dashboard...');
            this.currentPage = 'dashboard';
        },
        handleUserLogout() {
            console.log('👋 Usuario deslogueado! Volviendo al Login...');
            this.currentPage = 'login';
        }
    }
});
const __VLS_ctx = {};
let __VLS_elements;
const __VLS_componentsOption = {
    Login,
    Dashboard,
    Biblioteca
};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
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
    }));
    const __VLS_10 = __VLS_9({
        ...{ 'onGoBiblioteca': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    let __VLS_12;
    let __VLS_13;
    const __VLS_14 = ({ goBiblioteca: {} },
        { onGoBiblioteca: (...[$event]) => {
                if (!!(__VLS_ctx.currentPage === 'login'))
                    return;
                if (!(__VLS_ctx.currentPage === 'dashboard'))
                    return;
                __VLS_ctx.currentPage = 'biblioteca';
                // @ts-ignore
                [currentPage,];
            } });
    var __VLS_11;
}
else if (__VLS_ctx.currentPage === 'biblioteca') {
    // @ts-ignore
    [currentPage,];
    const __VLS_16 = {}.Biblioteca;
    /** @type {[typeof __VLS_components.Biblioteca, ]} */ ;
    // @ts-ignore
    Biblioteca;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({}));
    const __VLS_18 = __VLS_17({}, ...__VLS_functionalComponentArgsRest(__VLS_17));
}
var __VLS_dollars;
let __VLS_self;
