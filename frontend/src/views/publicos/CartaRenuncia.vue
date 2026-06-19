<template>
  <div class="carta-renuncia-container">
    <section class="encabezado">
      <h1>Carta de Renuncia — Generador Gratuito</h1>
      <p>Redacta tu carta de renuncia laboral en segundos y descárgala en PDF lista para entregar.</p>
    </section>

    <section class="formulario">
      <form @submit.prevent="generar">
        <fieldset>
          <legend>Tus datos</legend>
          <div class="form-group">
            <label for="nombreEmpleado">Nombre completo</label>
            <input id="nombreEmpleado" v-model="datos.nombreEmpleado" required placeholder="Ej: María Gómez" />
          </div>
          <div class="form-group">
            <label for="cargoEmpleado">Cargo que desempeñas</label>
            <input id="cargoEmpleado" v-model="datos.cargoEmpleado" required placeholder="Ej: Analista de Sistemas" />
          </div>
        </fieldset>

        <fieldset>
          <legend>Datos de la empresa</legend>
          <div class="form-group">
            <label for="nombreEmpresa">Nombre de la empresa</label>
            <input id="nombreEmpresa" v-model="datos.nombreEmpresa" required placeholder="Ej: ACME SAS" />
          </div>
          <div class="form-group">
            <label for="nombreJefe">Nombre de quien recibe la carta</label>
            <input id="nombreJefe" v-model="datos.nombreJefe" required placeholder="Ej: Laura Martínez" />
          </div>
          <div class="form-group">
            <label for="cargoJefe">Cargo de quien recibe</label>
            <input id="cargoJefe" v-model="datos.cargoJefe" required placeholder="Ej: Gerente de Recursos Humanos" />
          </div>
        </fieldset>

        <fieldset>
          <legend>Detalles de la renuncia</legend>
          <div class="form-group">
            <label for="fechaRenuncia">Fecha de la carta</label>
            <input id="fechaRenuncia" type="text" v-model="datos.fechaRenuncia" required placeholder="Ej: 20/06/2025" />
          </div>
          <div class="form-group">
            <label for="fechaUltimoDia">Último día de trabajo</label>
            <input id="fechaUltimoDia" type="text" v-model="datos.fechaUltimoDia" required placeholder="Ej: 04/07/2025" />
          </div>
          <div class="form-group">
            <label for="ciudadExpedicion">Ciudad de expedición</label>
            <input id="ciudadExpedicion" v-model="datos.ciudadExpedicion" required placeholder="Ej: Bogotá" />
          </div>
          <div class="form-group">
            <label for="motivoOpcional">Motivo de la renuncia (opcional)</label>
            <textarea id="motivoOpcional" v-model="datos.motivoOpcional" rows="3" placeholder="Puede dejarlo vacío si prefiere no especificar motivos"></textarea>
          </div>
          <div class="form-group form-group--checkbox">
            <input type="checkbox" id="incluirAgradecimiento" v-model="datos.incluirAgradecimiento" />
            <label for="incluirAgradecimiento" style="display:inline; font-weight:600; margin-left:8px;">
              Incluir párrafo de agradecimiento a la empresa
            </label>
          </div>
        </fieldset>

        <button type="submit" class="btn-submit" :disabled="generando">
          {{ generando ? "Generando..." : "Generar y Descargar PDF" }}
        </button>
        <p v-if="error" class="error-msg">{{ error }}</p>
      </form>
    </section>

    <section class="seo-content">
      <h2>¿Qué es una carta de renuncia?</h2>
      <p>
        La carta de renuncia es el documento formal mediante el cual un trabajador
        notifica a su empleador su decisión voluntaria de terminar el contrato laboral.
        En Colombia, presentarla por escrito es una buena práctica que protege al
        trabajador y da claridad sobre la fecha de terminación de la relación laboral.
      </p>

      <h2>¿Es obligatorio presentar carta de renuncia en Colombia?</h2>
      <p>
        No existe una norma que obligue al trabajador a presentarla por escrito,
        pero sí es altamente recomendable. El Código Sustantivo del Trabajo establece
        que en contratos a término indefinido el trabajador puede renunciar en cualquier
        momento, y entregar la carta por escrito deja constancia de la fecha y condiciones.
      </p>

      <h2>¿Qué debe contener?</h2>
      <ul>
        <li>Nombre del trabajador y cargo que desempeña</li>
        <li>Nombre de la empresa y de quien recibe</li>
        <li>Fecha de presentación de la renuncia</li>
        <li>Fecha del último día de trabajo</li>
        <li>Motivo (opcional)</li>
        <li>Firma del trabajador</li>
      </ul>

      <h2>Preguntas frecuentes</h2>

      <details>
        <summary>¿Con cuánto tiempo de anticipación debo renunciar?</summary>
        <p>
          El Código Sustantivo del Trabajo no establece un preaviso obligatorio para
          el trabajador. Sin embargo, muchos contratos o reglamentos internos pueden
          estipular un período de preaviso. Lo más común en Colombia es notificar con
          15 días de anticipación como cortesía profesional.
        </p>
      </details>

      <details>
        <summary>¿Puedo renunciar sin indicar motivos?</summary>
        <p>
          Sí. No estás obligado a explicar tus motivos. Puedes simplemente indicar
          tu voluntad de terminar la relación laboral y la fecha del último día de trabajo.
          El campo de motivo en este generador es completamente opcional.
        </p>
      </details>

      <details>
        <summary>¿Se guarda algún dato ingresado?</summary>
        <p>
          No. Esta herramienta funciona completamente en tu navegador. Ningún dato
          es enviado a ningún servidor ni almacenado en ninguna base de datos.
        </p>
      </details>

      <details>
        <summary>¿Qué pasa si la empresa no acepta mi renuncia?</summary>
        <p>
          En Colombia, la renuncia es un acto unilateral del trabajador y no requiere
          aceptación del empleador para ser válida. Guarda siempre una copia firmada
          o el acuse de recibo de la empresa.
        </p>
      </details>
    </section>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useCartaRenuncia } from '../../composables/useCartaRenuncia';

