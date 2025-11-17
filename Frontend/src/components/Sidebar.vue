<script lang="ts">
import { defineComponent, PropType, ref, onMounted, onUnmounted } from 'vue'

export default defineComponent({
    props: {
        goInicio: { type: Function as PropType<(event: MouseEvent) => void>, required: true },
        goBiblioteca: { type: Function as PropType<(event: MouseEvent) => void>, required: true },
        goRanking: { type: Function as PropType<(event: MouseEvent) => void>, required: true },
        goConfig: { type: Function as PropType<(event: MouseEvent) => void>, required: true }
    },
    setup() {
        const sidebarOpen = ref(false)
        const toggleSidebar = () => { sidebarOpen.value = !sidebarOpen.value }
        const closeSidebar = () => { sidebarOpen.value = false }
        const openSidebar = () => { sidebarOpen.value = true }

        const handleToggle = () => toggleSidebar()
        const handleShow = () => openSidebar()

        onMounted(() => {
            window.addEventListener('toggleSidebar', handleToggle)
            window.addEventListener('showSidebar', handleShow)
        })

        onUnmounted(() => {
            window.removeEventListener('toggleSidebar', handleToggle)
            window.removeEventListener('showSidebar', handleShow)
        })

        return { sidebarOpen, toggleSidebar, closeSidebar }
    }
})
</script>

<template>
    <!-- Sidebar drawer -->
    <aside class="sidebar" :class="{ open: sidebarOpen }" role="navigation" aria-label="Menú lateral">
        <nav>
            <ul>
                <li>
                    <a href="#" @click.prevent="goInicio($event); closeSidebar()">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/3/35/Tux.svg" alt="Inicio" />
                        <span>Inicio</span>
                    </a>
                </li>
                <li>
                    <a href="#" @click.prevent="goBiblioteca($event); closeSidebar()">
                        <img src="/Assets/Biblioteca.svg" alt="Biblioteca" />
                        <span>Biblioteca</span>
                    </a>
                </li>
                <li>
                    <a href="#" @click.prevent="goRanking($event); closeSidebar()">
                        <img src="/Assets/Ranking.svg" alt="Ranking" />
                        <span>Ranking</span>
                    </a>
                </li>
                <li>
                    <a href="#" @click.prevent="goConfig($event); closeSidebar()">
                        <img src="/Assets/Configuración.svg" alt="Configuración" />
                        <span>Configuración</span>
                    </a>
                </li>
            </ul>
        </nav>
    </aside>
    <div v-if="sidebarOpen" class="sidebar-overlay" @click="closeSidebar" aria-label="Cerrar menú"></div>
</template>

<style scoped>
/* Sidebar styles */
.sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 280px;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(20px);
    border-right: 1px solid rgba(255, 255, 255, 0.25);
    box-shadow: 4px 0 24px rgba(0, 0, 0, 0.2);
    z-index: 1100;
    transform: translateX(-100%);
    transition: transform 0.25s ease;
    padding: 24px 12px;
    overflow-y: auto;
}
.sidebar.open { transform: translateX(0); }
.sidebar nav { display: flex; flex-direction: column; }
.sidebar ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.sidebar li { margin: 0; }
.sidebar a {
    display: flex; align-items: center; gap: 14px; padding: 12px 14px;
    color: white; text-decoration: none; font-size: 16px; font-weight: 500;
    border-radius: 12px; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.15);
    transition: all 0.25s ease; position: relative; overflow: hidden;
}
.sidebar a:hover { background: rgba(255, 255, 255, 0.2); border-color: rgba(255, 255, 255, 0.35); transform: translateX(4px); }
.sidebar img { width: 28px; height: 28px; object-fit: contain; filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2)); }
.sidebar span { letter-spacing: 0.3px; }

.sidebar-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.5); z-index: 1000; }

@media (max-width: 768px) {
    .sidebar { width: 80%; max-width: 320px; }
}
</style>
