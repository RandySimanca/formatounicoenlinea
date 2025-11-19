// backend/controllers/datosPersonalesControllers.js
import UsuarioEmbebido from "../models/UsuarioEmbebido.js";

export const crearDatosPersonales = async (req, res) => {
  try {
    const userId = req.user.uid;
    console.log('📝 Creando datos personales para usuario:', userId);
    
    // Buscar usuario embebido
    const usuario = await UsuarioEmbebido.findById(userId);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar si ya tiene datos personales
    if (usuario.apellido1 && usuario.nombres) {
      console.log('⚠️ El usuario ya tiene datos personales registrados');
      return res.status(409).json({ 
        error: 'Ya existen datos personales para este usuario. Use PUT para actualizar.' 
      });
    }

    // Actualizar campos de datos personales
    Object.assign(usuario, {
      apellido1: req.body.apellido1,
      apellido2: req.body.apellido2,
      nombres: req.body.nombres,
      tipoDocumento: req.body.tipoDocumento,
      numDocumento: req.body.numDocumento,
      sexo: req.body.sexo,
      nacionalidad: req.body.nacionalidad,
      pais: req.body.pais,
      libretaMilitar: req.body.libretaMilitar,
      numeroLibreta: req.body.numeroLibreta,
      dm: req.body.dm,
      fechaNacimiento: req.body.fechaNacimiento,
      direccionCorrespondencia: req.body.direccionCorrespondencia
    });

    await usuario.save();
    
    console.log('✅ Datos personales creados exitosamente');
    
    return res.status(201).json({ 
      mensaje: 'Datos personales guardados correctamente', 
      data: usuario 
    });
  } catch (error) {
    console.error('❌ Error al guardar datos personales:', error);
    return res.status(500).json({ 
      error: 'Error interno al guardar datos personales',
      detalle: error.message 
    });
  }
};

export const obtenerDatosPersonales = async (req, res) => {
  try {
    const userId = req.user.uid;
    console.log('🔍 Buscando datos personales para usuario:', userId);
    
    const usuario = await UsuarioEmbebido.findById(userId, 
      'apellido1 apellido2 nombres tipoDocumento numDocumento sexo nacionalidad pais libretaMilitar numeroLibreta dm fechaNacimiento direccionCorrespondencia'
    );
    
    if (!usuario) {
      console.log('📭 No se encontró el usuario:', userId);
      return res.status(404).json({ 
        mensaje: "Usuario no encontrado" 
      });
    }

    // Verificar si tiene datos personales
    if (!usuario.apellido1 && !usuario.nombres) {
      console.log('📭 No hay datos personales para el usuario:', userId);
      return res.status(404).json({ 
        mensaje: "No hay datos personales registrados para este usuario" 
      });
    }
    
    console.log('✅ Datos personales encontrados');
    res.json(usuario);
  } catch (error) {
    console.error('❌ Error al obtener datos personales:', error);
    res.status(500).json({ 
      mensaje: "Error al obtener datos personales", 
      detalle: error.message 
    });
  }
};

export const actualizarDatosPersonales = async (req, res) => {
  try {
    const userId = req.user.uid;
    console.log('🔄 Actualizando datos personales para usuario:', userId);
    
    const usuario = await UsuarioEmbebido.findById(userId);
    
    if (!usuario) {
      console.log('❌ Usuario no encontrado:', userId);
      return res.status(404).json({ 
        mensaje: "Usuario no encontrado" 
      });
    }

    // Actualizar campos
    Object.assign(usuario, {
      apellido1: req.body.apellido1,
      apellido2: req.body.apellido2,
      nombres: req.body.nombres,
      tipoDocumento: req.body.tipoDocumento,
      numDocumento: req.body.numDocumento,
      sexo: req.body.sexo,
      nacionalidad: req.body.nacionalidad,
      pais: req.body.pais,
      libretaMilitar: req.body.libretaMilitar,
      numeroLibreta: req.body.numeroLibreta,
      dm: req.body.dm,
      fechaNacimiento: req.body.fechaNacimiento,
      direccionCorrespondencia: req.body.direccionCorrespondencia
    });

    await usuario.save();

    console.log('✅ Datos personales actualizados exitosamente');
    
    res.status(200).json({
      mensaje: "Datos personales actualizados correctamente",
      data: usuario
    });
  } catch (error) {
    console.error('❌ Error al actualizar datos personales:', error);
    res.status(500).json({ 
      mensaje: "Error al actualizar datos personales", 
      error: error.message 
    });
  }
};