// backend/app.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import cors from "cors"; // ✅ Importar cors
import recoveryRoutes from "./routes/recovery.js";

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

dotenv.config();
const app = express();

// --- Middleware CORS (antes de rutas) ---
app.use(cors({
  origin: 'http://localhost:5173', // tu frontend local
  credentials: true
}));

// --- Middleware global ---
app.use(express.json());

// --- Conexión MongoDB Mejorada ---
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!MONGODB_URI) {
  console.error("❌ ERROR: No se encontró MONGODB_URI en las variables de entorno");
} else {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log("✅ MongoDB conectado"))
    .catch((err) => console.error("❌ Error en MongoDB:", err.message));
}

// --- Rutas API ---
app.use("/api/formacion-academica", formacionAcademicaRoutes);
app.use("/api/experiencia", experienciaRoutes);
app.use("/api/experiencia-tot", experienciaTotRoutes);
app.use("/api/usuarios", usuariosRoute);
app.use("/api/login", loginRoute);
app.use("/api/datos-personales", datosPersonalesRoute);
app.use("/api/pdf", pdfRoutes);
app.use("/api", hojaRoutes);
app.use("/api/idiomas", idiomasRoutes);
app.use("/api/firma-servidor", firmaServidorRoutes);
app.use("/api/recovery", recoveryRoutes);

// --- Configuración de frontend MEJORADA ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const possiblePaths = [
  path.resolve(__dirname, "../frontend/dist"),
  path.resolve(__dirname, "./frontend/dist"),
  path.resolve(__dirname, "../dist"),
  path.resolve(__dirname, "./dist"),
  path.resolve(process.cwd(), "frontend/dist"),
  path.resolve(process.cwd(), "dist")
];

let frontendPath = null;

// Buscar la ruta correcta
for (const possiblePath of possiblePaths) {
  try {
    if (fs.existsSync(possiblePath) && fs.existsSync(path.join(possiblePath, "index.html"))) {
      frontendPath = possiblePath;
      console.log(`✅ Frontend encontrado en: ${frontendPath}`);
      break;
    }
  } catch (error) {
    console.log(`❌ Ruta no válida: ${possiblePath}`);
  }
}

// Servir archivos estáticos si se encontró el frontend
if (frontendPath) {
  app.use(express.static(frontendPath));

  // Rutas específicas para SEO (antes del catch-all)
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
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log("🌐 Modo: API + Frontend");
});

export default app;