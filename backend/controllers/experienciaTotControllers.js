// backend/controllers/experienciaTotControllers.js
import UsuarioEmbebido from "../models/UsuarioEmbebido.js";

export const guardarExperienciaTot = async (req, res) => {
  try {
    const { experienciaPublica, experienciaPrivada, ciudadDiligenciamiento, fechaDiligenciamiento, firmaBase64 } = req.body;
    const userId = req.user.id;

    console.log('💾 Guardando resumen de experiencia para usuario:', userId);

    const usuario = await UsuarioEmbebido.findById(userId);

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    // Actualizar campos de resumen de experiencia
    // Nota: Estos campos podrían agregarse al esquema si son necesarios
    // Por ahora, los guardamos en campos existentes o creamos nuevos
    usuario.ciudadDiligenciamiento = ciudadDiligenciamiento;
    usuario.fechaDiligenciamiento = fechaDiligenciamiento;
    
    // Si necesitas guardar experienciaPublica y experienciaPrivada,
    // deberás agregarlos al esquema de UsuarioEmbebido

    await usuario.save();

    console.log('✅ Resumen de experiencia guardado correctamente');

    res.status(200).json({ 
      mensaje: "Resumen guardado correctamente", 
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
    const userId = req.user.id;
    console.log('🔍 Obteniendo resumen de experiencia para usuario:', userId);

    const usuario = await UsuarioEmbebido.findById(userId, 
      'ciudadDiligenciamiento fechaDiligenciamiento'
    );

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    if (!usuario.ciudadDiligenciamiento && !usuario.fechaDiligenciamiento) {
      return res.status(404).json({ mensaje: "No hay resumen registrado" });
    }

    console.log('✅ Resumen de experiencia encontrado');
    res.json(usuario);
  } catch (error) {
    console.error("❌ Error al obtener resumen:", error);
    res.status(500).json({ 
      mensaje: "Error al obtener resumen",
      error: error.message 
    });
  }
};

/*import ExperienciaTot from "../models/ExperienciaTot.js";
import ResumenExperiencia from "../models/ExperienciaTot.js";

export const guardarExperienciaTot = async (req, res) => {
  try {
    const { experienciaPublica, experienciaPrivada, ciudadDiligenciamiento, fechaDiligenciamiento, firmaBase64 } = req.body;
    const userId = req.user.id;

    const resumenExistente = await ResumenExperiencia.findOne({ user: userId });

    if (resumenExistente) {
      // Si ya existe, actualiza
      resumenExistente.experienciaPublica = experienciaPublica;
      resumenExistente.experienciaPrivada = experienciaPrivada;
      resumenExistente.ciudadDiligenciamiento = ciudadDiligenciamiento;
      resumenExistente.fechaDiligenciamiento = fechaDiligenciamiento;
      resumenExistente.firmaBase64 = firmaBase64;
      await resumenExistente.save();

      return res.json({ mensaje: "Resumen actualizado correctamente", data: resumenExistente });
    }

    // Si no existe, crea nuevo
    const nuevoResumen = await ExperienciaTot.create({
      user: userId,
      experienciaPublica,
      experienciaPrivada,
      ciudadDiligenciamiento,
      fechaDiligenciamiento,
      firmaBase64
    });

    res.status(201).json({ mensaje: "Resumen guardado correctamente", data: nuevoResumen });

  } catch (error) {
    console.error("❌ Error al guardar resumen:", error);
    res.status(500).json({ mensaje: "Error al guardar el resumen", error });
  }
};

export const obtenerExperienciaTot = async (req, res) => {
  try {
    const resumen = await ExperienciaTot.findOne({ user: req.user.id });
    if (!resumen) {
      return res.status(404).json({ mensaje: "No hay resumen registrado" });
    }

    res.json(resumen);
  } catch (error) {
    console.error("❌ Error al obtener resumen:", error);
    res.status(500).json({ mensaje: "Error al obtener resumen" });
  }
};*/
