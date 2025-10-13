<script>
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AuthService from '../services/AuthService'
import Header from './Header.vue'
import Footer from './Footer.vue'

export default {
  name: 'Configuracion',
  components: {
    Header,
    Footer
  },
  setup() {
    const router = useRouter()
    const localUser = ref({
      username: '',
      correo: '',
      racha: 0,
      experiencia: 0,
      avatar: ""
    })

    const selectedAvatar = ref('')
    const newUsername = ref('')
    const passwordData = ref({
      current: '',
      new: '',
      confirm: ''
    })

    // Opciones de avatares
    const avatarOptions = ref([
      'https://ui-avatars.com/api/?name=Avatar1&background=FF6B6B&color=fff&size=128&bold=true',
      'https://ui-avatars.com/api/?name=Avatar2&background=4ECDC4&color=fff&size=128&bold=true',
      'https://ui-avatars.com/api/?name=Avatar3&background=45B7D1&color=fff&size=128&bold=true',
      'https://ui-avatars.com/api/?name=Avatar4&background=FFA07A&color=fff&size=128&bold=true',
      'https://ui-avatars.com/api/?name=Avatar5&background=98D8C8&color=fff&size=128&bold=true',
      'https://ui-avatars.com/api/?name=Avatar6&background=F7DC6F&color=fff&size=128&bold=true'
    ])

    onMounted(() => {
      document.title = 'Configuración - Sistema de Aprendizaje Linux'
      
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        const parsed = JSON.parse(storedUser)
        localUser.value = {
          username: parsed.username || '',
          correo: parsed.correo || '',
          racha: parsed.racha || 0,
          experiencia: parsed.experiencia || 0,
          avatar: parsed.avatar || ''
        }
        selectedAvatar.value = parsed.avatar || ''
        newUsername.value = parsed.username || ''
      }
    })

    const displayUser = computed(() => {
      return localUser.value
    })

    const getDefaultAvatar = (username) => {
      const colors = ['FF6B6B', '4ECDC4', '45B7D1', 'FFA07A', '98D8C8', 'F7DC6F', 'BB8FCE']
      const colorIndex = username.length % colors.length
      return `https://ui-avatars.com/api/?name=${username}&background=${colors[colorIndex]}&color=fff&size=128&bold=true`
    }

    const updateUsername = async () => {
      if (!newUsername.value.trim()) {
        alert('Por favor ingresa un nombre de usuario')
        return
      }

      try {
        const token = AuthService.getToken()
        const response = await fetch('https://sistema-de-aprendizaje-linux-production.up.railway.app/users/update', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username: newUsername.value })
        })

        if (response.ok) {
          const updatedUser = { ...localUser.value, username: newUsername.value }
          localUser.value = updatedUser
          localStorage.setItem('user', JSON.stringify(updatedUser))
          alert('Nombre de usuario actualizado correctamente')
        } else {
          alert('Error al actualizar el nombre de usuario')
        }
      } catch (error) {
        console.error('Error:', error)
        alert('Error al actualizar el nombre de usuario')
      }
    }

    const updatePassword = async () => {
      if (!passwordData.value.current || !passwordData.value.new || !passwordData.value.confirm) {
        alert('Por favor completa todos los campos')
        return
      }

      if (passwordData.value.new !== passwordData.value.confirm) {
        alert('Las contraseñas no coinciden')
        return
      }

      try {
        const token = AuthService.getToken()
        const response = await fetch('https://sistema-de-aprendizaje-linux-production.up.railway.app/users/change-password', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            currentPassword: passwordData.value.current,
            newPassword: passwordData.value.new
          })
        })

        if (response.ok) {
          alert('Contraseña actualizada correctamente')
          passwordData.value = { current: '', new: '', confirm: '' }
        } else {
          alert('Error al actualizar la contraseña. Verifica tu contraseña actual.')
        }
      } catch (error) {
        console.error('Error:', error)
        alert('Error al actualizar la contraseña')
      }
    }

    const handleLogout = () => {
      AuthService.logout()
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.push('/')
    }

    return {
      displayUser,
      selectedAvatar,
      newUsername,
      passwordData,
      avatarOptions,
      getDefaultAvatar,
      updateUsername,
      updatePassword,
      handleLogout
    }
  }
}
</script>

