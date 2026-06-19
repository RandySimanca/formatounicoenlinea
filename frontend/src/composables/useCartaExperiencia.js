import { ref } from 'vue';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export function useCartaExperiencia() {
  const generando = ref(false);
  const error = ref(null);

  async function generarYDescargar(datos) {
    generando.value = true;
    error.value = null;

    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([612, 792]); // Tamaño Carta

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
        return size + 4; // return height taken
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

      // 1. Ciudad y fecha de expedición
      const ciudadFecha = `${datos.ciudadExpedicion}, ${datos.fechaExpedicion}`;
      cursorY -= drawText(ciudadFecha, 11, font, margin, 'right');
      cursorY -= 40;

      // 2. Destinatario
      cursorY -= drawText(datos.aQuienVaDirigida, 11, fontBold);
      cursorY -= 40;

      // 3. Saludo
      cursorY -= drawText("Respetados señores:", 11, font);
      cursorY -= 20;

      // 4. Párrafo principal
      const fechaFinStr = datos.fechaFin ? `${datos.fechaFin}` : 'la fecha actual';
      const parrafoPrincipal = `${datos.nombreEmpresa}, identificada con NIT ${datos.nitEmpresa}, certifica que ${datos.nombreTrabajador}, identificado(a) con ${datos.tipoDocumento} No. ${datos.numeroDocumento}, prestó sus servicios en el cargo de ${datos.cargo} mediante contrato a ${datos.tipoContrato}, desde el ${datos.fechaInicio} hasta ${fechaFinStr}, devengando un salario mensual de $${datos.salario}.`;
      
      drawWrappedText(parrafoPrincipal, 11, font);
      cursorY -= 10;

      // 5. Párrafo de funciones
      if (datos.funcionesPrincipales) {
        const parrafoFunciones = `Entre sus principales funciones se encontraban: ${datos.funcionesPrincipales}.`;
        drawWrappedText(parrafoFunciones, 11, font);
        cursorY -= 10;
      }

      // 6. Párrafo de cierre
      const parrafoCierre = "La presente certificación se expide a solicitud del interesado para los fines que estime convenientes.";
      drawWrappedText(parrafoCierre, 11, font);
      
      cursorY -= 80; // Espacio para firma

      // 7. Firma
      drawText("________________________________", 11, fontBold);
      cursorY -= 15;
      drawText(datos.representanteLegal.toUpperCase(), 11, fontBold);
      cursorY -= 15;
      drawText(datos.cargoRepresentante, 11, font);
      cursorY -= 15;
      drawText(datos.nombreEmpresa, 11, fontBold);

      const pdfBytes = await pdfDoc.save();
      
      // Crear blob y descargar
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const nombreArchivo = `carta-experiencia-${datos.nombreTrabajador.replace(/\s+/g, '-').toLowerCase() || 'trabajador'}.pdf`;
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
