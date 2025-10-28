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
    const userId = req.usuario.id; // Desde el middleware auth
    
    // Buscar y eliminar la firma del usuario
    const resultado = await FirmaServidor.findOneAndDelete({ usuario: userId });
    
    if (!resultado) {
      return res.status(404).json({ 
        mensaje: "No se encontró firma para eliminar" 
      });
    }
    
    res.status(200).json({ 
      mensaje: "Firma eliminada exitosamente",
      firmaEliminada: resultado
    });
    
  } catch (error) {
    console.error("Error al eliminar firma:", error);
    res.status(500).json({ 
      mensaje: "Error al eliminar la firma",
      error: error.message 
    });
  }
};