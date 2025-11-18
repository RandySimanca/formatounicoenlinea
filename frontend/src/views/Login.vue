<template>
  <div class="login-wrapper">
    <!-- ✅ NUEVO: Mensaje de orientación horizontal -->
    <transition name="slide-down">
      <div v-if="mostrarMensajeOrientacion" class="orientation-banner">
        <div class="orientation-content">
          <span class="rotate-icon">📱↻</span>
          <div class="orientation-text">
            <strong>Mejor experiencia</strong>
            <p>Gira tu dispositivo horizontalmente para una mejor navegación</p>
          </div>
          <button @click="cerrarMensaje" class="close-banner">✕</button>
        </div>
      </div>
    </transition>

    <!-- Panel de información de contacto -->
    <div class="contact-panel">
      <div class="contact-header">
        <div class="logo">
          <div class="logo-icon">📑</div>
          <h1>Hoja de Vida en Formato Unico</h1>
        </div>
        <p class="tagline">Construye tu futuro profesional</p>
      </div>
      
      <div class="contact-info">
        <h3>¿Necesitas ayuda?</h3>
        <div class="contact-item">
          <span class="icon">📧</span>
          <div>
            <strong>Email</strong>
            <p>randysimancamercado@gmail.com</p>
          </div>
        </div>
        <div class="contact-item">
          <span class="icon">💬</span>
          <div>
            <strong>WhatsApp</strong>
            <p>+57 314 519 3285</p>
          </div>
        </div>

        <div class="contact-item user-counter-compact">
          <span class="icon counter-icon-small">👥</span>
          <div>
            <strong>Usuarios registrados</strong>
            <p v-if="!cargandoStats" class="counter-value">
              {{ totalFormateado }}
            </p>
            <p v-else class="counter-loading-small">Cargando...</p>
          </div>
        </div>
      </div>
    </div> 

    <!-- Formulario de login -->
    <div class="login-card">
      <div class="form-header">
        <h2>{{ modoRegistro ? "Crear cuenta" : "¡Bienvenido!" }}</h2>
        <p>
          {{
            modoRegistro
              ? "Registrate, llena tu tu hoja de vida y descargala en minutos"
              : "Inicia sesión para acceder a tu panel profesional"
          }}
        </p>
      </div>

      <form @submit.prevent="modoRegistro ? handleRegister() : handleLogin()">
        <div class="input-group">
          <label for="email">Correo electrónico</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="tu@email.com"
            autocomplete="email"
            required
          />
        </div>

        <div class="input-group">
          <label for="password">Contraseña</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="••••••••"
            autocomplete="current-password"
            required
          />
        </div>

        <div v-if="modoRegistro" class="input-group">
          <label for="nombre">Nombre completo</label>
          <input
            id="nombre"
            v-model="nombre"
            type="text"
            placeholder="Juan Pérez"
            autocomplete="name"
            required
          />
        </div>

        <button type="submit" :disabled="loading" class="submit-btn">
          <span v-if="loading" class="spinner"></span>
          {{
            loading
              ? modoRegistro
                ? "Creando cuenta..."
                : "Ingresando..."
              : modoRegistro
              ? "Crear mi cuenta"
              : "Iniciar sesión"
          }}
        </button>

        <div v-if="error" class="error-message">
          <span class="error-icon">⚠️</span>
          {{ error }}
        </div>
      </form>

      <div class="form-footer">
        <p>
          {{ modoRegistro ? "¿Ya tienes una cuenta?" : "¿No tienes cuenta?" }}
          <button @click="modoRegistro = !modoRegistro" class="toggle-btn">
            {{ modoRegistro ? "Iniciar sesión" : "Crear cuenta gratis" }}
          </button>
        </p>
      </div>

      <div class="additional-links">
        <router-link to="/recuperar-password" class="link">
          🔐 ¿Olvidaste tu contraseña?
        </router-link>
        <span class="separator">•</span>
        <a href="#" class="link" @click.prevent>Términos y condiciones</a>
      </div>
    </div>

    <!-- Panel publicitario -->
    <div class="ads-panel">
      <div class="ads-container">
        <div class="main-ad">
          <div class="ad-header">
            <h3>🚀 Impulsa tu carrera</h3>
            <span class="ad-badge">PREMIUM</span>
          </div>
          <div class="ad-content">
            <p>Descubre herramientas exclusivas para crear CVs que destacan</p>
            <ul class="benefits-list">
              <li>✅ Plantillas premium exclusivas</li>
              <li>✅ Análisis automático de ATS</li>
              <li>✅ Sugerencias personalizadas</li>
              <li>✅ Descargas ilimitadas</li>
            </ul>
            <button class="cta-btn">
              Prueba Premium
              <span class="price">$9.99/mes</span>
            </button>
          </div>
        </div>

        <div class="external-ad">
          <div class="ad-placeholder">
            <p>Espacio publicitario</p>
            <small>320x250</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api/axios';
