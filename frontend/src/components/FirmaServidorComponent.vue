<!--src/FirmaServidorComponent.vue-->
<template>
  <div class="section firma-section">
    <div class="section-title">
      <span class="section-number">5</span> FIRMA DEL SERVIDOR PÚBLICO O
      CONTRATISTA
    </div>

    <div class="declaration">
      <p>
        MANIFIESTO BAJO LA GRAVEDAD DEL JURAMENTO QUE 
        <input 
          type="radio" 
          name="inhabilidad" 
          value="SI" 
          v-model="declaracionInhabilidad"
        /> SI
        <input 
          type="radio" 
          name="inhabilidad" 
          value="NO" 
          v-model="declaracionInhabilidad"
        /> NO
        ME ENCUENTRO DENTRO
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
      <!-- Vista previa de la firma existente -->
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
        <label for="firma" class="label-upload"> 📝 Seleccionar firma </label>
      </div>

      <!-- Input oculto para cambiar firma -->
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

    <!-- Modal de confirmación para eliminar -->
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

// ✅ NUEVAS VARIABLES REACTIVAS
const declaracionInhabilidad = ref("");


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
      // ✅ CARGAR DECLARACIONES
      declaracionInhabilidad.value = data.declaracionInhabilidad || "";
           
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

      if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

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
  // ✅ VALIDAR DECLARACIONES
  if (!declaracionInhabilidad.value) {
    showError("❌ Por favor, selecciona una opción en la declaración de inhabilidad.");
    return;
  }

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
    // ✅ INCLUIR DECLARACIONES EN EL PAYLOAD
    const payload = {
      declaracionInhabilidad: declaracionInhabilidad.value,
      ciudadDiligenciamiento: ciudadDiligenciamiento.value,
      fechaDiligenciamiento: fechaDiligenciamiento.value,
      firmaServidor: firmaUrl.value,
    };

    const response = await api.post("/firma-servidor", payload);
    console.log("✅ Guardado:", response.data);
    showSuccess(
      "✅ Firma y declaraciones guardadas correctamente."
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

    // ✅ LIMPIAR TAMBIÉN LAS DECLARACIONES
    declaracionInhabilidad.value = "";
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
/* ✅ ESTILOS CORREGIDOS PARA EVITAR DESBORDAMIENTO */

.declaration {
  background: #f8f9fa;
  padding: 8px; /* Reducido */
  border-radius: 6px;
  margin: 6px 0; /* Reducido */
  border-left: 4px solid #007bff;
}

.declaration p {
  margin: 4px 0; /* Reducido */
  line-height: 1.4; /* Reducido */
  color: #333;
  font-size: 11px; /* Reducido */
}

.radio-inline-group {
  display: inline-flex;
  gap: 10px; /* Reducido */
  margin: 0 6px; /* Reducido */
  align-items: center;
  vertical-align: middle;
}

.radio-label {
  display: inline-flex;
  align-items: center;
  gap: 4px; /* Reducido */
  cursor: pointer;
  font-weight: 600;
  color: #007bff;
  transition: all 0.2s ease;
}

.radio-label:hover {
  color: #0056b3;
  transform: scale(1.05);
}

.radio-label input[type="radio"] {
  width: 14px; /* Reducido */
  height: 14px; /* Reducido */
  cursor: pointer;
  accent-color: #007bff;
}

.radio-text {
  font-size: 12px; /* Reducido */
  user-select: none;
}

/* ✅ Contenedor principal CON altura controlada */
.firma-section {
  display: flex;
  flex-direction: column;
  gap: 0.3rem; /* Reducido */
  max-height: none; /* ❌ REMOVIDO para permitir ver todo el contenido */
  overflow: visible; /* ✅ CAMBIADO para permitir ver el botón */
  padding: 0.4rem !important; /* Reducido */
  box-sizing: border-box;
}

/* Contenedor de datos de ciudad y fecha */
.datos-firma-container {
  display: flex;
  gap: 0.8rem; /* Reducido */
  margin: 0.2rem 0; /* Reducido */
}

.datos-firma-container .form-group {
  flex: 1;
  margin: 0;
}

.datos-firma-container label {
  font-size: 10px; /* Reducido */
  font-weight: 600;
  margin-bottom: 2px;
  display: block;
}

.datos-firma-container input {
  width: 100%;
  padding: 0.3rem; /* Reducido */
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 11px; /* Reducido */
  box-sizing: border-box;
}

/* ✅ Contenedor de firma con altura FIJA y controlada */
.signature-container {
  min-height: 120px; /* Reducido */
  max-height: 120px; /* Reducido */
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0.3rem 0; /* Reducido */
  overflow: hidden; /* Evitar desbordamiento */
}

/* Vista previa de firma - TAMAÑO REDUCIDO */
.firma-preview {
  display: flex;
  align-items: center;
  gap: 0.8rem; /* Reducido */
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}

.firma-imagen {
  width: 200px; /* Reducido de 250px */
  height: 80px; /* Reducido de 100px */
  border: 2px solid #dee2e6;
  border-radius: 6px;
  object-fit: contain;
  background: white;
  flex-shrink: 0; /* No reducir tamaño */
}

.firma-acciones {
  display: flex;
  flex-direction: column;
  gap: 0.4rem; /* Reducido */
  flex-shrink: 0;
}

/* Botones de acción - TAMAÑO REDUCIDO */
.btn-eliminar,
.btn-cambiar {
  padding: 5px 10px; /* Reducido */
  border: none;
  border-radius: 5px; /* Reducido */
  font-weight: 600;
  font-size: 10px; /* Reducido */
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
  box-shadow: 0 3px 6px rgba(220, 53, 69, 0.3);
}

.btn-cambiar {
  background: #17a2b8;
  color: white;
}

.btn-cambiar:hover {
  background: #138496;
  transform: translateY(-2px);
  box-shadow: 0 3px 6px rgba(23, 162, 184, 0.3);
}

/* Upload de firma */
.firma-upload {
  text-align: center;
  width: 100%;
}

.input-file {
  display: none;
}

.label-upload {
  display: inline-block;
  padding: 8px 16px; /* Reducido */
  background: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  font-size: 11px; /* Reducido */
  transition: all 0.3s ease;
}

.label-upload:hover {
  background: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 3px 6px rgba(0, 123, 255, 0.3);
}

/* ✅ Footer AJUSTADO para evitar desbordamiento */
.firma-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.4rem; /* Reducido */
  border-top: 2px solid #dee2e6;
  margin-top: 0.3rem; /* Reducido */
  min-height: 35px; /* Reducido */
  flex-shrink: 0; /* No reducir tamaño */
}

