<template>
  <form @submit.prevent="guardarExperiencia">
    <div class="section">
      <div class="form-group">
        <label>EMPLEO ACTUAL O CONTRATO ANTERIOR</label>

        <div class="form-row">
          <div class="form-group col-amplio">
            <label>EMPRESA O ENTIDAD.</label>
            <input
              type="text"
              v-model="experienciaLocal.empresa"
              class="form-control correo-input solo-pantalla"
            />
            <div class="texto-impresion solo-impresion">
              {{ experienciaLocal.empresa }}
            </div>
          </div>

          <div class="checkbox-group col-pequeno">
            <label>PUBLICA</label>
            <input
              type="radio"
              value="Publica"
              v-model="experienciaLocal.tipoEntidad"
            />
          </div>

          <div class="checkbox-group col-pequeno">
            <label>PRIVADA</label>
            <input
              type="radio"
              value="Privada"
              v-model="experienciaLocal.tipoEntidad"
            />
          </div>

          <div class="form-group col-medio">
            <label>PAÍS</label>
            <input
              type="text"
              v-model="experienciaLocal.pais"
              class="form-control"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group col-3">
            <label>DEPARTAMENTO</label>
            <input
              type="text"
              v-model="experienciaLocal.departamento"
              class="form-control"
            />
          </div>

          <div class="form-group col-3">
            <label>MUNICIPIO</label>
            <input
              type="text"
              v-model="experienciaLocal.municipio"
              class="form-control"
            />
          </div>

          <div class="form-group col-3">
            <label>CORREO ELECTRÓNICO ENTIDAD</label>
            <input
              type="email"
              v-model="experienciaLocal.correoEntidad"
              class="form-control correo-input"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group col-3">
            <label>TELÉFONOS</label>
            <input
              type="text"
              v-model="experienciaLocal.telefonos"
              class="form-control"
            />
          </div>

          <div class="form-group col-3">
            <label>FECHA DE INGRESO</label>
            <div style="display: flex">
              <div class="form-group" style="width: 30px; margin-right: 5px">
                <label>DÍA</label>
                <input
                  type="text"
                  v-model="experienciaLocal.fechaIngreso.dia"
                  class="form-control"
                  placeholder="dd"
                />
              </div>
              <div class="form-group" style="width: 30px; margin-right: 5px">
                <label>MES</label>
                <input
                  type="text"
                  v-model="experienciaLocal.fechaIngreso.mes"
                  class="form-control"
                  placeholder="mm"
                />
              </div>
              <div class="form-group" style="width: 60px">
                <label>AÑO</label>
                <input
                  type="text"
                  v-model="experienciaLocal.fechaIngreso.anio"
                  class="form-control"
                  placeholder="aaaa"
                />
              </div>
            </div>
          </div>

          <div class="form-group col-3">
            <label>FECHA DE RETIRO</label>
            <div style="display: flex">
              <div class="form-group" style="width: 30px; margin-right: 5px">
                <label>DÍA</label>
                <input
                  type="text"
                  v-model="experienciaLocal.fechaRetiro.dia"
                  class="form-control"
                  placeholder="dd"
                />
              </div>
              <div class="form-group" style="width: 30px; margin-right: 5px">
                <label>MES</label>
                <input
                  type="text"
                  v-model="experienciaLocal.fechaRetiro.mes"
                  class="form-control"
                  placeholder="mm"
                />
              </div>
              <div class="form-group" style="width: 60px">
                <label>AÑO</label>
                <input
                  type="text"
                  v-model="experienciaLocal.fechaRetiro.anio"
                  class="form-control"
                  placeholder="aaaa"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group col-3">
            <label>CARGO O CONTRATO ACTUAL</label>
            <input
              type="text"
              v-model="experienciaLocal.cargo"
              class="form-control"
            />
          </div>

          <div class="form-group col-3">
            <label>DEPENDENCIA</label>
            <input
              type="text"
              v-model="experienciaLocal.dependencia"
              class="form-control"
            />
          </div>

          <div class="form-group col-3">
            <label>DIRECCIÓN</label>
            <input
              type="text"
              v-model="experienciaLocal.direccion"
              class="form-control"
            />
          </div>
        </div>

        <div class="form-group" style="margin-top: 20px">
          <button
            type="submit"
            class="boton-guardar no-imprimir"
            :disabled="cargando"
          >
            {{ modoEdicion ? "Actualizar experiencia" : "Guardar experiencia" }}
          </button>

          <button
            v-if="experienciaLocal._id"
            type="button"
            class="boton-guardar no-imprimir"
            style="margin-left: 10px; background-color: #dc3545"
            @click="confirmarEliminacion"
            :disabled="cargando"
          >
            🗑️ Eliminar experiencia
          </button>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import { showSuccess, showError, showConfirm } from "../utils/showMessage.js";
