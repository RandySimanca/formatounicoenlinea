// backend/routes/usuarios.js
import express from 'express';
import { registrarUsuario } from '../controllers/authController.js';
import UsuarioEmbebido from '../models/UsuarioEmbebido.js';

const router = express.Router();

router.post('/', registrarUsuario);

// Endpoint público para contar usuarios
router.get('/count', async (req, res) => {
  try {
    const totalUsuarios = await UsuarioEmbebido.countDocuments();
    res.json({ success: true, total: totalUsuarios });
  } catch (error) {
    console.error('❌ Error al contar usuarios:', error);
    res.status(500).json({ success: false, message: 'Error al contar usuarios' });
  }
});

export default router;