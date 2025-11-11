// src/composables/useFormatoOficialHV.js
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export function useFormatoOficialHV() {
  async function llenarFormatoOficial(datosUsuario, urlFormato = "/FORMATO_UNICO_HOJA_DE_VIDA.pdf") {
    try {
      console.log("💼 Experiencias recibidas:", datosUsuario.experienciaLaboral);
      console.log("📋 Datos recibidos para llenar PDF:", datosUsuario);
      console.log("⚖️ Declaración de inhabilidad:", datosUsuario.declaracionInhabilidad);

      let pdfDoc;

      try {
        const existingPdfBytes = await fetch(urlFormato).then((res) => {
          if (!res.ok) throw new Error("Formato no encontrado");
          return res.arrayBuffer();
        });
        pdfDoc = await PDFDocument.load(existingPdfBytes);
        console.log("✅ Formato oficial cargado correctamente");
      } catch (error) {
        console.error("❌ No se pudo cargar el formato base:", error);
        pdfDoc = await PDFDocument.create();
        await crearFormatoDesdeCero(pdfDoc);
      }

      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const fontSize = 9;
      const fontSizeSmall = 7;

      const write = (page, text, x, y, size = fontSize, fontType = font) => {
        if (!text && text !== 0) return;
        const { height } = page.getSize();
        const textoFinal = String(text).substring(0, 50);
        page.drawText(textoFinal, {
          x,
          y: height - y,
          size,
          font: fontType,
          color: rgb(0, 0, 0),
        });
      };

      const pages = pdfDoc.getPages();

      // ========================== PÁGINA 1 =============================
      if (pages[0]) {
        const page1 = pages[0];
        write(page1, datosUsuario.apellido1 || "", 66, 188, fontSize + 1);
        write(page1, datosUsuario.apellido2 || "", 230, 188, fontSize + 1);
        write(page1, datosUsuario.nombres || "", 400, 188, fontSize + 1);

        if (datosUsuario.tipoDocumento === "C.C") write(page1, "X", 82, 220, 10, fontBold);
        else if (datosUsuario.tipoDocumento === "C.E") write(page1, "X", 113, 220, 10, fontBold);
        else if (datosUsuario.tipoDocumento === "PAS") write(page1, "X", 148, 220, 10, fontBold);

        write(page1, datosUsuario.numDocumento || "", 185, 220, fontSize + 1);

        if (["F", "Femenino"].includes(datosUsuario.sexo)) write(page1, "X", 316, 220, 10, fontBold);
        else if (["M", "Masculino"].includes(datosUsuario.sexo)) write(page1, "X", 341, 220, 10, fontBold);

        if (["colombiana", "Colombiano"].includes(datosUsuario.nacionalidad)) write(page1, "X", 383, 220, 10, fontBold);
        else if (datosUsuario.nacionalidad === "Extranjero") write(page1, "X", 458, 208, 10, fontBold);

        write(page1, datosUsuario.pais || "", 480, 220, 10);

        if (datosUsuario.libretaMilitar === "primera") write(page1, "X", 144, 250, 10, fontBold);
        else if (datosUsuario.libretaMilitar === "segunda") write(page1, "X", 260, 250, 10, fontBold);

        write(page1, datosUsuario.numeroLibreta || "", 330, 250);
        write(page1, datosUsuario.dm || "", 510, 250);

        write(page1, datosUsuario.fechaNacimiento?.dia || "", 142, 287, 10);
        write(page1, datosUsuario.fechaNacimiento?.mes || "", 186, 287, 10);
        write(page1, datosUsuario.fechaNacimiento?.anio || "", 242, 287, 10);

        write(page1, datosUsuario.fechaNacimiento?.pais || "", 140, 304, 10);
        write(page1, datosUsuario.fechaNacimiento?.depto || "", 140, 320, 10);
        write(page1, datosUsuario.fechaNacimiento?.municipio || "", 140, 335, 10);

        const dirCorr = datosUsuario.direccionCorrespondencia || {};
        write(page1, dirCorr.pais || "", 330, 304, 10);
        write(page1, dirCorr.depto || "", 490, 304, 10);
        write(page1, dirCorr.municipio || "", 350, 320, 10);
        write(page1, dirCorr.direccion || "", 290, 285, 10);
        write(page1, dirCorr.telefono || "", 350, 335, 10);
        write(page1, dirCorr.email || "", 470, 335, 8);

        if (datosUsuario.gradoAprobado) {
          const grados = {
            1: [100, 470], 2: [115, 470], 3: [135, 470], 4: [148, 470],
            5: [168, 470], 6: [188, 470], 7: [198, 470], 8: [217, 470],
            9: [235, 470], 10: [255, 470], 11: [275, 470]
          };
          if (grados[datosUsuario.gradoAprobado]) {
            const [x, y] = grados[datosUsuario.gradoAprobado];
            write(page1, "X", x, y, 10, fontBold);
          }
        }

        write(page1, datosUsuario.tituloBasica || "", 360, 445, 12);
        write(page1, datosUsuario.mesGradoBasica || "", 350, 475, 12);
        write(page1, datosUsuario.anoGradoBasica || "", 410, 475, 12);

        if (Array.isArray(datosUsuario.educacionSuperior)) {
          let yEdu = 590;
          const espacioEntreFilas = 18;
          datosUsuario.educacionSuperior.forEach((edu, idx) => {
            if (idx < 6) {
              write(page1, edu.modalidad || "", 62, yEdu, 10);
              write(page1, edu.semestres || "", 115, yEdu, 10);
              if (edu.graduado === true || edu.graduado === "SI") write(page1, "X", 180, yEdu, 10);
              else write(page1, "X", 210, yEdu, 10);
              write(page1, edu.titulo || "", 230, yEdu, 9);
              write(page1, edu.mesGrado || "", 425, yEdu, 12);
              write(page1, edu.anoGrado || "", 450, yEdu, 12);
              write(page1, edu.tarjetaProfesional || "", 525, yEdu, 10);
              yEdu += espacioEntreFilas;
            }
          });
        }

        if (Array.isArray(datosUsuario.idiomas)) {
          let yIdioma = 718;
          datosUsuario.idiomas.forEach((idioma, idx) => {
            if (idx < 3) {
              write(page1, idioma.nombre || idioma.idioma || "", 200, yIdioma, 10);
              if (idioma.habla === "R") write(page1, "X", 305, yIdioma, 10);
              if (idioma.habla === "B") write(page1, "X", 320, yIdioma, 10);
              if (idioma.habla === "MB") write(page1, "X", 335, yIdioma, 10);
              if (idioma.lee === "R") write(page1, "X", 350, yIdioma, 10);
              if (idioma.lee === "B") write(page1, "X", 370, yIdioma, 10);
              if (idioma.lee === "MB") write(page1, "X", 385, yIdioma, 10);
              if (idioma.escribe === "R") write(page1, "X", 405, yIdioma, 10);
              if (idioma.escribe === "B") write(page1, "X", 420, yIdioma, 10);
              if (idioma.escribe === "MB") write(page1, "X", 440, yIdioma, 10);
              yIdioma += 20;
            }
          });
        }
      }

      // ========================== PÁGINA 2 =============================
      console.log("💼 Procesando experiencia laboral:", datosUsuario.experienciaLaboral);

      const experiencias = Array.isArray(datosUsuario.experienciaLaboral)
        ? datosUsuario.experienciaLaboral
        : [];

      if (experiencias.length > 0 && pages[1]) {
        const experienciasPorPagina = 4;
        const totalPaginasExperiencia = Math.ceil(experiencias.length / experienciasPorPagina);

        const formatoBaseBytes = await fetch(urlFormato).then(r => r.arrayBuffer());
        const pdfBase = await PDFDocument.load(formatoBaseBytes);

        for (let i = 1; i < totalPaginasExperiencia; i++) {
          const [copiaPagina2] = await pdfDoc.copyPages(pdfBase, [1]);
          pdfDoc.insertPage(pdfDoc.getPageCount() - 1, copiaPagina2);
        }

        const updatedPages = pdfDoc.getPages();

        const bloques = [
          { yBase: 240 },
          { yBase: 373 },
          { yBase: 504 },
          { yBase: 633 },
        ];

        experiencias.forEach((exp, idx) => {
          const paginaIndex = 1 + Math.floor(idx / experienciasPorPagina);
          const posicion = idx % experienciasPorPagina;
          const { yBase } = bloques[posicion];
          const page = updatedPages[paginaIndex];

          if (posicion === 0 && paginaIndex > 1) {
            page.drawText("", {
              x: 200,
              y: page.getSize().height - 60,
              size: 12,
              font: fontBold,
              color: rgb(0, 0, 0),
            });
          }

          write(page, exp.empresa || "", 60, yBase, 10);
          if (exp.tipo === "publica") write(page, "X", 350, yBase, 10);
          else if (exp.tipo === "privada") write(page, "X", 390, yBase, 10);
          write(page, exp.pais || "", 485, yBase, 10);

          write(page, exp.departamento || "", 60, yBase + 30, 10);
          write(page, exp.municipio || "", 235, yBase + 30, 10);
          write(page, exp.emailEntidad || "", 410, yBase + 30, 8);
          write(page, exp.telefono || "", 60, yBase + 60, 10);

          write(page, exp.fechaIngreso?.dia || "", 265, yBase + 60, 10);
          write(page, exp.fechaIngreso?.mes || "", 310, yBase + 60, 10);
          write(page, exp.fechaIngreso?.anio || "", 360, yBase + 60, 10);
          write(page, exp.fechaRetiro?.dia || "", 430, yBase + 60, 10);
          write(page, exp.fechaRetiro?.mes || "", 477, yBase + 60, 10);
          write(page, exp.fechaRetiro?.anio || "", 525, yBase + 60, 10);

          write(page, exp.cargo || "", 60, yBase + 90, 10);
          write(page, exp.dependencia || "", 235, yBase + 90, 10);
          write(page, exp.direccion || "", 410, yBase + 90, 10);
        });
      }

      // ========================== PÁGINA 3 =============================
      // uso la página 3 por índice fijo (más fiable si agregas páginas dinámicas)
      const page3 = pdfDoc.getPages()[2];
      if (page3) {
        const { height } = page3.getSize();

        const t = datosUsuario.tiempoExperiencia || {};
        write(page3, t.servidorPublico?.anos || "", 400, 200, 14);
        write(page3, t.servidorPublico?.meses || "", 450, 200, 14);
        write(page3, t.sectorPrivado?.anos || "", 400, 220, 14);
        write(page3, t.sectorPrivado?.meses || "", 450, 220, 14);
        write(page3, t.independiente?.anos || "", 400, 250, 14);
        write(page3, t.independiente?.meses || "", 450, 250, 14);
        write(page3, t.total?.anos || "", 400, 280, 14);
        write(page3, t.total?.meses || "", 450, 280, 14);

        // Coordenadas sugeridas: AJUSTA SI/NO como necesites.
        // Basadas en la prueba que hiciste (la X roja), están muy cerca de la posición final.
        // SI suele estar a la IZQ del grupo, NO a la DER. Ajusta los valores X.
        const coordInhabilidad = {
          SI: { x: 250, y: 373 }, // <- prueba primero, luego ajusta
          NO: { x: 300, y: 373 }  // <- prueba primero, luego ajusta
        };

        // Dibujo la X usando drawText (queda en primer plano)
        if (datosUsuario.declaracionInhabilidad === "SI") {
          page3.drawText("X", {
            x: coordInhabilidad.SI.x,
            y: height - coordInhabilidad.SI.y,
            size: 12,
            font: fontBold,
            color: rgb(0, 0, 0),
          });
        } else if (datosUsuario.declaracionInhabilidad === "NO") {
          page3.drawText("X", {
            x: coordInhabilidad.NO.x,
            y: height - coordInhabilidad.NO.y,
            size: 12,
            font: fontBold,
            color: rgb(0, 0, 0),
          });
        }

        if (datosUsuario.ciudadDiligenciamiento && datosUsuario.fechaDiligenciamiento) {
          const fechaObj = new Date(datosUsuario.fechaDiligenciamiento);
          const ciudadFecha = `${datosUsuario.ciudadDiligenciamiento}, ${fechaObj.toLocaleDateString("es-CO")}`;
          write(page3, ciudadFecha, 220, 455, 10);
        } else {
          const fechaHoy = new Date();
          const municipio = datosUsuario.direccionCorrespondencia?.municipio || "Bogotá";
          const ciudadFecha = `${municipio}, ${fechaHoy.toLocaleDateString("es-CO")}`;
          write(page3, ciudadFecha, 220, 455, 10);
        }

        if (datosUsuario.firmaServidor) {
          try {
            const firmaBase64 = datosUsuario.firmaServidor.replace(/^data:image\/\w+;base64,/, "");
            const firmaImage = await pdfDoc.embedPng(firmaBase64);
            const firmaDims = firmaImage.scale(0.5);
            const firmaX = 250;
            const firmaY = page3.getSize().height - 500;

            page3.drawImage(firmaImage, {
              x: firmaX,
              y: firmaY,
              width: firmaDims.width,
              height: firmaDims.height,
            });
          } catch (error) {
            console.error("❌ Error al insertar la firma:", error);
          }
        }
      }

      console.log("✅ PDF llenado correctamente");
      return pdfDoc;
    } catch (error) {
      console.error("❌ Error llenando formato oficial:", error);
      throw error;
    }
  }

  async function crearFormatoDesdeCero(pdfDoc) {
    for (let i = 0; i < 3; i++) pdfDoc.addPage([612, 792]);
  }

  async function descargarPDF(pdfDoc, nombreArchivo) {
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = nombreArchivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function calcularTiempoExperiencia(experiencias) {
    let totalPublicoMeses = 0, totalPrivadoMeses = 0, totalIndependienteMeses = 0;

    experiencias.forEach(exp => {
      let fechaIngreso, fechaRetiro;

      if (exp.fechaIngreso) {
        if (typeof exp.fechaIngreso === 'string') {
          fechaIngreso = new Date(exp.fechaIngreso);
        } else {
          fechaIngreso = new Date(
            exp.fechaIngreso.anio || exp.fechaIngreso.año || 2000,
            (exp.fechaIngreso.mes || 1) - 1,
            exp.fechaIngreso.dia || 1
          );
        }
      }

      if (exp.fechaRetiro) {
        if (typeof exp.fechaRetiro === 'string') {
          fechaRetiro = new Date(exp.fechaRetiro);
        } else {
          fechaRetiro = new Date(
            exp.fechaRetiro.anio || exp.fechaRetiro.año || new Date().getFullYear(),
            (exp.fechaRetiro.mes || new Date().getMonth() + 1) - 1,
            exp.fechaRetiro.dia || new Date().getDate()
          );
        }
      }

      if (!fechaIngreso || !fechaRetiro) return;

      const diffTime = fechaRetiro.getTime() - fechaIngreso.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      const mesesDecimal = diffDays / 30;

      const tipo = (exp.tipoEntidad || exp.tipo || "").toLowerCase();

      if (tipo === "publica" || tipo === "pública") {
        totalPublicoMeses += mesesDecimal;
      } else if (tipo === "privada") {
        totalPrivadoMeses += mesesDecimal;
      } else if (tipo === "independiente") {
        totalIndependienteMeses += mesesDecimal;
      }
    });

    const convertirMesesDecimales = (totalMesesDecimal) => {
      const mesesEnteros = Math.floor(totalMesesDecimal);
      const anios = Math.floor(mesesEnteros / 12);
      const meses = mesesEnteros % 12;
      return { anios, meses };
    };

    const publico = convertirMesesDecimales(totalPublicoMeses);
    const privado = convertirMesesDecimales(totalPrivadoMeses);
    const independiente = convertirMesesDecimales(totalIndependienteMeses);
    const totalMesesDecimal = totalPublicoMeses + totalPrivadoMeses + totalIndependienteMeses;
    const total = convertirMesesDecimales(totalMesesDecimal);

    return { publico, privado, independiente, total };
  }

  function mapearDatosUsuario(usuarioLocal) {
    const normalizarFecha = (fecha) => {
      if (!fecha) return { dia: "", mes: "", anio: "" };
      if (typeof fecha === "string" || fecha instanceof Date) {
        const f = new Date(fecha);
        return {
          dia: String(f.getDate()).padStart(2, "0"),
          mes: String(f.getMonth() + 1).padStart(2, "0"),
          anio: String(f.getFullYear())
        };
      }
      return {
        dia: fecha.dia ?? "",
        mes: fecha.mes ?? "",
        anio: fecha.anio ?? ""
      };
    };

    const normalizarInhabilidad = (valor) => {
      if (!valor) return "NO";
      const v = String(valor).trim().toUpperCase();
      if (["SI", "S", "TRUE", "X", "1"].includes(v)) return "SI";
      return "NO";
    };

    const experienciasMapeadas = (usuarioLocal.experienciaLaboral || []).map(exp => ({
      empresa: exp.empresa || "",
      tipo: exp.tipoEntidad ? exp.tipoEntidad.toLowerCase() : "",
      pais: exp.pais || "Colombia",
      departamento: exp.departamento || "",
      municipio: exp.municipio || "",
      emailEntidad: exp.correoEntidad || "",
      telefono: exp.telefonos || "",
      fechaIngreso: exp.fechaIngreso,
      fechaRetiro: exp.fechaRetiro,
      cargo: exp.cargo || "",
      dependencia: exp.dependencia || "",
      direccion: exp.direccion || "",
      tipoEntidad: exp.tipoEntidad || exp.tipo || ""
    }));

    const tiemposCalculados = calcularTiempoExperiencia(experienciasMapeadas);

    return {
      apellido1: usuarioLocal.apellido1 || "",
      apellido2: usuarioLocal.apellido2 || "",
      nombres: usuarioLocal.nombres || "",
      numDocumento: usuarioLocal.numDocumento || "",
      tipoDocumento: usuarioLocal.tipoDocumento || "",
      sexo: usuarioLocal.sexo || "",
      nacionalidad: usuarioLocal.nacionalidad || "",
      pais: usuarioLocal.pais || "Colombia",
      libretaMilitar: usuarioLocal.libretaMilitar || "",
      numeroLibreta: usuarioLocal.numeroLibreta || "",
      dm: usuarioLocal.dm || "",
      fechaNacimiento: usuarioLocal.fechaNacimiento || {},
      direccionCorrespondencia: usuarioLocal.direccionCorrespondencia || {},

      idiomas: (usuarioLocal.idiomas || []).map(i => ({
        nombre: i.nombre || i.idioma || "",
        habla: i.habla || "",
        lee: i.lee || "",
        escribe: i.escribe || ""
      })),

      gradoAprobado: usuarioLocal.gradoBasica || 11,
      tituloBasica: usuarioLocal.tituloBachiller || "Bachiller",
      mesGradoBasica: usuarioLocal.mesGrado || "",
      anoGradoBasica: usuarioLocal.anioGrado || "",

      educacionSuperior: (usuarioLocal.formacionesSuperior || []).map(f => ({
        modalidad: f.modalidad || "",
        semestres: f.semestres || "",
        graduado: f.graduado || "",
        titulo: f.titulo || "",
        mesGrado: f.mesTermino || "",
        anoGrado: f.anioTermino || "",
        tarjetaProfesional: f.tarjeta || ""
      })),

      experienciaLaboral: experienciasMapeadas.map(exp => ({
        ...exp,
        fechaIngreso: normalizarFecha(exp.fechaIngreso),
        fechaRetiro: normalizarFecha(exp.fechaRetiro)
      })),

      tiempoExperiencia: {
        servidorPublico: {
          anos: String(tiemposCalculados.publico.anios),
          meses: String(tiemposCalculados.publico.meses),
        },
        sectorPrivado: {
          anos: String(tiemposCalculados.privado.anios),
          meses: String(tiemposCalculados.privado.meses),
        },
        independiente: {
          anos: String(tiemposCalculados.independiente.anios),
          meses: String(tiemposCalculados.independiente.meses),
        },
        total: {
          anos: String(tiemposCalculados.total.anios),
          meses: String(tiemposCalculados.total.meses),
        },
      },

      declaracionInhabilidad: normalizarInhabilidad(usuarioLocal.declaracionInhabilidad),
      ciudadDiligenciamiento: usuarioLocal.ciudadDiligenciamiento || "",
      fechaDiligenciamiento: usuarioLocal.fechaDiligenciamiento || "",
      firmaServidor: usuarioLocal.firmaServidor || null,
    };
}

function separarDigitos(texto) {
  if (!texto) return "";
  return String(texto).split('').join('  '); // Dos espacios entre cada carácter
}



  return {
    llenarFormatoOficial,
    descargarPDF,
    mapearDatosUsuario,
    separarDigitos,
  };
}
