<script>
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AuthService from '../services/AuthService'
import Header from './Header.vue'
import Footer from './Footer.vue'
import { API_URL } from '../config/api'

export default {
    name: 'Ranking',
    components: {
        Header,
        Footer
    },
    setup() {
        const router = useRouter()
        const ranking = ref([])
        const localUser = ref({
            username: '',
            correo: '',
            racha: 0,
            experiencia: 0,
            avatar: ""
        })

        onMounted(async () => {
            document.title = 'Ranking - Sistema de Aprendizaje Linux'

            const storedUser = localStorage.getItem('user')
            if (storedUser) {
                const parsed = JSON.parse(storedUser)
                localUser.value.username = parsed.username
                localUser.value.racha = parsed.racha
                localUser.value.experiencia = parsed.experiencia
                localUser.value.avatar = parsed.avatar
                localUser.value.correo = parsed.correo
            }

            await fetchRanking()
        })

        const displayUser = computed(() => {
            return localUser.value
        })

        const fetchRanking = async () => {
            try {
                const token = AuthService.getToken()
                const response = await fetch(`${API_URL}/users/ranking`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })

                if (!response.ok) throw new Error(`Error HTTP: ${response.status}`)

                const data = await response.json()
                ranking.value = data
            } catch (error) {
                console.error('Error fetching ranking:', error)
                ranking.value = [
                    { username: 'CristianUser', experiencia: 1500 },
                    { username: 'Cristian', experiencia: 900 },
                    { username: 'juana', experiencia: 600 },
                    { username: 'cherry', experiencia: 450 }
                ]
            }
        }

        const getDefaultAvatar = (username) => {
            const colors = ['FF6B6B', '4ECDC4', '45B7D1', 'FFA07A', '98D8C8', 'F7DC6F', 'BB8FCE']
            const colorIndex = username.length % colors.length
            return `https://ui-avatars.com/api/?name=${username}&background=${colors[colorIndex]}&color=fff&size=128&bold=true`
        }

        const handleLogout = () => {
            AuthService.logout()
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            router.push('/')
        }

        return {
            ranking,
            displayUser,
            handleLogout,
            getDefaultAvatar
        }
    }
}
</script>

<template>
    <div class="page">
        <Header :user="displayUser" :logout="handleLogout" />

        <div class="content">
            <h1 class="title">Ranking de Usuarios</h1>

            <div class="ranking-container">
                <div class="ranking-header">
                    <span class="col-rank">Rank</span>
                    <span class="col-user">Usuario</span>
                    <span class="col-xp">Experiencia</span>
                </div>

                <div class="ranking-list">
                    <div v-for="(user, index) in ranking" :key="user.username"
                        :class="['ranking-item', { 'top-three': index < 3, 'first-place': index === 0 }]">
                        
                        <div class="rank-column">
                            <span v-if="index === 0" class="medal gold">🥇</span>
                            <span v-else-if="index === 1" class="medal silver">🥈</span>
                            <span v-else-if="index === 2" class="medal bronze">🥉</span>
                            <span v-else class="rank-number">{{ index + 1 }}</span>
                        </div>

                        <div class="user-column">
                            <div class="avatar">
                                <img :src="user.avatar || getDefaultAvatar(user.username)" :alt="user.username" />
                            </div>
                            <span class="username">{{ user.username }}</span>
                        </div>

                        <div class="xp-column">
                            <span class="xp-value">{{ user.experiencia }} XP</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <Footer :goInicio="() => $router.push('/dashboard')" :goBiblioteca="() => $router.push('/biblioteca')"
            :goRanking="() => $router.push('/ranking')" :goConfig="() => $router.push('/configuracion')" />
    </div>
</template>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.page {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #ef9c6c 0%, #c57da1 50%, #956eaa 100%);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    overflow-y: auto;
    color: #fff;
}

.content {
    padding: 30px 20px 120px; /* Reducido de 90px a 70px */
    max-width: 800px;
    margin: 0 auto;
}

.title {
    font-size: 42px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 15px; /* Reducido de 20px a 15px */
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.ranking-container {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 16px;
    padding: 0;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    overflow: hidden;
}

.ranking-header {
    display: grid;
    grid-template-columns: 80px 1fr 150px;
    padding: 16px 20px;
    background: rgba(0, 0, 0, 0.3);
    font-weight: 600;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 2px solid rgba(255, 255, 255, 0.2);
}

.col-rank {
    text-align: center;
}

.col-user {
    text-align: left;
    padding-left: 10px;
}

.col-xp {
    text-align: right;
}

.ranking-list {
    display: flex;
    flex-direction: column;
}

.ranking-item {
    display: grid;
    grid-template-columns: 80px 1fr 150px;
    align-items: center;
    padding: 16px 20px;
    background: rgba(255, 255, 255, 0.05);
    transition: all 0.3s ease;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.ranking-item:last-child {
    border-bottom: none;
}

.ranking-item:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(5px);
}

.ranking-item.first-place {
    background: linear-gradient(90deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 193, 7, 0.1) 100%);
    border-left: 4px solid #FFD700;
}

.ranking-item.top-three {
    background: rgba(255, 255, 255, 0.08);
}

.rank-column {
    display: flex;
    align-items: center;
    justify-content: center;
}

.medal {
    font-size: 32px;
}

.rank-number {
    font-size: 20px;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.7);
}

.user-column {
    display: flex;
    align-items: center;
    gap: 15px;
    padding-left: 10px;
}

.avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid rgba(255, 255, 255, 0.5); /* Aumentado de 0.3 a 0.5 */
    box-shadow: 0 2px 12px rgba(255, 255, 255, 0.2); /* Cambiado de sombra negra a blanca */
    flex-shrink: 0;
    background: white; /* Fondo blanco para que la imagen se vea más clara */
}

.avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(1.1) contrast(1.05); /* Aumenta brillo y contraste */
}

.username {
    font-size: 16px;
    font-weight: 600;
}

.xp-column {
    text-align: right;
}

.xp-value {
    font-size: 16px;
    font-weight: 700;
    color: #FFD700;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

/* RESPONSIVE */
@media (max-width: 768px) {
    .content {
        padding: 65px 15px 120px; /* Reducido de 80px a 65px */
    }

    .title {
        font-size: 24px;
        margin-bottom: 12px; /* Reducido de 15px a 12px */
    }

    .ranking-header {
        grid-template-columns: 60px 1fr 100px;
        padding: 12px 15px;
        font-size: 12px;
    }

    .ranking-item {
        grid-template-columns: 60px 1fr 100px;
        padding: 12px 15px;
    }

    .medal {
        font-size: 24px;
    }

    .rank-number {
        font-size: 16px;
    }

    .avatar {
        width: 40px;
        height: 40px;
    }

    .username {
        font-size: 14px;
    }

    .xp-value {
        font-size: 14px;
    }
}
</style>