.firma-label {
  font-weight: 600;
  font-size: 10px; /* Reducido */
  color: #333;
  max-width: 45%;
  line-height: 1.2;
}

.btn-guardar {
  padding: 6px 12px; /* Reducido */
  background: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: 600;
  font-size: 11px; /* Reducido */
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.btn-guardar:hover:not(:disabled) {
  background: #218838;
  transform: translateY(-2px);
  box-shadow: 0 3px 6px rgba(40, 167, 69, 0.3);
}

.btn-guardar:disabled {
  background: #6c757d;
  cursor: not-allowed;
  opacity: 0.6;
}

/* Modal - SIN CAMBIOS */
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

/* ✅ Optimización para impresión */
@media print {
  .no-imprimir {
    display: none !important;
  }

  .firma-section {
    max-height: none;
    page-break-inside: avoid;
    overflow: visible;
  }

  .firma-preview {
    justify-content: flex-start;
  }

  .firma-imagen {
    width: 200px !important;
    height: 80px !important;
  }

  /* Mostrar X en lugar de radio button al imprimir */
  input[type="radio"]:checked::after {
    content: 'X';
    position: absolute;
    left: 2px;
    top: -2px;
    font-size: 14px;
    font-weight: bold;
    color: #000;
  }
}

/* ✅ Responsive - AJUSTADO */
@media (max-width: 768px) {
  .firma-section {
    max-height: none; /* Permitir altura automática en móviles */
    overflow: visible;
  }

  .datos-firma-container {
    flex-direction: column;
    gap: 0.5rem;
  }

  .firma-preview {
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
  }

  .firma-imagen {
    width: 180px;
    height: 72px;
  }

  .firma-acciones {
    width: 100%;
    flex-direction: row;
  }

  .btn-eliminar,
  .btn-cambiar {
    flex: 1;
  }

  .firma-footer {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }

  .firma-label {
    max-width: 100%;
    text-align: center;
  }

  .btn-guardar {
    width: 100%;
    
  }

  .radio-inline-group {
    display: flex;
    margin: 8px 0;
  }
}

/* ✅ AJUSTE ADICIONAL: Asegurar que todo quepa en la página */
@media screen and (max-height: 900px) {
  .firma-section {
    max-height: 380px;
  }
  
  .signature-container {
    min-height: 100px;
    max-height: 100px;
  }
  
  .firma-imagen {
    width: 180px;
    height: 72px;
  }
}
</style>