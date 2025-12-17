import Usuario from '../models/Usuario.js'; // Asegúrate de que la ruta a tu modelo sea correcta
import { enviarCorreoUnico } from '../services/emailService.js'; 

export const enviarCampanaNavidad = async (req, res) => {
    try {
        // 1. Obtener todos los usuarios (solo el nombre y el correo)
        const usuarios = await Usuario.find({}, 'nombre email');

        if (!usuarios || usuarios.length === 0) {
            return res.status(404).json({ mensaje: "No hay usuarios registrados para enviar correos." });
        }

        const asunto = "🎄 ¡Feliz Navidad y un Prospero año 2026 te desea el  equipo de   Formato Único en Linea! 🎁";

        // 2. Ejecutar los envíos
        // Usamos Promise.allSettled para que si un correo falla, los demás sigan enviándose
        const promesasEnvio = usuarios.map(usuario => {
            const htmlContent = `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 15px; overflow: hidden;">
                    <div style="background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%); padding: 40px 20px; text-align: center; color: white;">
                        <h1 style="margin: 0; font-size: 28px;">¡Feliz Navidad, ${usuario.nombre}! 🎅</h1>
                    </div>
                    <div style="padding: 30px; background-color: #ffffff; color: #2d3748; line-height: 1.6;">
                        <p>Hola <strong>${usuario.nombre}</strong>,</p>
                        <p>En esta época de reflexión y alegría, queremos agradecerte por confiar en nosotros para construir tu futuro profesional.</p>
                        <p style="background: #fff5f5; padding: 15px; border-left: 4px solid #e53e3e; font-style: italic;">
                            "El éxito es la suma de pequeños esfuerzos repetidos día tras día." 
                        </p>
                        <p>Que el próximo año llegue cargado de nuevas oportunidades laborales y metas cumplidas. ¡Tu hoja de vida está lista para descargar!</p>
                        <div style="text-align: center; margin-top: 30px;">
                            <a href="https://formatounicoenlinea-a17641bda7dd.herokuapp.com/login" style="background-color: #e53e3e; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold;">Actualizar mi CV</a>
                        </div>
                    </div>
                    <div style="background-color: #f7fafc; padding: 20px; text-align: center; font-size: 12px; color: #a0aec0;">
                        <p>© 2025 Hoja de Vida en Formato Único<br>Este es un mensaje automático de temporada.</p>
                    </div>
                </div>
            `;
            return enviarCorreoUnico(usuario.email, asunto, htmlContent);
        });

        const resultados = await Promise.allSettled(promesasEnvio);
        
        const exitosos = resultados.filter(r => r.status === 'fulfilled' && r.value).length;
        const fallidos = usuarios.length - exitosos;

        res.status(200).json({
            mensaje: "Proceso de campaña finalizado",
            estadisticas: {
                totalUsuarios: usuarios.length,
                enviadosConExito: exitosos,
                fallidos: fallidos
            }
        });

    } catch (error) {
        console.error("❌ Error en la campaña navideña:", error);
        res.status(500).json({ mensaje: "Error al procesar el envío masivo." });
    }
};