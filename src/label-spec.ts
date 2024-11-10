export interface ILabelSpec {
    useNewLabelDesign: boolean,
    date: Date | undefined,
    objective: string,
    images: string[],
    dateFormat: 'long' | 'short'
}
