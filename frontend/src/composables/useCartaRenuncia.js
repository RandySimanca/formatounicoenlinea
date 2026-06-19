import { ref } from 'vue';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export function useCartaRenuncia() {
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

      const ciudadFecha = `${datos.ciudadExpedicion}, ${datos.fechaRenuncia}`;
      cursorY -= drawText(ciudadFecha, 11, font, margin, 'right');
      cursorY -= 40;

      cursorY -= drawText(datos.nombreJefe, 11, fontBold);
      cursorY -= drawText(datos.cargoJefe, 11, font);
      cursorY -= drawText(datos.nombreEmpresa, 11, font);
      cursorY -= 40;

      cursorY -= drawText(`Respetado(a) ${datos.nombreJefe}:`, 11, font);
      cursorY -= 20;

      const parrafoRenuncia = `Por medio de la presente, yo ${datos.nombreEmpleado}, identificado(a) en el cargo de ${datos.cargoEmpleado}, me permito presentar formalmente mi renuncia irrevocable al cargo que vengo desempeñando en ${datos.nombreEmpresa}, con efectividad a partir del día ${datos.fechaUltimoDia}.`;
      drawWrappedText(parrafoRenuncia, 11, font);
      cursorY -= 10;

      if (datos.motivoOpcional) {
        const parrafoMotivo = `Los motivos que me llevan a tomar esta decisión son: ${datos.motivoOpcional}.`;
        drawWrappedText(parrafoMotivo, 11, font);
        cursorY -= 10;
      }

      if (datos.incluirAgradecimiento) {
        const parrafoAgradecimiento = `Quiero expresar mi sincero agradecimiento a ${datos.nombreEmpresa} y a todo el equipo de trabajo por la oportunidad brindada y las experiencias vividas durante mi tiempo en la organización.`;
        drawWrappedText(parrafoAgradecimiento, 11, font);
        cursorY -= 10;
      }

      const parrafoCierre = "Me comprometo a colaborar en el proceso de transición y entrega del cargo durante el tiempo que reste hasta mi último día de trabajo.";
      drawWrappedText(parrafoCierre, 11, font);
      
      cursorY -= 80;

      drawText("________________________________", 11, fontBold);
      cursorY -= 15;
      drawText(datos.nombreEmpleado.toUpperCase(), 11, fontBold);
      cursorY -= 15;
      drawText(datos.cargoEmpleado, 11, font);

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const kebabName = datos.nombreEmpleado.replace(/\s+/g, '-').toLowerCase() || 'empleado';
      const nombreArchivo = `carta-renuncia-${kebabName}.pdf`;
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
