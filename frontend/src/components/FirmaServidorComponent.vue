<!-- src/FirmaServidorComponent.vue -->
<template>
  <div class="section firma-section">
    <div class="section-title">
      <span class="section-number">5</span> FIRMA DEL SERVIDOR PÚBLICO O
      CONTRATISTA
    </div>

    <div class="declaration">
      <p>
        MANIFIESTO BAJO LA GRAVEDAD DEL JURAMENTO QUE SI NO ME ENCUENTRO DENTRO
        DE LAS CAUSALES DE INHABILIDAD E INCOMPATIBILIDAD DEL ORDEN
        CONSTITUCIONAL O LEGAL, PARA EJERCER CARGOS EMPLEOS PÚBLICOS O PARA
        CELEBRAR CONTRATOS DE PRESTACIÓN DE SERVICIOS CON LA ADMINISTRACIÓN
        PÚBLICA.
      </p>
      <p>
        PARA TODOS LOS EFECTOS LEGALES, CERTIFICO QUE LOS DATOS POR MI ANOTADOS
        EN EL PRESENTE FORMATO ÚNICO DE HOJA DE VIDA, SON VERACES (ARTÍCULO 5o.
        DE LA LEY 190/95).
      </p>
    </div>

    <div class="datos-firma-container">
      <div class="form-group">
        <label for="signing-city">Ciudad:</label>
        <input
          type="text"
          id="signing-city"
          placeholder="Ej: Bogotá"
          v-model="ciudadDiligenciamiento"
        />
      </div>

      <div class="form-group">
        <label for="signing-date">Fecha de diligenciamiento:</label>
        <input type="date" id="signing-date" v-model="fechaDiligenciamiento" />
      </div>
    </div>

    <div class="signature-container">
      <div v-if="firmaUrl" class="firma-preview">
        <img :src="firmaUrl" alt="Firma cargada" class="firma-imagen" />
        <div class="firma-acciones">
          <button @click="eliminarFirma" class="btn-eliminar no-imprimir">
            🗑️ Eliminar firma
          </button>
          <button @click="cambiarFirma" class="btn-cambiar no-imprimir">
            🔄 Cambiar firma
          </button>
        </div>
      </div>

      <div v-else class="firma-upload">
        <input
          type="file"
          id="firma"
          ref="firmaInput"
          accept=".jpg,.jpeg,.png"
          @change="mostrarFirma"
          class="input-file"
        />
        <label for="firma" class="label-upload"> 📝 Seleccionar firma </label>
      </div>

      <input
        type="file"
        ref="firmaInputCambio"
        accept=".jpg,.jpeg,.png"
        @change="mostrarFirma"
        style="display: none"
      />
    </div>

    <div class="firma-footer">
      <label class="firma-label"
        >FIRMA DEL SERVIDOR PÚBLICO O CONTRATISTA</label
      >
      <button
        @click="guardarFirma"
        class="btn-guardar no-imprimir"
        :disabled="guardando"
      >
        {{ guardando ? "⏳ Guardando..." : "💾 Guardar diligenciamiento" }}
      </button>
    </div>

    <div
      v-if="mostrarModalEliminar"
      class="modal-overlay"
      @click="cerrarModalEliminar"
    >
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>⚠️ Confirmar eliminación</h3>
        </div>
        <div class="modal-body">
          <p>¿Estás seguro de que deseas eliminar la firma?</p>
          <p class="warning-text">Esta acción no se puede deshacer.</p>
        </div>
        <div class="modal-footer">
          <button @click="cerrarModalEliminar" class="btn-cancelar">
            Cancelar
          </button>
          <button
            @click="confirmarEliminarFirma"
            class="btn-confirmar-eliminar"
          >
            Eliminar firma
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { showSuccess, showError } from "../utils/showMessage";
import { ref, onMounted } from "vue";
import api from "../api/axios";

const ciudadDiligenciamiento = ref("");
const fechaDiligenciamiento = ref("");
const firmaUrl = ref(null);
const guardando = ref(false);
const mostrarModalEliminar = ref(false);
const firmaInput = ref(null);
const firmaInputCambio = ref(null);

onMounted(async () => {
  await cargarFirma();
});

async function cargarFirma() {
  try {
    const response = await api.get("/firma-servidor");
    const data = response.data;
    if (data) {
      ciudadDiligenciamiento.value = data.ciudadDiligenciamiento || "";
      fechaDiligenciamiento.value =
        data.fechaDiligenciamiento?.substring(0, 10) || "";
      firmaUrl.value = data.firmaServidor || null;
      console.log("✅ Firma cargada correctamente");
    }
  } catch (error) {
    console.error(
      "No se pudo cargar la firma existente:",
      error.response?.data || error.message
    );
  }
}

const mostrarFirma = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  if (file.size > 2 * 1024 * 1024) {
    showError("❌ La imagen es muy grande. Máximo 2MB.");
    return;
  }

  if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
    showError("❌ Solo se permiten archivos JPG, JPEG o PNG.");
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 250;
      canvas.height = 100;
      const ctx = canvas.getContext("2d");

      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      firmaUrl.value = canvas.toDataURL("image/png");
      console.log("✅ Firma procesada correctamente");
    };
    img.onerror = () => {
      showError("❌ Error al cargar la imagen.");
    };
    img.src = e.target.result;
  };
  reader.onerror = () => {
    showError("❌ Error al leer el archivo.");
  };
  reader.readAsDataURL(file);
};

