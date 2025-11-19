# 📄 Formato Único de Hoja de Vida – Aplicación Web

Aplicación web full-stack para crear, gestionar y descargar hojas de vida en el **Formato Único** requerido por entidades públicas en Colombia.  
Permite registrar datos personales, formación académica, experiencia laboral, idiomas y generar un PDF profesional.

---

## 🚀 Tecnologías Principales

### **Frontend**
- Vue 3
- Pinia
- Vue Router
- Vite
- Axios
- html2pdf.js
- SweetAlert2

### **Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT para autenticación
- bcryptjs para hashing
- Nodemailer (recuperación de contraseña)
- PDFKit (generación de PDF)

---

## 📌 Funcionalidades

- Autenticación con JWT  
- Registro y actualización de:
  - Datos personales  
  - Formación académica  
  - Experiencia laboral  
  - Idiomas  
- Firma digital del usuario  
- Resumen automático de tiempo en sector público/privado  
- Recuperación de contraseña vía email  
- Generación de PDF listo para imprimir  
- Interfaz responsive para móvil y escritorio  

---

## 📁 Estructura del Proyecto

formatounicoenlinea/
├── backend/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middlewares/
│ ├── config/
│ └── app.js
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── views/
│ │ ├── router/
│ │ ├── stores/
│ │ └── api/
│ └── vite.config.js
│
└── DOCUMENTACION_COMPLETA.md


---

## 🔧 Instalación y Configuración

### 1️⃣ **Clonar repositorio**
```bash
git clone https://github.com/usuario/formatounicoenlinea.git
cd formatounicoenlinea

npm install

MONGO_URI=mongodb://localhost:27017/baseDeDatosHV
JWT_SECRET=tu_secreto_jwt_super_seguro
PORT=4000

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_clave_app

npm run dev

cd frontend
npm install
npm run dev

📌 Scripts Útiles
Backend
npm run dev
npm start


endpoints principales

| Tipo            | Ruta                       | Descripción         |
| --------------- | -------------------------- | ------------------- |
| POST            | `/api/login`               | Iniciar sesión      |
| POST            | `/api/usuarios`            | Registrar usuario   |
| GET/POST        | `/api/datos-personales`    | Datos personales    |
| GET/POST        | `/api/formacion-academica` | Formación           |
| GET/POST/DELETE | `/api/experiencia`         | Experiencia laboral |
| GET/POST        | `/api/idiomas`             | Idiomas             |
| GET             | `/api/pdf/generar`         | Generar PDF         |


Todos los endpoints (excepto login/registro/recovery) requieren:

Authorization: Bearer <token>

🧩 Generación de PDF

El PDF puede generarse desde:

El backend → /api/pdf/generar

La vista de resumen en el frontend → VistaCompleta.vue

📚 Documentación Completa

Toda la documentación técnica está disponible en:

👉 DOCUMENTACION_COMPLETA.md

Incluye:

Arquitectura

Diagramas

API detallada

Modelos de base de datos

Guía de desarrollo

Deploy (Heroku, Railway, Vercel)

Casos de uso

👤 Autor

Randy Simanca Mercado
📧 randysimancamercado@gmail.com

📱 WhatsApp: +57 314 519 3285

🔒 Licencia

Uso privado – todos los derechos reservados.
