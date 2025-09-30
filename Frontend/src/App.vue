<script>
import Login from './components/Login.vue'
import Dashboard from './components/Dashboard.vue'
import Biblioteca from './components/Biblioteca.vue'
import Registro from './components/Registro.vue'

export default {
  name: 'AppContainer',
  components: { Login, Dashboard, Biblioteca, Registro },
  data() {
    return {
      currentPage: window.location.hash.replace('#', '') || 'login',
      isAuthenticated: false
    }
  },
  methods: {
    setPage(page) {
      if (!this.isAuthenticated && page !== 'login' && page !== 'registro') {
        console.warn('⛔ Acceso denegado, vuelve a login')
        this.currentPage = 'login'
        window.location.hash = 'login'
        return
      }
      this.currentPage = page
      window.location.hash = page
    },
    handleUserLogin() {
      this.isAuthenticated = true
      this.setPage('dashboard')
    },
    handleRegister() {
      this.setPage('registro')
    },
    handleUserLogout() {
      this.isAuthenticated = false
      this.setPage('login')
    }
  },
  mounted() {
    window.addEventListener('hashchange', () => {
      const page = window.location.hash.replace('#', '') || 'login'
      if (!this.isAuthenticated && page !== 'login' && page !== 'registro') {
        console.warn('⛔ Intento de entrar sin login')
        this.setPage('login')
      } else {
        this.currentPage = page
      }
    })
  }
}
</script>

<template>
  <div>
    <!-- Login -->
    <Login 
      v-if="currentPage === 'login'" 
      @login="handleUserLogin"
      @registro="handleRegister"
    />

    <!-- Registro -->
    <Registro 
      v-else-if="currentPage === 'registro'" 
      @goLogin="setPage('login')" 
    />

    <!-- Dashboard -->
    <Dashboard 
      v-else-if="currentPage === 'dashboard'" 
      @goBiblioteca="setPage('biblioteca')" 
      @logout="handleUserLogout"
    />

    <!-- Biblioteca -->
    <Biblioteca 
      v-else-if="currentPage === 'biblioteca'" 
      @goInicio="setPage('dashboard')" 
      @logout="handleUserLogout"
    />
  </div>
</template>

