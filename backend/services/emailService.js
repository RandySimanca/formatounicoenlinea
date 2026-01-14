// backend/services/emailService.js
//importar mpdemailer
import nodemailer from "nodemailer";

// Configurar el transporter una sola vez
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // false para puerto 587 (STARTTLS)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 15000, // Aumentamos a 15 segundos
  greetingTimeout: 15000,
});

console.log("📧 Configuración de correo: smtp.gmail.com:587 (STARTTLS)");

/**
 * Envía correo de bienvenida al registrar nuevo usuario
 */
export const enviarCorreoBienvenida = async (usuario) => {
  const mailOptions = {
    from: `"Formato Único Hoja de Vida" <${process.env.EMAIL_USER}>`,
    to: usuario.email,
    subject: "¡Bienvenido! Registro exitoso en Formato Único Hoja de Vida",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #2c3e50; margin-bottom: 20px;">¡Bienvenido/a ${usuario.nombre || ''}!</h2>
          
          <p style="color: #555; line-height: 1.6;">
            Tu cuenta ha sido creada exitosamente en nuestro sistema de <strong>Formato Único de Hoja de Vida</strong>.
          </p>
          
          <div style="background-color: #e8f4f8; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 5px 0; color: #333;">
              <strong>📧 Email registrado:</strong> ${usuario.email}
            </p>
            <p style="margin: 5px 0; color: #333;">
              <strong>📄 Documento:</strong> ${usuario.numDocumento || 'No especificado'}
            </p>
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
          
          <p style="color: #888; font-size: 12px; text-align: center;">
            Si no creaste esta cuenta, por favor ignora este correo o contáctanos.
          </p>
          
          <p style="color: #555; margin-top: 20px;">
            Atentamente,<br>
            <strong>Randy Simanca</strong><br>
            Soporte Técnico<br>
            💬 314-5193285
          </p>
        </div>
      </div>
    `,
    text: `
¡Bienvenido/a ${usuario.nombre || ''}!

Tu cuenta ha sido creada exitosamente en nuestro sistema de Formato Único de Hoja de Vida.

📧 Email registrado: ${usuario.email}
📄 Documento: ${usuario.numDocumento || 'No especificado'}

¿Qué puedes hacer ahora?
✅ Completar tu información personal
✅ Agregar tu experiencia laboral
✅ Registrar tu formación académica
✅ Descargar tu hoja de vida en formato PDF oficial

Ingresa a tu cuenta: https://formatounicoenlinea-a17641bda7dd.herokuapp.com/login

Si no creaste esta cuenta, por favor ignora este correo o contáctanos.

Atentamente,
Randy Simanca
Soporte Técnico
💬 314-5193285
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Correo de bienvenida enviado a ${usuario.email}`);
    return { success: true };
  } catch (error) {
    console.error("❌ Error al enviar correo de bienvenida:");
    console.error("Mensaje:", error.message);
    console.error("Código:", error.code);
    console.error("Comando:", error.command);
    return { success: false, error: error.message };
  }
};

/**
 * Envía correo de recuperación de contraseña
 */
export const enviarCodigoRecuperacion = async (email, codigo, nombreUsuario = "") => {
  const mailOptions = {
    from: `"Soporte Hoja de Vida" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Código de recuperación de contraseña",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #e74c3c; margin-bottom: 20px;">🔐 Recuperación de Contraseña</h2>
          
          <p style="color: #555; line-height: 1.6;">
            Hola ${nombreUsuario},
          </p>
          
          <p style="color: #555; line-height: 1.6;">
            Recibimos una solicitud para restablecer la contraseña de tu cuenta.
          </p>
          
          <div style="background-color: #fff3cd; padding: 20px; border-radius: 5px; margin: 25px 0; text-align: center;">
            <p style="margin: 0 0 10px 0; color: #856404; font-size: 14px;">Tu código de recuperación es:</p>
            <p style="margin: 0; font-size: 32px; font-weight: bold; color: #2c3e50; letter-spacing: 5px;">${codigo}</p>
          </div>
          
          <p style="color: #e74c3c; font-weight: bold;">
            ⏱️ Este código expira en 15 minutos
          </p>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://formatounicoenlinea-a17641bda7dd.herokuapp.com/login" 
               style="background-color: #3498db; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              Ir al sitio web
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #888; font-size: 12px; text-align: center;">
            Si no solicitaste este código, ignora este correo. Tu cuenta permanece segura.
          </p>
          
          <p style="color: #555; margin-top: 20px;">
            Atentamente,<br>
            <strong>Randy Simanca</strong><br>
            Soporte Técnico<br>
            💬 314-5193285
          </p>
        </div>
      </div>
    `,
    text: `
Hola ${nombreUsuario},

Recibimos una solicitud para restablecer la contraseña de tu cuenta.

Tu código de recuperación es: ${codigo}

⏱️ Este código expira en 15 minutos.

Ingresa a: https://formatounicoenlinea-a17641bda7dd.herokuapp.com/login

Si no solicitaste este código, ignora este correo.

Atentamente,
Randy Simanca
Soporte Técnico
💬 314-5193285
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Correo de recuperación enviado a ${email}`);
    return { success: true };
  } catch (error) {
    console.error("❌ Error al enviar correo de recuperación:");
    console.error("Mensaje:", error.message);
    console.error("Código:", error.code);
    console.error("Comando:", error.command);
    return { success: false, error: error.message };
  }
};

export const enviarCorreoUnico = async (email, asunto, htmlContent) => {
  const mailOptions = {
    from: `"Formato Único Hoja de Vida" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: asunto,
    html: htmlContent
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Correo de campaña enviado a ${email}`);
    return { success: true };
  } catch (error) {
    console.error(`❌ Error enviando a ${email}:`, error.message);
    return { success: false, error: error.message };
  }
};

export default {
  enviarCorreoBienvenida,
  enviarCodigoRecuperacion,
  enviarCorreoUnico,
  transporter
};
