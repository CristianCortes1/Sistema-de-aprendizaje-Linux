<script>
import Login from './components/Login.vue'
import Dashboard from './components/Dashboard.vue'
import Biblioteca from './components/Biblioteca.vue'

export default {
  name: 'AppContainer',
  components: {
    Login,
    Dashboard,
    Biblioteca
  },
  data() {
    return {
      currentPage: 'login' // 👈 empezamos en login
    }
  },
  methods: {
    handleUserLogin() {
      console.log('🚀 Usuario logueado! Cambiando a Dashboard...')
      this.currentPage = 'dashboard'
    },
    handleUserLogout() {
      console.log('👋 Usuario deslogueado! Volviendo al Login...')
      this.currentPage = 'login'
    }
  }
}
</script>

<template>
  <div>
    <!-- Login -->
    <Login 
      v-if="currentPage === 'login'" 
      @login="handleUserLogin" 
    />

    <!-- Dashboard -->
    <Dashboard 
      v-else-if="currentPage === 'dashboard'" 
      @goBiblioteca="currentPage = 'biblioteca'" 
    />

    <!-- Biblioteca -->
    <Biblioteca 
      v-else-if="currentPage === 'biblioteca'" 
    />
  </div>
</template>


<style scoped></style>
