import { ref } from 'vue';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export function useDerechoPeticion() {
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

      cursorY -= drawText("DERECHO DE PETICIÓN", 13, fontBold, margin, 'center');
      cursorY -= 15;
      cursorY -= drawText("(Artículo 23 Constitución Política de Colombia — Ley 1437 de 2011)", 11, font, margin, 'center');
      cursorY -= 30;

      const ciudadFecha = `${datos.ciudadExpedicion}, ${datos.fechaExpedicion}`;
      cursorY -= drawText(ciudadFecha, 11, font, margin, 'right');
      cursorY -= 30;

      cursorY -= drawText("Señor(a):", 11, fontBold);
      cursorY -= drawText(datos.cargoDestinatario, 11, fontBold);
      cursorY -= drawText(datos.nombreDestinatario, 11, fontBold);
      cursorY -= drawText(datos.ciudadDestinatario, 11, fontBold);
      cursorY -= 30;

      cursorY -= drawText("Respetado(a) señor(a):", 11, font);
      cursorY -= 20;

      let correoSolicitanteTexto = datos.correoDeSolicitante ? `, correo ${datos.correoDeSolicitante}` : '';
      const parrafoIdentificacion = `Yo, ${datos.nombreSolicitante}, identificado(a) con ${datos.tipoDocumento} No. ${datos.numeroDocumento}, domiciliado(a) en ${datos.direccionSolicitante}, ciudad de ${datos.ciudadSolicitante}, teléfono ${datos.telefonoSolicitante}${correoSolicitanteTexto}, en pleno uso de mis derechos constitucionales, respetuosamente me dirijo a usted para hacer uso del derecho de petición consagrado en el artículo 23 de la Constitución Política de Colombia y la Ley 1437 de 2011, en relación con el siguiente asunto:`;
      drawWrappedText(parrafoIdentificacion, 11, font);
      cursorY -= 20;

      cursorY -= drawText("HECHOS:", 11, fontBold);
      drawWrappedText(datos.hechos, 11, font);
      cursorY -= 20;

      cursorY -= drawText("PETICIÓN CONCRETA:", 11, fontBold);
      drawWrappedText(datos.peticionConcreta, 11, font);
      cursorY -= 20;

      const parrafoLegal = "De conformidad con el artículo 14 de la Ley 1437 de 2011 (Código de Procedimiento Administrativo y de lo Contencioso Administrativo), solicito respetuosamente dar respuesta a la presente petición dentro de los quince (15) días hábiles siguientes a su recepción.";
      drawWrappedText(parrafoLegal, 11, font);
      cursorY -= 20;

      let correoNotifTexto = datos.correoDeSolicitante ? `, o al correo electrónico ${datos.correoDeSolicitante}` : '';
      const parrafoNotificacion = `Para notificaciones me permito indicar mi dirección: ${datos.direccionSolicitante}, ${datos.ciudadSolicitante}${correoNotifTexto}.`;
      drawWrappedText(parrafoNotificacion, 11, font);
      
      cursorY -= 80;

      drawText("________________________________", 11, fontBold);
      cursorY -= 15;
      drawText(datos.nombreSolicitante.toUpperCase(), 11, fontBold);
      cursorY -= 15;
      drawText(`${datos.tipoDocumento} No. ${datos.numeroDocumento}`, 11, font);

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const kebabName = datos.nombreSolicitante.replace(/\s+/g, '-').toLowerCase() || 'solicitante';
      const nombreArchivo = `derecho-peticion-${kebabName}.pdf`;
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
