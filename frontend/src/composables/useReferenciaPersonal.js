import { ref } from 'vue';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export function useReferenciaPersonal() {
  const generando = ref(false);
  const error = ref(null);

  async function generarYDescargar(datos) {
    generando.value = true;
    error.value = null;

    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([612, 792]);

      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      
      const { width, height } = page.getSize();
      const margin = 72;
      const contentWidth = width - margin * 2;
      
      let cursorY = height - margin;

      const drawText = (text, size = 11, type = font, x = margin, align = 'left') => {
        if (!text) return 0;
        const textWidth = type.widthOfTextAtSize(text, size);
        let currentX = x;
        if (align === 'right') currentX = width - margin - textWidth;
        if (align === 'center') currentX = (width - textWidth) / 2;

        page.drawText(text, {
          x: currentX,
          y: cursorY,
          size,
          font: type,
          color: rgb(0, 0, 0),
        });
        return size + 4;
      };

      const drawWrappedText = (text, size = 11, type = font, x = margin) => {
        if (!text) return 0;
        const words = text.split(' ');
        let line = '';
        let heightTaken = 0;
        const lineHeight = size + 6;

        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const testWidth = type.widthOfTextAtSize(testLine, size);
          if (testWidth > contentWidth && n > 0) {
            page.drawText(line, { x, y: cursorY, size, font: type, color: rgb(0, 0, 0) });
            line = words[n] + ' ';
            cursorY -= lineHeight;
            heightTaken += lineHeight;
          } else {
            line = testLine;
          }
        }
        page.drawText(line, { x, y: cursorY, size, font: type, color: rgb(0, 0, 0) });
        cursorY -= lineHeight;
        heightTaken += lineHeight;
        return heightTaken;
      };

      const ciudadFecha = `${datos.ciudadExpedicion}, ${datos.fechaExpedicion}`;
      cursorY -= drawText(ciudadFecha, 11, font, margin, 'right');
      cursorY -= 40;

      cursorY -= drawText(datos.aQuienVaDirigida, 11, fontBold);
      cursorY -= 40;

      cursorY -= drawText("Respetados señores:", 11, font);
      cursorY -= 20;

      const parrafoPresentacion = `Yo, ${datos.nombreReferente}, identificado(a) con ${datos.tipoDocumentoReferente} No. ${datos.numeroDocumentoReferente}, ${datos.ocupacionReferente}, me permito presentar esta carta de referencia personal en favor de ${datos.nombreRecomendado}, identificado(a) con ${datos.tipoDocumentoRecomendado} No. ${datos.numeroDocumentoRecomendado}, a quien conozco en calidad de ${datos.relacionConRecomendado} desde hace ${datos.tiempoConociendolo}.`;
      drawWrappedText(parrafoPresentacion, 11, font);
      cursorY -= 10;

      let cualidadesUnidas = '';
      if (datos.cualidades.length === 1) {
        cualidadesUnidas = datos.cualidades[0];
      } else if (datos.cualidades.length === 2) {
        cualidadesUnidas = `${datos.cualidades[0]} y ${datos.cualidades[1]}`;
      } else if (datos.cualidades.length > 2) {
        const last = datos.cualidades.pop();
        cualidadesUnidas = `${datos.cualidades.join(', ')} y ${last}`;
        datos.cualidades.push(last);
      }

      const parrafoCualidades = `Durante el tiempo que llevo conociéndolo(a), puedo dar fe de que ${datos.nombreRecomendado} es una persona de reconocida ${cualidadesUnidas}, cualidades que he podido verificar de manera personal en distintas situaciones.`;
      drawWrappedText(parrafoCualidades, 11, font);
      cursorY -= 10;

      if (datos.comentarioAdicional) {
        drawWrappedText(datos.comentarioAdicional, 11, font);
        cursorY -= 10;
      }

      let correoTexto = datos.correoReferente ? ` o al correo ${datos.correoReferente}` : '';
      const parrafoCierre = `En virtud de lo anterior, recomiendo ampliamente a ${datos.nombreRecomendado} y me pongo a disposición para ampliar esta información en caso de ser requerido(a). Pueden comunicarse conmigo al teléfono ${datos.telefonoReferente}${correoTexto}.`;
      drawWrappedText(parrafoCierre, 11, font);
      
      cursorY -= 80;

      drawText("________________________________", 11, fontBold);
      cursorY -= 15;
      drawText(datos.nombreReferente.toUpperCase(), 11, fontBold);
      cursorY -= 15;
      drawText(`${datos.tipoDocumentoReferente} No. ${datos.numeroDocumentoReferente}`, 11, font);
      cursorY -= 15;
      drawText(datos.ocupacionReferente, 11, font);

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const kebabName = datos.nombreRecomendado.replace(/\s+/g, '-').toLowerCase() || 'recomendado';
      const nombreArchivo = `referencia-personal-${kebabName}.pdf`;
      link.download = nombreArchivo;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (err) {
      console.error("Error generando PDF:", err);
      error.value = "Ocurrió un error al generar el PDF. Verifica los datos e intenta nuevamente.";
    } finally {
      generando.value = false;
    }
  }

  return { generando, error, generarYDescargar };
}
