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
        const loading = ref<boolean>(false)
        const router = useRouter()

        const handleRegistro = async () => {
            if (!username.value || !correo.value || !password.value) {
                alert('Por favor llena todos los campos')
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

                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`)
                }

                const user = await response.json()
                console.log('✅ Registro exitoso:', user)

                alert('Usuario registrado con éxito')
                router.push('/') // 👈 redirige directo al login
            } catch (err) {
                console.error('❌ Error en registro:', err)
                alert('No se pudo registrar el usuario')
            } finally {
                loading.value = false
            }
        }

        return {
            username,
            correo,
            contraseña: password,
            loading,
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

            <form @submit.prevent="handleRegistro" class="form-group">
                <label for="username">Apodo:</label>
                <input v-model="username" type="text" id="username" placeholder="Escribe el apodo" required />

                <label for="correo">Correo:</label>
                <input v-model="correo" type="email" id="correo" placeholder="Escribe el correo" required />

                <label for="contraseña">Contraseña:</label>
                <input v-model="contraseña" type="password" id="contraseña" placeholder="Escribe la contraseña"
                    required />

                <button type="submit" class="boton-enviar" :disabled="loading">
                    {{ loading ? 'Registrando...' : 'Registrar' }}
                </button>
            </form>

            <router-link to="/" class="login-btn">
                Volver al Login
            </router-link>
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

button,
.login-btn {
    background-color: #ff6600;
    color: white;
    border: none;
    padding: 10px 20px;
    margin-top: 10px;
    border-radius: 5px;
    cursor: pointer;
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