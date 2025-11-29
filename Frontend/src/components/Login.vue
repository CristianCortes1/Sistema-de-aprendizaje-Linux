<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthService from '../services/AuthService'

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

            <form @submit.prevent="handleLogin" class="form-group">
                <label for="email">Apodo:</label>
                <input v-model="email" type="text" id="email" placeholder="Ingresa tu apodo" required />

                <label for="password">Contraseña:</label>
                <input v-model="password" type="password" id="password" placeholder="Ingresa tu contraseña" required />

                <button type="submit" class="boton-enviar" :disabled="loading">
                    {{ loading ? 'Cargando...' : 'Iniciar sesión' }}
                </button>
            </form>

            <router-link to="/forgot-password" class="back-link">
                ¿Olvidaste tu contraseña?
            </router-link>

            <div class="legal-links">
                <router-link to="/registro" class="legal-link">¿No tienes cuenta? Regístrate</router-link>
            </div>
        </div>
    </div>
</template>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    text-decoration: none;
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
    margin-top: 50px;
    background: #fff;
    padding: 40px;
    border-radius: 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
    width: 550px;
    color: #333;
}

.Plantilla img {
    width: 80px;
    height: 80px;
    margin-bottom: 25px;
}

.Plantilla h1 {
    font-size: 2rem;
    margin-bottom: 10px;
    color: #333;
    text-shadow: none;
}

.Plantilla p {
    color: #666;
}

.label-left {
    display: block;
    text-align: left;
    margin-bottom: 5px;
}

label {
    display: block;
    text-align: left;
    margin-bottom: 5px;
    font-weight: 500;
    color: #333;
}

input {
    padding: 12px;
    margin-bottom: 15px;
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 8px;
    background: #fff;
    color: #333;
    font-size: 1rem;
}

input::placeholder {
    color: #999;
}

input:focus {
    outline: none;
    border-color: #ff6600;
    background: #fff;
}

button {
    background-color: #ff6600;
    color: white;
    border: none;
    padding: 12px 20px;
    margin-top: 10px;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 600;
    font-size: 1rem;
    width: 100%;
}

button:hover:not(:disabled) {
    background-color: #e55b00;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.back-link {
    display: inline-block;
    color: #666;
    text-decoration: none;
    font-size: 14px;
    margin-top: 20px;
    padding: 8px 16px;
    border-radius: 5px;
    transition: all 0.3s ease;
}

.back-link:hover {
    color: #ff6600;
    background: #f5f5f5;
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

.success-message {
    background: #efe;
    color: #2a7;
    border: 1px solid #cfc;
}

.success-message svg {
    color: #2a7;
    flex-shrink: 0;
}

.legal-links {
    margin-top: 20px;
    padding-top: 15px;
    border-top: 1px solid #eee;
    font-size: 12px;
    color: #999;
}

.legal-link {
    color: #999;
    text-decoration: none;
    transition: color 0.3s ease;
}

.legal-link:hover {
    color: #ff6600;
    text-decoration: underline;
}

.separator {
    margin: 0 8px;
    color: #ddd;
}

.checkbox-group {
    margin: 15px 0;
    text-align: left;
}

.checkbox-label {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    cursor: pointer;
    font-size: 14px;
    color: #555;
}

.checkbox-label input[type="checkbox"] {
    margin: 0;
    margin-top: 3px;
    width: auto;
    cursor: pointer;
    flex-shrink: 0;
}

.checkbox-label span {
    line-height: 1.5;
}

.inline-link {
    color: #ff6600;
    text-decoration: none;
    font-weight: 500;
}

.inline-link:hover {
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
