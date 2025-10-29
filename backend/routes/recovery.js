// backend/routes/recovery.js
import express from "express";
import {
  solicitarRecuperacion,
  verificarCodigo,
  restablecerPassword,
  obtenerCodigoActual
} from "../controllers/recoveryController.js";

const router = express.Router();

/**
 * @route   POST /api/recovery/solicitar
 * @desc    Solicitar código de recuperación
 * @access  Public
 */
router.post("/solicitar", solicitarRecuperacion);

/**
 * @route   POST /api/recovery/verificar
 * @desc    Verificar código de recuperación
 * @access  Public
 */
router.post("/verificar", verificarCodigo);

/**
 * @route   POST /api/recovery/restablecer
 * @desc    Restablecer contraseña con token
 * @access  Public
 */
router.post("/restablecer", restablecerPassword);

/**
 * @route   GET /api/recovery/codigo-actual
 * @desc    Obtener código actual (solo desarrollo)
 * @access  Public (solo en dev)
 */
router.get("/codigo-actual", obtenerCodigoActual);

export default router;