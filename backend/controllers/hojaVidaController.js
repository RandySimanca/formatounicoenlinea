//backend/controllers/hojaVidaController.js
// backend/controllers/hojaVidaController.js (SIMPLIFICADO)
import UsuarioEmbebido from '../models/UsuarioEmbebido.js';

export const obtenerHojaCompleta = async (req, res) => {
  try {
    const userId = req.user.uid;

    // ✅ UNA SOLA CONSULTA trae TODO
    const usuario = await UsuarioEmbebido.findById(userId, '-password');

    if (!usuario) {
      return res.status(404).json({
        mensaje: "No se encontró información de hoja de vida."
      });
    }

    // Ya tienes TODO en un solo objeto
    res.json(usuario);

  } catch (error) {
    console.error("❌ Error al obtener la hoja de vida:", error);
    res.status(500).json({ mensaje: "Error al consultar hoja de vida." });
  }
};