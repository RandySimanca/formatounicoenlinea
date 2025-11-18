<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUsuarioStore } from '../stores/usuarios';

const emit = defineEmits(['close']);

const router = useRouter();
const usuarioStore = useUsuarioStore();

const nombre = ref('Invitado');

const cerrarSesion = () => {
  usuarioStore.$reset();
  localStorage.clear();
  router.push('/login');
  location.reload();
  emit('close');
};

const handleNavigate = () => {
  emit('close');
};

onMounted(() => {
  const datos = JSON.parse(localStorage.getItem('usuario'));
  if (datos?.nombre) nombre.value = datos.nombre;
});
</script>

<template>
  <div class="sidebar-content">
    <div class="sidebar-header">
      <div>
        <p class="sidebar-subtitle">Bienvenido</p>
        <p class="sidebar-username">{{ nombre }}</p>
      </div>
      <button class="sidebar-close" type="button" @click="handleNavigate">
        ✕
      </button>
    </div>

    <nav class="sidebar-nav">
      <p class="sidebar-title">Menú principal</p>
      <ul class="sidebar-menu">
        <li>
          <router-link to="/panel/Hoja1" @click="handleNavigate">
            Datos Personales
          </router-link>
        </li>
        <li>
          <router-link to="/panel/Hoja2" @click="handleNavigate">
            Experiencia Laboral
          </router-link>
        </li>
        <li>
          <router-link to="/panel/Hoja2Extra" @click="handleNavigate">
            Registrar Experiencia
          </router-link>
        </li>
        <li>
          <router-link to="/panel/Hoja3" @click="handleNavigate">
            Tiempo Total de Experiencia
          </router-link>
        </li>
        <li>
          <router-link to="/panel/vistaCompleta" @click="handleNavigate">
            Generar PDF
          </router-link>
        </li>
      </ul>
    </nav>

    <button class="boton-cerrar" type="button" @click="cerrarSesion">
      Cerrar sesión
    </button>
  </div>
</template>

<style scoped>
.sidebar-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-subtitle {
  font-size: 0.8rem;
  color: #9ca3af;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.sidebar-username {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0.2rem 0 0;
  color: #f9fafb;
}

.sidebar-close {
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: #f9fafb;
  font-size: 1rem;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  cursor: pointer;
  display: none;
}

.sidebar-title {
  font-size: 0.9rem;
  color: #d1d5db;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sidebar-menu {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.sidebar-menu a {
  display: block;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  text-decoration: none;
  color: #e5e7eb;
  font-weight: 500;
  transition: background 0.2s ease, color 0.2s ease;
}

.sidebar-menu a.router-link-exact-active,
.sidebar-menu a:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #38bdf8;
}

.boton-cerrar {
  margin-top: auto;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  border: none;
  background: linear-gradient(135deg, #f87171, #ef4444);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.boton-cerrar:active {
  transform: translateY(1px);
}

@media (max-width: 1023px) {
  .sidebar-close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
}

@media (max-width: 640px) {
  .sidebar-content {
    padding: 1.25rem;
  }

  .sidebar-menu a {
    font-size: 0.95rem;
  }
}
</style>
