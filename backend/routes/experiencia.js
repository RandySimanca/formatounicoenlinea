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


/*import express from 'express';
import { 
  guardarExperiencia,
  obtenerExperiencias,
  eliminarExperiencia,
  actualizarExperiencia
} from '../controllers/experienciaControllers.js';
import auth from '../middlewares/auth.js';
import verificarJWT from '../middlewares/verificarJWT.js';

const router = express.Router();

// CRUD completo para experiencias
router.post('/', auth, guardarExperiencia);           // Crear
router.get('/', auth, obtenerExperiencias);           // Leer
router.put('/:id', auth, actualizarExperiencia);      // Actualizar
router.delete('/:id', auth, eliminarExperiencia);     // Eliminar

export default router;*/