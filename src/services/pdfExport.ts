import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportToPdf(elementId: string = 'dpia-document-preview', filename: string = 'DPIA_Assessment.pdf'): Promise<void> {
  let targetElement = document.getElementById(elementId);
  if (!targetElement) {
    targetElement = document.getElementById('dpia-document-preview');
  }

  if (!targetElement) {
    console.error(`Target element with id '${elementId}' not found. Falling back to native print.`);
    window.print();
    return;
  }

  try {
    const canvas = await html2canvas(targetElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      onclone: (clonedDoc) => {
        const clonedElem = clonedDoc.getElementById(elementId) || clonedDoc.getElementById('dpia-document-preview');
        if (clonedElem) {
          clonedElem.style.display = 'block';
          clonedElem.style.position = 'static';
          clonedElem.style.opacity = '1';
          clonedElem.style.backgroundColor = '#ffffff';
          clonedElem.style.color = '#1e293b';

          // Sanitize any child element oklch inline or computed styles
          const allChildren = clonedElem.getElementsByTagName('*');
          for (let i = 0; i < allChildren.length; i++) {
            const child = allChildren[i] as HTMLElement;
            if (child.style) {
              if (child.style.backgroundColor && child.style.backgroundColor.includes('oklch')) {
                child.style.backgroundColor = '#ffffff';
              }
              if (child.style.color && child.style.color.includes('oklch')) {
                child.style.color = '#1e293b';
              }
              if (child.style.borderColor && child.style.borderColor.includes('oklch')) {
                child.style.borderColor = '#cbd5e1';
              }
            }
          }
        }
      },
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(filename);
  } catch (err) {
    console.error('HTML2Canvas PDF generation failed:', err);
    // Graceful fallback to print
    window.print();
  }
}
