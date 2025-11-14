<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthService from '../services/AuthService'

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')
const router = useRouter()

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

async function handleLogin() {
    // Limpiar mensaje de error previo
    errorMessage.value = ''

    if (!email.value || !password.value) {
        errorMessage.value = 'Por favor llena todos los campos'
        return
    }

    loading.value = true
    try {
        const data = await AuthService.login(email.value, password.value)

        // Guardar token y datos del usuario en localStorage
        const token = data.access_token
        AuthService.setToken(token)
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify({
            id: data.user.id_Usuario,
            username: data.user.username,
            correo: data.user.correo,
            avatar: data.user.avatar,
            racha: data.user.racha,
            experiencia: data.user.experiencia,
            rol: data.user.rol
        }))

        // Redirección por rol
        if (data.user.rol === 'admin') {
            router.push('/admin')
        } else {
            router.push('/dashboard')
        }
    } catch (err: any) {
        console.error('❌ Error en login:', err)
        
        // Manejar errores específicos
        if (err.message.includes('Sesión expirada')) {
            // No mostrar este error en login, simplemente limpiar
            errorMessage.value = 'Por favor inicia sesión'
        } else if (err.message.includes('Account not activated') || err.message.includes('not activated') || err.message.includes('no está activada')) {
            errorMessage.value = 'Tu cuenta aún no está activada. Por favor revisa tu correo para confirmar tu cuenta.'
        } else if (err.message.includes('Invalid credentials') || err.message.includes('Unauthorized') || err.message.includes('401')) {
            errorMessage.value = 'Usuario o contraseña incorrectos'
        } else if (err.message.includes('conexión') || err.message.includes('network')) {
            errorMessage.value = 'Error de conexión. Por favor verifica tu internet e intenta de nuevo.'
        } else {
            errorMessage.value = err.message || 'Error al iniciar sesión. Por favor intenta de nuevo.'
        }
    } finally {
        loading.value = false
    }
}

function handleGoogleLogin() {
    // Redirigir a la ruta de Google OAuth del backend
    window.location.href = `${API_URL}/auth/google`
}
</script>


<template>
    <div class="login">
        <div class="Background"></div>
        <div class="Plantilla">
            <img src="https://upload.wikimedia.org/wikipedia/commons/3/35/Tux.svg" alt="Mi logo" />
            <h1>Bienvenido a Penguin Path</h1>
            <p>La mejor plataforma para aprender linux paso a paso.</p><br>

            <!-- Mensaje de error -->
            <div v-if="errorMessage" class="message error-message">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
                {{ errorMessage }}
            </div>

            <div class="form-group">
                <label class="label-left">Apodo</label>
                <input type="text" placeholder="Ingresa tu apodo" v-model="email" />
            </div>

            <div class="form-group">
                <label class="label-left">Contraseña</label>
                <input type="password" placeholder="Ingresa tu contraseña" v-model="password" />
            </div>

            <button class="login-btn" :disabled="loading" @click="handleLogin">
                {{ loading ? 'Cargando...' : 'Iniciar sesión' }}
            </button>

            <div class="divider">
                <span>O</span>
            </div>

            <button class="google-btn" @click="handleGoogleLogin" type="button">
                <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                    <path fill="none" d="M0 0h48v48H0z"/>
                </svg>
                Continuar con Google
            </button>

            <div class="links">
                <router-link to="/forgot-password" class="forgot-password">¿Olvidaste tu contraseña?</router-link>
                <p class="register-text">
                    ¿No tienes cuenta?
                    <router-link to="/registro" class="register-link">Regístrate</router-link>
                </p>
            </div>
        </div>
    </div>
</template>



<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    margin: 0;
    padding: 0;
}

html {
    margin: 0;
    padding: 0;
}

/* Si estás usando Vue, también resetea el div principal */
#app {
    margin: 0;
    padding: 0;
}

.login {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    position: relative;
    overflow-y: auto;
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
    margin-top: 100px;
    background: #fff;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
    width: 550px;

}

.Plantilla img {
    width: 80px;
    height: 80px;
    margin-bottom: 25px;
}

.label-left {
    display: block;
    text-align: left;
    margin-bottom: 5px;
}

input {
    padding: 10px;
    margin: 5px;
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 5px;
}

button {
    background-color: #ff6600;
    color: white;
    border: none;
    padding: 10px 20px;
    margin-top: 10px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    width: 100%;
}

button:hover:not(:disabled) {
    background-color: #e55b00;
}

button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.divider {
    display: flex;
    align-items: center;
    text-align: center;
    margin: 20px 0;
    color: #666;
}

.divider::before,
.divider::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #ddd;
}

.divider span {
    padding: 0 15px;
    font-size: 14px;
    font-weight: 500;
}

.google-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    background-color: white;
    color: #444;
    border: 1px solid #ddd;
    padding: 10px 20px;
    margin-top: 0;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 100%;
    font-weight: 500;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.google-btn:hover {
    background-color: #f8f9fa;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    border-color: #ccc;
}

.google-btn svg {
    flex-shrink: 0;
}

.message {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 20px;
    font-size: 14px;
    animation: slideIn 0.3s ease;
    text-align: left;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.error-message {
    background: #fee;
    color: #c33;
    border: 1px solid #fcc;
}

.error-message svg {
    color: #c33;
    flex-shrink: 0;
}

.links {
    margin-top: 20px;
}

.forgot-password {
    color: #ff6600;
    text-decoration: none;
    font-size: 14px;
    display: block;
    margin-bottom: 15px;
}

.forgot-password:hover {
    text-decoration: underline;
}

.register-text {
    color: #666;
    font-size: 14px;
}

.register-link {
    color: #ff6600;
    text-decoration: none;
    font-weight: 600;
}

.register-link:hover {
    text-decoration: underline;
}

@media (min-width: 768px) {
    .login {
        padding: 40px;
    }

    .Plantilla {
        max-width: 450px;
        padding: 50px 40px;
        border-radius: 25px;
    }

    .Plantilla h1 {
        font-size: 28px;
        margin-bottom: 10px;
    }

    .subtitle {
        font-size: 15px;
        margin-bottom: 35px;
    }

    .form-group {
        margin-bottom: 25px;
    }

    input {
        padding: 16px;
        font-size: 15px;
    }

    .login-btn {
        padding: 18px;
        font-size: 17px;
        margin: 15px 0 25px 0;
    }
}

/* Pantallas muy pequeñas */
@media (max-width: 480px) {
    .login {
        padding: 15px;
        align-items: flex-start;
        padding-top: 30px;
    }

    .Plantilla {
        padding: 30px 25px;
        border-radius: 15px;
        margin-bottom: 20px;
    }

    .Plantilla h1 {
        font-size: 22px;
    }

    .subtitle {
        font-size: 13px;
    }

    input {
        padding: 14px;
    }

    .login-btn {
        padding: 15px;
        font-size: 15px;
    }
}
</style>