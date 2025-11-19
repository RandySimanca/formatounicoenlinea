// backend/controllers/recoveryController.js
import UsuarioEmbebido from "../models/UsuarioEmbebido.js";
import crypto from "crypto";
import nodemailer from "nodemailer";

// Almacenamiento temporal de códigos
const codigosRecuperacion = new Map();

function generarCodigoRecuperacion() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const solicitarRecuperacion = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        mensaje: "El correo electrónico es obligatorio."
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        mensaje: "El formato del correo electrónico no es válido."
      });
    }

    const usuario = await UsuarioEmbebido.findOne({ email: email.toLowerCase() });

    if (!usuario) {
      console.log(`⚠️ Intento de recuperación para email no existente: ${email}`);
      return res.status(200).json({
        mensaje: "Si el correo existe, se ha generado un código de recuperación.",
        codigoGenerado: false
      });
    }

    const codigo = generarCodigoRecuperacion();
    const expiracion = Date.now() + 15 * 60 * 1000;

    codigosRecuperacion.set(email.toLowerCase(), {
      codigo,
      usuarioId: usuario._id.toString(),
      expiracion,
      intentos: 0
    });

    console.log(`🔑 Código de recuperación generado para ${email}: ${codigo}`);

    const respuesta = {
      mensaje: "Código de recuperación generado correctamente.",
      codigoGenerado: true,
      email: email
    };

    if (process.env.NODE_ENV === 'development') {
      respuesta.codigoDesarrollo = codigo;
      console.log(`🔓 [DEV] Código incluido en respuesta: ${codigo}`);
    }

    // Enviar correo
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Soporte Hoja de Vida" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Código de recuperación de contraseña",
      text: `Hola ${usuario.nombre || ""},\nEste mensaje te llega porque tienes tu hoja de vida en formato unico registrada en nuestro sistema.
       y pediste un codigo de recuperacion para cambiar tu contraseña de acceso.\n\nTu código de recuperación es: ${codigo}\n\nEste código expira en 15 minutos.\n\nSi no solicitaste este código, ignora este correo.
      \n\n\nIngresa a esta direccion web para acceder a tu perfil: https://formatounicoenlinea-a17641bda7dd.herokuapp.com/login
      \n\nAtte.\nRandy Simanca. \nSoporte Técnico.\n💬314-5193285`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`📧 Correo enviado a ${email}`);
    } catch (error) {
      console.error("❌ Error al enviar correo:", error.message);
      return res.status(500).json({
        mensaje: "Error al enviar el correo de recuperación.",
        detalle: error.message,
      });
    }

    res.status(200).json(respuesta);

  } catch (error) {
    console.error("❌ Error al solicitar recuperación:", error);
    res.status(500).json({
      mensaje: "Error interno del servidor.",
      detalle: error.message
    });
  }
};

export const verificarCodigo = async (req, res) => {
  try {
    const { email, codigo } = req.body;

    if (!email || !codigo) {
      return res.status(400).json({
        mensaje: "Email y código son obligatorios."
      });
    }

    const emailNormalizado = email.toLowerCase();
    const datosRecuperacion = codigosRecuperacion.get(emailNormalizado);

    if (!datosRecuperacion) {
      return res.status(404).json({
        mensaje: "No hay solicitud de recuperación para este email."
      });
    }

    if (Date.now() > datosRecuperacion.expiracion) {
      codigosRecuperacion.delete(emailNormalizado);
      return res.status(410).json({
        mensaje: "El código ha expirado. Solicita uno nuevo."
      });
    }

    if (datosRecuperacion.intentos >= 3) {
      codigosRecuperacion.delete(emailNormalizado);
      return res.status(429).json({
        mensaje: "Demasiados intentos fallidos. Solicita un nuevo código."
      });
    }

    if (datosRecuperacion.codigo !== codigo) {
      datosRecuperacion.intentos++;
      const intentosRestantes = 3 - datosRecuperacion.intentos;

      return res.status(401).json({
        mensaje: `Código incorrecto. Te quedan ${intentosRestantes} intento(s).`,
        intentosRestantes
      });
    }

    const tokenRecuperacion = crypto.randomBytes(32).toString('hex');

    datosRecuperacion.tokenRecuperacion = tokenRecuperacion;
    datosRecuperacion.tokenExpiracion = Date.now() + 10 * 60 * 1000;

    console.log(`✅ Código verificado correctamente para ${email}`);

    res.status(200).json({
      mensaje: "Código verificado correctamente.",
      tokenRecuperacion,
      email: emailNormalizado
    });

  } catch (error) {
    console.error("❌ Error al verificar código:", error);
    res.status(500).json({
      mensaje: "Error interno del servidor.",
      detalle: error.message
    });
  }
};

export const restablecerPassword = async (req, res) => {
  try {
    const { email, tokenRecuperacion, nuevaPassword } = req.body;

    if (!email || !tokenRecuperacion || !nuevaPassword) {
      return res.status(400).json({
        mensaje: "Todos los campos son obligatorios."
      });
    }

    if (nuevaPassword.length < 6) {
      return res.status(400).json({
        mensaje: "La contraseña debe tener al menos 6 caracteres."
      });
    }

    const emailNormalizado = email.toLowerCase();
    const datosRecuperacion = codigosRecuperacion.get(emailNormalizado);

    if (!datosRecuperacion || !datosRecuperacion.tokenRecuperacion) {
      return res.status(404).json({
        mensaje: "Sesión de recuperación no encontrada."
      });
    }

    if (datosRecuperacion.tokenRecuperacion !== tokenRecuperacion) {
      return res.status(401).json({
        mensaje: "Token de recuperación inválido."
      });
    }

    if (Date.now() > datosRecuperacion.tokenExpiracion) {
      codigosRecuperacion.delete(emailNormalizado);
      return res.status(410).json({
        mensaje: "El token ha expirado. Inicia el proceso nuevamente."
      });
    }

    const usuario = await UsuarioEmbebido.findById(datosRecuperacion.usuarioId);

    if (!usuario) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado."
      });
    }

    usuario.password = nuevaPassword;
    await usuario.save();

    codigosRecuperacion.delete(emailNormalizado);

    console.log(`✅ Contraseña restablecida para usuario: ${usuario.email}`);

    res.status(200).json({
      mensaje: "Contraseña restablecida exitosamente. Ya puedes iniciar sesión."
    });

  } catch (error) {
    console.error("❌ Error al restablecer contraseña:", error);
    res.status(500).json({
      mensaje: "Error interno del servidor.",
      detalle: error.message
    });
  }
};

export const limpiarCodigosExpirados = () => {
  const ahora = Date.now();
  let eliminados = 0;

  for (const [email, datos] of codigosRecuperacion.entries()) {
    if (ahora > datos.expiracion) {
      codigosRecuperacion.delete(email);
      eliminados++;
    }
  }

  if (eliminados > 0) {
    console.log(`🧹 Limpieza automática: ${eliminados} código(s) expirado(s) eliminado(s)`);
  }
};

setInterval(limpiarCodigosExpirados, 5 * 60 * 1000);

export const obtenerCodigoActual = (req, res) => {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({ mensaje: "Endpoint solo disponible en desarrollo" });
  }

  const { email } = req.query;
  const datos = codigosRecuperacion.get(email?.toLowerCase());

  if (!datos) {
    return res.status(404).json({ mensaje: "No hay código para este email" });
  }

  res.json({
    email,
    codigo: datos.codigo,
    expira: new Date(datos.expiracion).toLocaleString(),
    intentos: datos.intentos
  });
};