<template>
  <div class="page">
    <Header :user="displayUser" :logout="handleLogout" />

    <div class="content">
      <h1 class="title">Configuración</h1>

      <div class="section">
        <h2 class="section-title">Información del perfil</h2>
        <p class="section-subtitle">Tu progreso te define más que palabras</p>

        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Racha</span>
            <span class="info-value">{{ displayUser.racha }} días</span>
          </div>
          <div class="info-item">
            <span class="info-label">Experiencia</span>
            <span class="info-value">{{ displayUser.experiencia }} XP</span>
          </div>
          <div class="info-item">
            <span class="info-label">Nombre de usuario</span>
            <span class="info-value">{{ displayUser.username }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Correo electrónico</span>
            <span class="info-value">{{ displayUser.correo }}</span>
          </div>
        </div>

        <div class="avatar-section">
          <div class="current-avatar">
            <img :src="displayUser.avatar || getDefaultAvatar(displayUser.username)" alt="Avatar actual" />
            <div class="avatar-info">
              <span class="avatar-label">Avatar</span>
              <span class="avatar-sublabel">Avatar actual</span>
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Cambiar avatar</h2>
        <p class="section-subtitle">Elige un nuevo avatar de la colección.</p>

        <div class="avatar-grid">
          <div 
            v-for="(avatar, index) in avatarOptions" 
            :key="index"
            :class="['avatar-option', { 'selected': selectedAvatar === avatar }]"
            @click="selectedAvatar = avatar"
          >
            <img :src="avatar" :alt="`Avatar ${index + 1}`" />
          </div>
        </div>
      </div>

      <!-- Cambiar nombre de usuario -->
      <div class="section">
        <h2 class="section-title">Cambiar nombre de usuario</h2>
        <p class="section-subtitle">Actualiza tu nombre de usuario</p>

        <div class="input-group">
          <input 
            type="text" 
            v-model="newUsername" 
            placeholder="Nuevo nombre de usuario"
            class="text-input"
          />
          <button @click="updateUsername" class="btn-primary">
            Guardar nombre de usuario
          </button>
        </div>
      </div>

      <!-- Cambiar contraseña -->
      <div class="section">
        <h2 class="section-title">Cambiar contraseña</h2>
        <p class="section-subtitle">Necesita tu contraseña vieja para confirmar la nueva contraseña.</p>

        <div class="input-group">
          <input 
            type="password" 
            v-model="passwordData.current" 
            placeholder="Contraseña actual"
            class="text-input"
          />
          <input 
            type="password" 
            v-model="passwordData.new" 
            placeholder="Nueva contraseña"
            class="text-input"
          />
          <input 
            type="password" 
            v-model="passwordData.confirm" 
            placeholder="Confirmar nueva contraseña"
            class="text-input"
          />
          <button @click="updatePassword" class="btn-primary">
            Cambiar contraseña
          </button>
        </div>
      </div>

      <!-- Cerrar sesión -->
      <div class="section">
        <h2 class="section-title">Cerrar sesión</h2>
        <p class="section-subtitle">Finaliza tu sesión actual</p>

        <button @click="handleLogout" class="btn-danger">
          Cerrar sesión
        </button>
      </div>

      <div class="footer-info">
        <span>© 2024 Penguin Path. Todos los derechos reservados.</span>
        <div class="footer-links">
          <a href="#">Términos de servicio</a>
          <a href="#">Política de privacidad</a>
        </div>
      </div>
    </div>

    <Footer 
      :goInicio="() => $router.push('/dashboard')" 
      :goBiblioteca="() => $router.push('/biblioteca')" 
      :goRanking="() => $router.push('/ranking')" 
      :goConfig="() => $router.push('/configuracion')" 
    />
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #ef9c6c 0%, #c57da1 50%, #956eaa 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  overflow-y: auto;
  color: #fff;
}

.content {
  padding: 100px 20px 120px;
  max-width: 700px;
  margin: 0 auto;
}

.title {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 30px;
}

.section {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
}

.section-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 20px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
}

.info-value {
  font-size: 16px;
  font-weight: 600;
}

.avatar-section {
  margin-top: 20px;
}

.current-avatar {
  display: flex;
  align-items: center;
  gap: 15px;
}

.current-avatar img {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.5);
  background: white;
}

.avatar-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.avatar-label {
  font-size: 16px;
  font-weight: 600;
}

.avatar-sublabel {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
}

.avatar-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
}

.avatar-option {
  cursor: pointer;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid transparent;
  transition: all 0.3s ease;
  background: white;
}

.avatar-option:hover {
  border-color: rgba(255, 255, 255, 0.5);
  transform: scale(1.1);
}

.avatar-option.selected {
  border-color: #4CAF50;
  box-shadow: 0 0 12px rgba(76, 175, 80, 0.5);
}

.avatar-option img {
  width: 100%;
  height: 100%;
  display: block;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.text-input {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 12px 16px;
  color: white;
  font-size: 14px;
  transition: all 0.3s ease;
}

.text-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.text-input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.4);
  background: rgba(0, 0, 0, 0.3);
}

.btn-primary {
  background: #2196F3;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  color: white;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: #1976D2;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.4);
}

.btn-danger {
  background: #f44336;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  color: white;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.btn-danger:hover {
  background: #d32f2f;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(244, 67, 54, 0.4);
}

.footer-info {
  text-align: center;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 40px;
}

.footer-links {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 10px;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: white;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .content {
    padding: 90px 15px 120px;
  }

  .title {
    font-size: 24px;
    margin-bottom: 20px;
  }

  .section {
    padding: 20px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .avatar-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>