import api from "../api/axios";

export default {
  name: "ExperienciaComponent",

  props: {
    experiencia: {
      type: Object,
      default: () => ({}),
    },
  },

  emits: [
    "experiencia-eliminada",
    "experiencias-actualizadas",
    "experiencia-seleccionada",
  ],

  data() {
    return {
      experienciaLocal: {
        _id: null,
        empresa: "",
        tipoEntidad: "",
        pais: "",
        departamento: "",
        municipio: "",
        correoEntidad: "",
        telefonos: "",
        fechaIngreso: { dia: "", mes: "", anio: "" },
        fechaRetiro: { dia: "", mes: "", anio: "" },
        cargo: "",
        dependencia: "",
        direccion: "",
        datosPrecargados: false,
      },
      cargando: false,
      modoEdicion: false,
    };
  },

  mounted() {
    this.sincronizarExperiencia(this.experiencia);
  },

  watch: {
    experiencia: {
      handler(nueva) {
        this.sincronizarExperiencia(nueva);
      },
      immediate: true,
      deep: true,
    },
  },

  methods: {
    esNumeroEnRango(valor, min, max) {
      const n = parseInt(valor, 10);
      return Number.isFinite(n) && n >= min && n <= max;
    },

    validarFechasCampos(f) {
      if (!f) return { ok: false, msg: "Fechas incompletas" };

      const { dia, mes, anio } = f;

      if (!this.esNumeroEnRango(dia, 1, 31))
        return { ok: false, msg: "El día debe estar entre 1 y 31" };

      if (!this.esNumeroEnRango(mes, 1, 12))
        return { ok: false, msg: "El mes debe estar entre 1 y 12" };

      if (!Number.isFinite(parseInt(anio, 10)))
        return { ok: false, msg: "El año es requerido" };

      return { ok: true };
    },

    construirDate({ dia, mes, anio }) {
      return new Date(parseInt(anio), parseInt(mes) - 1, parseInt(dia));
    },

    normalizarFecha(fecha) {
      if (!fecha) return { dia: "", mes: "", anio: "" };

      if (typeof fecha === "string" || fecha instanceof Date) {
        const f = new Date(fecha);
        return {
          dia: String(f.getDate()).padStart(2, "0"),
          mes: String(f.getMonth() + 1).padStart(2, "0"),
          anio: String(f.getFullYear()),
        };
      }

      return {
        dia: fecha.dia ?? "",
        mes: fecha.mes ?? "",
        anio: fecha.anio ?? "",
      };
    },

    sincronizarExperiencia(exp) {
      if (!exp) return;

      if (this.modoEdicion && this.experienciaLocal.datosPrecargados) return;

      this.experienciaLocal = {
        ...this.experienciaLocal,
        ...exp,
        _id: exp._id || null,
        fechaIngreso: this.normalizarFecha(exp.fechaIngreso),
        fechaRetiro: this.normalizarFecha(exp.fechaRetiro),
        datosPrecargados: true,
      };

      this.modoEdicion = !!exp._id;
    },

    convertirFecha({ dia, mes, anio }) {
      if (!dia || !mes || !anio) return null;
      return new Date(parseInt(anio), parseInt(mes) - 1, parseInt(dia));
    },

    async guardarExperiencia() {
      this.cargando = true;

      try {
        // Validación de fechas
        const valIng = this.validarFechasCampos(
          this.experienciaLocal.fechaIngreso
        );
        if (!valIng.ok) {
          showError("❌ Fecha de ingreso inválida: " + valIng.msg);
          this.cargando = false;
          return;
        }

        const valRet = this.validarFechasCampos(
          this.experienciaLocal.fechaRetiro
        );
        if (!valRet.ok) {
          showError("❌ Fecha de retiro inválida: " + valRet.msg);
          this.cargando = false;
          return;
        }

        const dIng = this.construirDate(this.experienciaLocal.fechaIngreso);
        const dRet = this.construirDate(this.experienciaLocal.fechaRetiro);

        if (dIng > dRet) {
          showError(
            "❌ La fecha de ingreso no puede ser mayor que la fecha de retiro."
          );
          this.cargando = false;
          return;
        }

        const experienciaFormateada = {
          ...this.experienciaLocal,
          fechaIngreso: this.convertirFecha(this.experienciaLocal.fechaIngreso),
          fechaRetiro: this.convertirFecha(this.experienciaLocal.fechaRetiro),
        };

        // ========== ACTUALIZAR ==========
        if (this.modoEdicion && this.experienciaLocal._id) {
          await api.put(
            `/experiencia/${this.experienciaLocal._id}`,
            experienciaFormateada
          );
          showSuccess("✅ ¡Experiencia laboral actualizada correctamente!");

          setTimeout(() => {
            window.location.reload();
          }, 800);
          return;
        }

        // ========== CREAR ==========
        await api.post("/experiencia", experienciaFormateada);
        showSuccess("✅ ¡Experiencia laboral guardada correctamente!");

        setTimeout(() => {
          window.location.reload();
        }, 800);
      } catch (error) {
        console.error(
          "❌ Error al procesar experiencia:",
          error.response?.data || error.message
        );
        showError("❌ Ocurrió un error al procesar los datos.");
        this.cargando = false;
      }
    },

    async confirmarEliminacion() {
      const empresa = this.experienciaLocal.empresa || "esta experiencia";

      const confirm = await showConfirm({
        title: "Eliminar experiencia",
        text: `¿Estás seguro de eliminar "${empresa}"? Esta acción no se puede deshacer.`,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "No",
      });

      if (confirm) this.eliminarExperiencia();
    },

    async eliminarExperiencia() {
      if (!this.experienciaLocal._id) {
        showError("❌ No se puede eliminar una experiencia sin ID.");
        return;
      }

      this.cargando = true;

      try {
        await api.delete(`/experiencia/${this.experienciaLocal._id}`);
        showSuccess("✅ Experiencia eliminada correctamente");
        this.$emit("experiencia-eliminada", this.experienciaLocal._id);

        setTimeout(() => {
          window.location.reload();
        }, 800);
      } catch (error) {
        console.error(
          "❌ Error al eliminar experiencia:",
          error.response?.data || error.message
        );
        showError("❌ Ocurrió un error al eliminar la experiencia.");
        this.cargando = false;
      }
    },
  },
};
</script>

