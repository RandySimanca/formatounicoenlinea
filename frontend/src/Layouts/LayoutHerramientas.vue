<template>
  <div class="layout-herramientas">
    <header class="header">
      <div class="header-content">
        <h1 class="logo">Formato Único en Línea</h1>
        <p class="subtitle">Herramientas gratuitas para documentos laborales</p>
      </div>
    </header>
    <main class="main-content">
      <RouterView />
    </main>
    <footer class="footer">
      <p>© 2025 formatounicoenlinea.com — Herramientas gratuitas</p>
    </footer>
  </div>
</template>

<script setup>
</script>

<style scoped>
.layout-herramientas {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f4f5f7;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.header {
  background-color: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  padding: 1rem 0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.header-content {
  max-width: 860px;
  margin: 0 auto;
  padding: 0 20px;
  text-align: center;
}

.logo {
  color: #176994;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.subtitle {
  color: #64748b;
  margin: 4px 0 0;
  font-size: 0.9rem;
}

.main-content {
  flex: 1;
  padding: 2rem 20px;
}

.footer {
  background-color: #ffffff;
  border-top: 1px solid #e2e8f0;
  padding: 1.5rem 0;
  text-align: center;
  color: #64748b;
  font-size: 0.85rem;
}
</style>
