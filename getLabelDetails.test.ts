import { getLabelDetails } from './src/pdf-builder';
import { describe, expect, it } from '@jest/globals';
import { EightPerSheet } from './src/label';

describe('getLabelDetails', () => {
    it('should return the width from the label spec', () => {
        const { width } = getLabelDetails(EightPerSheet, 0, 0)
        expect(width).toBe(EightPerSheet.width);
    });

    it('should return the height from the label spec', () => {
        const { height } = getLabelDetails(EightPerSheet, 0, 0)
        expect(height).toBe(EightPerSheet.height);
    });

    it('should return left margin for labels in the first column', () => {
        const firstRowFirstColumn = getLabelDetails(EightPerSheet, 0, 0)
        expect(firstRowFirstColumn.left).toBe(EightPerSheet.leftMargin);

        const secondRowFirstColumn = getLabelDetails(EightPerSheet, 0, 1);
        expect(secondRowFirstColumn.left).toBe(EightPerSheet.leftMargin);
    })

    it('should return the top margin for labels in the first row', () => {
        const firstRowFirstColumn = getLabelDetails(EightPerSheet, 0, 0)
        expect(firstRowFirstColumn.top).toBe(EightPerSheet.topMargin);;

        const firstRowSecondColumn = getLabelDetails(EightPerSheet, 1, 0);
        expect(firstRowSecondColumn.top).toBe(EightPerSheet.topMargin);

    })
})
