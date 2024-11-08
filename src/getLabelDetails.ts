import { ILabelFormat } from './label.ts';

export const getLabelDetails: (format: ILabelFormat, x: number, y: number) => { top: number, left:number, width: number, height: number } = (format, x, y) => {
    const left = (x * format.horizontalPitch) + format.leftMargin;
    const top = (y * format.verticalPitch) + format.topMargin;

    return {
        top,
        left,
        width: format.width,
        height: format.height,
    }
}
