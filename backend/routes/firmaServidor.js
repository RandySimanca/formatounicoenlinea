// ========================================
// backend/controllers/firmaServidorControllers.js
// ========================================

import FirmaServidor from "../models/FirmaServidor.js";

/**
 * Guardar o actualizar firma del servidor
 * POST /api/firma-servidor
 */
export const guardarFirmaServidor = async (req, res) => {
  try {
    const { ciudadDiligenciamiento, fechaDiligenciamiento, firmaServidor } = req.body;
    const usuarioId = req.usuario._id;

    // Validación
    if (!firmaServidor) {
      return res.status(400).json({
        ok: false,
        mensaje: "La firma es requerida",
      });
    }

    // Buscar si ya existe una firma para este usuario
    let firma = await FirmaServidor.findOne({ user: usuarioId });

    if (firma) {
      // Actualizar firma existente
      firma.ciudadDiligenciamiento = ciudadDiligenciamiento;
      firma.fechaDiligenciamiento = fechaDiligenciamiento;
      firma.firmaServidor = firmaServidor;
      await firma.save();

      console.log(`✅ Firma actualizada para usuario: ${usuarioId}`);

      return res.json({
        ok: true,
        mensaje: "Firma actualizada correctamente",
        data: firma,
      });
    }

    // Crear nueva firma
    firma = new FirmaServidor({
      user: usuarioId,
      ciudadDiligenciamiento,
      fechaDiligenciamiento,
      firmaServidor,
    });

    await firma.save();

    console.log(`✅ Firma creada para usuario: ${usuarioId}`);

    res.status(201).json({
      ok: true,
      mensaje: "Firma guardada correctamente",
      data: firma,
    });
  } catch (error) {
    console.error("❌ Error al guardar firma:", error);
    res.status(500).json({
      ok: false,
      mensaje: "Error al guardar la firma",
      error: error.message,
    });
  }
};

/**
 * Obtener firma del servidor
 * GET /api/firma-servidor
 */
export const obtenerFirmaServidor = async (req, res) => {
  try {
    const usuarioId = req.usuario._id;

    const firma = await FirmaServidor.findOne({ user: usuarioId });

    if (!firma) {
      return res.status(404).json({
        ok: false,
        mensaje: "No se encontró firma para este usuario",
      });
    }

    console.log(`✅ Firma obtenida para usuario: ${usuarioId}`);

    res.json({
      ok: true,
      data: firma,
    });
  } catch (error) {
    console.error("❌ Error al obtener firma:", error);
    res.status(500).json({
      ok: false,
      mensaje: "Error al obtener la firma",
      error: error.message,
    });
  }
};

/**
 * Eliminar firma del servidor
 * DELETE /api/firma-servidor
 */
export const eliminarFirmaServidor = async (req, res) => {
  try {
    const usuarioId = req.usuario._id;

    // Buscar y eliminar la firma del usuario
    const firmaEliminada = await FirmaServidor.findOneAndDelete({ user: usuarioId });

    if (!firmaEliminada) {
      return res.status(404).json({
        ok: false,
        mensaje: "No se encontró firma para eliminar",
      });
    }

    console.log(`🗑️ Firma eliminada para usuario: ${usuarioId}`);

    res.json({
      ok: true,
      mensaje: "Firma eliminada correctamente",
      eliminada: true,
    });
  } catch (error) {
    console.error("❌ Error al eliminar firma:", error);
    res.status(500).json({
      ok: false,
      mensaje: "Error al eliminar la firma del servidor",
      error: error.message,
    });
  }
};
