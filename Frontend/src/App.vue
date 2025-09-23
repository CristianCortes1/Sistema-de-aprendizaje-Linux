<script>
import Login from './components/Login.vue'
import Dashboard from './components/Dashboard.vue'

export default {
  name: 'AppContainer',
  components: {
    Login,    // ← Corregido: usas el nombre correcto
    Dashboard
  },
  data() {
    return {
      isLoggedIn: false // Estado inicial: no logueado
    }
  },
  methods: {
    handleUserLogin() {
      console.log('🚀 Usuario logueado! Cambiando a Dashboard...')
      this.isLoggedIn = true
    },

    handleUserLogout() {
      console.log('👋 Usuario deslogueado! Volviendo al Login...')
      this.isLoggedIn = false
    }
  }
}
</script>


<template>
  <div class="app-container">
    <!-- Muestra Login si no está logueado -->
    <Login v-if="!isLoggedIn" @login="handleUserLogin" />

    <!-- Muestra Dashboard si está logueado -->
    <Dashboard v-if="isLoggedIn" @logout="handleUserLogout" />
  </div>
</template>

<style scoped></style>
