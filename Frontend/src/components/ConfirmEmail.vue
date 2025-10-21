<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { API_URL } from '../config/api'

const router = useRouter()
const route = useRoute()
const loading = ref(true)
const message = ref('')
const isSuccess = ref(false)
const countdown = ref(5)

onMounted(async () => {
    const token = typeof route.query.token === 'string' ? route.query.token : ''
    
    if (!token) {
        message.value = 'Token de confirmación no encontrado'
        isSuccess.value = false
        loading.value = false
        return
    }

    try {
        const response = await fetch(`${API_URL}/auth/confirm-email?token=${token}`)
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`)
        }

        const data = await response.json()
        message.value = 'Email confirmado exitosamente. ¡Ya puedes iniciar sesión!'
        isSuccess.value = true
        
        // Countdown para redirección
        const interval = setInterval(() => {
            countdown.value--
            if (countdown.value <= 0) {
                clearInterval(interval)
                router.push('/')
            }
        }, 1000)

    } catch (error) {
        console.error('Error confirmando email:', error)
        message.value = 'Error al confirmar el email. El token puede haber expirado o ser inválido.'
        isSuccess.value = false
    } finally {
        loading.value = false
    }
})
</script>

<template>
    <div class="confirm-email">
        <div class="Background"></div>
        <div class="Plantilla">
            <div v-if="loading" class="loading">
                <div class="spinner"></div>
                <h2>Confirmando tu email...</h2>
                <p>Por favor espera un momento</p>
            </div>
            
            <div v-else class="result">
                <div class="icon">
                    <span v-if="isSuccess" class="success-icon">✅</span>
                    <span v-else class="error-icon">❌</span>
                </div>
                
                <h2 :class="{ 'success': isSuccess, 'error': !isSuccess }">
                    {{ isSuccess ? '¡Confirmación exitosa!' : 'Error de confirmación' }}
                </h2>
                
                <p class="message">{{ message }}</p>
                
                <div v-if="isSuccess" class="success-actions">
                    <p class="redirect-info">
                        Serás redirigido al login en {{ countdown }} segundos...
                    </p>
                    <button @click="router.push('/')" class="login-btn">
                        Ir al Login ahora
                    </button>
                </div>
                
                <div v-else class="error-actions">
                    <button @click="router.push('/registro')" class="register-btn">
                        Volver a registrarse
                    </button>
                    <button @click="router.push('/')" class="login-btn">
                        Ir al Login
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.confirm-email {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    position: relative;
}

.Background {
    position: fixed;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    background: linear-gradient(135deg, #d17a47 0%, #4a2c5a 100%);
    z-index: -1;
}

.Plantilla {
    background: #fff;
    padding: 40px;
    border-radius: 20px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    text-align: center;
    max-width: 500px;
    width: 100%;
}

.loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #ff6600;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.result {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

.icon {
    font-size: 48px;
    margin-bottom: 10px;
}

.success-icon {
    color: #28a745;
}

.error-icon {
    color: #dc3545;
}

h2.success {
    color: #28a745;
    margin-bottom: 15px;
}

h2.error {
    color: #dc3545;
    margin-bottom: 15px;
}

.message {
    color: #666;
    font-size: 16px;
    line-height: 1.5;
    margin-bottom: 20px;
}

.success-actions,
.error-actions {
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 100%;
}

.redirect-info {
    color: #888;
    font-size: 14px;
    margin-bottom: 10px;
}

.login-btn,
.register-btn {
    background-color: #ff6600;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
}

.login-btn:hover,
.register-btn:hover {
    background-color: #e55a00;
}

.register-btn {
    background-color: #6c757d;
}

.register-btn:hover {
    background-color: #5a6268;
}

@media (max-width: 480px) {
    .Plantilla {
        padding: 30px 20px;
        margin: 20px;
    }
    
    .icon {
        font-size: 36px;
    }
    
    h2 {
        font-size: 20px;
    }
    
    .message {
        font-size: 14px;
    }
}
</style>