<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
    name: 'PrivacyPolicy',
    setup() {
        const router = useRouter()
        return { router }
    }
})
</script>

<template>
    <div class="legal-page">
        <div class="container">
            <button @click="router.back()" class="back-button">
                ← Volver
            </button>

            <div class="content">
                <h1>Política de Privacidad</h1>
                <p class="last-updated">Última actualización: Noviembre 2025</p>

                <section>
                    <h2>1. Información que Recopilamos</h2>
                    <p>En Penguin Path recopilamos la siguiente información cuando te registras:</p>
                    <ul>
                        <li><strong>Nombre de usuario:</strong> Para identificarte en la plataforma</li>
                        <li><strong>Correo electrónico:</strong> Para comunicaciones importantes y recuperación de cuenta</li>
                        <li><strong>Contraseña:</strong> Almacenada de forma segura con hash bcrypt</li>
                        <li><strong>Progreso de aprendizaje:</strong> Lecciones completadas, experiencia y logros</li>
                    </ul>
                </section>

                <section>
                    <h2>2. Cómo Usamos tu Información</h2>
                    <p>Utilizamos tu información para:</p>
                    <ul>
                        <li>Proporcionar acceso a la plataforma de aprendizaje</li>
                        <li>Personalizar tu experiencia de aprendizaje</li>
                        <li>Enviar notificaciones sobre tu progreso</li>
                        <li>Mejorar nuestros servicios educativos</li>
                        <li>Comunicar actualizaciones importantes del sistema</li>
                    </ul>
                </section>

                <section>
                    <h2>3. Protección de Datos</h2>
                    <p>Nos tomamos muy en serio la seguridad de tus datos:</p>
                    <ul>
                        <li>Las contraseñas se almacenan con encriptación bcrypt</li>
                        <li>Usamos HTTPS para todas las comunicaciones</li>
                        <li>Los contenedores Docker aíslan tu ambiente de aprendizaje</li>
                        <li>No compartimos tu información con terceros sin tu consentimiento</li>
                    </ul>
                </section>

                <section>
                    <h2>4. Tus Derechos</h2>
                    <p>Tienes derecho a:</p>
                    <ul>
                        <li>Acceder a tu información personal</li>
                        <li>Corregir datos incorrectos</li>
                        <li>Solicitar la eliminación de tu cuenta</li>
                        <li>Exportar tus datos de progreso</li>
                    </ul>
                </section>

                <section>
                    <h2>5. Cookies y Almacenamiento Local</h2>
                    <p>Utilizamos:</p>
                    <ul>
                        <li><strong>LocalStorage:</strong> Para mantener tu sesión activa</li>
                        <li><strong>JWT Tokens:</strong> Para autenticación segura</li>
                    </ul>
                </section>

                <section>
                    <h2>6. Contacto</h2>
                    <p>Si tienes preguntas sobre esta política, contáctanos en:</p>
                    <p><strong>Email:</strong> privacy@penguinpath.com</p>
                </section>
            </div>
        </div>
    </div>
</template>

<style scoped>
.legal-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #ef9c6c 0%, #c57da1 50%, #956eaa 100%);
    padding: 40px 20px;
}

.container {
    max-width: 800px;
    margin: 0 auto;
}

.back-button {
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s ease;
    margin-bottom: 20px;
}

.back-button:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateX(-5px);
}

.content {
    background: white;
    padding: 40px;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

h1 {
    color: #333;
    font-size: 32px;
    margin-bottom: 10px;
}

.last-updated {
    color: #666;
    font-size: 14px;
    margin-bottom: 30px;
}

section {
    margin-bottom: 30px;
}

h2 {
    color: #ff6600;
    font-size: 22px;
    margin-bottom: 15px;
}

p {
    color: #555;
    line-height: 1.6;
    margin-bottom: 15px;
}

ul {
    margin-left: 20px;
    color: #555;
}

li {
    margin-bottom: 10px;
    line-height: 1.6;
}

strong {
    color: #333;
}

@media (max-width: 768px) {
    .legal-page {
        padding: 20px 15px;
    }

    .content {
        padding: 25px 20px;
    }

    h1 {
        font-size: 24px;
    }

    h2 {
        font-size: 18px;
    }
}
</style>