import { useHojaVidaStore } from '../stores/hojaVida';

const router = useRouter();
const hojaStore = useHojaVidaStore();

const email = ref('');
const password = ref('');
const nombre = ref('');
const error = ref('');
const loading = ref(false);
const modoRegistro = ref(false);

// Variables para el contador
const totalUsuarios = ref(0);
const cargandoStats = ref(false);

// ✅ NUEVO: Variables para el mensaje de orientación
const mostrarMensajeOrientacion = ref(false);
const mensajeCerradoManualmente = ref(false);

const totalFormateado = computed(() => {
  return new Intl.NumberFormat('es-CO').format(totalUsuarios.value);
});

const cargarContadorUsuarios = async () => {
  cargandoStats.value = true;
  try {
    const response = await api.get('/usuarios/count');
    
    if (response.data?.success) {
      totalUsuarios.value = response.data.total;
    }
  } catch (error) {
    console.error('Error cargando contador:', error);
    totalUsuarios.value = 0;
  } finally {
    cargandoStats.value = false;
  }
};

// ✅ NUEVO: Función para detectar si es móvil en orientación vertical
const verificarOrientacion = () => {
  if (mensajeCerradoManualmente.value) return;
  
  const esMovil = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  const esVertical = window.innerHeight > window.innerWidth;
  const anchoMovil = window.innerWidth <= 768;
  
  mostrarMensajeOrientacion.value = esMovil && esVertical && anchoMovil;
};

// ✅ NUEVO: Función para cerrar el mensaje manualmente
const cerrarMensaje = () => {
  mensajeCerradoManualmente.value = true;
  mostrarMensajeOrientacion.value = false;
  
  // Guardar en localStorage para no mostrar nuevamente en esta sesión
  localStorage.setItem('orientacion-mensaje-cerrado', 'true');
};

const handleLogin = async () => {
  error.value = '';
  if (!email.value || !password.value) {
    error.value = 'Por favor completa todos los campos';
    return;
  }

  loading.value = true;
  try {
    const res = await api.post('/login', {
      email: email.value,
      password: password.value,
    });

    const { token, usuario } = res.data;
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    
    await hojaStore.cargarHojaDeVida();

    router.push(usuario.roles.includes('admin') ? '/admin' : '/panel/Hoja1');
  } catch (e) {
    console.error('Error de login:', e);
    error.value = e.response?.data?.mensaje || 'Error de conexión. Verifica tus credenciales.';
  } finally {
    loading.value = false;
  }
};

const handleRegister = async () => {
  error.value = '';
  if (!email.value || !password.value || !nombre.value) {
    error.value = 'Por favor completa todos los campos para continuar';
    return;
  }

  loading.value = true;
  try {
    await api.post('/usuarios', {
      email: email.value,
      password: password.value,
      nombre: nombre.value,
      roles: ['usuario'],
    });

    modoRegistro.value = false;
    error.value = '🎉 ¡Registro exitoso! Ahora puedes iniciar sesión.';
  } catch (e) {
    console.error('Error de registro:', e);
    error.value = e.response?.data?.mensaje || 'Error al crear la cuenta. Intenta nuevamente.';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  cargarContadorUsuarios();
  
  // ✅ NUEVO: Verificar si el mensaje fue cerrado anteriormente
  const mensajeCerrado = localStorage.getItem('orientacion-mensaje-cerrado');
  if (mensajeCerrado === 'true') {
    mensajeCerradoManualmente.value = true;
  }
  
  // Verificar orientación al cargar
  verificarOrientacion();
  
  // Escuchar cambios de orientación y redimensionamiento
  window.addEventListener('orientationchange', verificarOrientacion);
  window.addEventListener('resize', verificarOrientacion);
});

onUnmounted(() => {
  // Limpiar eventos al desmontar el componente
  window.removeEventListener('orientationchange', verificarOrientacion);
  window.removeEventListener('resize', verificarOrientacion);
});
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.login-wrapper {
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  position: relative;
}

/* ✅ NUEVO: Estilos del banner de orientación */
.orientation-banner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
  color: white;
  padding: 1rem;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.orientation-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: space-between;
}

.rotate-icon {
  font-size: 2rem;
  animation: rotate-phone 2s ease-in-out infinite;
}

@keyframes rotate-phone {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-15deg); }
  75% { transform: rotate(15deg); }
}

.orientation-text {
  flex: 1;
}

