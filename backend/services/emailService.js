// backend/services/emailService.js
// Usaremos un puente de Google Apps Script para enviar correos desde Gmail evitando bloqueos de SMTP

/**
 * Función genérica para enviar correos vía Puente de Google Apps Script
 */
const enviarViaPuente = async (opciones) => {
  const bridgeUrl = process.env.EMAIL_BRIDGE_URL;

  if (!bridgeUrl) {
    console.error("❌ Error: EMAIL_BRIDGE_URL no está configurada.");
    return { success: false, error: "Falta URL del puente" };
  }

  try {
    const response = await fetch(bridgeUrl, {
      method: "POST",
      redirect: "follow",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: opciones.to,
        subject: opciones.subject,
        html: opciones.html,
        text: opciones.text
      })
    });

    const text = await response.text();
    console.log("📡 RESPUESTA COMPLETA:", text);
    //console.log(`📡 Respuesta del Puente (Status ${response.status})`);

    try {
      const data = JSON.parse(text);
      if (data.status === "success") {
        console.log(`✅ Correo enviado exitosamente vía Puente a ${opciones.to}`);
        return { success: true };
      } else {
        console.error("❌ Error del Puente de Google:", data.message);
        return { success: false, error: data.message };
      }
    } catch (e) {
      console.error("❌ El Puente no devolvió JSON. Respuesta recibida:", text.substring(0, 100) + "...");
      return { success: false, error: "Respuesta no válida del servidor de Google" };
    }
  } catch (error) {
    console.error("❌ Error de red al conectar con el Puente:", error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Envía correo de bienvenida al registrar nuevo usuario
 */
export const enviarCorreoBienvenida = async (usuario) => {
  const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #2c3e50; margin-bottom: 20px;">¡Bienvenido/a ${usuario.nombre || ''}!</h2>
          <p style="color: #555; line-height: 1.6;">
            Tu cuenta ha sido creada exitosamente en nuestro sistema de <strong>Formato Único de Hoja de Vida</strong>.
          </p>
          <div style="background-color: #e8f4f8; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 5px 0; color: #333;"><strong>📧 Email registrado:</strong> ${usuario.email}</p>
            <p style="margin: 5px 0; color: #333;"><strong>📄 Documento:</strong> ${usuario.numDocumento || 'No especificado'}</p>
          </div>
          <h3 style="color: #2c3e50; margin-top: 25px;">¿Qué puedes hacer ahora?</h3>
          <ul style="color: #555; line-height: 1.8;">
            <li>✅ Completar tu información personal</li>
            <li>✅ Agregar tu experiencia laboral</li>
            <li>✅ Registrar tu formación académica</li>
            <li>✅ Descargar tu hoja de vida en formato PDF oficial</li>
          </ul>
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://formatounicoenlinea-a17641bda7dd.herokuapp.com/login" 
               style="background-color: #3498db; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              Ingresar a mi cuenta
            </a>
          </div>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #555; margin-top: 20px;">
            Atentamente,<br><strong>Randy Simanca</strong><br>Soporte Técnico<br>💬 314-5193285
          </p>
        </div>
      </div>
    `;

  return await enviarViaPuente({
    to: usuario.email,
    subject: "¡Bienvenido! Registro exitoso en Formato Único Hoja de Vida",
    html,
    text: `¡Bienvenido/a ${usuario.nombre || ''}! Tu cuenta ha sido creada exitosamente.`
  });
};

/**
 * Envía correo de recuperación de contraseña
 */
export const enviarCodigoRecuperacion = async (email, codigo, nombreUsuario = "") => {
  const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #e74c3c; margin-bottom: 20px;">🔐 Recuperación de Contraseña</h2>
          <p style="color: #555; line-height: 1.6;">Hola ${nombreUsuario},</p>
          <p style="color: #555; line-height: 1.6;">Recibimos una solicitud para restablecer la contraseña de tu cuenta.</p>
          <div style="background-color: #fff3cd; padding: 20px; border-radius: 5px; margin: 25px 0; text-align: center;">
            <p style="margin: 0 0 10px 0; color: #856404; font-size: 14px;">Tu código de recuperación es:</p>
            <p style="margin: 0; font-size: 32px; font-weight: bold; color: #2c3e50; letter-spacing: 5px;">${codigo}</p>
          </div>
          <p style="color: #e74c3c; font-weight: bold;">⏱️ Este código expira en 15 minutos</p>
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://formatounicoenlinea-a17641bda7dd.herokuapp.com/login" 
               style="background-color: #3498db; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              Ir al sitio web
            </a>
          </div>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #555; margin-top: 20px;">
            Atentamente,<br><strong>Randy Simanca</strong><br>Soporte Técnico<br>💬 314-5193285
          </p>
        </div>
      </div>
    `;

  return await enviarViaPuente({
    to: email,
    subject: "Código de recuperación de contraseña",
    html,
    text: `Hola, tu código de recuperación es: ${codigo}. Expira en 15 minutos.`
  });
};

export const enviarCorreoUnico = async (email, asunto, htmlContent) => {
  return await enviarViaPuente({
    to: email,
    subject: asunto,
    html: htmlContent,
    text: "Mensaje de Formato Único Hoja de Vida"
  });
};

export default {
  enviarCorreoBienvenida,
  enviarCodigoRecuperacion,
  enviarCorreoUnico
};