<style scoped>
.correo-input {
  width: 100%;
}

.col-amplio {
  flex: 0 0 40%;
  max-width: 50%;
}

.col-pequeno {
  flex: 0 0 10% !important;
  max-width: 20% !important;
  margin-left: auto;
  margin-right: auto;
}

.col-medio {
  flex: 0 0 20%;
  max-width: 30%;
}

.col-3 {
  flex: 0 0 32%;
  max-width: 32%;
}

.solo-impresion {
  display: none;
}

@media print {
  .solo-pantalla {
    display: none !important;
  }

  .solo-impresion {
    display: block !important;
    width: 100% !important;
    padding: 2px 4px !important;
    border: 1px solid #333 !important;
    border-radius: 2px !important;
    font-size: 10px !important;
    min-height: 20px !important;
    box-sizing: border-box !important;
    word-wrap: break-word !important;
    white-space: normal !important;
  }

  .form-control {
    border: 1px solid #333 !important;
    font-size: 9px !important;
    padding: 2px 3px !important;
  }

  .col-amplio {
    flex: 0 0 40% !important;
    max-width: 50% !important;
  }

  .col-pequeno {
    flex: 0 0 10% !important;
    max-width: 20% !important;
  }

  .col-medio {
    flex: 0 0 20% !important;
    max-width: 30% !important;
  }

  .col-3 {
    flex: 0 0 32% !important;
    max-width: 32% !important;
  }

  .form-row {
    display: flex !important;
    flex-wrap: wrap !important;
    gap: 2px !important;
    page-break-inside: avoid !important;
  }

  .form-group {
    page-break-inside: avoid !important;
  }
}
</style>
