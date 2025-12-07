// frontend/src/utils/experienciaUtils.js

/**
 * Calcula la duración de una experiencia laboral en años y meses (con decimales)
 * @param {Date|string|Object} fechaIngreso - Fecha de ingreso
 * @param {Date|string|Object} fechaRetiro - Fecha de retiro
 * @returns {Object} { anios, meses, mesesDecimales, totalMeses, totalMesesDecimales }
 */
export function calcularDuracionExperiencia(fechaIngreso, fechaRetiro) {
  const inicio = normalizarFecha(fechaIngreso);
  const fin = normalizarFecha(fechaRetiro);

  if (!inicio || !fin) {
    console.warn('⚠️ Fechas inválidas:', { fechaIngreso, fechaRetiro });
    return { anios: 0, meses: 0, mesesDecimales: 0, totalMeses: 0, totalMesesDecimales: 0 };
  }

  // Calcular diferencia en meses completos
  let totalMeses = (fin.getFullYear() - inicio.getFullYear()) * 12;
  totalMeses += fin.getMonth() - inicio.getMonth();

  // Calcular días adicionales para fracción de mes
  let diasAdicionales = 0;
  let diasDelMes = 0;

  if (fin.getDate() >= inicio.getDate()) {
    // Caso simple: el día final es mayor o igual al día inicial
    diasAdicionales = fin.getDate() - inicio.getDate();
    diasDelMes = new Date(fin.getFullYear(), fin.getMonth() + 1, 0).getDate();
  } else {
    // El día final es menor, restamos un mes y calculamos días
    totalMeses--;
    const mesAnterior = new Date(fin.getFullYear(), fin.getMonth(), 0);
    const diasMesAnterior = mesAnterior.getDate();
    diasAdicionales = (diasMesAnterior - inicio.getDate() + 1) + fin.getDate();
    diasDelMes = diasMesAnterior + new Date(fin.getFullYear(), fin.getMonth() + 1, 0).getDate();
  }

  // Convertir días adicionales a fracción de mes
  const fraccionMes = diasAdicionales / diasDelMes;
  const totalMesesDecimales = totalMeses + fraccionMes;

  // Calcular años y meses decimales
  const anios = Math.floor(totalMesesDecimales / 12);
  const mesesDecimales = parseFloat((totalMesesDecimales % 12).toFixed(1));

  // También calcular versión redondeada para compatibilidad
  const totalMesesRedondeados = Math.round(totalMesesDecimales);
  const mesesRedondeados = totalMesesRedondeados % 12;

  return {
    anios,
    meses: mesesRedondeados,
    mesesDecimales,
    totalMeses: totalMesesRedondeados,
    totalMesesDecimales
  };
}

/**
 * Normaliza diferentes formatos de fecha a objeto Date
 */
function normalizarFecha(fecha) {
  if (!fecha) return null;

  // Si ya es Date
  if (fecha instanceof Date) {
    return isNaN(fecha.getTime()) ? null : fecha;
  }

  // Si es string ISO
  if (typeof fecha === 'string') {
    const d = new Date(fecha);
    return isNaN(d.getTime()) ? null : d;
  }

  // Si es objeto { dia, mes, anio }
  if (typeof fecha === 'object' && fecha.dia && fecha.mes && fecha.anio) {
    const d = new Date(
      parseInt(fecha.anio),
      parseInt(fecha.mes) - 1,
      parseInt(fecha.dia)
    );
    return isNaN(d.getTime()) ? null : d;
  }

  return null;
}

/**
 * Calcula el tiempo total de experiencia por tipo
 * @param {Array} experiencias - Array de experiencias laborales
 * @returns {Object} Tiempos calculados por tipo
 */
