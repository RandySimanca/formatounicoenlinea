// backend/controllers/firmaServidorControllers.js
import FirmaServidor from '../models/FirmaServidor.js';

export const guardarFirmaServidor = async (req, res) => {
  try {
    const { ciudadDiligenciamiento, fechaDiligenciamiento, firmaServidor } = req.body;

    const data = await FirmaServidor.findOneAndUpdate(
      { user: req.user.id },
      { ciudadDiligenciamiento, fechaDiligenciamiento, firmaServidor, user: req.user.id },
      { upsert: true, new: true }
    );

    res.status(200).json({ mensaje: 'Firma guardada correctamente', data });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al guardar firma', error });
  }
};

export const obtenerFirmaServidor = async (req, res) => {
  try {
    const data = await FirmaServidor.findOne({ user: req.user.id });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener firma', error });
  }
};


/**
 * Eliminar firma del servidor
 * DELETE /api/firma-servidor
 */
export const eliminarFirmaServidor = async (req, res) => {
  try {
    const usuarioId = req.usuario._id;

    const firmaEliminada = await FirmaServidor.findOneAndDelete({ 
      user: usuarioId 
    });

    if (!firmaEliminada) {
      return res.status(404).json({ 
        ok: false,
        mensaje: "No se encontró firma para eliminar" 
      });
    }

    console.log(`🗑️ Firma eliminada para usuario: ${usuarioId}`);

    res.json({
      ok: true,
      mensaje: "Firma eliminada correctamente",
      eliminada: true
    });

  } catch (error) {
    console.error("❌ Error al eliminar firma:", error);
    res.status(500).json({
      ok: false,
      mensaje: "Error al eliminar la firma del servidor",
      error: error.message
    });
  }
};