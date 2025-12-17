// backend/routes/adminRoutes.js

const esAdmin = (req, res, next) => {
    // Imprimimos para depurar en los logs de Heroku
    console.log("Roles del usuario:", req.user?.roles);

    const roles = req.user?.roles || [];
    
    // Verificamos si incluye 'Administrador' (exacto como está en tu token)
    if (roles.includes('Administrador') || roles.includes('admin')) {
        next();
    } else {
        res.status(403).json({ 
            mensaje: "Acceso denegado: Se requieren permisos de administrador",
            sus_roles: roles // Esto nos ayudará a ver qué recibió
        });
    }
};

export default router;