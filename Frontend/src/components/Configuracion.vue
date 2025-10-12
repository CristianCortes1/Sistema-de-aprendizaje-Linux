<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'Configuracion',
  setup() {
    const router = useRouter()
    const prefs = ref({
      temaOscuro: true,
      notificaciones: true,
      idioma: 'es'
    })

    onMounted(() => {
      const saved = localStorage.getItem('prefs')
      if (saved) prefs.value = JSON.parse(saved)
    })

    const save = () => {
      localStorage.setItem('prefs', JSON.stringify(prefs.value))
      router.push('/dashboard')
    }

    const goBack = () => router.push('/dashboard')

    return { prefs, save, goBack }
  }
})
</script>

<template>
  <div class="page">
    <header class="header">
      <button class="back" @click="goBack">← Volver</button>
      <h1>Configuración</h1>
    </header>

    <div class="form">
      <label><input type="checkbox" v-model="prefs.temaOscuro" /> Tema oscuro</label>
      <label><input type="checkbox" v-model="prefs.notificaciones" /> Notificaciones</label>
      <label>
        Idioma
        <select v-model="prefs.idioma">
          <option value="es">Español</option>
          <option value="en">English</option>
        </select>
      </label>
      <button class="save" @click="save">Guardar</button>
    </div>
  </div>
</template>

<style scoped>
.page { 
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 20px; 
  color: #fff; 
  background: linear-gradient(135deg, #ef9c6c 0%, #c57da1 50%, #956eaa 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  overflow-y: auto;
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
.form { 
  display: grid; 
  gap: 16px; 
  margin-top: 20px; 
  background: rgba(255,255,255,.1); 
  padding: 20px; 
  border-radius: 12px; 
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,.1);
}
.form label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
}
.form input, .form select {
  background: rgba(255,255,255,.1);
  border: 1px solid rgba(255,255,255,.2);
  color: #fff;
  padding: 8px;
  border-radius: 6px;
}
.save { 
  background: #4caf50; 
  border: none; 
  color: #fff; 
  padding: 12px 16px; 
  border-radius: 8px; 
  cursor: pointer; 
  transition: all 0.3s ease;
  font-size: 16px;
  font-weight: 600;
}
.save:hover {
  background: #45a049;
  transform: translateY(-2px);
}
</style>
