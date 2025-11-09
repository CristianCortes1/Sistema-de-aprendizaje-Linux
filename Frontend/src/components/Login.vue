<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthService from '../services/AuthService'
import { API_URL } from '../config/api'

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')
const router = useRouter()

async function handleLogin() {
    // Limpiar mensaje de error previo
    errorMessage.value = ''

    if (!email.value || !password.value) {
        errorMessage.value = 'Por favor llena todos los campos'
        return
    }

    loading.value = true
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: email.value,
                password: password.value
            })
        })

        const data = await response.json()

        if (!response.ok) {
            // Manejar errores específicos del backend
            if (data.message) {
                if (data.message.includes('Account not activated') || data.message.includes('not activated')) {
                    errorMessage.value = 'Tu cuenta aún no está activada. Por favor revisa tu correo para confirmar tu cuenta.'
                } else if (data.message.includes('Invalid credentials') || data.message.includes('Unauthorized')) {
                    errorMessage.value = 'Usuario o contraseña incorrectos'
                } else {
                    errorMessage.value = data.message
                }
            } else {
                errorMessage.value = 'Error al iniciar sesión. Por favor intenta de nuevo.'
            }
            return
        }

        // Guardar token y datos del usuario en localStorage
        // La API de Nest devuelve access_token; mantenemos compat con token
        const token = data.token || data.access_token
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
    } catch (err) {
        console.error('❌ Error en login:', err)
        errorMessage.value = 'Error de conexión. Por favor verifica tu internet e intenta de nuevo.'
    } finally {
        loading.value = false
    }
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