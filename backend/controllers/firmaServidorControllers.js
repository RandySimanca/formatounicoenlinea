// backend/controllers/firmaServidorControllers.js
import UsuarioEmbebido from '../models/UsuarioEmbebido.js';

export const guardarFirmaServidor = async (req, res) => {
  try {
    const { declaracionInhabilidad, ciudadDiligenciamiento, fechaDiligenciamiento, firmaServidor } = req.body;

    // ✅ Validaciones
    if (!declaracionInhabilidad) {
      return res.status(400).json({ mensaje: 'La declaración de inhabilidad es obligatoria' });
    }

    if (!ciudadDiligenciamiento || !fechaDiligenciamiento || !firmaServidor) {
      return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
    }

    // ✅ CORRECCIÓN: Usar req.user.uid en lugar de req.user.id
    const userId = req.user.uid;
    console.log('💾 Guardando firma con declaraciones para usuario:', userId);

    const usuario = await UsuarioEmbebido.findById(userId);
    if (!usuario) {
      console.error('❌ Usuario no encontrado con uid:', userId);
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Actualizar campos de firma
    usuario.declaracionInhabilidad = declaracionInhabilidad;
    usuario.ciudadDiligenciamiento = ciudadDiligenciamiento;
    usuario.fechaDiligenciamiento = fechaDiligenciamiento;
    usuario.firmaServidor = firmaServidor;

    await usuario.save();

    console.log('✅ Firma guardada exitosamente para usuario:', userId);

    res.status(200).json({ 
      mensaje: 'Firma y declaraciones guardadas correctamente', 
      data: {
        declaracionInhabilidad: usuario.declaracionInhabilidad,
        ciudadDiligenciamiento: usuario.ciudadDiligenciamiento,
        fechaDiligenciamiento: usuario.fechaDiligenciamiento,
        firmaServidor: usuario.firmaServidor
      }
    });
  } catch (error) {
    console.error('❌ Error al guardar firma:', error);
    res.status(500).json({ mensaje: 'Error al guardar firma', error: error.message });
  }
};

export const obtenerFirmaServidor = async (req, res) => {
  try {
    // ✅ CORRECCIÓN: Usar req.user.uid
    const userId = req.user.uid;
    console.log('🔍 Obteniendo firma para usuario:', userId);

    const usuario = await UsuarioEmbebido.findById(userId, 
      'declaracionInhabilidad ciudadDiligenciamiento fechaDiligenciamiento firmaServidor'
    );
    
    if (!usuario) {
      console.error('❌ Usuario no encontrado con uid:', userId);
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    if (!usuario.firmaServidor) {
      console.log('ℹ️ No hay firma guardada para usuario:', userId);
      return res.status(200).json(null);
    }

    console.log('✅ Firma obtenida para usuario:', userId);
    
    res.status(200).json({
      declaracionInhabilidad: usuario.declaracionInhabilidad,
      ciudadDiligenciamiento: usuario.ciudadDiligenciamiento,
      fechaDiligenciamiento: usuario.fechaDiligenciamiento,
      firmaServidor: usuario.firmaServidor
    });

  } catch (error) {
    console.error('❌ Error al obtener firma:', error);
    res.status(500).json({ mensaje: 'Error al obtener firma', error: error.message });
  }
};

export const eliminarFirmaServidor = async (req, res) => {
  try {
    // ✅ CORRECCIÓN: Usar req.user.uid
    const userId = req.user.uid;
    console.log('🗑️ Eliminando firma para usuario:', userId);

    const usuario = await UsuarioEmbebido.findById(userId);
    
    if (!usuario) {
      console.error('❌ Usuario no encontrado con uid:', userId);
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    if (!usuario.firmaServidor) {
      console.log('ℹ️ No hay firma para eliminar para usuario:', userId);
      return res.status(404).json({ mensaje: 'No se encontró firma para eliminar' });
    }

    // Limpiar campos de firma
    usuario.declaracionInhabilidad = undefined;
    usuario.ciudadDiligenciamiento = undefined;
    usuario.fechaDiligenciamiento = undefined;
    usuario.firmaServidor = undefined;

    await usuario.save();

    console.log('✅ Firma eliminada correctamente para usuario:', userId);
    
    res.status(200).json({ mensaje: 'Firma y declaraciones eliminadas exitosamente' });

  } catch (error) {
    console.error('❌ Error al eliminar firma:', error);
    res.status(500).json({ mensaje: 'Error al eliminar firma', error: error.message });
  }
};

/*import FirmaServidor from '../models/FirmaServidor.js';

export const guardarFirmaServidor = async (req, res) => {
  try {
    const { 
      declaracionInhabilidad,
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

    if (!ciudadDiligenciamiento || !fechaDiligenciamiento || !firmaServidor) {
      return res.status(400).json({ 
        mensaje: 'Todos los campos son obligatorios' 
      });
    }

    console.log('💾 Guardando firma con declaraciones:', {
      userId: req.user.id,
      declaracionInhabilidad,
      ciudadDiligenciamiento
    });

    const data = await FirmaServidor.findOneAndUpdate(
      { user: req.user.id },
      { 
        declaracionInhabilidad,
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
      tieneDeclaraciones: !!(data.declaracionInhabilidad)
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

//Eliminar firma del servidor---DELETE /api/firma-servidor
 
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
};*/