<script lang="ts">
import { defineComponent, PropType, computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthService from '../services/AuthService'

export default defineComponent({
    props: {
        user: {
            type: Object,
            required: false,
            default: () => ({})
        },
        logout: {
            type: Function as PropType<(event: MouseEvent) => void>,
            required: false
        }
    },
    setup(props) {
        const router = useRouter()
        const localUser = ref({
            username: '',
            correo: '',
            racha: 0,
            experiencia: 0,
            avatar: ""
        })

        onMounted(() => {
            const storedUser = localStorage.getItem('user')
            if (storedUser) {
                const parsed = JSON.parse(storedUser)
                localUser.value.username = parsed.username
                localUser.value.racha = parsed.racha
                localUser.value.experiencia = parsed.experiencia
                localUser.value.avatar = parsed.avatar
                localUser.value.correo = parsed.correo
            }
        })

        const displayUser = computed(() => {
            // Si se pasa un user prop con datos, usarlo; si no, usar localUser
            return Object.keys(props.user || {}).length > 0 ? props.user : localUser.value
        })

        const handleLogout = () => {
            if (props.logout) {
                props.logout({} as MouseEvent)
            } else {
                AuthService.logout()
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                router.push('/')
            }
        }

        return { displayUser, handleLogout }
    }
})
</script>

<template>
    <header class="header">
        <div class="logo">
            <img src="https://upload.wikimedia.org/wikipedia/commons/3/35/Tux.svg" alt="Penguin" class="logo" />
            <span class="brand">Penguin Path</span>
        </div>
        <div class="status">
            <div class="streak">
                <img src="/Assets/Racha.svg" alt="Racha" />
                <span>Racha: {{ displayUser.racha }} días</span>
            </div>
            <div class="xp">
                <img src="/Assets/xp.svg" alt="XP" />
                <span>{{ displayUser.experiencia }} XP</span>
            </div>
            <div class="perfil">
                <img :src="displayUser.avatar || '/Assets/Avatar1.svg'" alt="Perfil" />
                <span>{{ displayUser.username }}</span>
                <button class="logout-btn" @click="handleLogout">
                </button>
            </div>
        </div>
    </header>
</template>

<style scoped>
/* ...existing header styles from Dashboard.vue... */
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 10px;
    background: linear-gradient(135deg, #ca672d 0%, #411a56 100%);
    min-height: 80px;
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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
    width: 45px;
    height: 45px;
    backdrop-filter: blur(10px);
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
}
</style>