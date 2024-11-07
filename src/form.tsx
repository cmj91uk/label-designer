import { useForm, SubmitHandler } from 'react-hook-form';
import { buildPdf } from './pdf-builder';
import { FingerSpace, Formation, FullStop, Punctuation } from './icons';
import { EightPerSheet, ILabelFormat, SixtyFivePerSheet, TwentyFourPerSheet } from './label';
import { ILabelSpec } from './label-spec';
import { formatDate } from './dateFormatter';

interface LessonForm {
    showDate: boolean,
    date?: Date,
    label: string,
    finger: boolean,
    formation: boolean,
    fullstop: boolean,
    punctuation: boolean,
    labelFormat: 'eight' | 'twentyfour' | 'sixtyfive',
    dateFormat: 'long' | 'short'
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isValidDate = (d: any) => {
    return d instanceof Date && !isNaN(d.valueOf());
}

export const Form = () => {

    const { register, handleSubmit, watch } = useForm<LessonForm>({
        defaultValues: {
            showDate: true,
            labelFormat: 'twentyfour',
            dateFormat: 'long'
        }
    });

    const showDate = watch('showDate');

    const submit: SubmitHandler<LessonForm> = (data) => {
        const images: string[] = [];
        if (data.finger) {
            images.push(FingerSpace);
        }
        if (data.formation) {
            images.push(Formation);
        }
        if (data.fullstop) {
            images.push(FullStop);
        }
        if (data.punctuation) {
            images.push(Punctuation);
        }

        let format: ILabelFormat = TwentyFourPerSheet;
        switch (data.labelFormat) {
            case 'eight':
                format = EightPerSheet
                break;
            case 'twentyfour':
                format = TwentyFourPerSheet
                break;
            case 'sixtyfive':
                format = SixtyFivePerSheet
                break;
        }

        const labelSpec: ILabelSpec = {
            date: showDate && isValidDate(data.date) ? data.date : undefined,
            objective: data.label,
            images,
            dateFormat: data.dateFormat,
        }

        buildPdf(format, labelSpec);
    }

    const longFormat = formatDate('long', new Date());
    const shortFormat = formatDate('short', new Date());

    return (
        <div className='label-app'>
            <form onSubmit={handleSubmit(submit)}>

                <div className='label-sizing'>
                    <div className='is-size-4'>
                        Labels Per Page
                    </div>
                    <div className='label-sizing-options'>
                        <label className='radio'>
                            <input type='radio' value='eight' {...register('labelFormat')} />
                            Eight
                        </label>
                        <label className='radio'>
                            <input type='radio' value='twentyfour' {...register('labelFormat')} />
                            Twenty Four
                        </label>
                        <label className='radio'>
                            <input type='radio' value='sixtyfive' {...register('labelFormat')} />
                            Sixty Five
                        </label>
                    </div>
                </div>

                <hr />

                <div className='label-sizing'>
                    <div className='is-size-4'>
                        Dates
                    </div>
                    <div className='show-date-picker'>
                        <label className='checkbox'>
                            <input type="checkbox" {...register('showDate')} />
                            Show Date?
                        </label>
                    </div>
                    {showDate ?
                        (
                            <>
                                <span className='is-size-4'>Date Format</span>
                                <div className='control label-sizing-options'>
                                    <label className='radio'>
                                        <input type='radio' value='long' {...register('dateFormat')} />
                                        Long ({longFormat})
                                    </label>
                                    <label className='radio'>
                                        <input type='radio' value='short' {...register('dateFormat')} />
                                        Short ({shortFormat})
                                    </label>
                                </div>
                            </>
                        ) : null}
                    {showDate ? (
                        <div>
                            <div className='is-size-4'>
                                Label Date
                            </div>
                            <div>
                                <input className='input' type="date" defaultValue={'23/09/2024'} {...register('date', { valueAsDate: true })} />
                            </div>
                        </div>
                    ) : null}
                </div>

                <hr />
                <div className='text-section'>
                    <div className='is-size-4'>
                        Lesson Objective
                    </div>
                    <input className='input' type="text" placeholder="Lesson Objective" {...register('label')} />
                </div>

                <hr />

                <div>
                    <div className='is-size-4'>
                        Icons
                    </div>
                    <div className='checkboxes'>
                        <div>
                            <label className='checkbox'>
                                <input type="checkbox" {...register('finger')} />
                                Finger Spaces
                            </label>
                        </div>

                        <div>
                            <label className='checkbox'>
                                <input type="checkbox" {...register('fullstop')} />
                                Full Stop
                            </label>
                        </div>

                        <div>
                            <label className='checkbox'>
                                <input type="checkbox" {...register('formation')} />
                                Letter Formation
                            </label>
                        </div>

                        <div>
                            <label className='checkbox'>
                                <input type="checkbox" {...register('punctuation')} />
                                Punctuation
                            </label>
                        </div>
                    </div>
                </div>

                <hr />

                <button className='button is-primary' type="submit">Download</button>
            </form>
        </div>
    );
}