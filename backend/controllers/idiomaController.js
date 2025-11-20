// backend/controllers/idiomaController.js
import UsuarioEmbebido from '../models/UsuarioEmbebido.js';
import { validationResult } from 'express-validator';

class IdiomasController {
  // Obtener idiomas del usuario autenticado
  static async obtenerIdiomas(req, res) {
    try {
      const usuarioId = req.user.uid;

      const usuario = await UsuarioEmbebido.findById(usuarioId, 'idiomas nombre email');

      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado',
          data: null
        });
      }

      if (!usuario.idiomas || usuario.idiomas.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No se encontraron datos de idiomas para este usuario',
          data: null
        });
      }

      res.status(200).json({
        success: true,
        message: 'Idiomas obtenidos correctamente',
        data: usuario,
        idiomas: usuario.idiomas,
        totalIdiomas: usuario.idiomas.length
      });

    } catch (error) {
      console.error('Error al obtener idiomas:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Crear/actualizar idiomas
  static async crearIdiomas(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
      }

      const usuarioId = req.user.uid;
      const { idiomas } = req.body;

      const usuario = await UsuarioEmbebido.findById(usuarioId);

      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado',
          data: null
        });
      }

      // Validar y limpiar idiomas
      const idiomasLimpios = idiomas
        .filter(idioma => idioma.nombre && idioma.nombre.trim() !== '')
        .map(idioma => ({
          nombre: idioma.nombre.trim(),
          habla: idioma.habla || '',
          lee: idioma.lee || '',
          escribe: idioma.escribe || ''
        }));

      if (idiomasLimpios.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Debe proporcionar al menos un idioma válido',
          data: null
        });
      }

      if (idiomasLimpios.length > 10) {
        return res.status(400).json({
          success: false,
          message: 'No se pueden agregar más de 10 idiomas',
          data: null
        });
      }

      // Actualizar idiomas
      usuario.idiomas = idiomasLimpios;
      await usuario.save();

      res.status(201).json({
        success: true,
        message: `Idiomas guardados correctamente con ${usuario.idiomas.length} idioma(s)`,
        data: usuario,
        totalIdiomas: usuario.idiomas.length
      });

    } catch (error) {
      console.error('Error al crear idiomas:', error);

      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Error de validación',
          errors: Object.values(error.errors).map(err => err.message)
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Actualizar idiomas existentes
  static async actualizarIdiomas(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
      }

      const usuarioId = req.user.uid;
      const { idiomas } = req.body;

      const usuario = await UsuarioEmbebido.findById(usuarioId);

      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado',
          data: null
        });
      }

      // Validar y limpiar idiomas
      const idiomasLimpios = idiomas
        .filter(idioma => idioma.nombre && idioma.nombre.trim() !== '')
        .map(idioma => ({
          nombre: idioma.nombre.trim(),
          habla: idioma.habla || '',
          lee: idioma.lee || '',
          escribe: idioma.escribe || ''
        }));

      // Actualizar idiomas
      usuario.idiomas = idiomasLimpios;
      await usuario.save();

      res.status(200).json({
        success: true,
        message: `Idiomas actualizados correctamente. Total: ${usuario.idiomas.length} idioma(s)`,
        data: usuario,
        totalIdiomas: usuario.idiomas.length
      });

    } catch (error) {
      console.error('Error al actualizar idiomas:', error);

      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Error de validación',
          errors: Object.values(error.errors).map(err => err.message)
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Eliminar todos los idiomas
  static async eliminarIdiomas(req, res) {
    try {
      const usuarioId = req.user.uid;

      const usuario = await UsuarioEmbebido.findById(usuarioId);

      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado',
          data: null
        });
      }

      // Limpiar idiomas
      usuario.idiomas = [];
      await usuario.save();

      res.status(200).json({
        success: true,
        message: 'Idiomas eliminados correctamente',
        data: usuario
      });

    } catch (error) {
      console.error('Error al eliminar idiomas:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Obtener estadísticas de idiomas
  static async obtenerEstadisticas(req, res) {
    try {
      const usuarioId = req.user.uid;

      const usuario = await UsuarioEmbebido.findById(usuarioId, 'idiomas');

      if (!usuario || !usuario.idiomas || usuario.idiomas.length === 0) {
        return res.status(200).json({
          success: true,
          message: 'No hay datos de idiomas',
          estadisticas: {
            totalIdiomas: 0,
            idiomasConNivel: 0,
            nivelesDistribucion: { R: 0, B: 0, MB: 0 }
          }
        });
      }

      const estadisticas = {
        totalIdiomas: usuario.idiomas.length,
        idiomasConNivel: usuario.idiomas.filter(i => i.habla || i.lee || i.escribe).length,
        nivelesDistribucion: {
          R: usuario.idiomas.filter(i => i.habla === 'R' || i.lee === 'R' || i.escribe === 'R').length,
          B: usuario.idiomas.filter(i => i.habla === 'B' || i.lee === 'B' || i.escribe === 'B').length,
          MB: usuario.idiomas.filter(i => i.habla === 'MB' || i.lee === 'MB' || i.escribe === 'MB').length
        }
      };

      res.status(200).json({
        success: true,
        message: 'Estadísticas obtenidas correctamente',
        estadisticas
      });

    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

export default IdiomasController;