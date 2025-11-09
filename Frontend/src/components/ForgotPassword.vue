<script setup lang="ts">
import { ref } from 'vue';
import { API_URL } from '../config/api';

const email = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const isLoading = ref(false);

const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const handleForgotPassword = async () => {
  errorMessage.value = '';
  successMessage.value = '';

  // Validaciones
  if (!email.value) {
    errorMessage.value = 'Por favor ingresa tu correo electrónico';
    return;
  }

  if (!validateEmail(email.value)) {
    errorMessage.value = 'Por favor ingresa un correo electrónico válido';
    return;
  }

  isLoading.value = true;

  try {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email.value }),
    });

    const data = await response.json();

    if (response.ok) {
      successMessage.value =
        'Si tu correo está registrado, recibirás un enlace para restablecer tu contraseña. Por favor revisa tu bandeja de entrada.';
      email.value = '';
    } else {
      errorMessage.value = data.message || 'Error al procesar la solicitud';
    }
  } catch (error) {
    console.error('Error:', error);
    errorMessage.value =
      'Error de conexión. Por favor intenta nuevamente más tarde.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="forgot-password-container">
    <div class="forgot-password-card">
      <div class="logo">
        <img src="https://upload.wikimedia.org/wikipedia/commons/3/35/Tux.svg" alt="Penguin Path Logo" />
      </div>

      <h1 class="title">¿Olvidaste tu contraseña?</h1>
      <p class="subtitle">
        Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
      </p>

      <form @submit.prevent="handleForgotPassword">
        <div class="form-group">
          <label for="email">Correo electrónico</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="tu@correo.com"
            :disabled="isLoading"
          />
        </div>

        <div v-if="errorMessage" class="error-message">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
          <span>{{ errorMessage }}</span>
        </div>

        <div v-if="successMessage" class="success-message">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <span>{{ successMessage }}</span>
        </div>

        <button type="submit" class="submit-button" :disabled="isLoading">
          {{ isLoading ? 'Enviando...' : 'Enviar enlace de recuperación' }}
        </button>
      </form>

      <div class="back-to-login">
        <router-link to="/">Volver al inicio de sesión</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.forgot-password-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ef9c6c 0%, #c57da1 50%, #956eaa 100%);
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.forgot-password-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.logo {
  text-align: center;
  margin-bottom: 24px;
}

.logo img {
  width: 80px;
  height: 80px;
}

.title {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 12px;
}

.subtitle {
  font-size: 15px;
  color: #666;
  text-align: center;
  margin-bottom: 32px;
  line-height: 1.5;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  font-size: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  transition: all 0.3s;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #ef9c6c;
  box-shadow: 0 0 0 3px rgba(239, 156, 108, 0.1);
}

.form-group input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: #fee;
  border-left: 4px solid #f44336;
  border-radius: 8px;
  color: #c62828;
  font-size: 14px;
  margin-bottom: 20px;
  animation: slideIn 0.3s ease;
}

.success-message {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 16px;
  background: #e8f5e9;
  border-left: 4px solid #4caf50;
  border-radius: 8px;
  color: #2e7d32;
  font-size: 14px;
  margin-bottom: 20px;
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

.submit-button {
  width: 100%;
  padding: 14px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #ef9c6c 0%, #c57da1 50%, #956eaa 100%);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 156, 108, 0.4);
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.back-to-login {
  text-align: center;
  margin-top: 24px;
}

.back-to-login a {
  color: #956eaa;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.3s;
}

.back-to-login a:hover {
  color: #7d5a8f;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .forgot-password-card {
    padding: 30px 24px;
  }

  .title {
    font-size: 24px;
  }

  .subtitle {
    font-size: 14px;
  }
}
</style>
