// backend/app.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import cors from "cors";

// --- Configuración inicial ---
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- MongoDB Connection ---
const MONGODB_URI = process.env.MONGODB_URI;
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ MongoDB conectado exitosamente"))
  .catch((err) => console.error("❌ Error al conectar a MongoDB:", err));

// --- Importar rutas API ---
import formacionAcademicaRoutes from "./routes/formacionAcademica.js";
import experienciaRoutes from "./routes/experiencia.js";
import hojaRoutes from "./routes/hojaVidaRoutes.js";
import usuariosRoute from "./routes/usuarios.js";
import loginRoute from "./routes/login.js";
import datosPersonalesRoute from "./routes/datosPersonales.js";
import experienciaTotRoutes from "./routes/experienciaTot.js";
import pdfRoutes from "./routes/pdf.js";
import idiomasRoutes from "./routes/idiomas.js";
import firmaServidorRoutes from "./routes/firmaServidor.js";
import recoveryRoutes from "./routes/recovery.js";

// --- Usar rutas API ---
app.use("/api/formacion-academica", formacionAcademicaRoutes);
app.use("/api/experiencia", experienciaRoutes);
app.use("/api/hoja-vida", hojaRoutes);
app.use("/api/usuarios", usuariosRoute);
app.use("/api/login", loginRoute);
app.use("/api/datos-personales", datosPersonalesRoute);
app.use("/api/experiencia-tot", experienciaTotRoutes);
app.use("/api/pdf", pdfRoutes);
app.use("/api/idiomas", idiomasRoutes);
app.use("/api/firma-servidor", firmaServidorRoutes);
app.use("/api/recovery", recoveryRoutes);

// --- Endpoint de salud (para monitoreo externo tipo UptimeRobot) ---
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()) + 's',
    env: process.env.NODE_ENV || 'development'
  });
});

// --- Servir archivos estáticos del frontend ---
const frontendPath = path.join(__dirname, "../frontend/dist");

// ✅ Verificar si existe el directorio del frontend
if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));

  // Rutas específicas para SEO
  app.get("/robots.txt", (req, res) => {
    const robotsPath = path.join(frontendPath, "robots.txt");
    if (fs.existsSync(robotsPath)) {
      res.type("text/plain");
      res.sendFile(robotsPath);
    } else {
      res.status(404).send("robots.txt not found");
    }
  });

  app.get("/sitemap.xml", (req, res) => {
    const sitemapPath = path.join(frontendPath, "sitemap.xml");
    if (fs.existsSync(sitemapPath)) {
      res.type("application/xml");
      res.sendFile(sitemapPath);
    } else {
      res.status(404).send("sitemap.xml not found");
    }
  });

  // Redirigir todas las rutas no API al frontend
  app.get("*", (req, res) => {
    if (!req.path.startsWith("/api")) {
      res.sendFile(path.join(frontendPath, "index.html"));
    }
  });
} else {
  console.log("⚠️ No se encontró el directorio del frontend");

  app.get("/", (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head><title>Hoja de Vida - Error de Configuración</title></head>
      <body>
        <h1>⚠️ Error de Configuración</h1>
        <p>El frontend no se ha encontrado, pero el backend está funcionando correctamente.</p>
      </body>
      </html>
    `);
  });
}

// --- Configurar puerto ---
const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor iniciado con éxito`);
  console.log(`📡 Puerto: ${PORT}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 MongoDB URI presente: ${!!MONGODB_URI}`);
  console.log(`📧 Email Bridge URL presente: ${!!process.env.EMAIL_BRIDGE_URL}`);

  if (fs.existsSync(frontendPath)) {
    console.log(`📁 Sirviendo frontend desde: ${frontendPath}`);
  } else {
    console.warn("⚠️ Advertencia: No se encontró el directorio del frontend");
  }

  // --- Keep-Alive Interno (respaldo) ---
  // NOTA: En Render plan gratuito, este ping interno NO evita el sleep.
  // Para evitar el sleep real, usar UptimeRobot apuntando a /health
  // URL: https://formatounicoenlinea.onrender.com/health
  const SERVER_URL = process.env.SERVER_URL || 'https://formatounicoenlinea.onrender.com';
  const HEALTH_URL = `${SERVER_URL}/health`;
  if (process.env.NODE_ENV === 'production' || process.env.KEEP_ALIVE === 'true') {
    console.log(`⏰ Keep-alive interno activado para: ${HEALTH_URL}`);
    console.log(`💡 Para evitar el sleep en Render, configura UptimeRobot en: ${HEALTH_URL}`);
    setInterval(() => {
      fetch(HEALTH_URL)
        .then(res => res.json())
        .then(data => console.log(`✅ Keep-alive OK: ${data.timestamp}`))
        .catch(err => console.error(`❌ Error en keep-alive: ${err.message}`));
    }, 14 * 60 * 1000); // cada 14 minutos
  }
});

export default app;