//backend/controllers/authController.js
import jwt from "jsonwebtoken";
import UsuarioEmbebido from "../models/UsuarioEmbebido.js";
import { enviarCorreoBienvenida } from "../services/emailService.js";

/**
 * Controlador para manejar el registro y login de usuarios.
 * Utiliza JWT para autenticación.
 */

export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, password, roles } = req.body;

    if (!nombre || !email || !password) {
      return res
        .status(400)
        .json({ mensaje: "Todos los campos son obligatorios." });
    }

    const existe = await UsuarioEmbebido.findOne({ email: email.toLowerCase() });
    if (existe) {
      return res.status(409).json({ mensaje: "El correo ya está registrado." });
    }

    const nuevoUsuario = new UsuarioEmbebido({
      nombre,
      email: email.toLowerCase(),
      password,
      roles: roles || ["usuario"]
    });

    await nuevoUsuario.save();

    console.log('✅ Usuario registrado exitosamente:', email);

    // 🎉 ENVIAR CORREO DE BIENVENIDA (sin bloquear la respuesta)
    enviarCorreoBienvenida({
      email: nuevoUsuario.email,
      nombre: nuevoUsuario.nombre,
      numDocumento: nuevoUsuario.numDocumento || ""
    }).catch(error => {
      // Solo logueamos el error, no afecta el registro
      console.error("⚠️ No se pudo enviar correo de bienvenida:");
      console.error("Error:", error);
    });

    res.status(201).json({
      mensaje: "Usuario registrado exitosamente. ¡Revisa tu correo!"
    });
  } catch (err) {
    console.error("Error en registro:", err.message);
    res.status(500).json({ mensaje: "Error interno del servidor." });
  }
};

export const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Actualizar último acceso
    usuario.ultimoAcceso = new Date();
    await usuario.save();

    // Token JWT
    const token = jwt.sign(
      { uid: usuario._id, roles: usuario.roles },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    console.log('✅ Login exitoso para:', email);

    res.json({
      token,
      usuario: {
        uid: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        roles: usuario.roles,
      },
    });
  } catch (err) {
    console.error("Error en login:", err.message);
    res.status(500).json({ mensaje: "Error interno del servidor." });
  }
};