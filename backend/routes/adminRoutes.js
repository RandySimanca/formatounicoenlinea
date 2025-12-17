// backend/routes/adminRoutes.js

import express from 'express';
import { enviarCampanaNavidad } from '../controllers/emailController.js';
import verificarJWT from '../middlewares/verificarJWT.js';

const router = express.Router();

// Middleware local (no necesita exportarse)
const esAdmin = (req, res, next) => {
    console.log("Roles del usuario detectados:", req.user?.roles);
    const roles = req.user?.roles || [];
    
    if (roles.includes('Administrador') || roles.includes('admin')) {
        next();
    } else {
        res.status(403).json({ 
            mensaje: "Acceso denegado: Se requieren permisos de administrador",
            sus_roles: roles 
        });
    }
};

// Definición de la ruta
router.post('/campana/navidad', verificarJWT, esAdmin, enviarCampanaNavidad);

// Exportación única necesaria
export default router;