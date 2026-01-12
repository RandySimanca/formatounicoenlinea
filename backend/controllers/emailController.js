import Usuario from '../models/UsuarioEmbebido.js'; 
import { enviarCorreoUnico } from '../services/emailService.js'; 

export const enviarCampanaNavidad = async (req, res) => {
    try {
        const usuarios = await Usuario.find({}, 'nombre email');
        
        if (!usuarios || usuarios.length === 0) {
            return res.status(404).json({ mensaje: "No hay usuarios en la base de datos" });
        }

        const asunto = "🎄 ¡Felices Fiestas y un Próspero 2026! 🎁";

        const promesasEnvio = usuarios.map(usuario => {
            const htmlContent = `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 30px; border-radius: 12px; background-color: #ffffff;">
                    <h2 style="color: #d32f2f; text-align: center;">¡Hola, ${usuario.nombre}! 🎅</h2>
                    <p style="font-size: 16px; text-align: center;">
                        En esta época de unión y gratitud, todo el equipo de <strong>Formato Único en Línea</strong> quiere agradecerte por confiar en nosotros durante este año.
                    </p>
                    <p style="font-size: 18px; font-weight: bold; text-align: center; color: #1b5e20; margin: 25px 0;">
                        ¡Te deseamos una Feliz Navidad y un próspero año 2026 lleno de salud, éxitos y nuevas oportunidades!
                    </p>
                    <div style="text-align: center; margin: 30px 0;">
                        <p style="font-size: 15px; color: #555;">Sigue gestionando tus procesos en nuestra plataforma:</p>
                        <a href="https://formatounicoenlinea-a17641bda7dd.herokuapp.com/login" 
                           style="background-color: #d32f2f; color: white; padding: 12px 25px; text-decoration: none; font-weight: bold; border-radius: 5px; display: inline-block;">
                           Ir a Formato Único en Línea
                        </a>
                    </div>
                    <div style="border-top: 2px solid #f0f0f0; margin-top: 30px; padding-top: 20px;">
                        <p style="color: #555; margin: 0; font-size: 15px;">
                            Atentamente,<br>
                            <span style="font-size: 16px; color: #222;"><strong>Randy Simanca</strong></span><br>
                            <span style="color: #777;">Soporte Técnico</span><br>
                            <span style="color: #d32f2f;">💬</span> <strong>314-5193285</strong><br>
                            <small style="color: #999;">Equipo de Formato Único en Línea</small>
                        </p>
                    </div>
                </div>
            `;
            return enviarCorreoUnico(usuario.email, asunto, htmlContent);
        });

        const resultados = await Promise.allSettled(promesasEnvio);
        
        // CORRECCIÓN AQUÍ: Contamos correctamente
        const finalExitos = resultados.filter(r => r.status === 'fulfilled').length;
        const finalFallidos = resultados.filter(r => r.status === 'rejected').length;

        console.log(`✅ Resumen: ${finalExitos} exitosos, ${finalFallidos} fallidos.`);

        res.status(200).json({ 
            mensaje: "Campaña procesada", 
            detalles: { enviados: finalExitos, errores: finalFallidos } 
        });

    } catch (error) {
        console.error("Error en campaña:", error);
        res.status(500).json({ mensaje: "Error interno" });
    }
};