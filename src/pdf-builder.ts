import jsPDF, { jsPDFOptions } from "jspdf"
import { ILabelFormat } from "./label";
import { ILabelSpec } from "./label-spec";
import { formatDate } from './dateFormatter';
import { getLabelDetails } from './getLabelDetails.ts';

declare global {
    interface Window {
        DEBUG: string,
        CUSTOM_MODE: string
    }
}

interface ICoords {
    x: number;
    y: number;
    height: number;
    width: number;
}

const drawOuterBox: (doc: jsPDF, coords: ICoords) => void =
    (doc, coords) => {
        if (window.DEBUG === 'true') {

            const { x, y, width, height } = coords;

            // Draw Outer Rectangle
            const stroke = 'S';
            const rectRadius = 5;
            // Slightly inset rounded rectangle
            doc.roundedRect(x, y, width, height, rectRadius, rectRadius, stroke);
        }
    }

// const addLessonObjective: (doc: jsPDF, coords: ICoords, objective: string) => void =
//     (doc, coords, objective) => {
//         const { x, y, width } = coords;
//         doc.text(`LO: ${objective}`, x, y, { maxWidth: width, align: 'left', baseline: 'top' })
//     }
//
// const addDate: (doc: jsPDF, coords: ICoords, date: Date | undefined, dateFormat: "long" | "short") => void =
//     (doc, coords, date, dateFormat) => {
//         const {  x, y, width } = coords;
//         const hasDate = date != null;
//         const formatted = hasDate ? formatDate(dateFormat, date!) : "";
//         doc.text(formatted, x, y, { maxWidth: width, align: 'left', baseline: 'top' })
//     }

const addLabelText = (doc: jsPDF, coords: ICoords, text: string[]) => {
    const { x, y, width } = coords;
    doc.text(text, x, y, { maxWidth: width, align: 'left', baseline: 'top' })
};
const buildLabel = async (doc: jsPDF, labelFormat: ILabelFormat, labelSpec: ILabelSpec, coords: ICoords) => {

    drawOuterBox(doc, coords);

    const margin = 3;
    const usableWidth = coords.width - (2 * margin);
    const usableHeight = coords.height - (2 * margin);
    const usableCoords: ICoords = {
        x: coords.x + margin,
        y: coords.y + margin,
        width: usableWidth,
        height: usableHeight,
    }

    const text: string[] = [];
    if (labelSpec.date != null) {
        text.push(formatDate(labelSpec.dateFormat, labelSpec.date))
        text.push("");
    }
    text.push(`LO: ${labelSpec.objective}`)
    addLabelText(doc, usableCoords, text);

    if (labelSpec.images.length) {
        const imageWidth = labelFormat.imageSize;
        // We've got some images to add!
        const bottomThird = usableHeight / 3;
        const imageTop = 2 * bottomThird;
        const topMargin = (bottomThird - imageWidth) / 2;

        // const imageMargins = (usableWidth - (imageWidth * images.length)) / (images.length + 1);
        const imageMargins = (usableWidth - (imageWidth * labelSpec.images.length)) / (labelSpec.images.length + 1);

        labelSpec.images.forEach((img, index) => {
            const imageX = usableCoords.x + (imageMargins * (index + 1)) + (imageWidth * index);
            const imageY = usableCoords.y + imageTop + topMargin;

            doc.addImage(img, 'PNG', imageX, imageY, imageWidth, imageWidth);
        })
    }
}


const buildPdfNew = async (format: ILabelFormat, labelSpec: ILabelSpec) => {

    const options: jsPDFOptions = {
        format: 'a4',
        orientation: 'p',
        unit: 'mm',
    }
    const doc = new jsPDF(options);
    doc.setFontSize(format.fontSize);

    const { countX, countY } = format;
    for (let x = 0; x < countX; x++) {
        for (let y = 0; y < countY; y++) {
            const { top, left, width, height } = getLabelDetails(format, x, y);
            const coords: ICoords = {
                x: left,
                y: top,
                width,
                height
            }
            await buildLabel(doc, format, labelSpec, coords);
        }
    }

    return doc.save(`${labelSpec.objective}.pdf`);

}

export const buildPdf = async (format: ILabelFormat, labelSpec: ILabelSpec, imageWidth: number = 10) => {
    if (labelSpec.useNewLabelDesign) {
        return buildPdfNew(format, labelSpec);
    } else {
        return buildPdfOld(format, labelSpec, imageWidth);
    }

}

const buildPdfOld = async (format: ILabelFormat, labelSpec: ILabelSpec, imageWidth: number = 8) => {
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
    doc.setFontSize(12);
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

            if (window.DEBUG === 'true') {
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

    const shortFormatter = new Intl.DateTimeFormat('en-GB');
    doc.save(`${shortFormatter.format(date)}_${objective}.pdf`);

}
