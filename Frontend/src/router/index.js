import { createRouter, createWebHistory } from 'vue-router';
import AuthService from '../services/AuthService';
import Login from '@/components/Login.vue';
import Dashboard from '@/components/Dashboard.vue';
import Registro from '@/components/Registro.vue'

const routes = [
    { path: '/', name: 'Login', component: Login, meta: { guestOnly: true } },
    {path: '/registro',name: 'Registro',component: Registro,meta: { guestOnly: true }},
    { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true } }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// Guard global
router.beforeEach((to, from, next) => {
    const isAuth = AuthService.isAuthenticated();

    if (to.meta.requiresAuth && !isAuth) {
        next({ path: '/' }); // protege rutas privadas
    } else if (to.meta.guestOnly && isAuth) {
        next({ path: '/dashboard' }); // evita que logueado vea login
    } else {
        next();
    }
});

export default router;