.orientation-text strong {
  display: block;
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.orientation-text p {
  margin: 0;
  font-size: 0.85rem;
  opacity: 0.95;
}

.close-banner {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.close-banner:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

/* Animación de entrada del banner */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.4s ease;
}

.slide-down-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

/* Panel de contacto */
.contact-panel {
  flex: 1;
  max-width: 500px;
  padding: 3rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
  border-right: 1px solid rgba(255, 255, 255, 0.2);
}

.contact-header {
  text-align: center;
  margin-bottom: 3rem;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.logo-icon {
  font-size: 2.5rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 1rem;
  border-radius: 50%;
  backdrop-filter: blur(10px);
}

.logo h1 {
  font-size: 2.5rem;
  margin: 0;
  font-weight: 700;
  background: linear-gradient(45deg, #fff, #e0e7ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.tagline {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
}

.contact-info {
  margin-bottom: 2rem;
}

.contact-info h3 {
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
  color: #fff;
  text-align: center;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.contact-item .icon {
  font-size: 1.5rem;
  min-width: 2rem;
}

.contact-item div strong {
  display: block;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.contact-item div p {
  margin: 0;
  opacity: 0.8;
  font-size: 0.9rem;
}

.user-counter-compact {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  margin-bottom: 0;
}

.user-counter-compact:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.counter-icon-small {
  font-size: 1.3rem !important;
}

.counter-value {
  font-size: 1.1rem !important;
  font-weight: 700 !important;
  color: #fff !important;
  opacity: 1 !important;
  margin: 0 !important;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.counter-loading-small {
  font-size: 0.85rem !important;
  opacity: 0.7 !important;
  font-style: italic;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

/* Formulario de login */
.login-card {
  flex: 1;
  max-width: 500px;
  background: white;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.1);
}

.form-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.form-header h2 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #1a202c;
  font-weight: 700;
}

.form-header p {
  color: #718096;
  font-size: 1rem;
  line-height: 1.5;
  margin: 0;
}

.input-group {
  margin-bottom: 1.5rem;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #2d3748;
  font-size: 0.9rem;
}

.input-group input {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f7fafc;
}

.input-group input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-message {
  background: #fef2f2;
  color: #c53030;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid #feb2b2;
}

.error-icon {
  font-size: 1.1rem;
}

.form-footer {
  text-align: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e2e8f0;
}

.form-footer p {
  color: #718096;
  margin: 0;
}

.toggle-btn {
  background: none;
  border: none;
  color: #667eea;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.3s ease;
}

.toggle-btn:hover {
  color: #764ba2;
}

.additional-links {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
  font-size: 0.875rem;
}

.link {
  color: #718096;
  text-decoration: none;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.link:hover {
  color: #667eea;
  text-decoration: underline;
  transform: translateY(-1px);
}

.separator {
  color: #cbd5e0;
}

/* Panel publicitario */
.ads-panel {
  flex: 1;
  max-width: 400px;
  background: #f8fafc;
  padding: 2rem;
  overflow-y: auto;
  border-left: 1px solid rgba(255, 255, 255, 0.2);
}

.ads-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: 100%;
  justify-content: flex-start;
}

.main-ad {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 15px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.main-ad::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  transform: translate(30px, -30px);
}

.ad-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.ad-header h3 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 700;
}

.ad-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.ad-content p {
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  line-height: 1.5;
  opacity: 0.9;
}

.benefits-list {
  list-style: none;
  padding: 0;
  margin-bottom: 1.5rem;
}

.benefits-list li {
  padding: 0.4rem 0;
  font-size: 0.8rem;
  opacity: 0.9;
}

.cta-btn {
  width: 100%;
  background: white;
  color: #667eea;
  border: none;
  padding: 1rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cta-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.price {
  background: #667eea;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.8rem;
}

.external-ad {
  background: white;
  border: 2px dashed #e2e8f0;
  border-radius: 10px;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #a0aec0;
  transition: all 0.3s ease;
}

.external-ad:hover {
  border-color: #cbd5e0;
  background: #f7fafc;
}

.ad-placeholder p {
  margin: 0 0 0.5rem 0;
  font-weight: 600;
  font-size: 1rem;
}

.ad-placeholder small {
  font-size: 0.8rem;
}

/* Responsive */
@media (max-width: 768px) {
  .login-wrapper {
    flex-direction: column;
  }
  
  .contact-panel {
    max-width: none;
    padding: 2rem;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .login-card {
    max-width: none;
    padding: 2rem;
  }

  .ads-panel {
    max-width: none;
    padding: 2rem;
    border-left: none;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    max-height: 400px;
  }
  
  .logo {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .logo h1 {
    font-size: 2rem;
  }
  
  .form-header h2 {
    font-size: 1.5rem;
  }

  /* ✅ Ajustar tamaño del banner en móvil */
  .orientation-text strong {
    font-size: 0.9rem;
  }

  .orientation-text p {
    font-size: 0.8rem;
  }

  .rotate-icon {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .contact-panel,
  .login-card,
  .ads-panel {
    padding: 1.5rem;
  }
  
  .additional-links {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .separator {
    display: none;
  }

  /* ✅ Compactar más el banner en pantallas muy pequeñas */
  .orientation-banner {
    padding: 0.75rem;
  }

  .orientation-content {
    gap: 0.75rem;
  }
}
</style>