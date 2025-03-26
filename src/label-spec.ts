export interface ILabelSpec {
    date: Date | undefined,
    objective: string,
    images: string[],
    dateFormat: 'long' | 'short'
}
