<template>
  <div class="section-general contenido-pagina">
    <!-- Primera página -->
    <div class="carta">
      <Header2Component />
      <div class="section-title">
        <span class="section-number">3</span> EXPERIENCIA LABORAL
      </div>
      <div v-if="experienciasOrdenadas.length === 0" class="no-experiencias-container">
        <!-- ... mensaje sin experiencias ... -->
      </div>

      <div v-for="(exp, i) in primerasExperiencias" :key="`primera-${exp._id || i}`" class="modulo-experiencia">
        <ExperienciaComponent 
          :experiencia="exp" 
          @experiencias-actualizadas="actualizarExperiencias"
        />
      </div>
    </div>

    <!-- Páginas siguientes -->
    <div v-for="(grupo, index) in experienciasAgrupadas" :key="`grupo-${index}`" class="carta">
      <div v-for="(exp, i) in grupo" :key="`resto-${exp._id || i}`" class="modulo-experiencia">
        <ExperienciaComponent 
          :experiencia="exp"
          @experiencias-actualizadas="actualizarExperiencias"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useHojaVidaStore } from "../stores/hojaVida";
import { useExperienciaStore } from "../stores/experienciaStore.js";
import Header2Component from "../components/Header2Component.vue";
import ExperienciaComponent from "../components/ExperienciaComponent.vue";

const hojaStore = useHojaVidaStore();
const experienciaStore = useExperienciaStore();
const router = useRouter();

const token = localStorage.getItem("token");

// ✅ NUEVO: Estado local para experiencias ordenadas
const experienciasOrdenadas = ref([]);

onMounted(async () => {
  if (!token) {
    console.error("❌ Token no encontrado.");
  } else {
    await hojaStore.cargarHojaDeVida();
  }
  try {
    await experienciaStore.cargarExperiencia();
    experienciasOrdenadas.value = [...experienciaStore.experiencias];
  } catch (err) {
    console.error("❌ Error al cargar experiencias:", err);
  }
});

// ✅ NUEVO: Método para actualizar experiencias cuando se guardan/actualizan
const actualizarExperiencias = async (nuevasExperiencias) => {
  await experienciaStore.cargarExperiencia();
  experienciasOrdenadas.value = [...experienciaStore.experiencias];
};

function irARegistrarExperiencia() {
  router.push("/panel/Hoja2Extra");
}

function agrupar(array, tamano) {
  const resultado = [];
  for (let i = 0; i < array.length; i += tamano) {
    resultado.push(array.slice(i, i + tamano));
  }
  return resultado;
}

// ✅ Usar experienciasOrdenadas en lugar de experienciaStore.experiencias
const primerasExperiencias = computed(() => experienciasOrdenadas.value.slice(0, 4));
const experienciasAgrupadas = computed(() => agrupar(experienciasOrdenadas.value.slice(4), 4));
</script>