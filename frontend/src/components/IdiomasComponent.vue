<template>
  <form @submit.prevent="enviarFormulario">
    <div class="section section-idiomas-compacta">
        <div class="form-group">
        <p class="p texto-explicativo-compacto">
          ESPECIFIQUE LOS IDIOMAS DIFERENTES AL ESPAÑOL QUE: HABLA, LEE, ESCRIBE
          DE FORMA, REGULAR (R), BIEN (B), O MUY BIEN (MB)
        </p>
      </div>

      <!-- Tabla solo se muestra si hay idiomas -->
      <div v-if="idiomas.length > 0" class="tabla-container">
        <table class="table tabla-idiomas-compacta">
          <thead>
            <tr>
              <th rowspan="2" class="columna-idioma">IDIOMA</th>
              <th colspan="3" class="grupo-habilidad">LO HABLA</th>
              <th colspan="3" class="grupo-habilidad">LO LEE</th>
              <th colspan="3" class="grupo-habilidad">LO ESCRIBE</th>
              <th rowspan="2" class="columna-acciones">ACCIONES</th>
            </tr>
            <tr>
              <th class="nivel-header">R</th>
              <th class="nivel-header">B</th>
              <th class="nivel-header">MB</th>
              <th class="nivel-header">R</th>
              <th class="nivel-header">B</th>
              <th class="nivel-header">MB</th>
              <th class="nivel-header">R</th>
              <th class="nivel-header">B</th>
              <th class="nivel-header">MB</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(idioma, index) in idiomas" :key="index" class="fila-idioma">
              <td class="celda-nombre-idioma">
                <input
                  class="form-control input-idioma"
                  v-model="idioma.nombre"
                  placeholder="Ej: Inglés"
                />
              </td>
              <!-- Lo Habla -->
              <td class="celda-radio">
                <input
                  type="radio"
                  :value="'R'"
                  :name="'habla-' + index"
                  v-model="idioma.habla"
                  class="radio-compacto"
                />
              </td>
              <td class="celda-radio">
                <input
                  type="radio"
                  :value="'B'"
                  :name="'habla-' + index"
                  v-model="idioma.habla"
                  class="radio-compacto"
                />
              </td>
              <td class="celda-radio">
                <input
                  type="radio"
                  :value="'MB'"
                  :name="'habla-' + index"
                  v-model="idioma.habla"
                  class="radio-compacto"
                />
              </td>
              <!-- Lo Lee -->
              <td class="celda-radio">
                <input
                  type="radio"
                  :value="'R'"
                  :name="'lee-' + index"
                  v-model="idioma.lee"
                  class="radio-compacto"
                />
              </td>
              <td class="celda-radio">
                <input
                  type="radio"
                  :value="'B'"
                  :name="'lee-' + index"
                  v-model="idioma.lee"
                  class="radio-compacto"
                />
              </td>
              <td class="celda-radio">
                <input
                  type="radio"
                  :value="'MB'"
                  :name="'lee-' + index"
                  v-model="idioma.lee"
                  class="radio-compacto"
                />
              </td>
              <!-- Lo Escribe -->
              <td class="celda-radio">
                <input
                  type="radio"
                  :value="'R'"
                  :name="'escribe-' + index"
                  v-model="idioma.escribe"
                  class="radio-compacto"
                />
              </td>
              <td class="celda-radio">
                <input
                  type="radio"
                  :value="'B'"
                  :name="'escribe-' + index"
                  v-model="idioma.escribe"
                  class="radio-compacto"
                />
              </td>
              <td class="celda-radio">
                <input
                  type="radio"
                  :value="'MB'"
                  :name="'escribe-' + index"
                  v-model="idioma.escribe"
                  class="radio-compacto"
                />
              </td>
              <td class="celda-acciones">
                <button
                  class="boton-eliminar no-imprimir"
                  @click.prevent="removeIdioma(index)"
                  title="Eliminar idioma"
                >
                  🗑️
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mensaje cuando no hay idiomas -->
      <div v-else class="sin-idiomas-mensaje">
        <p class="texto-sin-datos">No hay idiomas registrados</p>
      </div>

      <div class="botones-accion no-imprimir">
        <button
          type="button"
          class="boton-guardar boton-agregar"
          @click="addIdioma"
        >
          Agregar Idioma
        </button>

        <!-- 🔥 SOLUCIÓN: Mostrar SIEMPRE el botón de guardar cuando estamos en modo edición -->
        <button
          type="submit"
          class="boton-guardar boton-guardar-idiomas"
          v-if="idiomas.length > 0 || modoEdicion"
        >
          {{ idiomas.length > 0 ? 'Guardar Idiomas' : 'Confirmar Eliminación' }}
        </button>
      </div>
    </div>
  </form>
