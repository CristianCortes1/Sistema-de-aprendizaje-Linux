<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
    name: 'TermsConditions',
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
                <h1>Términos y Condiciones</h1>
                <p class="last-updated">Última actualización: Noviembre 2025</p>

                <section>
                    <h2>1. Aceptación de los Términos</h2>
                    <p>Al acceder y usar Penguin Path, aceptas estos términos y condiciones. Si no estás de acuerdo, no uses la plataforma.</p>
                </section>

                <section>
                    <h2>2. Uso de la Plataforma</h2>
                    <p>Penguin Path es una plataforma educativa para aprender Linux. Te comprometes a:</p>
                    <ul>
                        <li>Usar la plataforma únicamente con fines educativos</li>
                        <li>No intentar hackear o comprometer la seguridad del sistema</li>
                        <li>No compartir tu cuenta con otras personas</li>
                        <li>Mantener la confidencialidad de tu contraseña</li>
                        <li>No usar la terminal para actividades maliciosas</li>
                    </ul>
                </section>

                <section>
                    <h2>3. Cuenta de Usuario</h2>
                    <ul>
                        <li>Debes proporcionar información veraz al registrarte</li>
                        <li>Eres responsable de todas las actividades en tu cuenta</li>
                        <li>Nos reservamos el derecho de suspender cuentas que violen estos términos</li>
                        <li>Puedes eliminar tu cuenta en cualquier momento desde la configuración</li>
                    </ul>
                </section>

                <section>
                    <h2>4. Propiedad Intelectual</h2>
                    <p>Todo el contenido de Penguin Path (lecciones, retos, material educativo) es propiedad de la plataforma y está protegido por derechos de autor.</p>
                </section>

                <section>
                    <h2>5. Entorno de Terminal</h2>
                    <p>Los contenedores Docker proporcionados:</p>
                    <ul>
                        <li>Son entornos aislados y seguros para practicar</li>
                        <li>Tienen recursos limitados (512MB RAM, 50% CPU)</li>
                        <li>Se eliminan automáticamente después de 15 minutos de inactividad</li>
                        <li>No tienen acceso a internet para tu seguridad</li>
                    </ul>
                </section>

                <section>
                    <h2>6. Contenido Generado por Usuarios</h2>
                    <p>Al usar la plataforma, te comprometes a no:</p>
                    <ul>
                        <li>Subir contenido ofensivo o inapropiado</li>
                        <li>Compartir información personal sensible</li>
                        <li>Intentar exploits o ataques al sistema</li>
                    </ul>
                </section>

                <section>
                    <h2>7. Limitación de Responsabilidad</h2>
                    <p>Penguin Path se proporciona "tal cual". No garantizamos:</p>
                    <ul>
                        <li>Disponibilidad 100% del servicio</li>
                        <li>Que el contenido esté libre de errores</li>
                        <li>Resultados específicos en tu aprendizaje</li>
                    </ul>
                </section>

                <section>
                    <h2>8. Suspensión de Servicio</h2>
                    <p>Nos reservamos el derecho de:</p>
                    <ul>
                        <li>Realizar mantenimiento programado</li>
                        <li>Suspender cuentas que violen estos términos</li>
                        <li>Modificar o discontinuar características</li>
                    </ul>
                </section>

                <section>
                    <h2>9. Modificaciones a los Términos</h2>
                    <p>Podemos actualizar estos términos ocasionalmente. Te notificaremos de cambios importantes por correo electrónico.</p>
                </section>

                <section>
                    <h2>10. Contacto</h2>
                    <p>Para preguntas sobre estos términos:</p>
                    <p><strong>Email:</strong> penguinpathemail@gmail.com</p>
                </section>
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

.legal-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #ef9c6c 0%, #c57da1 50%, #956eaa 100%);
    padding: 40px 20px;
    margin: 0;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-y: auto;
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
