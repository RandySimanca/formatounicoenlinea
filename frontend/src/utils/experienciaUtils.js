// frontend/src/utils/experienciaUtils.js

/**
 * Calcula la duración de una experiencia laboral en años y meses
 * @param {Date|string|Object} fechaIngreso - Fecha de ingreso
 * @param {Date|string|Object} fechaRetiro - Fecha de retiro
 * @returns {Object} { anios, meses, totalMeses }
 */
export function calcularDuracionExperiencia(fechaIngreso, fechaRetiro) {
  const inicio = normalizarFecha(fechaIngreso);
  const fin = normalizarFecha(fechaRetiro);

  if (!inicio || !fin) {
    console.warn('⚠️ Fechas inválidas:', { fechaIngreso, fechaRetiro });
    return { anios: 0, meses: 0, totalMeses: 0 };
  }

  // Calcular diferencia en meses totales
  let totalMeses = (fin.getFullYear() - inicio.getFullYear()) * 12;
  totalMeses += fin.getMonth() - inicio.getMonth();

  // Calcular los días adicionales para redondeo
  let diasAdicionales = 0;
  if (fin.getDate() >= inicio.getDate()) {
    diasAdicionales = fin.getDate() - inicio.getDate();
  } else {
    totalMeses--;
    // Calcular días del mes anterior
    const ultimoDiaMesAnterior = new Date(fin.getFullYear(), fin.getMonth(), 0).getDate();
    diasAdicionales = (ultimoDiaMesAnterior - inicio.getDate()) + fin.getDate();
  }

  // Redondear: si hay 15 días o más, sumar un mes adicional
  if (diasAdicionales >= 15) {
    totalMeses++;
  }

  // Asegurar que no sea negativo
  totalMeses = Math.max(0, totalMeses);

  const anios = Math.floor(totalMeses / 12);
  const meses = totalMeses % 12;

  return { anios, meses, totalMeses };
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
      publico: { anios: 0, meses: 0, totalMeses: 0 },
      privado: { anios: 0, meses: 0, totalMeses: 0 },
      independiente: { anios: 0, meses: 0, totalMeses: 0 },
      total: { anios: 0, meses: 0, totalMeses: 0 }
    };
  }

  let totalMesesPublico = 0;
  let totalMesesPrivado = 0;
  let totalMesesIndependiente = 0;

  experiencias.forEach((exp, index) => {
    const duracion = calcularDuracionExperiencia(exp.fechaIngreso, exp.fechaRetiro);

    console.log(`📊 Experiencia ${index + 1}:`, {
      empresa: exp.empresa,
      tipo: exp.tipoEntidad || exp.tipo,
      duracion: `${duracion.anios} años, ${duracion.meses} meses (${duracion.totalMeses} meses totales)`
    });

    const tipo = (exp.tipoEntidad || exp.tipo || '').toLowerCase();

    if (tipo === 'publica' || tipo === 'público' || tipo === 'servidor público') {
      totalMesesPublico += duracion.totalMeses;
    } else if (tipo === 'privada' || tipo === 'privado' || tipo === 'empleado del sector privado') {
      totalMesesPrivado += duracion.totalMeses;
    } else if (tipo === 'independiente' || tipo === 'trabajador independiente') {
      totalMesesIndependiente += duracion.totalMeses;
    }
  });

  const totalMesesGeneral = totalMesesPublico + totalMesesPrivado + totalMesesIndependiente;

  const resultado = {
    publico: {
      anios: Math.floor(totalMesesPublico / 12),
      meses: totalMesesPublico % 12,
      totalMeses: totalMesesPublico
    },
    privado: {
      anios: Math.floor(totalMesesPrivado / 12),
      meses: totalMesesPrivado % 12,
      totalMeses: totalMesesPrivado
    },
    independiente: {
      anios: Math.floor(totalMesesIndependiente / 12),
      meses: totalMesesIndependiente % 12,
      totalMeses: totalMesesIndependiente
    },
    total: {
      anios: Math.floor(totalMesesGeneral / 12),
      meses: totalMesesGeneral % 12,
      totalMeses: totalMesesGeneral
    }
  };

  console.log('📊 RESUMEN FINAL:', {
    publico: `${resultado.publico.anios}a ${resultado.publico.meses}m (${resultado.publico.totalMeses}m)`,
    privado: `${resultado.privado.anios}a ${resultado.privado.meses}m (${resultado.privado.totalMeses}m)`,
    independiente: `${resultado.independiente.anios}a ${resultado.independiente.meses}m (${resultado.independiente.totalMeses}m)`,
    total: `${resultado.total.anios}a ${resultado.total.meses}m (${resultado.total.totalMeses}m)`
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