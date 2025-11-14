<template>
  <div class="auth-callback-container">
    <div class="spinner"></div>
    <p>Iniciando sesión con Google...</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AuthService from '../services/AuthService';

const router = useRouter();

onMounted(async () => {
  try {
    // Obtener token de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
      throw new Error('No se recibió token de autenticación');
    }

    // Guardar token y obtener datos del usuario
    AuthService.setToken(token);
    const userId = AuthService.getUserId();
    if (!userId) {
      throw new Error('No se pudo obtener el perfil del usuario');
    }
    const user = { id: userId };
        
    // Guardar usuario en localStorage
    localStorage.setItem('user', JSON.stringify(user));

    // Redirigir al dashboard
    router.push('/dashboard');
  } catch (error: any) {
    console.error('Error en callback de Google:', error);
    alert('Error al iniciar sesión con Google: ' + (error.message || 'Error desconocido'));
    router.push('/login');
  }
});
</script>

<style scoped>
.auth-callback-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

p {
  font-size: 18px;
  font-weight: 500;
}
</style>
