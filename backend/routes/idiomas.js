// backend/routes/idiomas.js
import express from 'express';
import IdiomasController from '../controllers/idiomaController.js';
import { validarIdiomas } from '../middlewares/idiomasValidations.js';
import verificarJWT from '../middlewares/verificarJWT.js';

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(verificarJWT);

// GET /api/idiomas/estadisticas - Obtener estadísticas (debe ir ANTES de /:id)
router.get('/estadisticas', IdiomasController.obtenerEstadisticas);

// GET /api/idiomas - Obtener idiomas del usuario
router.get('/', IdiomasController.obtenerIdiomas);

// POST /api/idiomas - Crear nuevo documento de idiomas
router.post('/', validarIdiomas, IdiomasController.crearIdiomas);

// PUT /api/idiomas - Actualizar idiomas existentes (sin :id porque usamos el usuario del token)
router.put('/', validarIdiomas, IdiomasController.actualizarIdiomas);

// DELETE /api/idiomas - Eliminar idiomas (sin :id porque usamos el usuario del token)
router.delete('/', IdiomasController.eliminarIdiomas);

export default router;


/*import express from 'express';
import IdiomasController from '../controllers/idiomaController.js';
import { validarIdiomas } from '../middlewares/idiomasValidations.js';
import verificarJWT from '../middlewares/verificarJWT.js'; // Middleware de autenticación

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(verificarJWT);

// GET /api/idiomas - Obtener idiomas del usuario
router.get('/', IdiomasController.obtenerIdiomas);

// GET /api/idiomas/estadisticas - Obtener estadísticas
router.get('/estadisticas', IdiomasController.obtenerEstadisticas);

// POST /api/idiomas - Crear nuevo documento de idiomas
router.post('/', validarIdiomas, IdiomasController.crearIdiomas);

// PUT /api/idiomas/:id - Actualizar idiomas existentes
router.put('/:id', validarIdiomas, IdiomasController.actualizarIdiomas);

// DELETE /api/idiomas/:id - Eliminar documento completo
router.delete('/:id', IdiomasController.eliminarIdiomas);

export default router;*/
