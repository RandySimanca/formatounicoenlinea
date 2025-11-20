//backend/routes/experiencia.js
import express from 'express';
import {
  agregarExperiencia,
  obtenerExperiencias,
  eliminarExperiencia,
  actualizarExperiencia
} from '../controllers/experienciaControllers.js';
import verificarJWT from '../middlewares/verificarJWT.js';

const router = express.Router();

// CRUD completo para experiencias (usando modelo embebido)
router.post('/', verificarJWT, agregarExperiencia);           // Crear
router.get('/', verificarJWT, obtenerExperiencias);           // Leer
router.put('/:id', verificarJWT, actualizarExperiencia);      // Actualizar
router.delete('/:id', verificarJWT, eliminarExperiencia);     // Eliminar

export default router;