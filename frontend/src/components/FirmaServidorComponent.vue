<!--src/FirmaServidorComponent.vue-->
<template>
  <div class="section">
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

    <div class="signature-area">
      <!-- Vista previa de la firma existente -->
      <div v-if="firmaUrl" class="firma-preview">
        <img
          :src="firmaUrl"
          alt="Firma cargada"
          class="firma-imagen"
        />
        <div class="firma-acciones">
          <button @click="eliminarFirma" class="btn-eliminar no-imprimir">
            🗑️ Eliminar firma
          </button>
          <button @click="cambiarFirma" class="btn-cambiar no-imprimir">
            🔄 Cambiar firma
          </button>
        </div>
      </div>

      <!-- Input para subir nueva firma -->
      <div v-else class="firma-upload">
        <input
          type="file"
          id="firma"
          ref="firmaInput"
          accept=".jpg,.jpeg,.png"
          @change="mostrarFirma"
          class="input-file"
        />
        <label for="firma" class="label-upload">
          📝 Seleccionar firma
        </label>
      </div>

      <!-- Input oculto para cambiar firma -->
      <input
        type="file"
        ref="firmaInputCambio"
        accept=".jpg,.jpeg,.png"
        @change="mostrarFirma"
        style="display: none"
      />

      <div class="firma-header">
        <label>FIRMA DEL SERVIDOR PÚBLICO O CONTRATISTA</label>
        <button 
          @click="guardarFirma" 
          class="btn-guardar no-imprimir"
          :disabled="guardando"
        >
          {{ guardando ? '⏳ Guardando...' : '💾 Guardar diligenciamiento' }}
        </button>
      </div>
    </div>

    <!-- Modal de confirmación para eliminar -->
    <div v-if="mostrarModalEliminar" class="modal-overlay" @click="cerrarModalEliminar">
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
          <button @click="confirmarEliminarFirma" class="btn-confirmar-eliminar">
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

// Convertir la imagen a base64
const mostrarFirma = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Validar tamaño del archivo (máximo 2MB)
  if (file.size > 2 * 1024 * 1024) {
    showError("❌ La imagen es muy grande. Máximo 2MB.");
    return;
  }

  // Validar tipo de archivo
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
      
      // Fondo blanco
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Dibujar imagen
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

// Guardar la información al backend
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
    showSuccess("✅ Firma y datos de diligenciamiento guardados correctamente.");
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

// Mostrar modal de confirmación
const eliminarFirma = () => {
  mostrarModalEliminar.value = true;
};

// Cerrar modal
const cerrarModalEliminar = () => {
  mostrarModalEliminar.value = false;
};

// Confirmar y eliminar firma
const confirmarEliminarFirma = async () => {
  try {
    await api.delete("/firma-servidor");
    
    // Limpiar datos locales
    firmaUrl.value = null;
    ciudadDiligenciamiento.value = "";
    fechaDiligenciamiento.value = "";
    
    // Resetear inputs de archivo
    if (firmaInput.value) firmaInput.value.value = "";
    if (firmaInputCambio.value) firmaInputCambio.value.value = "";
    
    showSuccess("✅ Firma eliminada correctamente.");
    cerrarModalEliminar();
    console.log("✅ Firma eliminada del servidor");
  } catch (error) {
    console.error("❌ Error al eliminar firma:", error.response?.data || error.message);
    showError("❌ No se pudo eliminar la firma. Intenta nuevamente.");
  }
};

// Cambiar firma
const cambiarFirma = () => {
  firmaInputCambio.value?.click();
};
</script>

<style scoped>
.section {
  margin-bottom: 30px;
}

.section-title {
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
}

.section-number {
  display: inline-block;
  background: #007bff;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  text-align: center;
  line-height: 24px;
  margin-right: 8px;
  font-size: 14px;
}

.declaration {
  background: #f8f9fa;
  padding: 15px;
  border-left: 4px solid #007bff;
  margin-bottom: 20px;
  border-radius: 4px;
}

.declaration p {
  margin: 10px 0;
  line-height: 1.6;
  font-size: 14px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 5px;
  color: #555;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.signature-area {
  margin-top: 20px;
}

/* Vista previa de firma */
.firma-preview {
  background: #f8f9fa;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  margin-bottom: 15px;
}

.firma-imagen {
  max-width: 250px;
  height: auto;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  background: white;
  margin-bottom: 15px;
}

.firma-acciones {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.btn-eliminar,
.btn-cambiar {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-eliminar {
  background: #dc3545;
  color: white;
}

.btn-eliminar:hover {
  background: #c82333;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(220, 53, 69, 0.3);
}

.btn-cambiar {
  background: #17a2b8;
  color: white;
}

.btn-cambiar:hover {
  background: #138496;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(23, 162, 184, 0.3);
}

/* Upload de firma */
.firma-upload {
  text-align: center;
  margin-bottom: 15px;
}

.input-file {
  display: none;
}

.label-upload {
  display: inline-block;
  padding: 12px 24px;
  background: #007bff;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.label-upload:hover {
  background: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
}

.firma-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  border-top: 2px solid #dee2e6;
}

.firma-header label {
  font-weight: 600;
  color: #333;
}

.btn-guardar {
  padding: 10px 20px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-guardar:hover:not(:disabled) {
  background: #218838;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(40, 167, 69, 0.3);
}

.btn-guardar:disabled {
  background: #6c757d;
  cursor: not-allowed;
  opacity: 0.6;
}

/* Modal */
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
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #dee2e6;
}

.modal-header h3 {
  margin: 0;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
}

.modal-body {
  padding: 20px;
}

.modal-body p {
  margin: 10px 0;
  color: #555;
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

.btn-cancelar:hover {
  background: #5a6268;
}

.btn-confirmar-eliminar {
  background: #dc3545;
  color: white;
}

.btn-confirmar-eliminar:hover {
  background: #c82333;
}

@media print {
  .no-imprimir {
    display: none !important;
  }
}

@media (max-width: 768px) {
  .firma-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .btn-guardar {
    width: 100%;
  }

  .firma-acciones {
    flex-direction: column;
  }

  .btn-eliminar,
  .btn-cambiar {
    width: 100%;
  }
}
</style>