// backend/scripts/eliminarColecciones.js
// Versión simple sin confirmación interactiva

import mongoose from 'mongoose';

const MONGODB_URI = "mongodb+srv://randysimancamercado2:Valeria1324@clustermiapp.z0bbfnk.mongodb.net/baseDeDatosHV?retryWrites=true&w=majority&appName=ClusterMiApp";

async function eliminarColecciones() {
  try {
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    const db = mongoose.connection.db;
    
    // 1. Verificar usuarios_embebidos
    const totalEmbebidos = await db.collection('usuarios_embebidos').countDocuments();
    console.log(`\n📊 Usuarios en usuarios_embebidos: ${totalEmbebidos}`);
    
    if (totalEmbebidos === 0) {
      console.error('❌ ERROR: usuarios_embebidos está vacía. NO se eliminará nada.');
      process.exit(1);
    }

    // 2. Listar colecciones
    const colecciones = await db.listCollections().toArray();
    const coleccionesAntiguas = [
      'usuarios',
      'datospersonales', 
      'formacionacademicas',
      'experiencias',
      'idiomas',
      'firmaservidors',
      'experienciatots'
    ];

    const encontradas = colecciones
      .map(c => c.name)
      .filter(name => coleccionesAntiguas.includes(name));

    console.log(`\n📋 Colecciones a eliminar: ${encontradas.length}`);
    encontradas.forEach(col => console.log(`   - ${col}`));

    if (encontradas.length === 0) {
      console.log('\n✅ No hay colecciones antiguas. Base de datos ya limpia.');
      await mongoose.disconnect();
      process.exit(0);
    }

    // 3. Crear backups
    console.log('\n📦 Creando backups...');
    for (const col of encontradas) {
      try {
        const docs = await db.collection(col).find({}).toArray();
        if (docs.length > 0) {
          const backupName = `${col}_backup`;
          await db.collection(backupName).insertMany(docs);
          console.log(`   ✅ ${backupName} (${docs.length} docs)`);
        }
      } catch (error) {
        console.log(`   ⚠️ ${col}: ${error.message}`);
      }
    }

    // 4. Eliminar colecciones
    console.log('\n🗑️ Eliminando colecciones...');
    let eliminadas = 0;
    
    for (const col of encontradas) {
      try {
        await db.collection(col).drop();
        eliminadas++;
        console.log(`   ✅ ${col} eliminada`);
      } catch (error) {
        console.log(`   ❌ ${col}: ${error.message}`);
      }
    }

    // 5. Resumen
    console.log('\n' + '='.repeat(50));
    console.log('✅ LIMPIEZA COMPLETADA');
    console.log('='.repeat(50));
    console.log(`Colecciones eliminadas: ${eliminadas}/${encontradas.length}`);
    console.log(`Usuarios en sistema: ${totalEmbebidos}`);
    console.log('\n⚠️ Los backups se mantienen por seguridad.');
    console.log('Verifica que la app funciona correctamente.');
    console.log('Después de algunos días, elimina los backups manualmente.\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Desconectado de MongoDB\n');
  }
}

// Ejecutar directamente
eliminarColecciones();