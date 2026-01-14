// backend/scripts/testEmail.js
import dotenv from 'dotenv';
import { enviarCodigoRecuperacion } from '../services/emailService.js';

dotenv.config();

const testEmail = async () => {
    const email = process.env.EMAIL_USER; // Enviar a sí mismo para probar
    console.log(`🚀 Iniciando prueba de envío de correo a: ${email}`);

    if (!email) {
        console.error("❌ Error: EMAIL_USER no está definido en el entorno.");
        return;
    }

    try {
        const resultado = await enviarCodigoRecuperacion(email, "123456", "Usuario de Prueba");
        if (resultado.success) {
            console.log("✅ ¡Prueba exitosa! El correo fue aceptado por el servidor SMTP.");
        } else {
            console.error("❌ La prueba falló.");
            console.error("Detalle del error:", resultado.error);
        }
    } catch (error) {
        console.error("❌ Error inesperado durante la prueba:", error);
    }
};

testEmail();
