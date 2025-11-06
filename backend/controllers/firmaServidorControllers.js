// backend/controllers/firmaServidorControllers.js
import FirmaServidor from '../models/FirmaServidor.js';

export const guardarFirmaServidor = async (req, res) => {
  try {
    const { 
      declaracionInhabilidad,
      declaracionVeracidad,
      ciudadDiligenciamiento, 
      fechaDiligenciamiento, 
      firmaServidor 
    } = req.body;

    // ✅ VALIDACIONES
    if (!declaracionInhabilidad) {
      return res.status(400).json({ 
        mensaje: 'La declaración de inhabilidad es obligatoria' 
      });
    }

    if (!declaracionVeracidad) {
      return res.status(400).json({ 
        mensaje: 'La declaración de veracidad es obligatoria' 
      });
    }

    if (!ciudadDiligenciamiento || !fechaDiligenciamiento || !firmaServidor) {
      return res.status(400).json({ 
        mensaje: 'Todos los campos son obligatorios' 
      });
    }

    console.log('💾 Guardando firma con declaraciones:', {
      userId: req.user.id,
      declaracionInhabilidad,
      declaracionVeracidad,
      ciudadDiligenciamiento
    });

    const data = await FirmaServidor.findOneAndUpdate(
      { user: req.user.id },
      { 
        declaracionInhabilidad,
        declaracionVeracidad,
        ciudadDiligenciamiento, 
        fechaDiligenciamiento, 
        firmaServidor, 
        user: req.user.id 
      },
      { upsert: true, new: true }
    );

    console.log('✅ Firma guardada exitosamente');

    res.status(200).json({ 
      mensaje: 'Firma y declaraciones guardadas correctamente', 
      data 
    });
  } catch (error) {
    console.error('❌ Error al guardar firma:', error);
    res.status(500).json({ 
      mensaje: 'Error al guardar firma', 
      error: error.message 
    });
  }
};

export const obtenerFirmaServidor = async (req, res) => {
  try {
    const data = await FirmaServidor.findOne({ user: req.user.id });
    
    if (!data) {
      return res.status(200).json(null);
    }

    console.log('✅ Firma obtenida:', {
      userId: req.user.id,
      tieneDeclaraciones: !!(data.declaracionInhabilidad && data.declaracionVeracidad)
    });

    res.status(200).json(data);
  } catch (error) {
    console.error('❌ Error al obtener firma:', error);
    res.status(500).json({ 
      mensaje: 'Error al obtener firma', 
      error: error.message 
    });
  }
};

/**
 * Eliminar firma del servidor
 * DELETE /api/firma-servidor
 */
export const eliminarFirmaServidor = async (req, res) => {
  try {
    const resultado = await FirmaServidor.findOneAndDelete({ user: req.user.id });
    
    if (!resultado) {
      return res.status(404).json({ 
        mensaje: "No se encontró firma para eliminar" 
      });
    }
    
    console.log('✅ Firma y declaraciones eliminadas:', {
      userId: req.user.id
    });

    res.status(200).json({ 
      mensaje: "Firma y declaraciones eliminadas exitosamente",
      firmaEliminada: resultado
    });
    
  } catch (error) {
    console.error("❌ Error al eliminar firma:", error);
    res.status(500).json({ 
      mensaje: "Error al eliminar la firma",
      error: error.message 
    });
  }
};