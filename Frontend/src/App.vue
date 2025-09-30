<template>
  <div id="app">
    <!-- <nav>
      <router-link to="/">Login</router-link> |
      <router-link to="/dashboard">Dashboard</router-link> |
      <router-link to="/biblioteca">Biblioteca</router-link> |
      <router-link to="/registro">Registro</router-link>
    </nav> -->

    <!-- Aquí se renderiza la vista -->
    <router-view />
  </div>
</template>

<script lang="ts">
export default {
  name: 'App'
}
</script>

