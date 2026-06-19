<template>
  <div class="derecho-peticion-container">
    <section class="encabezado">
      <h1>Derecho de Petición Laboral — Generador Gratuito</h1>
      <p>Redacta tu derecho de petición ante una empresa o entidad laboral. Se genera en PDF conforme al artículo 23 de la Constitución Política de Colombia.</p>
    </section>

    <section class="formulario">
      <form @submit.prevent="generar">
        <fieldset>
          <legend>Tus datos (solicitante)</legend>
          <div class="form-group">
            <label for="nombreSolicitante">Nombre completo</label>
            <input id="nombreSolicitante" v-model="datos.nombreSolicitante" required placeholder="Ej: María Gómez" />
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
          <div class="form-group">
            <label for="direccionSolicitante">Dirección</label>
            <input id="direccionSolicitante" v-model="datos.direccionSolicitante" required placeholder="Ej: Calle 123 # 45-67" />
          </div>
          <div class="form-group">
            <label for="telefonoSolicitante">Teléfono</label>
            <input id="telefonoSolicitante" v-model="datos.telefonoSolicitante" required placeholder="Ej: 3001234567" />
          </div>
          <div class="form-group">
            <label for="correoDeSolicitante">Correo electrónico (Opcional)</label>
            <input id="correoDeSolicitante" v-model="datos.correoDeSolicitante" placeholder="Ej: maria@example.com" />
          </div>
          <div class="form-group">
            <label for="ciudadSolicitante">Ciudad</label>
            <input id="ciudadSolicitante" v-model="datos.ciudadSolicitante" required placeholder="Ej: Bogotá" />
          </div>
        </fieldset>

        <fieldset>
          <legend>Datos del destinatario (empresa o entidad)</legend>
          <div class="form-group">
            <label for="nombreDestinatario">Nombre de la empresa o entidad</label>
            <input id="nombreDestinatario" v-model="datos.nombreDestinatario" required placeholder="Ej: ACME SAS, Ministerio de Trabajo" />
          </div>
          <div class="form-group">
            <label for="cargoDestinatario">Cargo de quien recibe</label>
            <input id="cargoDestinatario" v-model="datos.cargoDestinatario" required placeholder="Ej: Representante Legal, Jefe de RRHH" />
          </div>
          <div class="form-group">
            <label for="ciudadDestinatario">Ciudad del destinatario</label>
            <input id="ciudadDestinatario" v-model="datos.ciudadDestinatario" required placeholder="Ej: Bogotá" />
          </div>
        </fieldset>

        <fieldset>
          <legend>Contenido de la petición</legend>
          <div class="form-group">
            <label for="tipoPeticion">Tipo de petición</label>
            <select id="tipoPeticion" v-model="datos.tipoPeticion" required>
              <option value="pago de salarios pendientes">Pago de salarios pendientes</option>
              <option value="liquidacion de prestaciones sociales">Liquidación de prestaciones sociales</option>
              <option value="entrega de carta de experiencia">Entrega de carta de experiencia laboral</option>
              <option value="pago de horas extras">Pago de horas extras o recargos</option>
              <option value="afiliacion seguridad social">Afiliación o corrección en seguridad social</option>
              <option value="certificacion laboral">Certificación laboral</option>
              <option value="otro">Otro (describir en los hechos)</option>
            </select>
          </div>
          <div class="form-group">
            <label for="hechos">Hechos</label>
            <textarea id="hechos" v-model="datos.hechos" required rows="5" placeholder="Describa detalladamente los hechos que motivan su petición. Incluya fechas, montos u otros datos relevantes."></textarea>
          </div>
          <div class="form-group">
            <label for="peticionConcreta">Petición concreta</label>
            <textarea id="peticionConcreta" v-model="datos.peticionConcreta" required rows="4" placeholder="Indique específicamente qué solicita que haga la empresa o entidad."></textarea>
          </div>
          <div class="form-group">
            <label for="ciudadExpedicion">Ciudad de expedición</label>
            <input id="ciudadExpedicion" v-model="datos.ciudadExpedicion" required placeholder="Ej: Bogotá" />
          </div>
          <div class="form-group">
            <label for="fechaExpedicion">Fecha de expedición</label>
            <input id="fechaExpedicion" type="text" v-model="datos.fechaExpedicion" required placeholder="Ej: 20/06/2025" />
          </div>
        </fieldset>

        <button type="submit" class="btn-submit" :disabled="generando">
          {{ generando ? "Generando..." : "Generar y Descargar PDF" }}
        </button>
        <p v-if="error" class="error-msg">{{ error }}</p>
      </form>
    </section>

    <div class="aviso-legal">
      <strong>⚠️ Aviso importante:</strong> Este generador facilita la redacción del documento.
      El derecho de petición tiene plena validez al ser firmado y entregado formalmente al
      destinatario (en físico con acuse de recibo, o por correo certificado). Para situaciones
      complejas, consulta con un abogado laboralista.
    </div>

    <section class="seo-content">
      <h2>¿Qué es un derecho de petición laboral?</h2>
      <p>
        Es un documento formal mediante el cual un trabajador o ex trabajador solicita
        a una empresa o entidad que cumpla con una obligación laboral específica:
        pago de salarios, entrega de prestaciones, certificaciones, afiliaciones a
        seguridad social, entre otras. Está amparado por el artículo 23 de la
        Constitución Política de Colombia y la Ley 1437 de 2011.
      </p>

      <h2>¿Cuándo usarlo?</h2>
      <p>
        Cuando una empresa incumple sus obligaciones laborales y los intentos verbales
        no han dado resultado. El derecho de petición deja constancia escrita del
        reclamo y obliga al destinatario a responder en los términos que establece la ley.
      </p>

      <h2>¿Qué debe contener?</h2>
      <ul>
        <li>Identificación completa del solicitante</li>
        <li>Datos del destinatario (empresa o funcionario responsable)</li>
        <li>Descripción clara de los hechos</li>
        <li>Petición concreta y específica</li>
        <li>Dirección o correo para recibir respuesta</li>
        <li>Firma del solicitante</li>
      </ul>

      <h2>Preguntas frecuentes</h2>

      <details>
        <summary>¿En cuánto tiempo debe responder la empresa?</summary>
        <p>
          Según la Ley 1437 de 2011, las entidades tienen 15 días hábiles para responder
          derechos de petición de interés general o particular. Si no responden en ese
          plazo, incurren en silencio administrativo positivo o pueden ser sancionados.
          En el caso de empresas privadas, la Corte Constitucional ha extendido este
          derecho en contextos laborales.
        </p>
      </details>

      <details>
        <summary>¿Cómo debo entregar el derecho de petición?</summary>
        <p>
          Lo más recomendable es entregarlo en físico y exigir una copia con sello,
          fecha y firma de recibido. También puedes enviarlo por correo certificado
          o, si la empresa lo permite, por correo electrónico con confirmación de lectura.
          Guarda siempre el comprobante de entrega.
        </p>
      </details>

      <details>
        <summary>¿Qué pasa si la empresa no responde?</summary>
        <p>
          Puedes presentar una queja ante el Ministerio de Trabajo o la Superintendencia
          de Sociedades según el caso, adjuntando copia del derecho de petición y la
          constancia de entrega. El incumplimiento puede acarrear sanciones para la empresa.
        </p>
      </details>

      <details>
        <summary>¿Se guarda algún dato ingresado?</summary>
        <p>
          No. Esta herramienta funciona completamente en tu navegador. Ningún dato
          es enviado a ningún servidor ni almacenado en ninguna base de datos.
        </p>
      </details>
    </section>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useDerechoPeticion } from '../../composables/useDerechoPeticion';

const datos = reactive({
  nombreSolicitante: '',
  tipoDocumento: 'CC',
  numeroDocumento: '',
  direccionSolicitante: '',
  telefonoSolicitante: '',
  correoDeSolicitante: '',
  ciudadSolicitante: '',
  nombreDestinatario: '',
  cargoDestinatario: 'Representante Legal',
  ciudadDestinatario: '',
  tipoPeticion: 'pago de salarios pendientes',
  hechos: '',
  peticionConcreta: '',
  ciudadExpedicion: '',
  fechaExpedicion: '',
});

const { generando, error, generarYDescargar } = useDerechoPeticion();
const generar = () => generarYDescargar(datos);
</script>

<style scoped>
.derecho-peticion-container {
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

.aviso-legal {
  background-color: #fff8e1;
  border: 1px solid #f59e0b;
  border-radius: 8px;
  padding: 14px 16px;
  margin-top: 20px;
  color: #92400e;
  font-size: 0.9rem;
  line-height: 1.5;
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
