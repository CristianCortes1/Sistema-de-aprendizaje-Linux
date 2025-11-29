<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AuthService from '../services/AuthService'

const router = useRouter()
const route = useRoute()
const loading = ref(true)
const message = ref('')
const isSuccess = ref(false)
const countdown = ref(5)
const resendEmail = ref('')
const isResending = ref(false)
const resendMessage = ref('')
const showResendForm = ref(false)

onMounted(async () => {
    const token = typeof route.query.token === 'string' ? route.query.token : ''
    
    if (!token) {
        message.value = 'Token de confirmación no encontrado'
        isSuccess.value = false
        loading.value = false
        return
    }

    try {
        await AuthService.confirmEmail(token)
        
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

    } catch (error: any) {
        console.error('Error confirmando email:', error)
        message.value = error.message || 'Error al confirmar el email. El token puede haber expirado o ser inválido.'
        isSuccess.value = false
        showResendForm.value = true
    } finally {
        loading.value = false
    }
})

const handleResendEmail = async () => {
    if (!resendEmail.value || !resendEmail.value.includes('@')) {
        resendMessage.value = 'Por favor ingresa un correo electrónico válido'
        return
    }

    isResending.value = true
    resendMessage.value = ''

    try {
        await AuthService.resendConfirmationEmail(resendEmail.value)
        resendMessage.value = '✅ Si el correo existe en nuestro sistema, recibirás un nuevo email de confirmación. Por favor revisa tu bandeja de entrada.'
        resendEmail.value = ''
    } catch (error: any) {
        console.error('Error reenviando email:', error)
        resendMessage.value = error.message || '❌ Error al reenviar el email. Por favor intenta más tarde.'
    } finally {
        isResending.value = false
    }
}
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
                    <div v-if="showResendForm" class="resend-form">
                        <h3>¿Token expirado?</h3>
                        <p class="resend-description">Ingresa tu correo electrónico para recibir un nuevo link de confirmación</p>
                        
                        <div class="input-group">
                            <input 
                                v-model="resendEmail" 
                                type="email" 
                                placeholder="Tu correo electrónico"
                                class="email-input"
                                :disabled="isResending"
                                @keyup.enter="handleResendEmail"
                            />
                            <button 
                                @click="handleResendEmail" 
                                class="resend-btn"
                                :disabled="isResending"
                            >
                                <span v-if="!isResending">Reenviar Email</span>
                                <span v-else>Enviando...</span>
                            </button>
                        </div>
                        
                        <p v-if="resendMessage" class="resend-message" :class="{ 'success': resendMessage.includes('✅') }">
                            {{ resendMessage }}
                        </p>
                    </div>
                    
                    <div class="divider">o</div>
                    
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

.resend-form {
    width: 100%;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 12px;
    margin-bottom: 15px;
}

.resend-form h3 {
    color: #333;
    margin-bottom: 8px;
    font-size: 18px;
}

.resend-description {
    color: #666;
    font-size: 14px;
    margin-bottom: 12px;
}

.input-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 8px;
}

.email-input {
    padding: 12px;
    border: 2px solid #ddd;
    border-radius: 8px;
    font-size: 14px;
    transition: border-color 0.3s;
}

.email-input:focus {
    outline: none;
    border-color: #ff6600;
}

.email-input:disabled {
    background-color: #f0f0f0;
    cursor: not-allowed;
}

.resend-btn {
    background-color: #ff6600;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
}

.resend-btn:hover:not(:disabled) {
    background-color: #e55a00;
}

.resend-btn:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
}

.resend-message {
    margin-top: 8px;
    padding: 10px;
    border-radius: 6px;
    font-size: 14px;
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
}

.resend-message.success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
}

.divider {
    display: flex;
    align-items: center;
    text-align: center;
    color: #999;
    margin: 15px 0;
}

.divider::before,
.divider::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #ddd;
    margin: 0 10px;
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

    .resend-form {
        padding: 15px;
    }

    .resend-form h3 {
        font-size: 16px;
    }

    .input-group {
        gap: 8px;
    }
}
</style>