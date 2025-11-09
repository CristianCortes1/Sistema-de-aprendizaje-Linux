import { createRouter, createWebHistory } from 'vue-router';
import AuthService from '../services/AuthService';
import Login from '@/components/Login.vue';
import Dashboard from '@/components/Dashboard.vue';
import Registro from '@/components/Registro.vue';
import Biblioteca from '../components/Biblioteca.vue';
import ConfirmEmail from '../components/ConfirmEmail.vue';
import Ranking from '../components/Ranking.vue';
import Configuracion from '../components/Configuracion.vue';
import Leccion from '../components/Leccion.vue';
import AdminDashboard from '../components/AdminDashboard.vue';
import PrivacyPolicy from '../components/PrivacyPolicy.vue';
import TermsConditions from '../components/TermsConditions.vue';

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
        path: '/privacy-policy',
        name: 'PrivacyPolicy',
        component: PrivacyPolicy
    },
    {
        path: '/terms',
        name: 'TermsConditions',
        component: TermsConditions
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
        path: '/admin',
        name: 'AdminDashboard',
        component: AdminDashboard,
        meta: { requiresAuth: true, requiresRole: 'admin' }
    },
    {
        path: '/biblioteca',
        name: 'Biblioteca',
        component: Biblioteca,
        meta: { requiresAuth: true }
    },
    {
        path: '/ranking',
        name: 'Ranking',
        component: Ranking,
        meta: { requiresAuth: true }
    },
    {
        path: '/configuracion',
        name: 'Configuracion',
        component: Configuracion,
        meta: { requiresAuth: true }
    },
    {
        path: '/leccion/:id',
        name: 'Leccion',
        component: Leccion,
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
    const userRaw = localStorage.getItem('user');
    const role = userRaw ? (JSON.parse(userRaw).rol || JSON.parse(userRaw).role) : undefined;

    if (to.meta.requiresAuth && !isAuth) {
        // Si no está logueado y quiere ir a página protegida
        next({ path: '/' });
        return;
    }

    // Restricción de rol
    if (to.meta && (to.meta as any).requiresRole) {
        const required = (to.meta as any).requiresRole;
        if (required && role !== required) {
            // Usuario autenticado pero sin permisos
            next({ path: '/dashboard' });
            return;
        }
    }

    if (to.meta.guestOnly && isAuth) {
        // Si está logueado y quiere ir al login
        // Redirige a admin si corresponde
        if (role === 'admin') {
            next({ path: '/admin' });
        } else {
            next({ path: '/dashboard' });
        }
        return;
    }

    next();
});
export default router;
