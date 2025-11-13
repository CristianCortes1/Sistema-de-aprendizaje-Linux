<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import AuthService from '../services/AuthService'
import LessonService from '../services/LessonService'
import { useRouter } from 'vue-router'
import Header from './Header.vue'
import Footer from './Footer.vue'

export default defineComponent({
    setup() {
        const router = useRouter()
        const user = ref({
            username: '',
            correo: '',
            racha: 0,
            experiencia: 0,
            avatar: "",
            id: 0,
            rol: ''
        })

        const modules = ref<any[]>([])
        const selectedPage = ref('')

        const pickIcon = (title: string) => {
            const t = (title || '').toLowerCase()
            if (t.includes('archivo')) return '/Assets/Archivos.svg'
            if (t.includes('permiso')) return '/Assets/Permisos.svg'
            if (t.includes('proceso') || t.includes('señal') || t.includes('senial')) return '/Assets/Procesos.svg'
            if (t.includes('comando')) return '' // usa símbolo >_
            return ''
        }

        const fetchLessons = async () => {
            try {
                const userId = user.value.id
                if (!userId) {
                    console.error('No user ID found')
                    return
                }

                const data = await LessonService.getAvailableForUser(userId);
                modules.value = (Array.isArray(data) ? data : []).map((l: any) => ({
                    id: l.id,
                    name: l.titulo,
                    icon: pickIcon(l.titulo),
                    locked: l.locked,
                    progreso: l.progreso || 0
                }))
            } catch (e) {
                console.error('Error cargando lecciones:', e)
                modules.value = []
            }
        }

        onMounted(() => {
            const storedUser = localStorage.getItem('user')
            if (storedUser) {
                const parsed = JSON.parse(storedUser)
                user.value.username = parsed.username
                user.value.racha = parsed.racha
                user.value.experiencia = parsed.experiencia
                user.value.avatar = parsed.avatar
                user.value.correo = parsed.correo
                user.value.id = parsed.id_Usuario || parsed.id
                user.value.rol = parsed.rol || parsed.role || ''
            }

            // Cargar lecciones después de obtener el usuario
            fetchLessons()
        })

        const logout = () => {
            AuthService.logout()
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.href = '/'
        }

        const goInicio = () => router.push('/dashboard')
        const goBiblioteca = () => router.push('/biblioteca')
        const goRanking = () => router.push('/ranking')
        const goConfig = () => router.push('/configuracion')
        const goLeccion = (module: any) => {
            if (!module.locked) {
                router.push(`/leccion/${module.id}`)
            }
        }

        const navigateToPage = () => {
            if (!selectedPage.value) return
            if (selectedPage.value === 'admin') {
                router.push({ name: 'AdminDashboard' })
            } else if (selectedPage.value === 'dashboard') {
                router.push({ name: 'Dashboard' })
            }
            selectedPage.value = ''
        }

        const isAdmin = () => user.value.rol === 'admin'

        return { user, modules, logout, goInicio, goBiblioteca, goRanking, goConfig, goLeccion, selectedPage, navigateToPage, isAdmin }
    },
    components: {
        Header,
        Footer
    }
})
</script>

<template>
    <div class="dashboard">


        <Header :user="user" :logout="logout" />

        <div v-if="isAdmin()" class="nav-selector">
            <label for="pagina" class="nav-label">Ir a:</label>
            <select id="pagina" v-model="selectedPage" @change="navigateToPage" class="nav-select">
                <option value="">Selecciona una opción</option>
                <option value="admin">Dashboard Admin</option>
                <option value="dashboard">Dashboard Usuario</option>
            </select>
        </div>

        <!-- PROGRESO -->
        <h1 class="titulo">Tu progreso en Linux</h1>
        <p class="subtitulo">Domina la línea de comandos paso a paso</p>

        <div class="form-group">
            <div class="card" v-for="module in modules" :key="module.id" :class="{ 'locked': module.locked }">
                <button type="button" @click="goLeccion(module)" :disabled="module.locked">
                    <img v-if="module.icon" :src="module.icon" :alt="module.name" />
                    <span v-else>>_</span>
                    <span>{{ module.name }}</span>
                    <span v-if="module.locked" class="lock-icon">🔒</span>
                    <span v-if="!module.locked && module.progreso > 0" class="progress-indicator">{{ module.progreso }}%</span>
                </button>
            </div>
        </div>

        <Footer :goInicio="goInicio" :goBiblioteca="goBiblioteca" :goRanking="goRanking" :goConfig="goConfig" />
    </div>
