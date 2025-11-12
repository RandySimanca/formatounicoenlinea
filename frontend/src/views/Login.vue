<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api/axios'; // ✅ IMPORTANTE: Usar esta instancia
import { useHojaVidaStore } from '../stores/hojaVida';

const router = useRouter();
const hojaStore = useHojaVidaStore();

// Variables existentes
const email = ref('');
const password = ref('');
const nombre = ref('');
const error = ref('');
const loading = ref(false);
const modoRegistro = ref(false);

// ✅ Variables para el contador
const totalUsuarios = ref(0);
const cargandoStats = ref(false);

const totalFormateado = computed(() => {
  return new Intl.NumberFormat('es-CO').format(totalUsuarios.value);
});

// ✅ Función corregida
const cargarContadorUsuarios = async () => {
  cargandoStats.value = true;
  try {
    const response = await api.get('/usuarios/count'); // ✅ Sin duplicar /api
    
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

// Función para obtener la URL base (si la necesitas para otras cosas)
const getApiUrl = () => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:4000';
  }
  return window.location.origin;
};

const handleLogin = async () => {
  error.value = '';
  if (!email.value || !password.value) {
    error.value = 'Por favor completa todos los campos';
    return;
  }

  loading.value = true;
  try {
    const res = await api.post('/login', { // ✅ Usa 'api' aquí también
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
    await api.post('/usuarios', { // ✅ Usa 'api' aquí también
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

// ✅ Cargar contador al montar
onMounted(() => {
  cargarContadorUsuarios();
});
</script>

<template>
  <div class="login-wrapper">
    <!-- Panel de contacto -->
    <div class="contact-panel">
      <div class="contact-header">
        <div class="logo">
          <div class="logo-icon">📑</div>
          <h1>Hoja de Vida en Formato Unico</h1>
        </div>
        <p class="tagline">Construye tu futuro profesional</p>
      </div>
      
      <!-- ✅ Contador de usuarios -->
      <div class="user-counter">
        <span class="counter-icon">👥</span>
        <div class="counter-info">
          <span v-if="!cargandoStats" class="counter-number">
            {{ totalFormateado }}
          </span>
          <span v-else class="counter-loading">⏳</span>
          <span class="counter-text">usuarios registrados</span>
        </div>
      </div>
      
      <!-- ... resto del template ... -->
    </div>
  </div>
</template>

<style scoped>
/* Estilos del contador */
.user-counter {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  margin: 1.5rem 0;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.user-counter:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.2);
}

.counter-icon {
  font-size: 2rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.counter-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.counter-number {
  font-size: 1.75rem;
  font-weight: 700;
  color: white;
  line-height: 1;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.counter-loading {
  font-size: 1.5rem;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

.counter-text {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.9);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
}
</style>
```

---

## 🚀 Pasos finales:

1. **Guarda** `backend/routes/usuarios.js` (ya está correcto)
2. **Reinicia** el servidor backend
3. **Actualiza** `Login.vue` con el código de arriba
4. **Refresca** el navegador (F5)

---

## ✅ Resultado esperado:

En la consola del navegador verás:
```
🔄 Cargando contador de usuarios...
🚀 Request to: http://localhost:4000/api/usuarios/count
✅ Response from: /usuarios/count 200
📊 Respuesta: {success: true, total: 5}
✅ Total usuarios: 5