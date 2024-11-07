export interface ILabelFormat {
    countX: number,
    countY: number,
    width: number;
    height: number;
    horizontalPitch: number;
    verticalPitch: number;
    leftMargin: number;
    topMargin: number;
}

export const TwentyFourPerSheet: ILabelFormat = {
    // https://www.labelplanet.co.uk/label-templates-for-rounded-rectangle-labels/label-templates-24-per-sheet-lp24-63/
    countX: 3,
    countY: 8,
    width: 63.5,
    height: 33.9,
    horizontalPitch: 66,
    verticalPitch: 33.9,
    leftMargin: 7.25,
    topMargin: 12.9
}

export const EightPerSheet: ILabelFormat = {
    // https://www.labelplanet.co.uk/label-templates-for-rounded-rectangle-labels/label-templates-8-per-sheet-lp8-99/
    countX: 2,
    countY: 4,
    width: 99.1,
    height: 67.7,
    horizontalPitch: 101.6,
    verticalPitch: 67.7,
    leftMargin: 4.65,
    topMargin: 13.1
}

export const SixtyFivePerSheet: ILabelFormat = {
    // https://www.labelplanet.co.uk/label-templates-for-rounded-rectangle-labels/label-templates-65-per-sheet-lp65-38/
    countX: 5,
    countY: 13,
    width: 38.1,
    height: 21.2,
    horizontalPitch: 40.6,
    verticalPitch: 21.2,
    leftMargin: 4.75,
    topMargin: 10.7
}