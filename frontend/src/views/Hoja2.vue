<template>
  <div class="section-general contenido-pagina">
    <!-- Primera página -->
    <div class="carta">
      <Header2Component />
      <div class="section-title" style="display: flex; justify-content: space-between; align-items: center; padding-right: 20px;">
        <div><span class="section-number">3</span> EXPERIENCIA LABORAL</div>
        <div v-if="experienciaStore.experiencias.length > 0" class="bulk-actions no-imprimir">
          <button @click="marcarTodas(true)" :disabled="cargandoBulk" class="btn-bulk" title="Incluir todas en la impresión">
            ☑️ Seleccionar todas
          </button>
          <button @click="marcarTodas(false)" :disabled="cargandoBulk" class="btn-bulk btn-bulk-danger" title="Excluir todas de la impresión">
            ☐ Deseleccionar todas
          </button>
        </div>
      </div>
      <div
        v-if="experienciaStore.experiencias.length === 0"
        class="no-experiencias-container"
      >
        <div class="no-experiencias-message">
          <i class="fas fa-briefcase icon-large"></i>
          <h3>No hay experiencias laborales registradas</h3>
          <p>
            Para completar tu hoja de vida, registra tu experiencia laboral en
            el siguiente módulo.
          </p>
          <button @click="irARegistrarExperiencia" class="btn-recordatorio">
            📝 Ir a Registrar Experiencia
          </button>
        </div>
      </div>

      <div
        v-for="(exp, i) in primerasExperiencias"
        :key="`primera-${exp._id || i}`"
        class="modulo-experiencia"
      >
        <ExperienciaComponent
          :experiencia="exp"
          @experiencias-actualizadas="actualizarExperiencias"
        />
      </div>
    </div>

    <!-- Páginas siguientes -->
    <div
      v-for="(grupo, index) in experienciasAgrupadas"
      :key="`grupo-${index}`"
      class="carta"
    >
      <div
        v-for="(exp, i) in grupo"
        :key="`resto-${exp._id || i}`"
        class="modulo-experiencia"
      >
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
import api from "../api/axios";
import { showSuccess, showError } from "../utils/showMessage.js";

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

const cargandoBulk = ref(false);

async function marcarTodas(estado) {
  if (cargandoBulk.value) return;
  cargandoBulk.value = true;
  try {
    const convertirFecha = (f) => {
      if (!f || !f.dia || !f.mes || !f.anio) return null;
      return new Date(parseInt(f.anio), parseInt(f.mes) - 1, parseInt(f.dia));
    };

    const promesas = experienciasOrdenadas.value.map(exp => {
      if (exp.imprimir === estado) return Promise.resolve();
      const obj = { 
        ...exp, 
        imprimir: estado,
        fechaIngreso: convertirFecha(exp.fechaIngreso),
        fechaRetiro: convertirFecha(exp.fechaRetiro)
      };
      return api.put(`/experiencia/${exp._id}`, obj);
    });
    await Promise.all(promesas);
    showSuccess(`✅ Se han ${estado ? 'seleccionado' : 'deseleccionado'} todas las experiencias`);
    await actualizarExperiencias();
    setTimeout(() => {
      window.location.reload();
    }, 800);
  } catch (error) {
    console.error("❌ Error al marcar todas:", error);
    showError("❌ Hubo un error al actualizar las experiencias");
  } finally {
    cargandoBulk.value = false;
  }
}

function agrupar(array, tamano) {
  const resultado = [];
  for (let i = 0; i < array.length; i += tamano) {
    resultado.push(array.slice(i, i + tamano));
  }
  return resultado;
}

// ✅ Usar experienciasOrdenadas en lugar de experienciaStore.experiencias
const primerasExperiencias = computed(() =>
  experienciasOrdenadas.value.slice(0, 4)
);
const experienciasAgrupadas = computed(() =>
  agrupar(experienciasOrdenadas.value.slice(4), 4)
);
</script>

<style scoped>
@media print {
  .carta {
    width: 8.5in !important;
    height: 11in !important;
    padding: 0.4in !important;
    box-sizing: border-box;
    page-break-after: always !important;
  }
  .modulo-experiencia {
    margin-bottom: 1rem;
  }
}

.bulk-actions {
  display: flex;
  gap: 10px;
}

.btn-bulk {
  background: #e2e8f0;
  border: 1px solid #cbd5e0;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  color: #4a5568;
  transition: all 0.2s ease;
}

.btn-bulk:hover:not(:disabled) {
  background: #edf2f7;
  transform: translateY(-1px);
}

.btn-bulk:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-bulk-danger {
  color: #c53030;
}
</style>
