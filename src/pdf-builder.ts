import jsPDF from "jspdf"
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

interface TextLayout {
    fontSize: number;
    lineHeight: number;
    maxLines: number;
}

interface ImageLayout {
    width: number;
    spacing: number;
    topOffset: number;
}

export interface IMultiLabelSpec {
    specs: (ILabelSpec | null)[];  // Array of specs, null means leave position empty
    defaultSpec?: ILabelSpec;      // Optional default spec for unfilled positions
}

const isDebugMode = () => window.DEBUG === 'true';

const drawOuterBox = (doc: jsPDF, coords: ICoords): void => {
    if (isDebugMode()) {
        const { x, y, width, height } = coords;
        const rectRadius = 5;
        doc.roundedRect(x, y, width, height, rectRadius, rectRadius, 'S');
    }
};

const calculateTextLayout = (height: number, hasImages: boolean): TextLayout => {
    const baseLayout = {
        fontSize: 12,
        lineHeight: 1.2,
        maxLines: Math.floor(height / (12 * 1.2))
    };

    if (hasImages) {
        return {
            ...baseLayout,
            maxLines: Math.floor(baseLayout.maxLines * 0.6)
        };
    }

    return baseLayout;
};

const calculateImageLayout = (coords: ICoords, imageCount: number, imageSize: number, hasText: boolean): ImageLayout => {
    // Calculate total width needed for images
    const totalImageWidth = imageSize * imageCount;
    // Calculate remaining space
    const remainingSpace = coords.width - totalImageWidth;
    // For multiple images, divide remaining space by gaps between images (count-1) and edges
    const spacing = imageCount > 1 
        ? remainingSpace / (imageCount + 1)
        : remainingSpace / 2; // For single image, split remaining space equally for left/right
    
    return {
        width: imageSize,
        spacing,
        // If no text, center vertically, otherwise position at 60% from top
        topOffset: hasText ? coords.height * 0.6 : (coords.height - imageSize) / 2
    };
};

const addLabelText = (doc: jsPDF, coords: ICoords, text: string[], layout: TextLayout): void => {
    const { x, y, width } = coords;
    doc.setFontSize(layout.fontSize);
    
    // Join the text array with newlines to preserve spacing
    const textContent = text.join('\n');
    doc.text(textContent, x, y, { 
        maxWidth: width, 
        align: 'left', 
        baseline: 'top',
        lineHeightFactor: layout.lineHeight 
    });
};

const addLabelImages = (doc: jsPDF, coords: ICoords, images: string[], layout: ImageLayout): void => {
    images.forEach((img, index) => {
        try {
            // For single image, center it
            // For multiple images, space them evenly with equal gaps
            const imageX = coords.x + layout.spacing + (index * (layout.width + layout.spacing));
            const imageY = coords.y + layout.topOffset;
            doc.addImage(img, 'PNG', imageX, imageY, layout.width, layout.width);
        } catch (error) {
            console.error(`Failed to add image at index ${index}:`, error);
        }
    });
};

const buildLabel = async (doc: jsPDF, labelFormat: ILabelFormat, labelSpec: ILabelSpec, coords: ICoords): Promise<void> => {
    drawOuterBox(doc, coords);

    const margin = 4;
    const usableCoords: ICoords = {
        x: coords.x + margin,
        y: coords.y + margin,
        width: coords.width - (2 * margin),
        height: coords.height - (2 * margin)
    };

    // Prepare text content
    const text: string[] = [];
    if (labelSpec.date != null) {
        text.push(formatDate(labelSpec.dateFormat, labelSpec.date));
    }
    // Add objective text
    if (labelSpec.objective && labelSpec.objective.length > 0) {
        text.push(labelSpec.objective);
    }

    const hasText = text.length > 0;

    // Calculate layouts
    const textLayout = calculateTextLayout(usableCoords.height, labelSpec.images.length > 0);
    const imageLayout = labelSpec.images.length > 0 
        ? calculateImageLayout(usableCoords, labelSpec.images.length, labelFormat.imageSize, hasText)
        : null;

    // Add content
    if (hasText) {
        addLabelText(doc, usableCoords, text, textLayout);
    }
    if (imageLayout && labelSpec.images.length > 0) {
        addLabelImages(doc, usableCoords, labelSpec.images, imageLayout);
    }
};

export const buildPdf = async (format: ILabelFormat, labelSpecs: ILabelSpec | IMultiLabelSpec): Promise<jsPDF> => {
    try {
        // Input validation
        if (!format || !labelSpecs) {
            throw new Error('Invalid input: format and labelSpecs are required');
        }

        // Initialize PDF
        const doc = new jsPDF({
            format: 'a4',
            orientation: 'p',
            unit: 'mm',
        });

        doc.setFontSize(format.fontSize);

        // Generate labels
        const { countX, countY } = format;
        const labelsPerPage = countX * countY;

        if ('specs' in labelSpecs) {
            // Multi-label case
            const totalLabels = labelSpecs.specs.filter(spec => spec !== null).length;
            const totalPages = Math.ceil(totalLabels / labelsPerPage);

            for (let page = 0; page < totalPages; page++) {
                // Add a new page for all pages except the first
                if (page > 0) {
                    doc.addPage();
                }

                // Calculate the start and end indices for this page
                const startIdx = page * labelsPerPage;
                const endIdx = Math.min((page + 1) * labelsPerPage, labelSpecs.specs.length);

                // Get the specs for this page
                const pageSpecs = labelSpecs.specs.slice(startIdx, endIdx);

                // Fill the page with labels
                for (let y = 0; y < countY; y++) {
                    for (let x = 0; x < countX; x++) {
                        const position = y * countX + x;
                        if (position >= pageSpecs.length) break;

                        const spec = pageSpecs[position];
                        if (spec) {
                            if (spec.images.length > 3) {
                                throw new Error(`Maximum of 3 images allowed per label at position ${position + startIdx}`);
                            }
                            const { top, left, width, height } = getLabelDetails(format, x, y);
                            const coords: ICoords = { x: left, y: top, width, height };
                            await buildLabel(doc, format, spec, coords);
                        }
                    }
                }
            }
        } else {
            // Single label case - use same spec for all positions
            if (labelSpecs.images.length > 3) {
                throw new Error('Maximum of 3 images allowed per label');
            }

            for (let y = 0; y < countY; y++) {
                for (let x = 0; x < countX; x++) {
                    const { top, left, width, height } = getLabelDetails(format, x, y);
                    const coords: ICoords = { x: left, y: top, width, height };
                    await buildLabel(doc, format, labelSpecs, coords);
                }
            }
        }

        // Save PDF with a default name
        doc.save('label-sheet.pdf');
        return doc;
    } catch (error) {
        console.error('PDF generation failed:', error);
        throw error;
    }
};
