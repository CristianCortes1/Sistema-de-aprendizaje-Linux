<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AuthService from '../services/AuthService'

const router = useRouter()

// Simple tabs: Users and Lessons
const activeTab = ref<'users' | 'lessons'>('users')

const user = ref({
    username: '',
    correo: '',
    avatar: ''
})

onMounted(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
        const parsed = JSON.parse(storedUser)
        user.value.username = parsed.username
        user.value.correo = parsed.correo
        user.value.avatar = parsed.avatar
    }
})

const logout = () => {
    AuthService.logout()
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/'
}
</script>

<template>
    <div class="admin">
        <header class="admin-header">
            <div class="brand">
                <img src="/Assets/Archivos.svg" alt="logo" />
                <h1>Admin Dashboard</h1>
            </div>
            <div class="user-info">
                <div class="perfil">
                    <img :src="user.avatar" :alt="user.username" />
                    <span>{{ user.username }}</span>
                </div>
                <button class="logout-btn" @click="logout">Cerrar sesión</button>
            </div>
        </header>

        <aside class="sidebar">
            <nav>
                <button :class="{ active: activeTab === 'users' }" @click="activeTab = 'users'">Users</button>
                <button :class="{ active: activeTab === 'lessons' }" @click="activeTab = 'lessons'">Lessons</button>
            </nav>
        </aside>

        <main class="content">
            <section v-if="activeTab === 'users'">
                <h2>User Management</h2>
                <p>Placeholder de gestion de usuarios. Integra peticiones reales después.</p>
            </section>

            <section v-else>
                <h2>Lesson Management</h2>
                <p>Placeholder de gestión de lecciones y retos. Integra UI según mock.</p>
            </section>
        </main>
    </div>
</template>

<style>
body {
    margin: 0;
    padding: 0;
}
</style>

<style scoped>
*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
.admin {
    display: grid;
    grid-template-columns: 220px 1fr;
    grid-template-rows: 64px 1fr;
    height: 100vh;
    background: #0e1621;
    color: #e6edf3
}

.admin-header {
    grid-column: 1 / -1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 16px;
    background: #0b1220;
    border-bottom: 1px solid #1f2937
}

.brand {
    display: flex;
    align-items: center;
    gap: 10px
}

.brand img {
    width: 32px;
    height: 32px
}

.user-info {
    display: flex;
    align-items: center;
    gap: 15px
}

.perfil {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px
}

.perfil img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
    background: white
}

.logout-btn {
    background: #dc2626;
    border: none;
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    transition: background 0.2s
}

.logout-btn:hover {
    background: #b91c1c
}

.sidebar {
    grid-row: 2;
    background: #0b1220;
    border-right: 1px solid #1f2937;
    padding: 12px
}

.sidebar nav {
    display: flex;
    flex-direction: column;
    gap: 8px
}

.sidebar button {
    background: #111827;
    border: 1px solid #1f2937;
    color: #e6edf3;
    padding: 10px 12px;
    border-radius: 8px;
    text-align: left
}

.sidebar button.active {
    background: #1f2937
}

.content {
    padding: 16px;
    overflow: auto
}
</style>
