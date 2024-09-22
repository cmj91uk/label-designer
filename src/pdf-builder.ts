import jsPDF from "jspdf"
import { ILabelFormat } from "./label";

export const buildPdf = (format: ILabelFormat, date: Date, labelText: string, images: string[], imageWidth: number) => {
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
    const doc = new jsPDF();
    doc.setFontSize(14);
        //.setFont('ComicSansMS');

    const { width, height, horizontalPitch, verticalPitch, leftMargin, topMargin, countX, countY } = format;

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

            // Draw Outer Rectangle
            // const stroke = 'S';
            // const rectRadius = 5;
            // Slightly inset rounded rectangle
            // doc.roundedRect(labelStartX + 1, labelStartY + 1, width - 2, height - 2, rectRadius, rectRadius, stroke);
            
            const dateFormatter = new Intl.DateTimeFormat('en-GB');
            doc.text(dateFormatter.format(date), labelStartX + margin, labelStartY + margin, { maxWidth: textMaxWidth, align: 'left', baseline: 'top'});
            doc.text(`LO: ${labelText}`, labelStartX + margin, labelStartY + margin + 7, { maxWidth: textMaxWidth, align: 'left', baseline: 'top' });

            if (images.length)
            {
                // const imageCount = images.length;
                // const imageTotalSpace = height - ((imageCount + 1) * margin);

                const imageMargins = (height - (imageWidth * images.length)) / (images.length + 1);

                const imageX = labelStartX + margin + textMaxWidth + margin;

                images.forEach((img, index) => {
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

    doc.save('24persheet.pdf');

}