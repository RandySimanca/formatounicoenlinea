<!-- src/views/Hoja3.vue -->
<template>
  <div class="section-general contenido-pagina carta">
    <Header2Component />

    <div class="">
      <ExperienciaTotComponent :publico="publico" :privado="privado" :independiente="independiente"
        :totalAnios="totalAnios" :totalMeses="totalMeses" />

      <!-- ✅ REMOVIDA la clase compoFirma -->
      <FirmaServidorComponent />
      <RecursosHumComponent />
    </div>

    <FooterComponent />
  </div>
</template>

<style scoped>
@media print {
  .carta {
    width: 8.5in !important;
    height: 11in !important;
    padding: 0.4in !important;
    page-break-after: always !important;
    box-sizing: border-box;
  }
}
</style>

<script setup>
import { reactive, computed, ref, onMounted } from "vue";
import Header2Component from "../components/Header2Component.vue";
import ExperienciaTotComponent from "../components/ExperienciaTotComponent.vue";
import FirmaServidorComponent from "../components/FirmaServidorComponent.vue";
import RecursosHumComponent from "../components/RecursosHumComponent.vue";
import FooterComponent from "../components/FooterComponent.vue";
import { useHojaVidaStore } from "../stores/hojaVida";
import api from "../api/axios";
import { calcularDuracionExperiencia, calcularTiemposTotales } from "../utils/experienciaUtils";

// Store
const hojaStore = useHojaVidaStore();
const experiencias = ref([]);

const publico = reactive({ anios: 0, meses: 0 });
const privado = reactive({ anios: 0, meses: 0 });
const independiente = reactive({ anios: 0, meses: 0 });

const token = localStorage.getItem("token");

onMounted(async () => {
  if (!token) {
    console.error("❌ Token no encontrado");
  } else {
    await cargarExperiencias();
    await hojaStore.cargarHojaDeVida();
  }
});

async function cargarExperiencias() {
  try {
    const response = await api.get("/experiencia");
    experiencias.value = response.data;
    recalcularTotales();
  } catch (error) {
    console.error("❌ Error al cargar experiencias:", error);
  }
}

function recalcularTotales() {
  // Usar la función compartida para calcular tiempos totales
  const tiempos = calcularTiemposTotales(experiencias.value);

  // Actualizar los objetos reactivos con valores decimales
  publico.anios = tiempos.publico.anios;
  publico.meses = tiempos.publico.mesesDecimales; // Usar decimales
  privado.anios = tiempos.privado.anios;
  privado.meses = tiempos.privado.mesesDecimales; // Usar decimales
  independiente.anios = tiempos.independiente.anios;
  independiente.meses = tiempos.independiente.mesesDecimales; // Usar decimales
}

const totalAnios = computed(() => {
  const totalMeses =
    publico.anios * 12 + publico.meses +
    privado.anios * 12 + privado.meses +
    independiente.anios * 12 + independiente.meses;
  return Math.floor(totalMeses / 12);
});


const totalMeses = computed(() => {
  const totalMesesDecimal =
    publico.anios * 12 + publico.meses +
    privado.anios * 12 + privado.meses +
    independiente.anios * 12 + independiente.meses;
  // Retornar los meses restantes con decimales
  const mesesRestantes = totalMesesDecimal % 12;
  return parseFloat(mesesRestantes.toFixed(2));
}
);

</script>


<style scoped>
/* Agrega estilos si es necesario */
</style>