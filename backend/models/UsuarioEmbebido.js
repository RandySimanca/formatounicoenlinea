// backend/models/UsuarioEmbebido.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { Schema } = mongoose;

// Sub-esquemas
const fechaNacimientoSchema = new Schema({
  dia: String,
  mes: String,
  anio: String,
  pais: String,
  depto: String,
  municipio: String
}, { _id: false });

const direccionSchema = new Schema({
  pais: String,
  depto: String,
  municipio: String,
  direccion: String,
  telefono: String,
  email: String
}, { _id: false });

const experienciaSchema = new Schema({
  empresa: String,
  tipoEntidad: { type: String, enum: ["Publica", "Privada"] },
  pais: String,
  departamento: String,
  municipio: String,
  correoEntidad: String,
  telefonos: String,
  fechaIngreso: Date,
  fechaRetiro: Date,
  cargo: String,
  dependencia: String,
  direccion: String
}, { _id: true });

const formacionSuperiorSchema = new Schema({
  modalidad: String,
  semestres: String,
  graduado: { type: String, enum: ["SI", "NO", ""] },
  titulo: String,
  mesTermino: String,
  anioTermino: String,
  tarjeta: String
}, { _id: true });

const idiomaSchema = new Schema({
  nombre: String,
  habla: { type: String, enum: ['R', 'B', 'MB', ''] },
  lee: { type: String, enum: ['R', 'B', 'MB', ''] },
  escribe: { type: String, enum: ['R', 'B', 'MB', ''] }
}, { _id: false });

// Esquema principal del usuario
const usuarioEmbebidoSchema = new Schema({
  // Autenticación
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  roles: { type: [String], default: ["usuario"] },
  
  // Datos personales
  apellido1: String,
  apellido2: String,
  nombres: String,
  tipoDocumento: String,
  numDocumento: String,
  sexo: String,
  nacionalidad: String,
  pais: String,
  libretaMilitar: String,
  numeroLibreta: String,
  dm: String,
  
  fechaNacimiento: fechaNacimientoSchema,
  direccionCorrespondencia: direccionSchema,
  
  // Formación académica
  gradoBasica: { type: Number, min: 1, max: 11 },
  tituloBachiller: String,
  mesGrado: String,
  anioGrado: String,
  formacionSuperior: [formacionSuperiorSchema],
  
  // Experiencia laboral
  experiencias: [experienciaSchema],
  
  // Resumen de experiencia (campos adicionales)
  experienciaPublica: String,
  experienciaPrivada: String,
  
  // Idiomas
  idiomas: [idiomaSchema],
  
  // Firma y declaraciones
  firmaServidor: String,
  firmaBase64: String, // ✅ Campo adicional para experienciaTot
  declaracionInhabilidad: { type: String, enum: ['SI', 'NO', ''] },
  ciudadDiligenciamiento: String,
  fechaDiligenciamiento: Date,
  
  // Metadatos
  fechaCreacion: { type: Date, default: Date.now },
  ultimoAcceso: Date
}, {
  timestamps: true,
  collection: 'usuarios_embebidos'
});

// Middleware de encriptación
usuarioEmbebidoSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

usuarioEmbebidoSchema.methods.validarPassword = function (passwordPlano) {
  return bcrypt.compare(passwordPlano, this.password);
};

// Índices para búsquedas rápidas
usuarioEmbebidoSchema.index({ email: 1 });
usuarioEmbebidoSchema.index({ numDocumento: 1 });

export default mongoose.model("UsuarioEmbebido", usuarioEmbebidoSchema);