const datos = reactive({
  nombreEmpleado: '',
  cargoEmpleado: '',
  nombreEmpresa: '',
  nombreJefe: '',
  cargoJefe: '',
  fechaRenuncia: '',
  fechaUltimoDia: '',
  motivoOpcional: '',
  incluirAgradecimiento: true,
  ciudadExpedicion: '',
});

const { generando, error, generarYDescargar } = useCartaRenuncia();
const generar = () => generarYDescargar(datos);
</script>

<style scoped>
.carta-renuncia-container {
  max-width: 860px;
  margin: 0 auto;
}

.encabezado {
  text-align: center;
  margin-bottom: 2rem;
}

.encabezado h1 {
  color: #176994;
  margin-bottom: 0.5rem;
}

.encabezado p {
  color: #444;
}

fieldset {
  border: 1px solid #dde3ea;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
  background-color: #fff;
}

legend {
  color: #176994;
  font-weight: 700;
  padding: 0 8px;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

input, select, textarea {
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 10px;
  font-family: inherit;
  font-size: 1rem;
  box-sizing: border-box;
}

textarea {
  resize: vertical;
}

.form-group--checkbox {
  display: flex;
  align-items: center;
  margin-top: 1.5rem;
}

.form-group--checkbox input[type="checkbox"] {
  width: auto;
  margin-right: 8px;
}

.btn-submit {
  display: block;
  width: 100%;
  background-color: #176994;
  color: #fff;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-submit:hover:not(:disabled) {
  background-color: #114f70;
}

.btn-submit:disabled {
  background-color: #94b8cc;
  cursor: not-allowed;
}

.error-msg {
  color: #dc2626;
  margin-top: 10px;
  text-align: center;
  font-weight: 600;
}

.seo-content {
  border-top: 2px solid #e2e8f0;
  margin-top: 48px;
  padding-top: 24px;
  color: #444;
  line-height: 1.6;
}

.seo-content h2 {
  color: #176994;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.seo-content ul {
  padding-left: 20px;
}

.seo-content li {
  margin-bottom: 0.5rem;
}

details {
  background-color: #fff;
  border: 1px solid #dde3ea;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 10px;
}

details summary {
  cursor: pointer;
  color: #176994;
  font-weight: 600;
  outline: none;
}

details p {
  margin-top: 10px;
  margin-bottom: 0;
}
</style>
