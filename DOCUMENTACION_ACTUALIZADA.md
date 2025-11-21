# 📚 Documentación Completa del Proyecto
## Sistema de Hoja de Vida en Formato Único

**Versión:** 1.0.0  
**Fecha:** 2024  
**Autor:** Sistema de Hojas de Vida

---

## 📋 Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Instalación y Configuración](#instalación-y-configuración)
4. [Estructura del Proyecto](#estructura-del-proyecto)
5. [Documentación de API](#documentación-de-api)
6. [Componentes Vue](#componentes-vue)
7. [Base de Datos](#base-de-datos)
8. [Guías de Desarrollo](#guías-de-desarrollo)
9. [Despliegue](#despliegue)
10. [Casos de Uso](#casos-de-uso)
11. [Diagramas](#diagramas)

---

## 1. Descripción General

### 1.1 Propósito

El Sistema de Hoja de Vida en Formato Único es una aplicación web full-stack diseñada para permitir a los usuarios crear, gestionar y descargar sus hojas de vida en un formato estandarizado. La aplicación facilita el proceso de registro de información personal, formación académica, experiencia laboral e idiomas, permitiendo generar un documento PDF profesional.

### 1.2 Características Principales

- ✅ **Autenticación de usuarios**: Sistema de registro e inicio de sesión con JWT
- ✅ **Gestión de datos personales**: Formulario completo para información personal
- ✅ **Formación académica**: Registro de estudios básicos y superiores
- ✅ **Experiencia laboral**: Gestión de múltiples experiencias laborales
- ✅ **Resumen de Experiencia**: Cálculo automático de tiempo total de experiencia (pública/privada)
- ✅ **Firma del Servidor**: Gestión de firma digitalizada
- ✅ **Idiomas**: Registro de competencias lingüísticas
- ✅ **Generación de PDF**: Exportación de la hoja de vida completa en formato PDF
- ✅ **Interfaz responsive**: Diseño adaptable para dispositivos móviles y desktop
- ✅ **Recuperación de contraseña**: Sistema de recuperación mediante email

### 1.3 Tecnologías Utilizadas

#### Frontend
- **Vue.js 3.3.4**: Framework JavaScript progresivo
- **Vue Router 4.5.1**: Enrutamiento del lado del cliente
- **Pinia 2.3.1**: Gestión de estado
- **Axios 1.11.0**: Cliente HTTP para peticiones API
- **Vite 5.4.19**: Herramienta de construcción
- **html2pdf.js 0.12.0**: Generación de PDFs desde HTML
- **SweetAlert2 11.22.5**: Alertas y notificaciones

#### Backend
- **Node.js**: Entorno de ejecución JavaScript
- **Express 4.19.2**: Framework web
- **MongoDB**: Base de datos NoSQL
- **Mongoose 8.4.1**: ODM para MongoDB
- **JWT (jsonwebtoken 9.0.2)**: Autenticación basada en tokens
- **bcryptjs 2.4.3**: Encriptación de contraseñas
- **Nodemailer 7.0.10**: Envío de emails
- **PDFKit 0.15.0**: Generación de PDFs en el servidor

---

## 2. Arquitectura del Sistema

### 2.1 Arquitectura General

El sistema sigue una arquitectura **MVC (Modelo-Vista-Controlador)** con separación clara entre frontend y backend:

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Vue.js)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Componentes │  │    Stores     │  │    Router    │ │
│  │     Vue       │  │    (Pinia)    │  │   (Vue)      │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
                        ↕ HTTP/REST API
┌─────────────────────────────────────────────────────────┐
│                    BACKEND (Express)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  Controllers │  │    Routes     │  │  Middlewares │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│  ┌──────────────┐  ┌──────────────┐                   │
│  │    Models    │  │   Database    │                   │
│  │  (Mongoose)  │  │   (MongoDB)   │                   │
│  └──────────────┘  └──────────────┘                   │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Flujo de Datos

1. **Usuario interactúa** con la interfaz Vue.js
2. **Componente Vue** realiza petición HTTP mediante Axios
3. **Middleware de autenticación** valida el token JWT
4. **Controller** procesa la lógica de negocio
5. **Model** interactúa con MongoDB
6. **Respuesta** se envía de vuelta al frontend
7. **Store (Pinia)** actualiza el estado global
8. **Componente** se re-renderiza con los nuevos datos

### 2.3 Patrón de Datos Embebido

El sistema utiliza un **modelo embebido** donde toda la información del usuario (datos personales, formación, experiencias, idiomas, firma) se almacena en un único documento `UsuarioEmbebido` en MongoDB. Esto optimiza las consultas y reduce la complejidad de las relaciones.

---

## 3. Instalación y Configuración

### 3.1 Requisitos Previos

- **Node.js** >= 18.0.0
- **npm** o **yarn**
- **MongoDB** (local o MongoDB Atlas)
- **Git**

### 3.2 Instalación del Proyecto

#### Paso 1: Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd formatounicoenlinea
```

#### Paso 2: Instalar dependencias del backend
```bash
npm install
```

#### Paso 3: Instalar dependencias del frontend
```bash
cd frontend
npm install
cd ..
```

### 3.3 Configuración de Variables de Entorno

#### Backend (.env)

Crear archivo `.env` en la raíz del proyecto:

```env
# MongoDB
MONGO_URI=mongodb://localhost:27017/baseDeDatosHV
# O para MongoDB Atlas:
# MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/baseDeDatosHV

# JWT
JWT_SECRET=tu_secreto_jwt_muy_seguro_aqui_minimo_32_caracteres

# Servidor
PORT=4000
NODE_ENV=development

# Email (para recuperación de contraseña)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_contraseña_de_aplicacion
```

#### Frontend

El frontend se conecta automáticamente al backend. Si el backend está en un puerto diferente, editar `frontend/src/api/axios.js`:

```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  // ...
});
```

### 3.4 Ejecución en Desarrollo

#### Backend
```bash
npm run dev
# O
nodemon backend/app.js
```

#### Frontend
```bash
cd frontend
npm run dev
```

El frontend estará disponible en `http://localhost:5173` (Vite)  
El backend estará disponible en `http://localhost:4000`

### 3.5 Construcción para Producción

#### Frontend
```bash
cd frontend
npm run build
```

Esto generará los archivos estáticos en `frontend/dist/`

#### Backend
El backend ya está listo para producción. Solo asegúrate de tener las variables de entorno configuradas.

---

## 4. Estructura del Proyecto

### 4.1 Estructura de Directorios

```
📦formatounicoenlinea
 ┃ ┣ 📂refs
 ┃ ┃ ┣ 📂heads
 ┃ ┃ ┃ ┗ 📜main
 ┃ ┃ ┣ 📂remotes
 ┃ ┃ ┃ ┗ 📂origin
 ┃ ┃ ┃ ┃ ┗ 📜main
 ┃ ┃ ┗ 📂tags
 ┃ ┣ 📜.MERGE_MSG.swp
 ┃ ┣ 📜COMMIT_EDITMSG
 ┃ ┣ 📜config
 ┃ ┣ 📜description
 ┃ ┣ 📜FETCH_HEAD
 ┃ ┣ 📜HEAD
 ┃ ┣ 📜index
 ┃ ┗ 📜ORIG_HEAD
 ┣ 📂.vscode
 ┃ ┗ 📜settings.json
 ┣ 📂backend
 ┃ ┣ 📂config
 ┃ ┃ ┗ 📜db.js
 ┃ ┣ 📂controllers
 ┃ ┃ ┣ 📜authController.js
 ┃ ┃ ┣ 📜datosPersonalesControllers.js
 ┃ ┃ ┣ 📜experienciaControllers.js
 ┃ ┃ ┣ 📜experienciaTotControllers.js
 ┃ ┃ ┣ 📜firmaServidorControllers.js
 ┃ ┃ ┣ 📜formacionAcademicaControllers.js
 ┃ ┃ ┣ 📜hojaVidaController.js
 ┃ ┃ ┣ 📜idiomaController.js
 ┃ ┃ ┣ 📜pdfControllers.js
 ┃ ┃ ┗ 📜recoveryController.js
 ┃ ┣ 📂middlewares
 ┃ ┃ ┣ 📜auth.js
 ┃ ┃ ┣ 📜idiomasValidations.js
 ┃ ┃ ┣ 📜requerirAdmin.js
 ┃ ┃ ┣ 📜validateFormacion.js
 ┃ ┃ ┗ 📜verificarJWT.js
 ┃ ┣ 📂models
 ┃ ┃ ┣ 📂legacy
 ┃ ┃ ┃ ┣ 📜DatosPersonales.js
 ┃ ┃ ┃ ┣ 📜Experiencia.js
 ┃ ┃ ┃ ┣ 📜ExperienciaTot.js
 ┃ ┃ ┃ ┣ 📜FirmaServidor.js
 ┃ ┃ ┃ ┣ 📜FormacionAcademica.js
 ┃ ┃ ┃ ┣ 📜Idioma.js
 ┃ ┃ ┃ ┗ 📜Usuario.js
 ┃ ┃ ┗ 📜UsuarioEmbebido.js
 ┃ ┣ 📂routes
 ┃ ┃ ┣ 📜datosPersonales.js
 ┃ ┃ ┣ 📜experiencia.js
 ┃ ┃ ┣ 📜experienciaTot.js
 ┃ ┃ ┣ 📜firmaServidor.js
 ┃ ┃ ┣ 📜formacionAcademica.js
 ┃ ┃ ┣ 📜hojaVidaRoutes.js
 ┃ ┃ ┣ 📜idiomas.js
 ┃ ┃ ┣ 📜login.js
 ┃ ┃ ┣ 📜pdf.js
 ┃ ┃ ┣ 📜recovery.js
 ┃ ┃ ┗ 📜usuarios.js
 ┃ ┣ 📂scripts
 ┃ ┃ ┣ 📜limpiarColeccionesAntiguas.js
 ┃ ┃ ┗ 📜migrarAEmbebido.js
 ┃ ┣ 📜app.js
 ┃ ┗ 📜index.js
 ┣ 📂frontend
 ┃ ┣ 📂build
 ┃ ┃ ┗ 📜index.html
 ┃ ┣ 📂dist
 ┃ ┃ ┣ 📂assets
 ┃ ┃ ┃ ┣ 📜Escudo.svg
 ┃ ┃ ┃ ┣ 📜html2canvas-DYnHhVsd.js
 ┃ ┃ ┃ ┣ 📜icon1.png
 ┃ ┃ ┃ ┣ 📜icon2.png
 ┃ ┃ ┃ ┣ 📜icon3.ico
 ┃ ┃ ┃ ┣ 📜icon4.png
 ┃ ┃ ┃ ┣ 📜icon5.png
 ┃ ┃ ┃ ┣ 📜icon6.png
 ┃ ┃ ┃ ┣ 📜icon7.png
 ┃ ┃ ┃ ┣ 📜icon8.png
 ┃ ┃ ┃ ┣ 📜icon9.png
 ┃ ┃ ┃ ┣ 📜index-CoOFSro0.js
 ┃ ┃ ┃ ┣ 📜index-CxHxq5El.css
 ┃ ┃ ┃ ┣ 📜index.es-38i7OTHk.js
 ┃ ┃ ┃ ┗ 📜purify.es-CQJ0hv7W.js
 ┃ ┃ ┣ 📜FORMATO_UNICO_HOJA_DE_VIDA.pdf
 ┃ ┃ ┗ 📜index.html
 ┃ ┣ 📂public
 ┃ ┃ ┣ 📂assets
 ┃ ┃ ┃ ┣ 📜Escudo.svg
 ┃ ┃ ┃ ┣ 📜icon1.png
 ┃ ┃ ┃ ┣ 📜icon2.png
 ┃ ┃ ┃ ┣ 📜icon3.ico
 ┃ ┃ ┃ ┣ 📜icon4.png
 ┃ ┃ ┃ ┣ 📜icon5.png
 ┃ ┃ ┃ ┣ 📜icon6.png
 ┃ ┃ ┃ ┣ 📜icon7.png
 ┃ ┃ ┃ ┣ 📜icon8.png
 ┃ ┃ ┃ ┗ 📜icon9.png
 ┃ ┃ ┣ 📜FORMATO_UNICO_HOJA_DE_VIDA.pdf
 ┃ ┃ ┣ 📜robots.txt
 ┃ ┃ ┗ 📜sitemap.xml
 ┃ ┣ 📂src
 ┃ ┃ ┣ 📂api
 ┃ ┃ ┃ ┣ 📜axios.js
 ┃ ┃ ┃ ┣ 📜datosAPI.js
 ┃ ┃ ┃ ┗ 📜pdfAPI.js
 ┃ ┃ ┣ 📂assets
 ┃ ┃ ┃ ┣ 📜pdf-styles.css
 ┃ ┃ ┃ ┗ 📜vue.svg
 ┃ ┃ ┣ 📂components
 ┃ ┃ ┃ ┣ 📜DatosPerComponent.vue
 ┃ ┃ ┃ ┣ 📜Experiencia2Component.vue
 ┃ ┃ ┃ ┣ 📜ExperienciaComponent.vue
 ┃ ┃ ┃ ┣ 📜ExperienciaTotComponent.vue
 ┃ ┃ ┃ ┣ 📜FirmaServidorComponent.vue
 ┃ ┃ ┃ ┣ 📜FooterComponent.vue
 ┃ ┃ ┃ ┣ 📜FormacionAcadComponent.vue
 ┃ ┃ ┃ ┣ 📜Header2Component.vue
 ┃ ┃ ┃ ┣ 📜HeaderComponent.vue
 ┃ ┃ ┃ ┣ 📜IdiomasComponent.vue
 ┃ ┃ ┃ ┣ 📜MenuComponents.vue
 ┃ ┃ ┃ ┗ 📜RecursosHumComponent.vue
 ┃ ┃ ┣ 📂composables
 ┃ ┃ ┃ ┣ 📜useFormatoOficialHV.js
 ┃ ┃ ┃ ┗ 📜useSEO.js
 ┃ ┃ ┣ 📂helpers
 ┃ ┃ ┃ ┗ 📜axiosInstance.js
 ┃ ┃ ┣ 📂Layouts
 ┃ ┃ ┃ ┣ 📜LayoutPrivado.vue
 ┃ ┃ ┃ ┗ 📜LayoutPublico.vue
 ┃ ┃ ┣ 📂router
 ┃ ┃ ┃ ┗ 📜index.js
 ┃ ┃ ┣ 📂services
 ┃ ┃ ┣ 📂stores
 ┃ ┃ ┃ ┣ 📜datos.js
 ┃ ┃ ┃ ┣ 📜experienciaStore.js
 ┃ ┃ ┃ ┣ 📜hojaVida.js
 ┃ ┃ ┃ ┗ 📜usuarios.js
 ┃ ┃ ┣ 📂utils
 ┃ ┃ ┃ ┣ 📜experienciaUtils.js
 ┃ ┃ ┃ ┣ 📜pdfUtils
 ┃ ┃ ┃ ┗ 📜showMessage.js
 ┃ ┃ ┣ 📂views
 ┃ ┃ ┃ ┣ 📜Hoja1.vue
 ┃ ┃ ┃ ┣ 📜Hoja2.vue
 ┃ ┃ ┃ ┣ 📜Hoja2Extra.vue
 ┃ ┃ ┃ ┣ 📜Hoja3.vue
 ┃ ┃ ┃ ┣ 📜Home.vue
 ┃ ┃ ┃ ┣ 📜Login.vue
 ┃ ┃ ┃ ┣ 📜RecuperarPassword.vue
 ┃ ┃ ┃ ┗ 📜VistaCompleta.vue
 ┃ ┃ ┣ 📜App.vue
 ┃ ┃ ┣ 📜main.js
 ┃ ┃ ┗ 📜style.css
 ┃ ┣ 📜index.html
 ┃ ┣ 📜package-lock.json
 ┃ ┣ 📜package.json
 ┃ ┗ 📜vite.config.js
 ┣ 📜.gitignore
 ┣ 📜DOCUMENTACION_COMPLETA.md
 ┣ 📜DOCUMENTACION_COMPLETA.pdf
 ┣ 📜env.example
 ┣ 📜generate tree.txt
 ┣ 📜GUIA_SEO.md
 ┣ 📜package-lock.json
 ┣ 📜package.json
 ┣ 📜Procfile
 ┣ 📜README.md
 ┣ 📜SEO_IMPLEMENTADO.md
 ┣ 📜temp_doc.md
 ┣ 📜Valeria13
 ┗ 📜Valeria13..pub
```

### 4.2 Descripción de Carpetas Principales

#### Backend

- **controllers/**: Contiene la lógica de negocio para cada entidad
- **models/**: Define los esquemas de Mongoose para MongoDB
- **routes/**: Define las rutas HTTP y conecta con los controllers
- **middlewares/**: Funciones intermedias (autenticación, validación)
- **config/**: Configuraciones (base de datos, etc.)

#### Frontend

- **components/**: Componentes Vue reutilizables
- **views/**: Páginas completas de la aplicación
- **stores/**: Estado global gestionado con Pinia
- **router/**: Configuración de rutas del frontend
- **api/**: Cliente HTTP y funciones de API
- **composables/**: Funciones composables de Vue 3
- **utils/**: Funciones de utilidad

---

## 5. Documentación de API

### 5.1 Autenticación

#### POST /api/login
Inicia sesión de un usuario.

**Request Body:**
```json
{
  "email": "usuario@example.com",
  "password": "contraseña123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "uid": "507f1f77bcf86cd799439011",
    "nombre": "Juan Pérez",
    "email": "usuario@example.com",
    "roles": ["usuario"]
  }
}
```

**Errores:**
- `400`: Campos faltantes
- `404`: Usuario no encontrado
- `401`: Contraseña incorrecta

#### POST /api/usuarios
Registra un nuevo usuario.

**Request Body:**
```json
{
  "nombre": "Juan Pérez",
  "email": "usuario@example.com",
  "password": "contraseña123",
  "roles": ["usuario"]
}
```

**Response (201 Created):**
```json
{
  "mensaje": "Usuario registrado exitosamente."
}
```

**Errores:**
- `400`: Campos faltantes
- `409`: Email ya registrado

### 5.2 Datos Personales

#### GET /api/datos-personales
Obtiene los datos personales del usuario autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "apellido1": "Pérez",
  "apellido2": "García",
  "nombres": "Juan",
  "tipoDocumento": "C.C",
  "numDocumento": "1234567890",
  "sexo": "M",
  "nacionalidad": "Colombiana",
  "pais": "Colombia",
  "fechaNacimiento": {
    "dia": "15",
    "mes": "03",
    "anio": "1990",
    "pais": "Colombia",
    "depto": "Cundinamarca",
    "municipio": "Bogotá"
  },
  "direccionCorrespondencia": {
    "pais": "Colombia",
    "depto": "Cundinamarca",
    "municipio": "Bogotá",
    "direccion": "Calle 123 #45-67",
    "telefono": "3001234567",
    "email": "usuario@example.com"
  }
}
```

#### POST /api/datos-personales
Crea los datos personales del usuario.

**Request Body:**
```json
{
  "apellido1": "Pérez",
  "apellido2": "García",
  "nombres": "Juan",
  "tipoDocumento": "C.C",
  "numDocumento": "1234567890",
  "sexo": "M",
  "nacionalidad": "Colombiana",
  "pais": "Colombia",
  "fechaNacimiento": {
    "dia": "15",
    "mes": "03",
    "anio": "1990"
  },
  "direccionCorrespondencia": {
    "pais": "Colombia",
    "depto": "Cundinamarca",
    "municipio": "Bogotá",
    "direccion": "Calle 123 #45-67",
    "telefono": "3001234567",
    "email": "usuario@example.com"
  }
}
```

#### PUT /api/datos-personales
Actualiza los datos personales del usuario.

**Request Body:** (Igual que POST)

### 5.3 Formación Académica

#### GET /api/formacion-academica
Obtiene la formación académica del usuario.

**Response:**
```json
{
  "gradoBasica": 11,
  "tituloBachiller": "Bachiller Académico",
  "mesGrado": "11",
  "anioGrado": "2008",
  "formacionSuperior": [
    {
      "modalidad": "Técnico",
      "semestres": "6",
      "graduado": "SI",
      "titulo": "Técnico en Sistemas",
      "mesTermino": "06",
      "anioTermino": "2010",
      "tarjeta": "12345"
    }
  ]
}
```

#### POST /api/formacion-academica
Crea o actualiza la formación académica.

**Request Body:**
```json
{
  "gradoBasica": 11,
  "tituloBachiller": "Bachiller Académico",
  "mesGrado": "11",
  "anioGrado": "2008",
  "formacionSuperior": [
    {
      "modalidad": "Técnico",
      "semestres": "6",
      "graduado": "SI",
      "titulo": "Técnico en Sistemas",
      "mesTermino": "06",
      "anioTermino": "2010",
      "tarjeta": "12345"
    }
  ]
}
```

### 5.4 Experiencia Laboral

#### GET /api/experiencia
Obtiene todas las experiencias laborales del usuario.

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "empresa": "Empresa XYZ",
    "tipoEntidad": "Privada",
    "pais": "Colombia",
    "departamento": "Cundinamarca",
    "municipio": "Bogotá",
    "correoEntidad": "contacto@empresa.com",
    "telefonos": "6012345678",
    "fechaIngreso": "2020-01-15T00:00:00.000Z",
    "fechaRetiro": "2022-12-31T00:00:00.000Z",
    "cargo": "Desarrollador",
    "dependencia": "TI",
    "direccion": "Calle 100 #50-30"
  }
]
```

#### POST /api/experiencia
Crea una nueva experiencia laboral.

**Request Body:**
```json
{
  "empresa": "Empresa XYZ",
  "tipoEntidad": "Privada",
  "pais": "Colombia",
  "departamento": "Cundinamarca",
  "municipio": "Bogotá",
  "correoEntidad": "contacto@empresa.com",
  "telefonos": "6012345678",
  "fechaIngreso": "2020-01-15",
  "fechaRetiro": "2022-12-31",
  "cargo": "Desarrollador",
  "dependencia": "TI",
  "direccion": "Calle 100 #50-30"
}
```

**Validaciones:**
- `fechaIngreso` y `fechaRetiro` deben ser fechas válidas
- `fechaIngreso` no puede ser mayor que `fechaRetiro`
- `tipoEntidad` debe ser "Publica" o "Privada"

#### DELETE /api/experiencia/:id
Elimina una experiencia laboral.

### 5.5 Resumen de Experiencia (ExperienciaTot)

#### GET /api/experiencia-tot
Obtiene el resumen calculado de la experiencia laboral.

**Response:**
```json
{
  "servidorPublico": {
    "anios": 2,
    "meses": 5,
    "dias": 10
  },
  "empleadoPrivado": {
    "anios": 1,
    "meses": 0,
    "dias": 0
  },
  "trabajadorIndependiente": {
    "anios": 0,
    "meses": 0,
    "dias": 0
  },
  "totalTiempo": {
    "anios": 3,
    "meses": 5,
    "dias": 10
  }
}
```

#### POST /api/experiencia-tot
Guarda o actualiza el resumen de experiencia.

### 5.6 Firma del Servidor

#### GET /api/firma-servidor
Obtiene la firma digital guardada.

#### POST /api/firma-servidor
Guarda la firma digital.

**Request Body:**
```json
{
  "firma": "data:image/png;base64,..."
}
```

#### DELETE /api/firma-servidor
Elimina la firma guardada.

### 5.7 Idiomas

#### GET /api/idiomas
Obtiene los idiomas del usuario.

**Response:**
```json
{
  "idiomas": [
    {
      "nombre": "Inglés",
      "habla": "B",
      "lee": "B",
      "escribe": "R"
    },
    {
      "nombre": "Francés",
      "habla": "R",
      "lee": "R",
      "escribe": ""
    }
  ]
}
```

**Niveles:** R (Regular), B (Bueno), MB (Muy Bueno)

#### POST /api/idiomas
Crea o actualiza los idiomas del usuario.

**Request Body:**
```json
{
  "idiomas": [
    {
      "nombre": "Inglés",
      "habla": "B",
      "lee": "B",
      "escribe": "R"
    }
  ]
}
```

**Validaciones:**
- Máximo 10 idiomas por usuario
- `habla`, `lee`, `escribe` deben ser "R", "B", "MB" o ""

### 5.8 Hoja de Vida Completa

#### GET /api/hoja-vida
Obtiene toda la información de la hoja de vida del usuario.

**Response:**
```json
{
  "datosPersonales": { /* ... */ },
  "formacionAcademica": { /* ... */ },
  "experiencias": [ /* ... */ ],
  "idiomas": [ /* ... */ ],
  "firmaServidor": { /* ... */ }
}
```

### 5.9 Generación de PDF

#### GET /api/pdf/generar
Genera un PDF de la hoja de vida completa.

**Response:** Archivo PDF binario

**Headers de respuesta:**
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="hoja-de-vida.pdf"
```

### 5.10 Recuperación de Contraseña

#### POST /api/recovery/solicitar
Solicita un código de recuperación de contraseña.

**Request Body:**
```json
{
  "email": "usuario@example.com"
}
```

**Response:**
```json
{
  "mensaje": "Código de recuperación enviado al correo electrónico"
}
```

#### POST /api/recovery/verificar
Verifica el código de recuperación.

**Request Body:**
```json
{
  "email": "usuario@example.com",
  "codigo": "123456"
}
```

**Response:**
```json
{
  "token": "token_temporal_para_cambiar_contraseña"
}
```

#### POST /api/recovery/cambiar
Cambia la contraseña con el token temporal.

**Request Body:**
```json
{
  "token": "token_temporal",
  "nuevaPassword": "nueva_contraseña123"
}
```

### 5.11 Autenticación

Todas las rutas (excepto `/api/login`, `/api/usuarios` y `/api/recovery/*`) requieren autenticación mediante JWT.

**Header requerido:**
```
Authorization: Bearer <token>
```

El token expira en **2 horas**.

---

## 6. Componentes Vue

### 6.1 Componentes de Layout

#### LayoutPrivado.vue
Layout principal para páginas autenticadas. Incluye menú lateral responsive.

**Props:** Ninguna

**Slots:**
- Default: Contenido de la página

**Características:**
- Menú lateral colapsable en móviles
- Header con botón de menú hamburguesa
- Backdrop para móviles

#### LayoutPublico.vue
Layout para páginas públicas (login, recuperación).

**Props:** Ninguna

**Slots:**
- Default: Contenido de la página

### 6.2 Componentes de Formulario

#### DatosPerComponent.vue
Formulario completo de datos personales.

**Props:** Ninguna

**Emits:**
- `guardado`: Cuando se guardan los datos exitosamente

**Métodos:**
- `enviarFormulario()`: Envía los datos al backend
- `actualizarDatos()`: Actualiza datos existentes

**Campos:**
- Apellidos, nombres
- Tipo y número de documento
- Sexo, nacionalidad
- Fecha de nacimiento
- Dirección de correspondencia

#### FormacionAcadComponent.vue
Formulario de formación académica.

**Props:** Ninguna

**Métodos:**
- `guardarFormacion()`: Guarda la formación académica

**Campos:**
- Grado de básica (1-11)
- Título de bachiller
- Hasta 3 formaciones superiores

#### ExperienciaComponent.vue
Lista y edición de experiencias laborales.

**Props:**
- `experiencias`: Array de experiencias

**Métodos:**
- `eliminarExperiencia(id)`: Elimina una experiencia
- `editarExperiencia(experiencia)`: Edita una experiencia

#### Experiencia2Component.vue
Formulario para crear nueva experiencia.

**Props:**
- `experiencia`: Objeto experiencia (opcional, para edición)

**Emits:**
- `saved`: Cuando se guarda exitosamente

**Métodos:**
- `guardarExperiencia()`: Guarda la experiencia
- `resetFormulario()`: Limpia el formulario

#### ExperienciaTotComponent.vue
Muestra el resumen de tiempo de experiencia calculado.

**Props:** Ninguna

**Métodos:**
- `cargarExperienciaTot()`: Carga los datos desde el backend

#### FirmaServidorComponent.vue
Componente para capturar y guardar la firma del servidor.

**Props:** Ninguna

**Métodos:**
- `guardarFirma()`: Envía la firma en base64 al backend
- `limpiarFirma()`: Borra la firma actual

---

## 7. Base de Datos

El proyecto utiliza MongoDB con Mongoose. El esquema principal es `UsuarioEmbebido`, que contiene subdocumentos para cada sección de la hoja de vida.

### Esquema UsuarioEmbebido

```javascript
{
  nombre: String,
  email: String,
  password: String,
  roles: [String],
  datosPersonales: { ... },
  formacionAcademica: { ... },
  experiencias: [ ... ],
  experienciaTot: { ... },
  idiomas: [ ... ],
  firmaServidor: { ... }
}
```

---

## 8. Guías de Desarrollo

### Agregar una nueva sección

1. **Backend**:
   - Crear modelo en `backend/models/`
   - Agregar campo en `UsuarioEmbebido.js`
   - Crear controlador en `backend/controllers/`
   - Crear ruta en `backend/routes/`
   - Registrar ruta en `backend/app.js`

2. **Frontend**:
   - Crear componente en `frontend/src/components/`
   - Agregar store en `frontend/src/stores/` (si es necesario)
   - Agregar vista en `frontend/src/views/` (si es necesario)
   - Actualizar `VistaCompleta.vue` para incluir la nueva sección

---

## 9. Despliegue

### Heroku

1. Crear archivo `Procfile`:
   ```
   web: npm start
   ```
2. Configurar variables de entorno en Heroku dashboard.
3. Desplegar con `git push heroku main`.

### Vercel (Frontend)

1. Importar proyecto en Vercel.
2. Configurar `Build Command`: `npm run build`.
3. Configurar `Output Directory`: `dist`.
4. Configurar variables de entorno (`VITE_API_URL`).

---

## 10. Casos de Uso

### Generar Hoja de Vida

1. Usuario inicia sesión.
2. Completa "Datos Personales".
3. Completa "Formación Académica".
4. Agrega "Experiencias Laborales".
5. Verifica "Tiempo de Experiencia".
6. Agrega "Idiomas".
7. Firma digitalmente en "Firma Servidor".
8. Va a "Vista Completa" y verifica la información.
9. Clic en "Descargar PDF".

---

## 11. Diagramas

### Diagrama de Entidad-Relación (Simplificado)

```mermaid
erDiagram
    USUARIO ||--|| DATOS_PERSONALES : tiene
    USUARIO ||--|| FORMACION_ACADEMICA : tiene
    USUARIO ||--o{ EXPERIENCIA : tiene
    USUARIO ||--|| EXPERIENCIA_TOT : tiene
    USUARIO ||--o{ IDIOMA : tiene
    USUARIO ||--|| FIRMA : tiene
```
