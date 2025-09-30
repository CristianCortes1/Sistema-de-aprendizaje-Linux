import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import AuthService from '../services/AuthService'
import Login from '@/components/Login.vue'
import Dashboard from '@/components/Dashboard.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Login',
        component: Login,
        meta: { guestOnly: true }
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: { requiresAuth: true }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// Guard global
router.beforeEach((to, from, next) => {
    const isAuth: boolean = AuthService.isAuthenticated()

    if (to.meta.requiresAuth && !isAuth) {
        // Si no está logueado y quiere ir a página protegida
        next({ path: '/' })
    } else if (to.meta.guestOnly && isAuth) {
        // Si está logueado y quiere ir al login
        next({ path: '/dashboard' })
    } else {
        next()
    }
})

export default router
