// ✅ AGREGAR ESTA IMPORTACIÓN AL INICIO
import { defineStore } from 'pinia';
import { obtenerExperiencias } from "../api/datosAPI";

export const useExperienciaStore = defineStore('experiencia', {
  state: () => ({
    experiencias: [],
  }),
  actions: {
    async cargarExperiencia() {
      try {
        const { data } = await obtenerExperiencias();

        // 🔄 Convertir fechas y ordenar por fecha de retiro
        this.experiencias = data
          .map(exp => ({
            ...exp,
            fechaIngreso: this.convertirFechaAObjeto(exp.fechaIngreso),
            fechaRetiro: this.convertirFechaAObjeto(exp.fechaRetiro),
          }))
          .sort((a, b) => {
            // Ordenar por fecha de retiro (más reciente primero)
            const fechaA = new Date(
              a.fechaRetiro?.anio || 0,
              (a.fechaRetiro?.mes || 1) - 1,
              a.fechaRetiro?.dia || 1
            );
            const fechaB = new Date(
              b.fechaRetiro?.anio || 0,
              (b.fechaRetiro?.mes || 1) - 1,
              b.fechaRetiro?.dia || 1
            );
            return fechaB - fechaA; // Descendente (más reciente primero)
          });
      } catch (error) {
        console.error("❌ Error al cargar experiencia:", error.response?.data || error.message);
        this.experiencias = [];
      }
    },

    agregar(experiencia) {
      this.experiencias.push(experiencia);
      this.ordenarExperiencias(); // ✅ Ordenar después de agregar
    },

    actualizar(index, nuevaData) {
      this.experiencias[index] = nuevaData;
      this.ordenarExperiencias(); // ✅ Ordenar después de actualizar
    },

    eliminar(index) {
      this.experiencias.splice(index, 1);
    },

    resetear() {
      this.experiencias = [];
    },

    // ✅ Método para ordenar experiencias
    ordenarExperiencias() {
      this.experiencias.sort((a, b) => {
        const fechaA = new Date(
          a.fechaRetiro?.anio || 0,
          (a.fechaRetiro?.mes || 1) - 1,
          a.fechaRetiro?.dia || 1
        );
        const fechaB = new Date(
          b.fechaRetiro?.anio || 0,
          (b.fechaRetiro?.mes || 1) - 1,
          b.fechaRetiro?.dia || 1
        );
        return fechaB - fechaA; // Más reciente primero
      });
    },

    /**
     * 🧠 Utilidad local: convierte "2023-08-04T00:00:00.000Z"
     * en { dia: "04", mes: "08", anio: "2023" }
     */
    convertirFechaAObjeto(fechaISO) {
      if (!fechaISO) return { dia: '', mes: '', anio: '' };
      const fecha = new Date(fechaISO);
      return {
        dia: String(fecha.getDate()).padStart(2, "0"),
        mes: String(fecha.getMonth() + 1).padStart(2, "0"),
        anio: String(fecha.getFullYear()),
      };
    },
  },
});