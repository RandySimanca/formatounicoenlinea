// backend/routes/adminRoutes.js
import express from 'express';
import { enviarCampanaNavidad } from '../controllers/emailController.js';

// CORRECCIÓN 1: Importamos el valor por defecto (sin llaves) y le damos el nombre del archivo
import verificarJWT from '../middlewares/verificarJWT.js'; 

const router = express.Router();

// Middleware para verificar que el rol sea admin
const esAdmin = (req, res, next) => {
    // Usamos .uid y .roles porque así los definiste en verificarJWT.js
    if (req.user && req.user.roles && req.user.roles.includes('admin')) {
        next();
    } else {
        res.status(403).json({ mensaje: "Acceso denegado: Se requieren permisos de administrador" });
    }
};

// CORRECCIÓN 2: Usar el nombre correcto de la función 'enviarCampanaNavidad'
router.post('/campana/navidad', verificarJWT, esAdmin, enviarCampanaNavidad);

export default router;
