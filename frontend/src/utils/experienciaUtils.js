// frontend/src/utils/experienciaUtils.js
// Función compartida para calcular duración de experiencias
// Esta función asegura que el formulario web y el PDF usen exactamente la misma lógica

/**
 * Calcula la duración entre dos fechas en años y meses
 * @param {Date|string|Object} fechaIngreso - Fecha de ingreso
 * @param {Date|string|Object} fechaRetiro - Fecha de retiro
 * @returns {Object} { anios: number, meses: number } - Años y meses con decimales
 */
export function calcularDuracionExperiencia(fechaIngreso, fechaRetiro) {
  // Normalizar fechas a objetos Date
  let desde, hasta;

  if (fechaIngreso) {
    if (typeof fechaIngreso === 'string') {
      desde = new Date(fechaIngreso);
    } else if (fechaIngreso instanceof Date) {
      desde = fechaIngreso;
    } else if (fechaIngreso.anio || fechaIngreso.año) {
      desde = new Date(
        fechaIngreso.anio || fechaIngreso.año || 2000,
        (fechaIngreso.mes || 1) - 1,
        fechaIngreso.dia || 1
      );
    } else {
      return { anios: 0, meses: 0 };
    }
  } else {
    return { anios: 0, meses: 0 };
  }

  if (fechaRetiro) {
    if (typeof fechaRetiro === 'string') {
      hasta = new Date(fechaRetiro);
    } else if (fechaRetiro instanceof Date) {
      hasta = fechaRetiro;
    } else if (fechaRetiro.anio || fechaRetiro.año) {
      hasta = new Date(
        fechaRetiro.anio || fechaRetiro.año || new Date().getFullYear(),
        (fechaRetiro.mes || new Date().getMonth() + 1) - 1,
        fechaRetiro.dia || new Date().getDate()
      );
    } else {
      return { anios: 0, meses: 0 };
    }
  } else {
    return { anios: 0, meses: 0 };
  }

  // Validar fechas
  if (isNaN(desde.getTime()) || isNaN(hasta.getTime()) || hasta < desde) {
    return { anios: 0, meses: 0 };
  }

  // Calcular diferencia en días (sin Math.ceil ni +1 para mantener consistencia)
  const diffTime = hasta.getTime() - desde.getTime();
  const totalDias = diffTime / (1000 * 60 * 60 * 24);

  // Asumimos 30 días por mes exactos (igual que en el formulario web)
  const totalMeses = totalDias / 30;
  const anios = Math.floor(totalMeses / 12);
  const meses = Number((totalMeses % 12).toFixed(2)); // Siempre 2 decimales para consistencia

  return { anios, meses };
}

/**
 * Calcula los tiempos totales de experiencia por tipo
 * @param {Array} experiencias - Array de experiencias laborales
 * @returns {Object} { publico: {anios, meses}, privado: {anios, meses}, independiente: {anios, meses}, total: {anios, meses} }
 */
export function calcularTiemposTotales(experiencias) {
  let totalPublicoMeses = 0;
  let totalPrivadoMeses = 0;
  let totalIndependienteMeses = 0;

  experiencias.forEach(exp => {
    if (!exp.fechaIngreso || !exp.fechaRetiro) return;

    const { anios, meses } = calcularDuracionExperiencia(exp.fechaIngreso, exp.fechaRetiro);
    const totalMesesExp = anios * 12 + meses;

    const tipo = (exp.tipoEntidad || exp.tipo || "").toLowerCase();

    if (tipo === "publica" || tipo === "pública") {
      totalPublicoMeses += totalMesesExp;
    } else if (tipo === "privada") {
      totalPrivadoMeses += totalMesesExp;
    } else if (tipo === "independiente") {
      totalIndependienteMeses += totalMesesExp;
    }
  });

  // Convertir meses decimales a años y meses (redondeando meses a enteros)
  const convertirMesesDecimales = (totalMesesDecimal) => {
    const anios = Math.floor(totalMesesDecimal / 12);
    const mesesRestantes = totalMesesDecimal % 12;
    // Redondear a entero: < 0.5 hacia abajo, >= 0.5 hacia arriba
    const meses = Math.round(mesesRestantes);
    return { anios, meses };
  };

  const publico = convertirMesesDecimales(totalPublicoMeses);
  const privado = convertirMesesDecimales(totalPrivadoMeses);
  const independiente = convertirMesesDecimales(totalIndependienteMeses);
  const totalMesesDecimal = totalPublicoMeses + totalPrivadoMeses + totalIndependienteMeses;
  const total = convertirMesesDecimales(totalMesesDecimal);

  return { publico, privado, independiente, total };
}

