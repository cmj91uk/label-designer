import jsPDF, { jsPDFOptions } from "jspdf"
import { ILabelFormat } from "./label.ts";
import { ILabelSpec } from "./label-spec.ts";
import { formatDate } from './dateFormatter.ts';
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

const addLabelText = (doc: jsPDF, coords: ICoords, text: string[]) => {
    const { x, y, width } = coords;
    doc.text(text, x, y, { maxWidth: width, align: 'left', baseline: 'top' })
};

const buildLabel = async (doc: jsPDF, labelFormat: ILabelFormat, labelSpec: ILabelSpec, coords: ICoords) => {

    drawOuterBox(doc, coords);

    const margin = 4;
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
    if (labelSpec.objective.length > 0) {
        text.push(`${labelSpec.objective}`)
    }
    addLabelText(doc, usableCoords, text);

    const hasText = text.length > 0;

    if (labelSpec.images.length) {
        const imageWidth = labelFormat.imageSize;
        // We've got some images to add!
        const bottomThird = usableHeight / 3;
        const imageTop = hasText ? (2 * bottomThird) : bottomThird;
        const topMargin = (bottomThird - imageWidth) / 2;

        const imageMargins = (usableWidth - (imageWidth * labelSpec.images.length)) / (labelSpec.images.length + 1);

        labelSpec.images.forEach((img, index) => {
            const imageX = usableCoords.x + (imageMargins * (index + 1)) + (imageWidth * index);
            const imageY = usableCoords.y + imageTop + topMargin;

            doc.addImage(img, 'PNG', imageX, imageY, imageWidth, imageWidth);
        })
    }
}

export const buildPdf = async (format: ILabelFormat, labelSpec: ILabelSpec) => {
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
