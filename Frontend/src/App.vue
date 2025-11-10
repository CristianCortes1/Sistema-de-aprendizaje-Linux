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

<style>
/* Global layout guards to prevent horizontal overflow on mobile */
* {
  box-sizing: border-box;
}
html, body, #app {
  margin: 0;
  padding: 0;
  width: 100%;
  max-width: 100vw; /* clamp to viewport width */
  overflow-x: hidden; /* avoid white gap when panning horizontally */
}
/* Media elements never exceed container width */
img, video, canvas, svg {
  max-width: 100%;
  height: auto;
}
</style>

