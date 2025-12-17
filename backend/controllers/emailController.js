import Usuario from '../models/UsuarioEmbebido.js'; 
import { enviarCorreoUnico } from '../services/emailService.js'; 

export const enviarCampanaNavidad = async (req, res) => {
    try {
        const usuarios = await Usuario.find({}, 'nombre email');
        if (!usuarios || usuarios.length === 0) {
            return res.status(404).json({ mensaje: "No hay usuarios" });
        }

        const asunto = "🎄 ¡Felices Fiestas! 🎁";
        const promesasEnvio = usuarios.map(usuario => {
            const htmlContent = `<h1>Hola ${usuario.nombre}, Feliz Navidad</h1>`;
            return enviarCorreoUnico(usuario.email, asunto, htmlContent);
        });

        await Promise.allSettled(promesasEnvio);
        res.status(200).json({ mensaje: "Campaña enviada" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ mensaje: "Error interno" });
    }
};