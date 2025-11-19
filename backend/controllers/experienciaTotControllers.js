// backend/controllers/experienciaTotControllers.js
import UsuarioEmbebido from "../models/UsuarioEmbebido.js";

export const guardarExperienciaTot = async (req, res) => {
  try {
    const { experienciaPublica, experienciaPrivada, ciudadDiligenciamiento, fechaDiligenciamiento, firmaBase64 } = req.body;
    const userId = req.user.uid; // ✅ corregido

    console.log('💾 Guardando resumen de experiencia para usuario:', userId);

    const usuario = await UsuarioEmbebido.findById(userId);
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    // Guardar los datos dentro del usuario embebido
    usuario.experienciaPublica = experienciaPublica;
    usuario.experienciaPrivada = experienciaPrivada;
    usuario.ciudadDiligenciamiento = ciudadDiligenciamiento;
    usuario.fechaDiligenciamiento = fechaDiligenciamiento;
    usuario.firmaBase64 = firmaBase64;

    await usuario.save();

    res.status(200).json({
      mensaje: "Resumen de experiencia guardado correctamente",
      data: usuario
    });

  } catch (error) {
    console.error("❌ Error al guardar resumen:", error);
    res.status(500).json({
      mensaje: "Error al guardar el resumen",
      error: error.message
    });
  }
};

export const obtenerExperienciaTot = async (req, res) => {
  try {
    const userId = req.user.uid; // ✅ corregido
    console.log('🔍 Obteniendo resumen de experiencia para usuario:', userId);

    const usuario = await UsuarioEmbebido.findById(userId,
      'experienciaPublica experienciaPrivada ciudadDiligenciamiento fechaDiligenciamiento firmaBase64'
    );

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    if (!usuario.experienciaPublica && !usuario.experienciaPrivada) {
      return res.status(404).json({ mensaje: "No hay resumen registrado" });
    }

    res.json(usuario);
  } catch (error) {
    console.error("❌ Error al obtener resumen:", error);
    res.status(500).json({
      mensaje: "Error al obtener resumen",
      error: error.message
    });
  }
};