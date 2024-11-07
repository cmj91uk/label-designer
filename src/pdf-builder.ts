declare global {
    interface Window {
        DEBUG: string
    }
}

import jsPDF, { jsPDFOptions } from "jspdf"
import { ILabelFormat } from "./label";
import { ILabelSpec } from "./label-spec";
import { formatDate } from './dateFormatter';

export const buildPdf = async (format: ILabelFormat, labelSpec: ILabelSpec, imageWidth: number = 10) => {
    // Default export is a4 paper, portrait, using millimeters for units
    // Label 24 per sheet = 63.5 x 33.9 mm
    // A4 = 297mm * 210mm

    // 12.9 top margin
    // 12.9 bottom margin

    // finger spaces
    // letter formation
    // full stop
    // capital letter

    //190.5 wide in labels
    // 2 side margins
    // 2 inner margins
    const options: jsPDFOptions = {
        format: 'a4',
        orientation: 'p',
        unit: 'mm',
    }
    const doc = new jsPDF(options);
    doc.setFontSize(14);
        //.setFont('ComicSansMS');

    const { width, height, horizontalPitch, verticalPitch, leftMargin, topMargin, countX, countY } = format;

    const { date, images, objective, dateFormat } = labelSpec;

    const margin = 3;

    let textMaxWidth = width - (2 * margin);
    if (images.length) {
        textMaxWidth = textMaxWidth - imageWidth - margin;
    }
    
    for (let i = 0; i < countY; i++)
    {
        for (let j = 0; j < countX; j++)
        {
            const labelStartX = (horizontalPitch * j) + leftMargin;
            const labelStartY = (verticalPitch * i) + topMargin;

            if (window["DEBUG"] === 'true') {
                // Draw Outer Rectangle
                const stroke = 'S';
                const rectRadius = 5;
                // Slightly inset rounded rectangle
                doc.roundedRect(labelStartX, labelStartY, width, height, rectRadius, rectRadius, stroke);
            }

            const hasDate = date != null;

            const dateTextToDisplay = hasDate ? formatDate(dateFormat, date!) : "";

            const verticalOffset = dateFormat == 'long' ? 14 : 7;
            
            doc.text(dateTextToDisplay, labelStartX + margin, labelStartY + margin, { maxWidth: textMaxWidth, align: 'left', baseline: 'top'});
            doc.text(`LO: ${objective}`, labelStartX + margin, labelStartY + margin + verticalOffset, { maxWidth: textMaxWidth, align: 'left', baseline: 'top' });
            // doc.text(`Start X: ${labelStartX}, Start Y: ${labelStartY}`, labelStartX + margin, labelStartY + margin, { maxWidth: textMaxWidth, align: 'left', baseline: 'top' });
            // doc.text(`End X: ${labelStartX + width}, End Y: ${labelStartY + height}`, labelStartX + margin, labelStartY + margin + 14, { maxWidth: textMaxWidth, align: 'left', baseline: 'top' });

            if (images.length)
            {
                // const imageCount = images.length;
                // const imageTotalSpace = height - ((imageCount + 1) * margin);

                const imageMargins = (height - (imageWidth * images.length)) / (images.length + 1);

                const imageX = labelStartX + margin + textMaxWidth + margin;

                images.forEach(async (img, index) => {
                    const imageStartY = labelStartY + ((index + 1) * imageMargins) + (imageWidth * (index));

                    doc.addImage(img, 'PNG', imageX, imageStartY, imageWidth, imageWidth);
                });
            }

            // images?.forEach((image) => {
            //     const imageX = (horizontalPitch * j) + textMaxWidth;
            //     doc.addImage(image, 'PNG', imageX, labelStartY, imageOnLabel, imageOnLabel);
            // });

        }
    }

    const shortFormatter = new Intl.DateTimeFormat('en-GB');
    doc.save(`${shortFormatter.format(date)}_${objective}.pdf`);

}
