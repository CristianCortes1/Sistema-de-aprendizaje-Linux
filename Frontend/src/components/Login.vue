<script>
export default {
    name: 'LoginComponent',
    emits: ['login'],
    methods: {
        handleLogin() {
            // Credenciales por defecto para pruebas
            const defaultEmail = 'admin'
            const defaultPassword = '123'

            // Obtener valores de los inputs
            const emailInput = this.$el.querySelector('input[type="email"]')
            const passwordInput = this.$el.querySelector('input[type="password"]')

            const email = emailInput.value
            const password = passwordInput.value

            // Validación simple con credenciales por defecto
            if (email === defaultEmail && password === defaultPassword) {
                console.log('✅ Login exitoso!')
                this.$emit('login') // Emite evento al componente padre
            } else {
                console.log('❌ Credenciales incorrectas')
                alert('Credenciales incorrectas.\nUsa:\nEmail: admin\nPassword: 123')
            }
        }
    }
}
</script>



<template>
    <div class="login">
        <div class="Background"> </div>


        <div class="Plantilla">
            <img src="https://upload.wikimedia.org/wikipedia/commons/3/35/Tux.svg" alt="Mi logo" />
            <h1>Bienvenido a Penguin Path</h1>
            <p>La mejor plataforma para aprender linux paso a paso.</p><br>
            <div class="form-group">
                <label class=label-left>Correo electrónico</label>
                <input type="email" placeholder="ejemplo@correo.com" />
            </div>

            <div class="form-group">
                <label class="label-left">Contraseña</label>
                <input type="password" placeholder="Ingresa tu contraseña" />
            </div>

            <button class="login-btn" @click="handleLogin">Iniciar sesión</button>

            <div class="links">
                <a href="#" class="forgot-password">¿Olvidaste tu contraseña?</a>
                <p class="register-text">¿No tienes cuenta? <a href="#" class="register-link">Regístrate</a></p>
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