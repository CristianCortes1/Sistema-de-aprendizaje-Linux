<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import AuthService from '../services/AuthService'
import { useRouter } from 'vue-router'
import Header from './Header.vue'
import Footer from './Footer.vue'

export default defineComponent({
  name: 'Ranking',
  components: {
    Header,
    Footer
  },
  setup() {
    const router = useRouter()
    const ranking = ref<Array<{ username: string; experiencia: number }>>([])

    onMounted(async () => {
      try {
        const token = AuthService.getToken()
        const response = await fetch('https://sistema-de-aprendizaje-linux-production.up.railway.app/users/ranking', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`)
        
        const data = await response.json()
        ranking.value = data
      } catch (error) {
        console.error('Error fetching ranking:', error)
        // Fallback to mock data if API fails
        ranking.value = [
          { username: 'tux', experiencia: 1500 },
          { username: 'root', experiencia: 900 },
          { username: 'penguin', experiencia: 600 },
        ]
      }
    })

    const goBack = () => router.push('/dashboard')

    return { ranking, goBack }
  }
})
</script>

<template>
  <div class="page">
    <Header />
    <div class="content">
      <button class="back" @click="goBack">← Volver</button>
      <h1>Ranking</h1>
      <ul class="list">
        <li v-for="(u, i) in ranking" :key="u.username" class="item">
          <span class="pos">#{{ i + 1 }}</span>
          <span class="name">{{ u.username }}</span>
          <span class="xp">{{ u.experiencia }} XP</span>
        </li>
      </ul>
    </div>
    <Footer :goInicio="goBack" :goBiblioteca="() => $router.push('/biblioteca')" :goRanking="() => $router.push('/ranking')" :goConfig="() => $router.push('/configuracion')" />
  </div>
</template>

<style scoped>
.page { 
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0; 
  color: #fff; 
  background: linear-gradient(135deg, #ef9c6c 0%, #c57da1 50%, #956eaa 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  overflow-y: auto;
}
.content {
  padding: 20px;
  padding-top: 100px;
  padding-bottom: 100px;
}
.header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
.back { 
  background: none; 
  border: 1px solid rgba(255,255,255,.2); 
  color: #fff; 
  padding: 8px 12px; 
  border-radius: 8px; 
  cursor: pointer; 
  transition: all 0.3s ease;
}
.back:hover {
  background: rgba(255,255,255,.1);
  transform: translateY(-2px);
}
.list { list-style: none; margin-top: 16px; padding: 0; display: grid; gap: 10px; }
.item { 
  display: grid; 
  grid-template-columns: 60px 1fr 100px; 
  align-items: center; 
  background: rgba(255,255,255,.1); 
  padding: 16px; 
  border-radius: 12px; 
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,.1);
  transition: all 0.3s ease;
}
.item:hover {
  background: rgba(255,255,255,.15);
  transform: translateY(-2px);
}
.pos { font-weight: 700; font-size: 18px; }
.name { font-size: 16px; font-weight: 500; }
.xp { text-align: right; font-weight: 600; }
</style>
