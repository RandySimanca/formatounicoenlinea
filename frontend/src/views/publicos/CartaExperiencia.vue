<template>
  <div class="carta-experiencia-container">
    <section class="encabezado">
      <h1>Carta de Experiencia Laboral — Generador Gratuito</h1>
      <p>Genera rápidamente un certificado de experiencia laboral en PDF, sin registros y listo para firmar.</p>
    </section>

    <section class="formulario">
      <form @submit.prevent="generar">
        <fieldset>
          <legend>Datos de la empresa</legend>
          <div class="form-group">
            <label for="nombreEmpresa">Nombre o Razón Social</label>
            <input id="nombreEmpresa" v-model="datos.nombreEmpresa" required placeholder="Ej: ACME SAS" />
          </div>
          <div class="form-group">
            <label for="nitEmpresa">NIT</label>
            <input id="nitEmpresa" v-model="datos.nitEmpresa" required placeholder="Ej: 900.123.456-7" />
          </div>
          <div class="form-group">
            <label for="ciudadEmpresa">Ciudad de la empresa</label>
            <input id="ciudadEmpresa" v-model="datos.ciudadEmpresa" required placeholder="Ej: Bogotá" />
          </div>
          <div class="form-group">
            <label for="representanteLegal">Nombre del Representante Legal (o quien firma)</label>
            <input id="representanteLegal" v-model="datos.representanteLegal" required placeholder="Ej: Juan Pérez" />
          </div>
          <div class="form-group">
            <label for="cargoRepresentante">Cargo de quien firma</label>
            <input id="cargoRepresentante" v-model="datos.cargoRepresentante" required placeholder="Ej: Gerente General / Dir. Recursos Humanos" />
          </div>
        </fieldset>

        <fieldset>
          <legend>Datos del trabajador</legend>
          <div class="form-group">
            <label for="nombreTrabajador">Nombre completo</label>
            <input id="nombreTrabajador" v-model="datos.nombreTrabajador" required placeholder="Ej: María Gómez" />
          </div>
          <div class="form-group">
            <label for="tipoDocumento">Tipo de documento</label>
            <select id="tipoDocumento" v-model="datos.tipoDocumento" required>
              <option value="CC">Cédula de Ciudadanía (CC)</option>
              <option value="CE">Cédula de Extranjería (CE)</option>
              <option value="PA">Pasaporte (PA)</option>
              <option value="TI">Tarjeta de Identidad (TI)</option>
            </select>
          </div>
          <div class="form-group">
            <label for="numeroDocumento">Número de documento</label>
            <input id="numeroDocumento" v-model="datos.numeroDocumento" required placeholder="Ej: 1020304050" />
          </div>
        </fieldset>

        <fieldset>
          <legend>Detalles del cargo y expedición</legend>
          <div class="form-group">
            <label for="cargo">Cargo desempeñado</label>
            <input id="cargo" v-model="datos.cargo" required placeholder="Ej: Analista de Sistemas" />
          </div>
          <div class="form-group">
            <label for="tipoContrato">Tipo de contrato</label>
            <select id="tipoContrato" v-model="datos.tipoContrato" required>
              <option value="término fijo">Término fijo</option>
              <option value="término indefinido">Término indefinido</option>
              <option value="prestación de servicios">Prestación de servicios</option>
              <option value="obra o labor">Obra o labor</option>
            </select>
          </div>
          <div class="form-group">
            <label for="fechaInicio">Fecha de inicio</label>
            <input id="fechaInicio" type="text" v-model="datos.fechaInicio" required placeholder="Ej: 15/02/2020" />
          </div>
          <div class="form-group">
            <label for="fechaFin">Fecha de terminación (vacío si sigue vigente)</label>
            <input id="fechaFin" type="text" v-model="datos.fechaFin" placeholder="Ej: 30/11/2023" />
          </div>
          <div class="form-group">
            <label for="salario">Salario mensual</label>
            <input id="salario" type="text" v-model="datos.salario" required placeholder="Ej: 2.500.000" />
          </div>
          <div class="form-group">
            <label for="funcionesPrincipales">Principales funciones (separadas por comas)</label>
            <textarea id="funcionesPrincipales" v-model="datos.funcionesPrincipales" rows="3" placeholder="Ej: Desarrollo de software, mantenimiento de bases de datos"></textarea>
          </div>
          <div class="form-group">
            <label for="ciudadExpedicion">Ciudad de expedición de la carta</label>
            <input id="ciudadExpedicion" v-model="datos.ciudadExpedicion" required placeholder="Ej: Medellín" />
          </div>
          <div class="form-group">
            <label for="fechaExpedicion">Fecha de expedición</label>
            <input id="fechaExpedicion" type="text" v-model="datos.fechaExpedicion" required placeholder="Ej: 20/06/2024" />
          </div>
          <div class="form-group">
            <label for="aQuienVaDirigida">A quién va dirigida</label>
            <input id="aQuienVaDirigida" v-model="datos.aQuienVaDirigida" required placeholder="Ej: A QUIEN PUEDA INTERESAR" />
          </div>
        </fieldset>

        <button type="submit" class="btn-submit" :disabled="generando">
          {{ generando ? "Generando..." : "Generar y Descargar PDF" }}
        </button>
        <p v-if="error" class="error-msg">{{ error }}</p>
      </form>
    </section>

    <section class="seo-content">
      <h2>¿Qué es una carta de experiencia laboral?</h2>
      <p>
        La carta de experiencia laboral es un documento formal que una empresa emite
        para certificar que una persona trabajó en ella durante un período determinado,
        en un cargo específico y bajo ciertas condiciones contractuales.
      </p>

      <h2>¿Para qué sirve?</h2>
      <p>
        Es exigida por entidades públicas, empresas privadas y convocatorias de empleo
        como soporte de la experiencia profesional declarada en la hoja de vida.
        En Colombia, su presentación es requisito habitual en procesos de selección
        del sector público.
      </p>

      <h2>¿Qué debe contener?</h2>
      <ul>
        <li>Nombre completo y documento de identidad del trabajador</li>
        <li>Nombre y NIT de la empresa que certifica</li>
        <li>Cargo desempeñado y tipo de contrato</li>
        <li>Fechas de inicio y terminación</li>
        <li>Salario devengado</li>
        <li>Principales funciones</li>
        <li>Firma y datos del representante legal</li>
      </ul>

      <h2>Preguntas frecuentes</h2>

      <details>
        <summary>¿Tiene validez legal esta carta generada?</summary>
        <p>
          La carta generada aquí tiene el contenido correcto y puede ser firmada
          por el representante legal de la empresa para darle plena validez.
          Este generador facilita la redacción; la firma y el sello son responsabilidad
          de quien la expide.
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
        <summary>¿Puedo usar esta carta para sector público en Colombia?</summary>
        <p>
          Sí. La estructura sigue los lineamientos del Departamento Administrativo
          de la Función Pública (DAFP) para certificación de experiencia laboral.
        </p>
      </details>

      <details>
        <summary>¿Qué pasa si el empleado aún está trabajando en la empresa?</summary>
        <p>
          Deja el campo "Fecha de fin" vacío. El documento indicará que la relación
          laboral está vigente a la fecha de expedición.
        </p>
      </details>
    </section>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useCartaExperiencia } from '../../composables/useCartaExperiencia';

const datos = reactive({
  nombreEmpresa: '',
  nitEmpresa: '',
  ciudadEmpresa: '',
  representanteLegal: '',
  cargoRepresentante: '',
  nombreTrabajador: '',
  tipoDocumento: 'CC',
  numeroDocumento: '',
  cargo: '',
  tipoContrato: 'término indefinido',
  fechaInicio: '',
  fechaFin: '',
  salario: '',
  funcionesPrincipales: '',
  ciudadExpedicion: '',
  fechaExpedicion: '',
  aQuienVaDirigida: 'A QUIEN PUEDA INTERESAR'
});

const { generando, error, generarYDescargar } = useCartaExperiencia();

const generar = () => {
  generarYDescargar(datos);
};
</script>

<style scoped>
.carta-experiencia-container {
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