export function calcularTiemposTotales(experiencias) {
  if (!Array.isArray(experiencias)) {
    console.warn('⚠️ experiencias no es un array:', experiencias);
    return {
      publico: { anios: 0, meses: 0, mesesDecimales: 0, totalMeses: 0, totalMesesDecimales: 0 },
      privado: { anios: 0, meses: 0, mesesDecimales: 0, totalMeses: 0, totalMesesDecimales: 0 },
      independiente: { anios: 0, meses: 0, mesesDecimales: 0, totalMeses: 0, totalMesesDecimales: 0 },
      total: { anios: 0, meses: 0, mesesDecimales: 0, totalMeses: 0, totalMesesDecimales: 0 }
    };
  }

  let totalMesesDecimalesPublico = 0;
  let totalMesesDecimalesPrivado = 0;
  let totalMesesDecimalesIndependiente = 0;

  experiencias.forEach((exp, index) => {
    const duracion = calcularDuracionExperiencia(exp.fechaIngreso, exp.fechaRetiro);

    console.log(`📊 Experiencia ${index + 1}:`, {
      empresa: exp.empresa,
      tipo: exp.tipoEntidad || exp.tipo,
      duracion: `${duracion.anios} años, ${duracion.mesesDecimales} meses (${duracion.totalMesesDecimales.toFixed(2)} meses totales)`
    });

    const tipo = (exp.tipoEntidad || exp.tipo || '').toLowerCase();

    if (tipo === 'publica' || tipo === 'público' || tipo === 'servidor público') {
      totalMesesDecimalesPublico += duracion.totalMesesDecimales;
    } else if (tipo === 'privada' || tipo === 'privado' || tipo === 'empleado del sector privado') {
      totalMesesDecimalesPrivado += duracion.totalMesesDecimales;
    } else if (tipo === 'independiente' || tipo === 'trabajador independiente') {
      totalMesesDecimalesIndependiente += duracion.totalMesesDecimales;
    }
  });

  const totalMesesDecimalesGeneral = totalMesesDecimalesPublico + totalMesesDecimalesPrivado + totalMesesDecimalesIndependiente;

  const resultado = {
    publico: {
      anios: Math.floor(totalMesesDecimalesPublico / 12),
      meses: Math.round(totalMesesDecimalesPublico % 12), // Redondeado para compatibilidad
      mesesDecimales: parseFloat((totalMesesDecimalesPublico % 12).toFixed(1)), // 1 decimal
      totalMeses: Math.round(totalMesesDecimalesPublico),
      totalMesesDecimales: totalMesesDecimalesPublico
    },
    privado: {
      anios: Math.floor(totalMesesDecimalesPrivado / 12),
      meses: Math.round(totalMesesDecimalesPrivado % 12),
      mesesDecimales: parseFloat((totalMesesDecimalesPrivado % 12).toFixed(1)), // 1 decimal
      totalMeses: Math.round(totalMesesDecimalesPrivado),
      totalMesesDecimales: totalMesesDecimalesPrivado
    },
    independiente: {
      anios: Math.floor(totalMesesDecimalesIndependiente / 12),
      meses: Math.round(totalMesesDecimalesIndependiente % 12),
      mesesDecimales: parseFloat((totalMesesDecimalesIndependiente % 12).toFixed(1)), // 1 decimal
      totalMeses: Math.round(totalMesesDecimalesIndependiente),
      totalMesesDecimales: totalMesesDecimalesIndependiente
    },
    total: {
      anios: Math.floor(totalMesesDecimalesGeneral / 12),
      meses: Math.round(totalMesesDecimalesGeneral % 12),
      mesesDecimales: parseFloat((totalMesesDecimalesGeneral % 12).toFixed(1)), // 1 decimal
      totalMeses: Math.round(totalMesesDecimalesGeneral),
      totalMesesDecimales: totalMesesDecimalesGeneral
    }
  };

  console.log('📊 RESUMEN FINAL:', {
    publico: `${resultado.publico.anios}a ${resultado.publico.mesesDecimales}m (${resultado.publico.totalMesesDecimales.toFixed(2)}m)`,
    privado: `${resultado.privado.anios}a ${resultado.privado.mesesDecimales}m (${resultado.privado.totalMesesDecimales.toFixed(2)}m)`,
    independiente: `${resultado.independiente.anios}a ${resultado.independiente.mesesDecimales}m (${resultado.independiente.totalMesesDecimales.toFixed(2)}m)`,
    total: `${resultado.total.anios}a ${resultado.total.mesesDecimales}m (${resultado.total.totalMesesDecimales.toFixed(2)}m)`
  });

  return resultado;
}

/**
 * Formatea el tiempo para mostrar
 */
export function formatearTiempo(anios, meses) {
  const partesTexto = [];

  if (anios > 0) {
    partesTexto.push(`${anios} año${anios !== 1 ? 's' : ''}`);
  }

  if (meses > 0) {
    partesTexto.push(`${meses} mes${meses !== 1 ? 'es' : ''}`);
  }

  return partesTexto.length > 0 ? partesTexto.join(' y ') : '0 meses';
}