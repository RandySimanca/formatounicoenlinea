//routes/formacionAcademica.js
import express from "express";
import {
  obtenerFormacionAcademica,
  actualizarFormacionAcademica,
  agregarFormacionSuperior,
  eliminarFormacionSuperior
} from "../controllers/formacionAcademicaControllers.js";
import verificarJWT from "../middlewares/verificarJWT.js"; // ✅ nombre correcto

const router = express.Router();

// 🔍 Ruta de prueba
router.get("/test", (req, res) => {
  res.send("🚀 Ruta de formación académica embebida activa");
});

// 📘 Obtener formación académica completa (básica + superior)
router.get("/", verificarJWT, obtenerFormacionAcademica);

// 🔄 Actualizar formación académica completa
router.put("/", verificarJWT, actualizarFormacionAcademica);

// ➕ Agregar una formación superior (universitaria, técnica, etc.)
router.post("/superior", verificarJWT, agregarFormacionSuperior);

// 🗑️ Eliminar una formación superior específica
router.delete("/superior/:subId", verificarJWT, eliminarFormacionSuperior);

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