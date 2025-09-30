import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/components/Login.vue'
import Registro from '@/components/Registro.vue'
import Dashboard from '@/components/Dashboard.vue'
import Biblioteca from '@/components/Biblioteca.vue'

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/registro', component: Registro },
    { path: '/dashboard', component: Dashboard },
    { path: '/biblioteca', component: Biblioteca },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router

