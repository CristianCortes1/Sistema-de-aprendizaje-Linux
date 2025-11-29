<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthService from '../services/AuthService'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  close: []
  success: []
  switchToRegister: []
}>()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')
const router = useRouter()

const closeModal = () => {
  emit('close')
  // Reset form
  email.value = ''
  password.value = ''
  errorMessage.value = ''
}

const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.show) {
    closeModal()
  }
}

const handleBackdropClick = (e: MouseEvent) => {
  if (e.target === e.currentTarget) {
    closeModal()
  }
}

async function handleLogin() {
    errorMessage.value = ''

    if (!email.value || !password.value) {
        errorMessage.value = 'Por favor llena todos los campos'
        return
    }

    loading.value = true
    try {
        const data = await AuthService.login(email.value, password.value)

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

        emit('success')
        
        // Redirect based on role
        if (data.user.rol === 'admin') {
            router.push('/admin')
        } else {
            router.push('/dashboard')
        }
    } catch (err: any) {
        console.error('❌ Error en login:', err)
        
        if (err.message.includes('Account not activated') || err.message.includes('not activated') || err.message.includes('no está activada')) {
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

// Add/remove event listener for ESC key
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', handleEscape)
}
</script>

<template>
  <Transition name="modal">
    <div v-if="show" class="modal-backdrop" @click="handleBackdropClick">
      <div class="modal-container">
        <button class="modal-close" @click="closeModal" aria-label="Cerrar">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div class="modal-content">
          <!-- <img src="https://upload.wikimedia.org/wikipedia/commons/3/35/Tux.svg" alt="Penguin Path Logo" class="modal-logo" /> -->
          <h2>Bienvenido a Penguin Path</h2>
          <p class="modal-subtitle">Inicia sesión para continuar</p>

          <!-- Error message -->
          <div v-if="errorMessage" class="message error-message">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            {{ errorMessage }}
          </div>

          <form @submit.prevent="handleLogin">
            <div class="form-field">
              <label for="modal-email">Apodo</label>
              <input 
                v-model="email" 
                type="text" 
                id="modal-email" 
                placeholder="Ingresa tu apodo" 
                required 
                autocomplete="username"
              />
            </div>

            <div class="form-field">
              <label for="modal-password">Contraseña</label>
              <input 
                v-model="password" 
                type="password" 
                id="modal-password" 
                placeholder="Ingresa tu contraseña" 
                required 
                autocomplete="current-password"
              />
            </div>

            <button type="submit" class="modal-btn-primary" :disabled="loading">
              {{ loading ? 'Cargando...' : 'Iniciar sesión' }}
            </button>
          </form>

          <div class="modal-footer">
            <router-link to="/forgot-password" class="modal-link" @click="closeModal">
              ¿Olvidaste tu contraseña?
            </router-link>
            <p class="modal-text">
              ¿No tienes cuenta? 
              <a href="#" @click.prevent="emit('switchToRegister')" class="modal-link-primary">Regístrate</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 20px;
  overflow-y: auto;
}

.modal-container {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 450px;
  width: 100%;
  position: relative;
  animation: slideUp 0.3s ease;
  overflow-y: auto;
  max-height: 90vh;
  /* Hide scrollbar */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.modal-container::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
  color: #666;
  z-index: 10;
}

.modal-close:hover {
  background: #f5f5f5;
  color: #ff6600;
}

.modal-content {
  padding: 50px 40px 40px;
  text-align: center;
}

.modal-logo {
  width: 70px;
  height: 70px;
  margin-bottom: 20px;
}

.modal-content h2 {
  font-size: 1.75rem;
  margin-bottom: 8px;
  color: #333;
}

.modal-subtitle {
  color: #666;
  margin-bottom: 30px;
  font-size: 0.95rem;
}

.form-field {
  margin-bottom: 20px;
  text-align: left;
}

.form-field label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
  font-size: 0.9rem;
}

.form-field input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: #fafafa;
}

.form-field input:focus {
  outline: none;
  border-color: #ff6600;
  background: white;
  box-shadow: 0 0 0 3px rgba(255, 102, 0, 0.1);
}

.form-field input::placeholder {
  color: #999;
}

.modal-btn-primary {
  width: 100%;
  padding: 14px;
  background: #ff6600;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 10px;
}

.modal-btn-primary:hover:not(:disabled) {
  background: #e55b00;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 102, 0, 0.3);
}

.modal-btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.message {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 10px;
  margin-bottom: 20px;
  font-size: 14px;
  text-align: left;
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

.modal-footer {
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.modal-link {
  color: #666;
  text-decoration: none;
  font-size: 0.9rem;
  display: block;
  margin-bottom: 12px;
  transition: color 0.2s ease;
}

.modal-link:hover {
  color: #ff6600;
}

.modal-text {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

.modal-link-primary {
  color: #ff6600;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}

.modal-link-primary:hover {
  color: #e55b00;
  text-decoration: underline;
}

/* Modal transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9) translateY(20px);
}

/* Mobile responsive */
@media (max-width: 480px) {
  .modal-backdrop {
    padding: 0;
    align-items: flex-end;
  }

  .modal-container {
    max-width: 100%;
    border-radius: 20px 20px 0 0;
    max-height: 90vh;
    overflow-y: auto;
  }

  .modal-content {
    padding: 40px 24px 24px;
  }

  .modal-content h2 {
    font-size: 1.5rem;
  }
}
</style>
