// backend/controllers/experienciaController.js

import UsuarioEmbebido from '../models/UsuarioEmbebido.js';

export const agregarExperiencia = async (req, res) => {
  try {
    const usuario = await UsuarioEmbebido.findByIdAndUpdate(
      req.user.uid, // ✅ corregido
      { $push: { experiencias: req.body } },
      { new: true, select: 'experiencias' }
    );

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(201).json({
      mensaje: 'Experiencia agregada correctamente',
      experiencias: usuario.experiencias
    });
  } catch (error) {
    console.error('❌ Error al agregar experiencia:', error);
    res.status(500).json({ error: 'Error al agregar experiencia' });
  }
};

export const obtenerExperiencias = async (req, res) => {
  try {
    const usuario = await UsuarioEmbebido.findById(req.user.uid, 'experiencias'); // ✅ corregido

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Ordenar por fecha de retiro descendente
    const experienciasOrdenadas = usuario.experiencias.sort((a, b) =>
      new Date(b.fechaRetiro) - new Date(a.fechaRetiro)
    );

    res.json(experienciasOrdenadas);
  } catch (error) {
    console.error('❌ Error al obtener experiencias:', error);
    res.status(500).json({ error: 'Error al obtener experiencias' });
  }
};

export const actualizarExperiencia = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await UsuarioEmbebido.findOneAndUpdate(
      {
        _id: req.user.uid, // ✅ corregido
        'experiencias._id': id
      },
      {
        $set: { 'experiencias.$': { _id: id, ...req.body } }
      },
      { new: true, select: 'experiencias' }
    );

    if (!usuario) {
      return res.status(404).json({ error: 'Experiencia no encontrada' });
    }

    res.json({
      mensaje: 'Experiencia actualizada correctamente',
      experiencia: usuario.experiencias.id(id)
    });
  } catch (error) {
    console.error('❌ Error al actualizar experiencia:', error);
    res.status(500).json({ error: 'Error al actualizar experiencia' });
  }
};

export const eliminarExperiencia = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await UsuarioEmbebido.findByIdAndUpdate(
      req.user.uid, // ✅ corregido
      { $pull: { experiencias: { _id: id } } },
      { new: true, select: 'experiencias' }
    );

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({
      mensaje: 'Experiencia eliminada correctamente',
      id
    });
  } catch (error) {
    console.error('❌ Error al eliminar experiencia:', error);
    res.status(500).json({ error: 'Error al eliminar experiencia' });
  }
};