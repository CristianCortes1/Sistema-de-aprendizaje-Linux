<template>
  <div class="home-container">
    <!-- Main Header -->
    <nav class="main-header">
      <div class="logo-container">
        <img src="https://upload.wikimedia.org/wikipedia/commons/3/35/Tux.svg" alt="Penguin Path Logo" class="logo-img" />
        <span class="brand-name">Penguin Path</span>
      </div>
      <div class="nav-links">
        <router-link to="/login" class="nav-link">Iniciar Sesión</router-link>
        <router-link to="/registro" class="nav-btn">Registrarse</router-link>
      </div>
    </nav>

    <!-- Hero Section -->
    <header class="hero">
      <div class="hero-container">
        <div class="hero-text">
          <h1>Domina la<br>Terminal de Linux</h1>
          <p class="subtitle">Aprende a utilizar la línea de comandos con un entorno real, lecciones interactivas y práctica libre. Sin configuraciones, directo en tu navegador.</p>
          <div class="cta-buttons">
            <router-link to="/registro" class="btn btn-primary">Comenzar Ahora 🚀</router-link>
            <!-- <router-link to="/login" class="btn btn-secondary">Iniciar Sesión</router-link> -->
          </div>
        </div>
        
        <div class="hero-visual">
          <div class="terminal-window ubuntu-terminal">
            <div class="terminal-header">
              <span class="terminal-title">user@penguin: ~</span>
              <div class="terminal-buttons">
                <span class="t-btn minimize"></span>
                <span class="t-btn maximize"></span>
                <span class="t-btn close"></span>
              </div>
            </div>
            <div class="terminal-body">
              <div class="line">
                <span class="prompt-user">user@penguin</span>:<span class="prompt-path">~</span>$ <span class="cmd">echo "Hola Mundo"</span>
              </div>
              <div class="line output">Hola Mundo</div>
              <div class="line">
                <span class="prompt-user">user@penguin</span>:<span class="prompt-path">~</span>$ <span class="cmd">whoami</span>
              </div>
              <div class="line output">root</div>
              <div class="line">
                <span class="prompt-user">user@penguin</span>:<span class="prompt-path">~</span>$ <span class="cursor">_</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Features Section -->
    <section class="features">
      <h2>Características Principales</h2>
      <div class="feature-grid">
        <div class="feature-card">
          <div class="icon">🐧</div>
          <h3>Laboratorios Interactivos</h3>
          <p>Practica en entornos Linux reales y aislados directamente desde tu navegador.</p>
        </div>
        <div class="feature-card">
          <div class="icon">🗺️</div>
          <h3>Rutas de Aprendizaje</h3>
          <p>Sigue un camino estructurado desde principiante hasta experto en administración de sistemas.</p>
        </div>
        <div class="feature-card">
          <div class="icon">🏆</div>
          <h3>Gamificación</h3>
          <p>Gana experiencia, sube de nivel y compite en el ranking global mientras aprendes.</p>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section class="about">
      <div class="about-content">
        <h2>Sobre el Proyecto</h2>
        <p>
          El Sistema de Aprendizaje Linux es una plataforma educativa diseñada para facilitar la enseñanza y el aprendizaje
          del sistema operativo Linux. Nuestra arquitectura basada en contenedores garantiza un entorno seguro y
          reproducible para cada estudiante.
        </p>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <p>&copy; 2025 Sistema de Aprendizaje Linux. Todos los derechos reservados.</p>
      <div class="footer-links">
        <router-link to="/privacy-policy">Política de Privacidad</router-link>
        <router-link to="/terms">Términos y Condiciones</router-link>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Home',
});
</script>

<style scoped>
.home-container {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: white;
  line-height: 1.6;
  min-height: 100vh;
  /* Restored Gradient Background */
  background: linear-gradient(135deg, #ef9c6c 0%, #c57da1 50%, #956eaa 100%);
  overflow-x: hidden;
}

/* Main Header */
.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 4rem;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  /* Glassmorphism for header */
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-img {
  width: 32px;
  height: 32px;
}

.brand-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s;
}

.nav-link:hover {
  opacity: 0.8;
}

.nav-btn {
  background-color: #ff6600; /* Orange Button */
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.2s;
}

.nav-btn:hover {
  background-color: #e55b00;
}

