<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { API_URL } from '../config/api'

export default defineComponent({
    name: 'RegistroComponent',
    setup() {
        const username = ref<string>('')
        const correo = ref<string>('')
        const password = ref<string>('')
        const confirmPassword = ref<string>('')
        const acceptedPrivacy = ref<boolean>(false)
        const acceptedTerms = ref<boolean>(false)
        const loading = ref<boolean>(false)
        const errorMessage = ref<string>('')
        const successMessage = ref<string>('')
        const router = useRouter()

        const handleRegistro = async () => {
            // Limpiar mensajes previos
            errorMessage.value = ''
            successMessage.value = ''

            // Validaciones
            if (!username.value || !correo.value || !password.value || !confirmPassword.value) {
                errorMessage.value = 'Por favor llena todos los campos'
                return
            }

            if (password.value !== confirmPassword.value) {
                errorMessage.value = 'Las contraseñas no coinciden'
                return
            }

            if (password.value.length < 6) {
                errorMessage.value = 'La contraseña debe tener al menos 6 caracteres'
                return
            }

            if (!acceptedPrivacy.value) {
                errorMessage.value = 'Debes aceptar la Política de Privacidad'
                return
            }

            if (!acceptedTerms.value) {
                errorMessage.value = 'Debes aceptar los Términos y Condiciones'
                return
            }

            loading.value = true
            try {
                const response = await fetch(`${API_URL}/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: username.value,
                        correo: correo.value,
                        password: password.value
                    })
                })

                const data = await response.json()

                if (!response.ok) {
                    // Manejar errores específicos del backend
                    if (data.message) {
                        if (data.message.includes('Username already exists')) {
                            errorMessage.value = 'Este nombre de usuario ya está en uso'
                        } else if (data.message.includes('Email already exists')) {
                            errorMessage.value = 'Este correo ya está registrado'
                        } else {
                            errorMessage.value = data.message
                        }
                    } else {
                        errorMessage.value = 'Error al registrar usuario'
                    }
                    return
                }

                console.log('✅ Registro exitoso:', data)
                successMessage.value = '¡Registro exitoso! Revisa tu correo para confirmar tu cuenta'
                
                // Redirigir después de 3 segundos
                setTimeout(() => {
                    router.push('/')
                }, 3000)
            } catch (err) {
                console.error('❌ Error en registro:', err)
                errorMessage.value = 'Error de conexión. Por favor intenta de nuevo'
            } finally {
                loading.value = false
            }
        }

        return {
            username,
            correo,
            contraseña: password,
            confirmPassword,
            acceptedPrivacy,
            acceptedTerms,
            loading,
            errorMessage,
            successMessage,
            handleRegistro
        }
    }
})
</script>

<template>
    <div class="login">
        <div class="Background"></div>
        <div class="Plantilla">
            <img src="https://upload.wikimedia.org/wikipedia/commons/3/35/Tux.svg" alt="Mi logo" />
            <h1>Crear cuenta en Penguin Path</h1>
            <p>Llena el formulario para registrarte.</p><br>

            <!-- Mensajes de error/éxito -->
            <div v-if="errorMessage" class="message error-message">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
                {{ errorMessage }}
            </div>

            <div v-if="successMessage" class="message success-message">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                {{ successMessage }}
            </div>

            <form @submit.prevent="handleRegistro" class="form-group">
                <label for="username">Apodo:</label>
                <input v-model="username" type="text" id="username" placeholder="Escribe el apodo" required />

                <label for="correo">Correo:</label>
                <input v-model="correo" type="email" id="correo" placeholder="Escribe el correo" required />

                <label for="contraseña">Contraseña:</label>
                <input v-model="contraseña" type="password" id="contraseña" placeholder="Mínimo 6 caracteres"
                    required />

                <label for="confirmPassword">Confirmar Contraseña:</label>
                <input v-model="confirmPassword" type="password" id="confirmPassword" placeholder="Repite la contraseña"
                    required />

                <!-- Checkboxes de aceptación -->
                <div class="checkbox-group">
                    <label class="checkbox-label">
                        <input type="checkbox" v-model="acceptedPrivacy" required />
                        <span>
                            He leído y acepto la 
                            <router-link to="/privacy-policy" target="_blank" class="inline-link">Política de Privacidad</router-link>
                        </span>
                    </label>
                </div>

                <div class="checkbox-group">
                    <label class="checkbox-label">
                        <input type="checkbox" v-model="acceptedTerms" required />
                        <span>
                            He leído y acepto los 
                            <router-link to="/terms" target="_blank" class="inline-link">Términos y Condiciones</router-link>
                        </span>
                    </label>
                </div>

                <button type="submit" class="boton-enviar" :disabled="loading">
                    {{ loading ? 'Registrando...' : 'Registrar' }}
                </button>
            </form>

            <router-link to="/" class="back-link">
                ← Volver al Login
            </router-link>

            <div class="legal-links">
                <router-link to="/privacy-policy" class="legal-link">Política de Privacidad</router-link>
                <span class="separator">•</span>
                <router-link to="/terms" class="legal-link">Términos y Condiciones</router-link>
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
}

button:hover:not(:disabled) {
    background-color: #e55b00;
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
    margin-top: 15px;
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