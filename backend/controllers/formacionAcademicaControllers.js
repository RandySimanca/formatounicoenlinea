//controllers/formacionAcademicaControllers.js
import UsuarioEmbebido from "../models/UsuarioEmbebido.js";

/**
 * Obtener la formación académica del usuario autenticado
 */
export const obtenerFormacionAcademica = async (req, res) => {
  try {
    const userId = req.user.uid;
    const usuario = await UsuarioEmbebido.findById(userId);

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    const datos = {
      gradoBasica: usuario.gradoBasica,
      tituloBachiller: usuario.tituloBachiller,
      mesGrado: usuario.mesGrado,
      anioGrado: usuario.anioGrado,
      educacionSuperior: usuario.formacionSuperior || [] // 👈 CAMBIO CLAVE
    };

    console.log(`✅ Formación obtenida: ${datos.educacionSuperior.length} formaciones`);

    res.json(datos);
  } catch (error) {
    console.error("❌ Error al obtener formación académica:", error);
    res.status(500).json({
      mensaje: "Error al obtener la formación académica",
      detalle: error.message
    });
  }
};

/**
 * Actualizar formación académica completa
 */
export const actualizarFormacionAcademica = async (req, res) => {
  try {
    const userId = req.user.uid;
    const body = req.body;

    console.log('📥 Actualizando formación para usuario:', userId);

    const usuario = await UsuarioEmbebido.findById(userId);
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    // Actualizar campos principales
    usuario.gradoBasica = body.gradoBasica;
    usuario.tituloBachiller = body.tituloBachiller;
    usuario.mesGrado = body.mesGrado;
    usuario.anioGrado = body.anioGrado;

    // Actualizar educación superior
    if (body.educacionSuperior) {
      const formacionesLimpias = body.educacionSuperior.filter(f =>
        f.modalidad?.trim() || f.titulo?.trim() || f.semestres?.trim()
      );

      usuario.formacionSuperior = formacionesLimpias;  // 👈 GUARDAMOS EN EL MODELO ORIGINAL
      console.log(`✅ Guardando ${formacionesLimpias.length} educaciones superiores`);
    }

    await usuario.save();

    res.json({
      mensaje: "Formación académica actualizada correctamente",
      data: {
        gradoBasica: usuario.gradoBasica,
        tituloBachiller: usuario.tituloBachiller,
        mesGrado: usuario.mesGrado,
        anioGrado: usuario.anioGrado,
        educacionSuperior: usuario.formacionSuperior // 👈 SALIDA UNIFICADA
      }
    });
  } catch (error) {
    console.error("❌ Error al actualizar formación académica:", error);
    res.status(500).json({
      mensaje: "Error al actualizar la formación académica",
      detalle: error.message
    });
  }
};

/**
 * Agregar una nueva educación superior
 */
export const agregarFormacionSuperior = async (req, res) => {
  try {
    const userId = req.user.uid;
    const usuario = await UsuarioEmbebido.findById(userId);

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    usuario.formacionSuperior.push(req.body);
    await usuario.save();

    res.json({
      mensaje: "Educación superior agregada correctamente",
      data: usuario.formacionSuperior
    });
  } catch (error) {
    console.error("❌ Error al agregar educación superior:", error);
    res.status(500).json({
      mensaje: "Error al agregar educación superior",
      detalle: error.message
    });
  }
};

/**
 * Eliminar una educación superior específica
 */
export const eliminarFormacionSuperior = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { subId } = req.params;

    const usuario = await UsuarioEmbebido.findById(userId);
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    const antes = usuario.formacionSuperior.length;

    usuario.formacionSuperior = usuario.formacionSuperior.filter(
      f => f._id.toString() !== subId
    );

    if (antes === usuario.formacionSuperior.length) {
      return res.status(404).json({ mensaje: "Educación superior no encontrada" });
    }

    await usuario.save();

    res.json({
      mensaje: "Educación superior eliminada correctamente",
      data: usuario.formacionSuperior
    });
  } catch (error) {
    console.error("❌ Error al eliminar educación superior:", error);
    res.status(500).json({
      mensaje: "Error al eliminar educación superior",
      detalle: error.message
    });
  }
};


