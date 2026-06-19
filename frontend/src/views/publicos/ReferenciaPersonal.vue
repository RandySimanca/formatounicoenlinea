<template>
  <div class="referencia-personal-container">
    <section class="encabezado">
      <h1>Carta de Referencia Personal — Generador Gratuito</h1>
      <p>Genera una carta de referencia personal en PDF de forma gratuita, sin registro y lista para presentar.</p>
    </section>

    <section class="formulario">
      <form @submit.prevent="generar">
        <fieldset>
          <legend>Datos de quien da la referencia</legend>
          <div class="form-group">
            <label for="nombreReferente">Nombre completo</label>
            <input id="nombreReferente" v-model="datos.nombreReferente" required placeholder="Ej: Carlos Silva" />
          </div>
          <div class="form-group">
            <label for="tipoDocumentoReferente">Tipo de documento</label>
            <select id="tipoDocumentoReferente" v-model="datos.tipoDocumentoReferente" required>
              <option value="CC">Cédula de Ciudadanía (CC)</option>
              <option value="CE">Cédula de Extranjería (CE)</option>
              <option value="PA">Pasaporte (PA)</option>
            </select>
          </div>
          <div class="form-group">
            <label for="numeroDocumentoReferente">Número de documento</label>
            <input id="numeroDocumentoReferente" v-model="datos.numeroDocumentoReferente" required placeholder="Ej: 1020304050" />
          </div>
          <div class="form-group">
            <label for="ocupacionReferente">Ocupación o profesión</label>
            <input id="ocupacionReferente" v-model="datos.ocupacionReferente" required placeholder="Ej: Contador Público, Comerciante" />
          </div>
          <div class="form-group">
            <label for="telefonoReferente">Teléfono de contacto</label>
            <input id="telefonoReferente" v-model="datos.telefonoReferente" required placeholder="Ej: 3001234567" />
          </div>
          <div class="form-group">
            <label for="correoReferente">Correo electrónico (Opcional)</label>
            <input id="correoReferente" v-model="datos.correoReferente" placeholder="Ej: carlos@example.com" />
          </div>
        </fieldset>

        <fieldset>
          <legend>Relación con el recomendado</legend>
          <div class="form-group">
            <label for="relacionConRecomendado">Tipo de relación</label>
            <input id="relacionConRecomendado" v-model="datos.relacionConRecomendado" required placeholder="Ej: amigo cercano, vecino, colega" />
          </div>
          <div class="form-group">
            <label for="tiempoConociendolo">Tiempo de conocerse</label>
            <input id="tiempoConociendolo" v-model="datos.tiempoConociendolo" required placeholder="Ej: 5 años, más de 10 años" />
          </div>
        </fieldset>

        <fieldset>
          <legend>Datos del recomendado</legend>
          <div class="form-group">
            <label for="nombreRecomendado">Nombre completo</label>
            <input id="nombreRecomendado" v-model="datos.nombreRecomendado" required placeholder="Ej: María Gómez" />
          </div>
          <div class="form-group">
            <label for="tipoDocumentoRecomendado">Tipo de documento</label>
            <select id="tipoDocumentoRecomendado" v-model="datos.tipoDocumentoRecomendado" required>
              <option value="CC">Cédula de Ciudadanía (CC)</option>
              <option value="CE">Cédula de Extranjería (CE)</option>
              <option value="PA">Pasaporte (PA)</option>
              <option value="TI">Tarjeta de Identidad (TI)</option>
            </select>
          </div>
          <div class="form-group">
            <label for="numeroDocumentoRecomendado">Número de documento</label>
            <input id="numeroDocumentoRecomendado" v-model="datos.numeroDocumentoRecomendado" required placeholder="Ej: 1020304050" />
          </div>
        </fieldset>

        <fieldset>
          <legend>Cualidades y expedición</legend>
          <div class="form-group">
            <label>Cualidades a destacar</label>
            <div class="checkboxes-grid">
              <label><input type="checkbox" v-model="datos.cualidades" value="honestidad"> Honestidad</label>
              <label><input type="checkbox" v-model="datos.cualidades" value="responsabilidad"> Responsabilidad</label>
              <label><input type="checkbox" v-model="datos.cualidades" value="puntualidad"> Puntualidad</label>
              <label><input type="checkbox" v-model="datos.cualidades" value="liderazgo"> Liderazgo</label>
              <label><input type="checkbox" v-model="datos.cualidades" value="trabajo en equipo"> Trabajo en equipo</label>
              <label><input type="checkbox" v-model="datos.cualidades" value="compromiso"> Compromiso</label>
              <label><input type="checkbox" v-model="datos.cualidades" value="respeto"> Respeto</label>
              <label><input type="checkbox" v-model="datos.cualidades" value="proactividad"> Proactividad</label>
            </div>
          </div>
          <div class="form-group">
            <label for="comentarioAdicional">Comentario adicional (opcional)</label>
            <textarea id="comentarioAdicional" v-model="datos.comentarioAdicional" rows="3" placeholder="Ej: Es una persona muy amable y siempre dispuesta a ayudar..."></textarea>
          </div>
          <div class="form-group">
            <label for="ciudadExpedicion">Ciudad de expedición</label>
            <input id="ciudadExpedicion" v-model="datos.ciudadExpedicion" required placeholder="Ej: Bogotá" />
          </div>
          <div class="form-group">
            <label for="fechaExpedicion">Fecha de expedición</label>
            <input id="fechaExpedicion" type="text" v-model="datos.fechaExpedicion" required placeholder="Ej: 20/06/2025" />
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
      <h2>¿Qué es una carta de referencia personal?</h2>
      <p>
        Es un documento en el que una persona conocida del candidato — amigo, vecino,
        colega o familiar — certifica sus cualidades personales y morales. A diferencia
        de la carta de experiencia laboral, no proviene de un empleador sino de alguien
        que conoce al recomendado en un contexto personal o social.
      </p>

      <h2>¿Cuándo se solicita en Colombia?</h2>
      <p>
        Es requerida frecuentemente en procesos de selección del sector público,
        convocatorias de la Policía Nacional, el Ejército, entidades financieras,
        arriendos de vivienda, y en general cuando una organización desea verificar
        el carácter y la reputación de una persona más allá de su historial laboral.
      </p>

      <h2>¿Qué debe contener?</h2>
      <ul>
        <li>Nombre e identificación de quien da la referencia</li>
        <li>Relación con el recomendado y tiempo de conocerse</li>
        <li>Nombre e identificación del recomendado</li>
        <li>Cualidades personales destacadas</li>
        <li>Datos de contacto del referente</li>
        <li>Firma del referente</li>
      </ul>

      <h2>Preguntas frecuentes</h2>

      <details>
        <summary>¿Quién puede dar una referencia personal?</summary>
        <p>
          Cualquier persona mayor de edad que conozca al recomendado y pueda dar fe
          de su carácter. Generalmente se prefieren personas con una ocupación o
          posición reconocible: profesionales, comerciantes, líderes comunitarios.
          Familiares directos (padres, hijos, cónyuge) suelen ser excluidos por
          conflicto de interés.
        </p>
      </details>

      <details>
        <summary>¿Con cuántas referencias personales debo presentarme?</summary>
        <p>
          Depende de la entidad. Lo más habitual en Colombia es presentar entre 2 y 3
          cartas de referencia personal. Verifica los requisitos del proceso al que
          te vas a presentar.
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
        <summary>¿Tiene validez esta carta sin notaría?</summary>
        <p>
          Sí. La mayoría de procesos aceptan la carta firmada directamente por el
          referente. En algunos casos específicos pueden pedirte autenticación notarial
          de la firma, pero esto es poco frecuente. Verifica los requisitos del proceso.
        </p>
      </details>
    </section>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useReferenciaPersonal } from '../../composables/useReferenciaPersonal';

const datos = reactive({
  nombreReferente: '',
  tipoDocumentoReferente: 'CC',
  numeroDocumentoReferente: '',
  ocupacionReferente: '',
  telefonoReferente: '',
  correoReferente: '',
  relacionConRecomendado: '',
  tiempoConociendolo: '',
  nombreRecomendado: '',
  tipoDocumentoRecomendado: 'CC',
  numeroDocumentoRecomendado: '',
  cualidades: [],
  comentarioAdicional: '',
  ciudadExpedicion: '',
  fechaExpedicion: '',
  aQuienVaDirigida: 'A QUIEN PUEDA INTERESAR',
});

const { generando, error, generarYDescargar } = useReferenciaPersonal();

const generar = () => {
  if (datos.cualidades.length === 0) {
    alert('Por favor selecciona al menos una cualidad.');
    return;
  }
  generarYDescargar(datos);
};
</script>

<style scoped>
.referencia-personal-container {
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

.checkboxes-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 8px;
}
.checkboxes-grid label {
  font-weight: 400;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}
.checkboxes-grid input[type="checkbox"] {
  width: auto;
  margin: 0;
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
