//routes/formacionAcademica.js
import express from "express";
import {
  obtenerFormacionAcademica,
  actualizarFormacionAcademica,
  agregarFormacionSuperior,
  eliminarFormacionSuperior
} from "../controllers/formacionAcademicaControllers.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.get("/", authMiddleware, obtenerFormacionAcademica);
router.put("/", authMiddleware, actualizarFormacionAcademica);
router.post("/superior", authMiddleware, agregarFormacionSuperior);
router.delete("/superior/:subId", authMiddleware, eliminarFormacionSuperior);



export default router;

/*import express from 'express';
import {
  crearFormacionAcademica,
  obtenerFormacionAcademica,
  actualizarFormacionAcademica,
  eliminarFormacionAcademica,
  eliminarFormacionSuperior  // 🆕 Importar la nueva función
} from '../controllers/formacionAcademicaControllers.js';
import verificarJWT from '../middlewares/verificarJWT.js';

const router = express.Router();

router.get("/test", (req, res) => {
 res.send("🚀 Ruta de formación académica activa");
});

// CRUD completo
router.post('/', verificarJWT, crearFormacionAcademica);
router.get("/", verificarJWT, obtenerFormacionAcademica);
router.put('/', verificarJWT, actualizarFormacionAcademica);
router.delete('/:id', verificarJWT, eliminarFormacionAcademica);

// 🆕 NUEVA RUTA: Eliminar formación superior específica
router.delete('/:docId/formacion-superior/:subId', verificarJWT, eliminarFormacionSuperior);

export default router;*/