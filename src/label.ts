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
    countX: 2,
    countY: 4,
    width: 99.1,
    height: 67.7,
    horizontalPitch: 101.6,
    verticalPitch: 67.7,
    leftMargin: 4.65,
    topMargin: 13.1
}