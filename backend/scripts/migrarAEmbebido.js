// backend/scripts/migrarAEmbebido.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Usuario from '../models/Usuario.js';
import DatosPersonales from '../models/DatosPersonales.js';
import FormacionAcademica from '../models/FormacionAcademica.js';
import Experiencia from '../models/Experiencia.js';
import IdiomasDocumento from '../models/Idioma.js';
import FirmaServidor from '../models/FirmaServidor.js';
import UsuarioEmbebido from '../models/UsuarioEmbebido.js';

dotenv.config();

async function migrarDatos() {
  try {
    await await mongoose.connect("mongodb+srv://randysimancamercado2:Valeria1324@clustermiapp.z0bbfnk.mongodb.net/baseDeDatosHV?retryWrites=true&w=majority&appName=ClusterMiApp");

    console.log('✅ Conectado a MongoDB');

    const usuarios = await Usuario.find({});
    console.log(`📊 Encontrados ${usuarios.length} usuarios para migrar`);

    let migrados = 0;
    let errores = 0;

    for (const usuario of usuarios) {
      try {
        console.log(`\n🔄 Migrando usuario: ${usuario.email}`);

        // Obtener datos relacionados
        const datosPersonales = await DatosPersonales.findOne({ user: usuario._id });
        const formacion = await FormacionAcademica.findOne({ user: usuario._id });
        const experiencias = await Experiencia.find({ user: usuario._id });
        const idiomas = await IdiomasDocumento.findOne({ usuario: usuario._id });
        const firma = await FirmaServidor.findOne({ user: usuario._id });

        // Crear documento embebido
        const usuarioEmbebido = new UsuarioEmbebido({
          // Datos de autenticación (mantener password hasheado)
          nombre: usuario.nombre,
          email: usuario.email,
          password: usuario.password, // Ya está hasheado
          roles: usuario.roles,
          fechaCreacion: usuario.fechaCreacion,
          ultimoAcceso: usuario.ultimoAcceso,

          // Datos personales
          ...(datosPersonales && {
            apellido1: datosPersonales.apellido1,
            apellido2: datosPersonales.apellido2,
            nombres: datosPersonales.nombres,
            tipoDocumento: datosPersonales.tipoDocumento,
            numDocumento: datosPersonales.numDocumento,
            sexo: datosPersonales.sexo,
            nacionalidad: datosPersonales.nacionalidad,
            pais: datosPersonales.pais,
            libretaMilitar: datosPersonales.libretaMilitar,
            numeroLibreta: datosPersonales.numeroLibreta,
            dm: datosPersonales.dm,
            fechaNacimiento: datosPersonales.fechaNacimiento,
            direccionCorrespondencia: datosPersonales.direccionCorrespondencia
          }),

          // Formación académica
          ...(formacion && {
            gradoBasica: formacion.gradoBasica,
            tituloBachiller: formacion.tituloBachiller,
            mesGrado: formacion.mesGrado,
            anioGrado: formacion.anioGrado,
            formacionSuperior: formacion.formacionesSuperior || []
          }),

          // Experiencias
          experiencias: experiencias.map(exp => ({
            empresa: exp.empresa,
            tipoEntidad: exp.tipoEntidad,
            pais: exp.pais,
            departamento: exp.departamento,
            municipio: exp.municipio,
            correoEntidad: exp.correoEntidad,
            telefonos: exp.telefonos,
            fechaIngreso: exp.fechaIngreso,
            fechaRetiro: exp.fechaRetiro,
            cargo: exp.cargo,
            dependencia: exp.dependencia,
            direccion: exp.direccion
          })),

          // Idiomas
          idiomas: idiomas?.idiomas || [],

          // Firma
          ...(firma && {
            firmaServidor: firma.firmaServidor,
            declaracionInhabilidad: firma.declaracionInhabilidad,
            ciudadDiligenciamiento: firma.ciudadDiligenciamiento,
            fechaDiligenciamiento: firma.fechaDiligenciamiento
          })
        });

        await usuarioEmbebido.save();
        migrados++;
        console.log(`✅ Usuario ${usuario.email} migrado exitosamente`);
        console.log(`   - ${experiencias.length} experiencias`);
        console.log(`   - ${formacion?.formacionesSuperior?.length || 0} formaciones`);
        console.log(`   - ${idiomas?.idiomas?.length || 0} idiomas`);

      } catch (error) {
        errores++;
        console.error(`❌ Error migrando ${usuario.email}:`, error.message);
      }
    }

    console.log(`\n📊 Resumen de migración:`);
    console.log(`   ✅ Migrados: ${migrados}`);
    console.log(`   ❌ Errores: ${errores}`);
    console.log(`   📝 Total: ${usuarios.length}`);

    // Verificar migración
    const totalEmbebidos = await UsuarioEmbebido.countDocuments();
    console.log(`\n🔍 Verificación: ${totalEmbebidos} usuarios en la nueva colección`);

  } catch (error) {
    console.error('❌ Error general:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Desconectado de MongoDB');
  }
}

// Ejecutar migración
migrarDatos();