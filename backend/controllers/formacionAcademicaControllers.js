// controllers/formacionAcademicaControllers.js
import UsuarioEmbebido from "../models/UsuarioEmbebido.js";

/**
 * Obtener formación académica del usuario
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
      formacionSuperior: usuario.formacionSuperior || []
    };

    console.log(`✅ Formación obtenida: ${datos.formacionSuperior.length} formaciones`);

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
 * Crear o actualizar formación académica
 */
export const actualizarFormacionAcademica = async (req, res) => {
  try {
    const userId = req.user.uid;
    const body = req.body;

    console.log("📥 Actualizando formación académica:", body);

    const usuario = await UsuarioEmbebido.findById(userId);
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    usuario.gradoBasica = body.gradoBasica;
    usuario.tituloBachiller = body.tituloBachiller;
    usuario.mesGrado = body.mesGrado;
    usuario.anioGrado = body.anioGrado;

    // Aceptar tanto formacionSuperior como educacionSuperior para compatibilidad
    const formaciones = body.formacionSuperior || body.educacionSuperior;
    if (formaciones) {
      const limpias = formaciones.filter(f => {
        return f.modalidad?.trim() || f.titulo?.trim() || f.semestres?.trim();
      });

      usuario.formacionSuperior = limpias;

      console.log(`✅ Guardando ${limpias.length} formaciones superiores`);
    }

    await usuario.save();

    res.json({
      mensaje: "Formación académica actualizada correctamente",
      data: {
        _id: usuario._id,
        gradoBasica: usuario.gradoBasica,
        tituloBachiller: usuario.tituloBachiller,
        mesGrado: usuario.mesGrado,
        anioGrado: usuario.anioGrado,
        formacionSuperior: usuario.formacionSuperior
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

    console.log("➕ Agregando educación superior:", req.body);

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
 * Eliminar formación superior por ID
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

    usuario.formacionSuperior = usuario.formacionSuperior.filter(f => f._id.toString() !== subId);

    const despues = usuario.formacionSuperior.length;

    if (antes === despues) {
      return res.status(404).json({
        mensaje: "Formación superior no encontrada",
        subId
      });
    }

    await usuario.save();

    res.json({
      mensaje: "Formación superior eliminada correctamente",
      data: usuario.formacionSuperior
    });

  } catch (error) {
    console.error("❌ Error al eliminar formación superior:", error);
    res.status(500).json({
      mensaje: "Error al eliminar formación superior",
      detalle: error.message
    });
  }
};