</template>

<script>
import api from "../api/axios";
import { showSuccess, showError } from "../utils/showMessage.js";
import { useHojaVidaStore } from "../stores/hojaVida";

export default {
  name: "IdiomasComponent",
  data() {
    return {
      idiomas: [],
      modoEdicion: false,
      docId: null,
    };
  },
  computed: {
    hojaStore() {
      return useHojaVidaStore();
    }
  },
  mounted() {
    this.sincronizarConStore();
    this.obtenerDocId();
  },
  watch: {
    'hojaStore.idiomas': {
      handler(newIdiomas) {
        if (newIdiomas && newIdiomas.length > 0) {
          this.idiomas = [...newIdiomas];
          this.modoEdicion = true;
          console.log(`✅ Idiomas sincronizados desde store: ${this.idiomas.length} idioma(s)`);
        } else if (newIdiomas && newIdiomas.length === 0) {
          this.idiomas = [];
          this.modoEdicion = false;
          console.log(`ℹ️ No hay idiomas en el store`);
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    sincronizarConStore() {
      const idiomasStore = this.hojaStore.idiomas;
      if (idiomasStore && idiomasStore.length > 0) {
        this.idiomas = [...idiomasStore];
        this.modoEdicion = true;
        console.log(`✅ Idiomas iniciales cargados desde store: ${this.idiomas.length} idioma(s)`);
      } else {
        this.idiomas = [];
        this.modoEdicion = false;
        console.log(`ℹ️ No hay idiomas iniciales en el store`);
      }
    },

    async obtenerDocId() {
      try {
        const response = await api.get("/idiomas");
        if (response.data && response.data._id) {
          this.docId = response.data._id;
          this.modoEdicion = true;
          console.log("🔍 docId obtenido del servidor:", this.docId);
        } else {
          this.docId = null;
          this.modoEdicion = false;
          console.log("ℹ️ No hay documento de idiomas en el servidor");
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          this.docId = null;
          this.modoEdicion = false;
          console.log("ℹ️ Documento de idiomas no existe (404)");
        } else {
          console.error("❌ Error al obtener docId:", error);
        }
      }
    },

    addIdioma() {
      const nuevoIdioma = { 
        nombre: "", 
        habla: "", 
        lee: "", 
        escribe: "" 
      };
      
      this.idiomas.push(nuevoIdioma);
      
      this.$nextTick(() => {
        const tabla = document.querySelector('.tabla-idiomas-compacta tbody');
        if (tabla && tabla.lastElementChild) {
          tabla.lastElementChild.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      });
      
      console.log(`✅ Idioma agregado. Total: ${this.idiomas.length}`);
    },
    
    // 🔥 SOLUCIÓN PRINCIPAL: Método removeIdioma actualizado
    async removeIdioma(index) {
      if (this.idiomas.length === 0) {
        showError("⚠️ No hay idiomas para eliminar.");
        return;
      }
      
      try {
        console.log("🔍 DEBUG - Eliminando idioma en índice:", index);
        
        // Eliminar del estado local
        this.idiomas.splice(index, 1);
        
        // 🔥 SOLUCIÓN: Guardar automáticamente después de eliminar
        if (this.modoEdicion) {
          if (this.idiomas.length === 0) {
            // Si no quedan idiomas, eliminar el documento completo
            console.log("🗑️ Eliminando documento completo de la BD");
            await api.delete("/idiomas");
            
            this.modoEdicion = false;
            this.docId = null;
            
            showSuccess("✅ Todos los idiomas eliminados correctamente.");
          } else {
            // Si quedan idiomas, actualizar el documento
            console.log("🔄 Actualizando documento después de eliminar");
            const payload = { idiomas: this.idiomas };
            await api.put("/idiomas", payload);
            
            showSuccess(`✅ Idioma eliminado. Quedan ${this.idiomas.length} idioma(s).`);
          }
        } else {
          // Si no estaba en modo edición, solo eliminar localmente
          showSuccess("✅ Idioma eliminado del formulario");
        }
        
        console.log(`🗑️ Idioma eliminado. Total restante: ${this.idiomas.length}`);
        
      } catch (error) {
        console.error("❌ Error al eliminar el idioma:", error);
        
        const errorMessage = error.response?.data?.message || error.message;
        const errorDetails = error.response?.data?.errors || [];
        
        console.error("🔍 Error details:", errorDetails);
        showError(`Error al eliminar el idioma: ${errorMessage}`);
        
        // Revertir cambios en caso de error
        await this.cargarDatos(true);
      }
    },
    
    async cargarDatos(forzar = false) {
      if (!forzar && this.hojaStore.idiomas && this.hojaStore.idiomas.length > 0) {
        console.log("ℹ️ Usando datos del store, no se carga desde API");
        return;
      }

      try {
        const response = await api.get("/idiomas");
        if (response.data && response.data.idiomas) {
          if (response.data.idiomas.length > 0) {
            this.idiomas = response.data.idiomas;
            this.docId = response.data._id;
            this.modoEdicion = true;
            
            console.log("🔍 Datos cargados:");
            console.log("- docId establecido:", this.docId);
            console.log("- modoEdicion:", this.modoEdicion);
            console.log(`✅ ${this.idiomas.length} idioma(s) cargado(s) desde el servidor`);
          } else {
            this.idiomas = [];
            this.modoEdicion = false;
            this.docId = null;
            console.log("ℹ️ No hay idiomas guardados en el servidor");
          }
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          this.modoEdicion = false;
          this.docId = null;
          this.idiomas = [];
          console.log("ℹ️ No se encontraron datos de idiomas (404)");
        } else {
          console.error("❌ Error al cargar los idiomas:", error);
          showError("No se pudieron cargar los datos de idiomas.");
        }
      }
    },

    async enviarFormulario() {
      console.log("🔍 DEBUG enviarFormulario:");
      console.log("- modoEdicion:", this.modoEdicion);
      console.log("- docId:", this.docId);
      console.log("- idiomas.length:", this.idiomas.length);
      
      // 🔥 SOLUCIÓN: Permitir guardar incluso con array vacío para confirmar eliminación
      if (this.idiomas.length === 0 && this.modoEdicion) {
        try {
          console.log("🗑️ Confirmando eliminación de todos los idiomas");
          await api.delete("/idiomas");
          
          this.modoEdicion = false;
          this.docId = null;
          
          showSuccess("✅ Todos los idiomas eliminados correctamente.");
          return;
        } catch (error) {
          console.error("❌ Error al eliminar idiomas:", error);
          showError("Error al eliminar los idiomas.");
          return;
        }
      }

      if (this.idiomas.length === 0) {
        showError("⚠️ No hay idiomas para guardar.");
        return;
      }

      try {
        const payload = { idiomas: this.idiomas };
        let response;

        if (!this.docId || !this.modoEdicion) {
          console.log("🆕 Creando nuevo documento (POST)");
          response = await api.post('/idiomas', payload);
          
          this.modoEdicion = true;
          this.docId = response.data.data?._id;
          
          console.log("✅ Documento creado con ID:", this.docId);
          
        } else {
          console.log("🔄 Actualizando documento existente (PUT)");
          response = await api.put("/idiomas", payload);
          console.log("✅ Documento actualizado");
        }
        
        showSuccess(`✅ Idiomas guardados correctamente. Total: ${this.idiomas.length}`);
        console.log("🎯 Respuesta del servidor:", response.data);
        
      } catch (error) {
        console.error("❌ Error al guardar idiomas:", error);
        
        if (error.response) {
          console.log("🔍 Detalles del error:");
          console.log("- Status:", error.response.status);
          console.log("- Data:", error.response.data);
        }
        
        const errorMessage = error.response?.data?.message || 
                            error.response?.data || 
                            error.message;
        
        showError(`Error al guardar idiomas: ${errorMessage}`);
      }
    },
  },
};
</script>

<style scoped>
/* Estilos existentes... */
.section-idiomas-compacta {
  padding: 0.5rem !important;
  margin-bottom: 0.3rem !important;
}

.texto-explicativo-compacto {
  font-size: 9px !important;
  line-height: 1.2 !important;
  margin-bottom: 0.3rem !important;
  color: #555;
}

.tabla-idiomas-compacta {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 0.5rem !important;
  font-size: 9px !important;
}

.tabla-idiomas-compacta th,
.tabla-idiomas-compacta td {
  text-align: center;
  vertical-align: middle;
  padding: 2px !important;
  border: 1px solid #ccc;
}

.tabla-idiomas-compacta th {
  font-weight: bold;
  background-color: #f5f5f5;
  font-size: 8px !important;
}

.columna-idioma {
  width: 25% !important;
  text-align: left !important;
  font-size: 8px !important;
}

.grupo-habilidad {
  font-size: 8px !important;
  background-color: #f0f8ff !important;
}

.nivel-header {
  width: 4% !important;
  font-size: 7px !important;
  padding: 1px !important;
}

.columna-acciones {
  width: 8% !important;
  font-size: 7px !important;
}

.celda-nombre-idioma {
  text-align: left !important;
  padding: 1px !important;
}

.celda-radio {
  padding: 1px !important;
  text-align: center !important;
}

.celda-acciones {
  padding: 1px !important;
  text-align: center !important;
}

.input-idioma {
  width: 100% !important;
  padding: 2px !important;
  font-size: 9px !important;
  height: 20px !important;
  border: 1px solid #ccc;
  border-radius: 2px;
}

.radio-compacto {
  margin: 0 !important;
  transform: scale(0.8);
}

.botones-accion {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.3rem;
}

.boton-agregar,
.boton-guardar-idiomas {
  padding: 6px 12px !important;
  font-size: 11px !important;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: bold;
}

.boton-agregar {
  background-color: #17a2b8 !important;
  color: white;
}

.boton-agregar:hover {
  background-color: #138496 !important;
}

.boton-guardar-idiomas {
  background-color: #28a745 !important;
  color: white;
}

.boton-guardar-idiomas:hover {
  background-color: #218838 !important;
}

.boton-eliminar {
  background: none !important;
  border: none !important;
  font-size: 10px !important;
  cursor: pointer;
  padding: 1px !important;
}

.boton-eliminar:hover {
  opacity: 0.7;
}

.fila-idioma:nth-child(even) {
  background-color: #f9f9f9;
}

/* 🔥 NUEVO: Estilos para mensaje sin idiomas */
.sin-idiomas-mensaje {
  text-align: center;
  padding: 1rem;
  background-color: #f8f9fa;
  border: 1px dashed #dee2e6;
  border-radius: 0.25rem;
  margin: 0.5rem 0;
}

.texto-sin-datos {
  color: #6c757d;
  font-style: italic;
  font-size: 10px;
  margin: 0;
}

@media print {
  .section-idiomas-compacta {
    padding: 0.2rem !important;
    margin-bottom: 0.1rem !important;
    page-break-inside: avoid;
  }
  
  .tabla-idiomas-compacta {
    font-size: 8px !important;
  }
  
  .tabla-idiomas-compacta th,
  .tabla-idiomas-compacta td {
    padding: 1px !important;
  }
  
  .texto-explicativo-compacto {
    font-size: 8px !important;
  }
  
  .input-idioma {
    font-size: 8px !important;
    height: 16px !important;
  }
  
  .no-imprimir {
    display: none !important;
  }
}

@media screen {
  .section-idiomas-compacta {
    max-height: 200px;
    overflow: visible;
  }
}
</style>