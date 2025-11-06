// backend/models/FirmaServidor.js
import mongoose from "mongoose";

const FirmaServidorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
    unique: true,
  },
  // ✅ NUEVOS CAMPOS para las declaraciones
  declaracionInhabilidad: {
    type: String,
    enum: ['SI', 'NO', ''],
    default: ''
  },
  declaracionVeracidad: {
    type: String,
    enum: ['SI', 'NO', ''],
    default: ''
  },
  ciudadDiligenciamiento: String,
  fechaDiligenciamiento: Date,
  firmaServidor: String, // base64
}, {
  timestamps: true
});

export default mongoose.model("FirmaServidor", FirmaServidorSchema);