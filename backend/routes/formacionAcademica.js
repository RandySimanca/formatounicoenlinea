// routes/formacionAcademica.js
import express from "express";
import {
  obtenerFormacionAcademica,
  actualizarFormacionAcademica,
  agregarFormacionSuperior,
  eliminarFormacionSuperior
} from "../controllers/formacionAcademicaControllers.js";
import verificarJWT from "../middlewares/verificarJWT.js";

const router = express.Router();

// Ruta de prueba
router.get("/test", (req, res) => {
  res.send("🚀 Ruta de formación académica embebida activa");
});

// Obtener formación académica
router.get("/", verificarJWT, obtenerFormacionAcademica);

// Crear o actualizar formación académica (POST y PUT usan la misma lógica)
router.post("/", verificarJWT, actualizarFormacionAcademica);
router.put("/", verificarJWT, actualizarFormacionAcademica);

// Agregar formación superior
router.post("/superior", verificarJWT, agregarFormacionSuperior);

// Eliminar formación superior
router.delete("/superior/:subId", verificarJWT, eliminarFormacionSuperior);

export default router;