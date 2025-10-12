import { createRouter, createWebHistory } from 'vue-router';
import AuthService from '../services/AuthService';
import Login from '@/components/Login.vue';
import Dashboard from '@/components/Dashboard.vue';
import Registro from '@/components/Registro.vue';
import Biblioteca from '../components/Biblioteca.vue';
import ConfirmEmail from '../components/ConfirmEmail.vue';
const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login,
        meta: { guestOnly: true }
    },
    {
        path: '/registro',
        name: 'Registro',
        component: Registro,
        meta: { guestOnly: true }
    },
    {
        path: '/confirm-email',
        name: 'ConfirmEmail',
        component: ConfirmEmail,
        meta: { guestOnly: true }
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: { requiresAuth: true }
    },
    {
        path: '/biblioteca',
        name: 'Biblioteca',
        component: Biblioteca,
        meta: { requiresAuth: true }
    }
];
const router = createRouter({
    history: createWebHistory(),
    routes
});
// Guard global
router.beforeEach((to, from, next) => {
    const isAuth = AuthService.isAuthenticated();
    if (to.meta.requiresAuth && !isAuth) {
        // Si no está logueado y quiere ir a página protegida
        next({ path: '/' });
    }
    else if (to.meta.guestOnly && isAuth) {
        // Si está logueado y quiere ir al login
        next({ path: '/dashboard' });
    }
    else {
        next();
    }
});
export default router;
