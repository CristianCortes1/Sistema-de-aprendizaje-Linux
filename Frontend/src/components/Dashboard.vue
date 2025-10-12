<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import AuthService from '../services/AuthService'
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
            avatar: ""
        })

        const modules = ref([
            { name: 'Comandos básicos', icon: '' },
            { name: 'Archivos y directorios', icon: '/Assets/Archivos.svg' },
            { name: 'Permisos', icon: '/Assets/Permisos.svg' },
            { name: 'Procesos y señales', icon: '/Assets/Procesos.svg' },
        ])

        onMounted(() => {
            const storedUser = localStorage.getItem('user')
            if (storedUser) {
                const parsed = JSON.parse(storedUser)
                user.value.username = parsed.username
                user.value.racha = parsed.racha
                user.value.experiencia = parsed.experiencia
                user.value.avatar = parsed.avatar
                user.value.correo = parsed.correo
            }
        })

        const logout = () => {
            AuthService.logout() // limpiar token del backend si es necesario
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.href = '/'
        }

        const goInicio = () => router.push('/dashboard')
        const goBiblioteca = () => router.push('/biblioteca')
        const goRanking = () => router.push('/ranking')
        const goConfig = () => router.push('/configuracion')
        const goLeccion = (id: number) => router.push(`/leccion/${id}`)

        return { user, modules, logout, goInicio, goBiblioteca, goRanking, goConfig, goLeccion }
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

        <!-- PROGRESO -->
        <h1 class="titulo">Tu progreso en Linux</h1>
        <p class="subtitulo">Domina la línea de comandos paso a paso</p>

        <div class="form-group">
            <div class="card" v-for="(module, index) in modules" :key="module.name">
                <button type="button" @click="index === 0 ? goLeccion(1) : null" :disabled="index > 1">
                    <img v-if="module.icon" :src="module.icon" :alt="module.name" />
                    <span v-else>>_</span>
                    <span>{{ module.name }}</span>
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

.form-group .card:nth-child(1) button {
    /* background: #1e88e5;
    border: 2px solid #bdbdbd; */

    background: rgb(68, 148, 201);
}

.form-group .card:nth-child(1) button::after {
    content: "✓";
    position: absolute;
    top: 15px;
    right: 15px;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(30, 109, 188, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    color: white;
}

.form-group .card:nth-child(2) button {
    /* background: #fbc02d;
    color: #333;
    border: 2px solid #bdbdbd; */
    background: linear-gradient(135deg, rgba(255, 107, 53, 0.9), rgba(247, 147, 30, 0.8));
}

.form-group .card:nth-child(3) button {
    /* background: #424242;
    border: 2px solid #bdbdbd; */

    background: rgba(55, 65, 81, 0.8);
    opacity: 0.7;
}

.form-group .card:nth-child(3) button::after {
    content: "🔒";
    position: absolute;
    top: 15px;
    right: 15px;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(107, 114, 128, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
}

.form-group .card:nth-child(4) button {
    /* background: #424242;
    border: 2px solid #bdbdbd; */

    background: rgba(55, 65, 81, 0.8);
    opacity: 0.7;
}

.form-group .card:nth-child(4) button::after {
    content: "🔒";
    position: absolute;
    top: 15px;
    right: 15px;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(107, 114, 128, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
}

.form-group button:hover {
    /* transform: scale(1.05);
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2); */

    transform: translateY(-4px);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.3);
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