const guardarFirma = async () => {
  if (!firmaUrl.value) {
    showError("❌ Por favor, selecciona una firma antes de guardar.");
    return;
  }

  if (!ciudadDiligenciamiento.value || !fechaDiligenciamiento.value) {
    showError("❌ Por favor, completa la ciudad y fecha de diligenciamiento.");
    return;
  }

  guardando.value = true;

  try {
    const payload = {
      ciudadDiligenciamiento: ciudadDiligenciamiento.value,
      fechaDiligenciamiento: fechaDiligenciamiento.value,
      firmaServidor: firmaUrl.value,
    };

    const response = await api.post("/firma-servidor", payload);
    console.log("✅ Guardado:", response.data);
    showSuccess(
      "✅ Firma y datos de diligenciamiento guardados correctamente."
    );
  } catch (error) {
    console.error(
      "❌ Error al guardar:",
      error.response?.data || error.message
    );
    showError("❌ Ocurrió un error al guardar los datos.");
  } finally {
    guardando.value = false;
  }
};

const eliminarFirma = () => {
  mostrarModalEliminar.value = true;
};

const cerrarModalEliminar = () => {
  mostrarModalEliminar.value = false;
};

const confirmarEliminarFirma = async () => {
  try {
    await api.delete("/firma-servidor");

    firmaUrl.value = null;
    ciudadDiligenciamiento.value = "";
    fechaDiligenciamiento.value = "";

    if (firmaInput.value) firmaInput.value.value = "";
    if (firmaInputCambio.value) firmaInputCambio.value.value = "";

    showSuccess("✅ Firma eliminada correctamente.");
    cerrarModalEliminar();
    console.log("✅ Firma eliminada del servidor");
  } catch (error) {
    console.error(
      "❌ Error al eliminar firma:",
      error.response?.data || error.message
    );
    showError("❌ No se pudo eliminar la firma. Intenta nuevamente.");
  }
};

const cambiarFirma = () => {
  firmaInputCambio.value?.click();
};
</script>

<style scoped>
.firma-section {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  height: auto; /* ✅ Permite crecimiento dinámico */
  overflow: visible;
  padding: 0.5rem !important;
  margin-bottom: 1rem; /* ✅ Espacio con la siguiente sección */
}

.datos-firma-container {
  display: flex;
  gap: 1rem;
  margin: 0.3rem 0;
}

.datos-firma-container .form-group {
  flex: 1;
  margin: 0;
}

.datos-firma-container input {
  width: 100%;
  padding: 0.4rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 12px;
}

.signature-container {
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0.4rem 0;
}

.firma-preview {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

.firma-imagen {
  width: 250px;
  height: 100px;
  border: 2px solid #dee2e6;
  border-radius: 6px;
  object-fit: contain;
  background: white;
}

.firma-acciones {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.btn-eliminar,
.btn-cambiar {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.btn-eliminar {
  background: #dc3545;
  color: white;
}

.btn-eliminar:hover {
  background: #c82333;
  transform: translateY(-2px);
}

.btn-cambiar {
  background: #17a2b8;
  color: white;
}

.btn-cambiar:hover {
  background: #138496;
  transform: translateY(-2px);
}

.firma-upload {
  text-align: center;
  width: 100%;
}

.input-file {
  display: none;
}

.label-upload {
  display: inline-block;
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;
  transition: all 0.3s ease;
}

.label-upload:hover {
  background: #0056b3;
  transform: translateY(-2px);
}

.firma-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.6rem;
  border-top: 2px solid #dee2e6;
  margin-top: 0.5rem;
  min-height: 40px;
}

.firma-label {
  font-weight: 600;
  font-size: 11px;
  color: #333;
  max-width: 50%;
}

.btn-guardar {
  padding: 8px 16px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.btn-guardar:hover:not(:disabled) {
  background: #218838;
  transform: translateY(-2px);
}

.btn-guardar:disabled {
  background: #6c757d;
  cursor: not-allowed;
  opacity: 0.6;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #dee2e6;
}

.modal-body {
  padding: 20px;
}

.warning-text {
  color: #dc3545;
  font-weight: 600;
  font-size: 14px;
}

.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid #dee2e6;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn-cancelar,
.btn-confirmar-eliminar {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancelar {
  background: #6c757d;
  color: white;
}

.btn-confirmar-eliminar {
  background: #dc3545;
  color: white;
}

@media print {
  .no-imprimir {
    display: none !important;
  }

  .firma-section {
    max-height: none;
    page-break-inside: avoid;
  }
}

@media (max-width: 768px) {
  .datos-firma-container {
    flex-direction: column;
  }

  .firma-preview {
    flex-direction: column;
    gap: 0.5rem;
  }

  .firma-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .btn-guardar {
    width: 100%;
  }
}
</style>
