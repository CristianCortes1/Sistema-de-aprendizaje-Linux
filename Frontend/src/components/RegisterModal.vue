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
  switchToLogin: []
}>()

const username = ref('')
const correo = ref('')
const password = ref('')
const confirmPassword = ref('')
const acceptedPrivacy = ref(false)
const acceptedTerms = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const router = useRouter()

const closeModal = () => {
  emit('close')
  // Reset form
  username.value = ''
  correo.value = ''
  password.value = ''
  confirmPassword.value = ''
  acceptedPrivacy.value = false
  acceptedTerms.value = false
  errorMessage.value = ''
  successMessage.value = ''
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

async function handleRegistro() {
    errorMessage.value = ''
    successMessage.value = ''

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
        await AuthService.register(username.value, correo.value, password.value)

        console.log('✅ Registro exitoso')
        successMessage.value = '¡Registro exitoso! Revisa tu correo para confirmar tu cuenta'
        
        emit('success')
        
        // Close modal and redirect after 2 seconds
        setTimeout(() => {
            closeModal()
            router.push('/')
        }, 2000)
    } catch (err: any) {
        console.error('❌ Error en registro:', err)
        
        if (err.message.includes('Username already exists') || err.message.includes('usuario ya existe')) {
            errorMessage.value = 'Este nombre de usuario ya está en uso'
        } else if (err.message.includes('Email already exists') || err.message.includes('correo ya existe')) {
            errorMessage.value = 'Este correo ya está registrado'
        } else {
            errorMessage.value = err.message || 'Error al registrar usuario'
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
          <h2>Crear cuenta</h2>
          <p class="modal-subtitle">Únete a Penguin Path</p>

          <!-- Error message -->
          <div v-if="errorMessage" class="message error-message">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            {{ errorMessage }}
          </div>

          <!-- Success message -->
          <div v-if="successMessage" class="message success-message">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            {{ successMessage }}
          </div>

          <form @submit.prevent="handleRegistro">
            <div class="form-field">
              <label for="modal-username">Apodo</label>
              <input 
                v-model="username" 
                type="text" 
                id="modal-username" 
                placeholder="Elige tu apodo" 
                required 
              />
            </div>

            <div class="form-field">
              <label for="modal-correo">Correo electrónico</label>
              <input 
                v-model="correo" 
                type="email" 
                id="modal-correo" 
                placeholder="tu@email.com" 
                required 
              />
            </div>

            <div class="form-field">
              <label for="modal-password">Contraseña</label>
              <input 
                v-model="password" 
                type="password" 
                id="modal-password" 
                placeholder="Mínimo 6 caracteres" 
                required 
              />
            </div>

            <div class="form-field">
              <label for="modal-confirm-password">Confirmar contraseña</label>
              <input 
                v-model="confirmPassword" 
                type="password" 
                id="modal-confirm-password" 
                placeholder="Repite tu contraseña" 
                required 
              />
            </div>

            <div class="checkbox-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="acceptedPrivacy" required />
                <span>
                  He leído y acepto la 
                  <router-link to="/privacy-policy" class="inline-link" @click="closeModal">Política de Privacidad</router-link>
                </span>
              </label>
            </div>

            <div class="checkbox-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="acceptedTerms" required />
                <span>
                  He leído y acepto los 
                  <router-link to="/terms" class="inline-link" @click="closeModal">Términos y Condiciones</router-link>
                </span>
              </label>
            </div>

            <button type="submit" class="modal-btn-primary" :disabled="loading">
              {{ loading ? 'Registrando...' : 'Crear cuenta' }}
            </button>
          </form>

          <div class="modal-footer">
            <p class="modal-text">
              ¿Ya tienes cuenta? 
              <a href="#" @click.prevent="emit('switchToLogin')" class="modal-link-primary">Inicia sesión</a>
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
  max-width: 500px;
  width: 100%;
  position: relative;
  animation: slideUp 0.3s ease;
  max-height: 90vh;
  overflow-y: auto;
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
  margin-bottom: 16px;
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

.checkbox-group {
  margin: 16px 0;
  text-align: left;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
  font-size: 0.85rem;
  color: #555;
}

.checkbox-label input[type="checkbox"] {
  margin-top: 3px;
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

.success-message {
  background: #efe;
  color: #2a7;
  border: 1px solid #cfc;
}

.success-message svg {
  color: #2a7;
  flex-shrink: 0;
}

.modal-footer {
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px solid #eee;
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
  }

  .modal-content {
    padding: 40px 24px 24px;
  }

  .modal-content h2 {
    font-size: 1.5rem;
  }

  .checkbox-label {
    font-size: 0.8rem;
  }
}
</style>