</template>


<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.dashboard {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    /* background: linear-gradient(135deg, #ff6b35 0%, #dc8522 25%, #c2185b 75%, #7b1fa2 100%); */
    background: linear-gradient(135deg, #ef9c6c 0%, #c57da1 50%, #956eaa 100%);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
}

.logo {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 20px;
    font-weight: bold;
}

.logo img {
    width: 40px;
    height: 40px;
    object-fit: contain;
}

.brand {
    font-size: 22px;
    font-weight: bold;
    color: white;
}

.status {
    display: flex;
    align-items: center;
    gap: 15px;
    font-size: 14px;
}

.status div {
    display: flex;
    align-items: center;
    gap: 6px;
    /* font-weight: bold; */
    color: white;
}

.status img {
    width: 28px;
    height: 28px;
    object-fit: contain;
    border-radius: 50%;
}

.status .perfil img {
    background-color: white;
    border-radius: 90%;
    padding: 4px;
    /* display: flex; */
    /* align-items: center;
    justify-content: center; */
    width: 45px;
    height: 45px;
    backdrop-filter: blur(10px);
}

.titulo {
    text-align: center;
    margin: 30px 0 10px 0;
    font-size: 35px;
    font-weight: 300;
    margin-bottom: 10px;
    color: white;
}

.subtitulo {
    text-align: center;
    color: rgba(255, 255, 255, 0.8);
    font-size: 16px;
    margin-bottom: 40px;
}

.form-group {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
    max-width: 100%;
    margin: 0 auto;
    padding: 0 10px 70px 10px;
}

.card {
    flex: 1 1 200px;
    max-width: 250px;
}

.form-group button {
    width: 100%;
    min-width: 180px;
    max-width: 250px;
    padding: 25px 20px;
    border-radius: 16px;
    border: none;
    text-align: left;
    transition: all 0.3s ease;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    gap: 15px;
    font-size: 18px;
    font-weight: 600;
    color: white;
    min-height: 120px;
}

/* Estilos para lecciones desbloqueadas (por defecto) */
.form-group button {
    background: linear-gradient(135deg, rgba(68, 148, 201, 0.9), rgba(30, 136, 229, 0.8));
}

.form-group button:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.3);
}

/* Estilos para lecciones bloqueadas */
.form-group .card.locked button {
    background: rgba(55, 65, 81, 0.8);
    opacity: 0.7;
    cursor: not-allowed;
}

.form-group .card.locked button:hover {
    transform: none;
    box-shadow: none;
}

.lock-icon {
    position: absolute;
    top: 15px;
    right: 15px;
    font-size: 20px;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
}

.progress-indicator {
    position: absolute;
    top: 15px;
    right: 15px;
    background: rgba(76, 175, 80, 0.9);
    color: white;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: bold;
}

.form-group button img {
    width: 60px;
    height: 60px;
    object-fit: contain;
}

.logout-btn {
    background: none;
    border: none;
    color: white;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    border-radius: 8px;
    transition: background 0.3s ease;
    position: relative;
    transition: all 0.3s ease;
}

.logout-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
}

.nav-selector {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
    margin: 20px 20px 0 20px;
}

.nav-label {
    color: white;
    font-weight: 500;
    font-size: 15px;
}

.nav-select {
    padding: 10px 16px;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 10px;
    color: white;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: 200px;
}

.nav-select:hover {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.4);
}

.nav-select:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.5);
}

.nav-select option {
    background: #956eaa;
    color: white;
    padding: 10px;
}

@media (max-width: 768px) {
    .header {
        padding: 15px 15px;
        min-height: 70px;
    }

    .header img.logo {
        width: 32px;
        height: 32px;
    }

    .brand {
        font-size: 18px;
    }

    .status {
        gap: 10px;
        font-size: 11px;
    }

    .perfil {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 0.8rem;
    }

    .form-group {
        flex-direction: column;
        align-items: center;
    }

    .form-group .card {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 15px;
        padding: 10px;
    }

    .footer {
        flex-direction: row;
        justify-content: space-around;
    }
}
</style>