/* Hero Section */
.hero {
  padding: 8rem 4rem 4rem;
  min-height: 90vh;
  display: flex;
  align-items: center;
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  width: 100%;
}

.hero-text {
  text-align: left;
}

.hero h1 {
  font-size: 4rem;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  font-weight: 800;
  color: white;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 2.5rem;
  max-width: 500px;
  line-height: 1.6;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
}

.btn {
  padding: 0.8rem 2rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.3);
}

.btn-primary {
  background-color: #ff6600; /* Orange Button */
  color: white;
}

.btn-primary:hover {
  background-color: #e55b00;
}

/* Terminal Mockup - Ubuntu Style */
.hero-visual {
  display: flex;
  justify-content: center;
  width: 100%;
}

.terminal-window.ubuntu-terminal {
  background: #300a24; /* Ubuntu Aubergine */
  border-radius: 8px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.5);
  width: 100%;
  max-width: 500px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-family: 'Ubuntu Mono', 'Consolas', monospace;
}

.terminal-header {
  background: #3e3e3e; /* Dark gray header */
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: center; /* Center title */
  position: relative;
  border-bottom: 1px solid #222;
}

.terminal-title {
  color: #d5d5d5;
  font-size: 14px;
  font-weight: bold;
}

.terminal-buttons {
  display: flex;
  gap: 8px;
  position: absolute;
  right: 12px; /* Ubuntu controls on right (modern) or left, sticking to right for web convention or left if preferred. Let's do right for now or match user preference if specified. User said "Ubuntu", standard Ubuntu desktop often has them on right in newer versions or left in older unity. Let's put them on the right. */
}

.t-btn {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  display: block;
  background-color: #4f4f4f; /* Inactive state */
  border: 1px solid #333;
}

.close { background-color: #e95420; } /* Ubuntu Orange/Red */
.minimize { background-color: #4f4f4f; }
.maximize { background-color: #4f4f4f; }

.terminal-body {
  padding: 20px;
  color: white;
  font-size: 15px;
  line-height: 1.5;
  text-align: left;
}

.line {
  margin-bottom: 8px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.prompt-user {
  color: #8ae234; /* Ubuntu Green */
  font-weight: bold;
}

.prompt-path {
  color: #729fcf; /* Ubuntu Blue */
  font-weight: bold;
}

.cmd {
  color: #fff;
}

.output {
  color: #eeeeec;
  margin-left: 0;
  margin-bottom: 16px;
  width: 100%;
}

.cursor {
  animation: blink 1s step-end infinite;
  background-color: white;
  width: 9px;
  height: 18px;
  display: inline-block;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* Features Section */
.features {
  padding: 6rem 2rem;
  text-align: center;
  /* Transparent/Glassy background instead of solid dark */
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(5px);
}

.features h2 {
  font-size: 2.5rem;
  margin-bottom: 4rem;
  color: white;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  padding: 2.5rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.3s ease;
  color: white;
  text-align: left;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.feature-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.2);
}

.icon {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
}

.feature-card h3 {
  color: white;
  margin-bottom: 1rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.feature-card p {
  color: rgba(255, 255, 255, 0.9);
}

/* About Section */
.about {
  padding: 6rem 2rem;
  text-align: center;
  background: rgba(0, 0, 0, 0.1);
}

.about-content {
  max-width: 800px;
  margin: 0 auto;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  padding: 3rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.about h2 {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: white;
}

.about p {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
}

/* Footer */
.footer {
  background: rgba(0, 0, 0, 0.3);
  color: white;
  padding: 3rem 2rem;
  text-align: center;
  backdrop-filter: blur(5px);
}

.footer-links {
  margin-top: 1.5rem;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  margin: 0 15px;
  font-size: 0.95rem;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: white;
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 900px) {
  .main-header {
    padding: 1rem 1.5rem;
  }

  .hero {
    padding: 6rem 1.5rem 3rem;
    min-height: auto;
  }

  .hero-container {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 3rem;
  }

  .hero-text {
    text-align: center;
  }

  .subtitle {
    margin-left: auto;
    margin-right: auto;
  }

  .cta-buttons {
    justify-content: center;
  }

  .hero h1 {
    font-size: 2.5rem;
  }

  .terminal-window {
    max-width: 100%;
  }
}
</style>