/*import FormacionAcademica from '../models/FormacionAcademica.js';

export const crearFormacionAcademica = async (req, res) => {
  try {
    // 1) Fusiona req.body + req.usuario.uid
    const payload = {
      ...req.body,
      user: req.user.uid
    };
    console.log('🛠 Payload a guardar:', payload);

    // 2) Guarda en MongoDB
    const nuevoRegistro = await FormacionAcademica.create(payload);

    return res.status(201).json({
      mensaje: 'Guardado OK',
      data: nuevoRegistro
    });
  } catch (error) {
    console.error('❌ Error al guardar en MongoDB:', error);
    return res
      .status(500)
      .json({ error: 'Error interno al guardar la formacion academica' });
  }
};

export const obtenerFormacionAcademica = async (req, res) => {
  try {
    const datos = await FormacionAcademica.findOne({ user: req.user.uid });
    if (!datos)
      return res.status(404).json({ mensaje: "No hay formacion academica registrada" });
    res.json(datos);
  } catch (error) {
    res
      .status(500)
      .json({
        mensaje: "Error al obtener la formacion academica",
        detalle: error.message,
      });
  }
};

// Nueva función para actualizar
export const actualizarFormacionAcademica = async (req, res) => {
  try {
    const userId = req.user.uid;
    console.log('🔄 Actualizando para usuario:', userId);

    // Buscar el registro existente
    const formacionExistente = await FormacionAcademica.findOne({ user: userId });
    console.log('📋 Registro encontrado:', formacionExistente ? 'SÍ' : 'NO');

    if (!formacionExistente) {
      console.log('❌ No se encontró registro para actualizar');
      return res.status(404).json({
        mensaje: "No se encontró formación académica para actualizar"
      });
    }

    // Preparar los datos para actualizar
    const datosActualizacion = {
      ...req.body,
      user: userId // Mantener la referencia al usuario
    };

    console.log('🔄 Actualizando con datos:', datosActualizacion);

    // Actualizar el documento
    const formacionActualizada = await FormacionAcademica.findOneAndUpdate(
      { user: userId },
      datosActualizacion,
      {
        new: true, // Retorna el documento actualizado
        runValidators: true // Ejecuta las validaciones del esquema
      }
    );

    console.log('✅ Actualización exitosa, ID:', formacionActualizada._id);

    return res.status(200).json({
      mensaje: 'Formación académica actualizada correctamente',
      data: formacionActualizada
    });

  } catch (error) {
    console.error('❌ Error al actualizar formación académica:', error);
    return res.status(500).json({
      error: 'Error interno al actualizar la formación académica',
      detalle: error.message
    });
  }
};

export const eliminarFormacionAcademica = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await FormacionAcademica.findByIdAndDelete(id);

    if (!eliminado) {
      return res.status(404).json({ mensaje: "Formación no encontrada" });
    }

    res.json({ mensaje: "Formación eliminada correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar formación:", error);
    res.status(500).json({ mensaje: "Error al eliminar formación" });
  }
};

// 🆕 NUEVA FUNCIÓN: Eliminar formación superior específica
export const eliminarFormacionSuperior = async (req, res) => {
  try {
    const { docId, subId } = req.params;
    const userId = req.user.uid;

    console.log('🗑️ Eliminando formación superior:', { docId, subId, userId });

    // Buscar y actualizar el documento principal
    const result = await FormacionAcademica.findOneAndUpdate(
      { 
        _id: docId, 
        user: userId // Verificar que pertenezca al usuario autenticado
      },
      {
        $pull: { 
          formacionesSuperior: { _id: subId } 
        }
      },
      { new: true }
    );

    if (!result) {
      console.log('❌ Documento no encontrado:', { docId, userId });
      return res.status(404).json({ 
        error: 'Documento de formación académica no encontrado o no autorizado',
        docId: docId 
      });
    }

    console.log('✅ Formación superior eliminada exitosamente');

    res.json({ 
      message: 'Formación superior eliminada exitosamente', 
      docId,
      subId,
      updatedDocument: result
    });

  } catch (error) {
    console.error('❌ Error eliminando formación superior:', error);
    res.status(500).json({ error: error.message });
  }
};
*/