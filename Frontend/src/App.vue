<script>
import Login from './components/Login.vue'
import Dashboard from './components/Dashboard.vue'
import Biblioteca from './components/Biblioteca.vue'

export default {
  name: 'AppContainer',
  components: { Login, Dashboard, Biblioteca },
  data() {
    return {
      currentPage: window.location.hash.replace('#', '') || 'login',
      isAuthenticated: false // 👈 nuevo estado de sesión
    }
  },
  methods: {
    setPage(page) {
      // 👇 Seguridad: si intenta ir al dashboard/biblioteca sin login, redirige a login
      if (!this.isAuthenticated && page !== 'login') {
        console.warn('⛔ Acceso denegado, vuelve a login')
        this.currentPage = 'login'
        window.location.hash = 'login'
        return
      }
      this.currentPage = page
      window.location.hash = page
    },
    handleUserLogin() {
      // 🔑 aquí deberías validar credenciales reales
      this.isAuthenticated = true
      this.setPage('dashboard')
    },
    handleUserLogout() {
      this.isAuthenticated = false
      this.setPage('login')
    }
  },
  mounted() {
    window.addEventListener('hashchange', () => {
      const page = window.location.hash.replace('#', '') || 'login'
      // 👇 aplica validación al navegar con flechitas
      if (!this.isAuthenticated && page !== 'login') {
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
