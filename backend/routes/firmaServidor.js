// backend/routes/firmaServidor.js

import express from "express";
import { 
  guardarFirmaServidor, 
  obtenerFirmaServidor, 
  eliminarFirmaServidor 
} from "../controllers/firmaServidorControllers.js";
import verificarJWT from "../middlewares/verificarJWT.js";

const router = express.Router();

// Aplica autenticación a todas las rutas
router.use(verificarJWT);

// Rutas principales
router.post("/", guardarFirmaServidor);
router.get("/", obtenerFirmaServidor);
router.delete("/", eliminarFirmaServidor);

export default router;