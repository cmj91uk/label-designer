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
        <div>
            <form onSubmit={handleSubmit(submit)}>

                <div className='label-sizing'>
                    Labels Per Page
                    <div className='label-sizing-options'>
                        <label>
                            Eight
                            <input type='radio' value='eight' {...register('labelFormat')} />
                        </label>
                        <label>
                            Twenty Four
                            <input type='radio' value='twentyfour' {...register('labelFormat')} />
                        </label>
                        <label>
                            Sixty Five
                            <input type='radio' value='sixtyfive' {...register('labelFormat')} />
                        </label>
                    </div>
                </div>

                <div className='label-sizing'>
                    <div>
                        Show Date? <input type="checkbox" {...register('showDate')} />
                    </div>
                    {showDate ?
                        (
                            <>
                                <span>Date Format</span>
                                <div className='label-sizing-options'>
                                    <label>
                                        Long ({longFormat})
                                        <input type='radio' value='long' {...register('dateFormat')} />
                                    </label>
                                    <label>
                                        Short ({shortFormat})
                                        <input type='radio' value='short' {...register('dateFormat')} />
                                    </label>
                                </div>
                            </>
                        ) : null}
                </div>

                <div className='text-section'>
                    {showDate ? (<input type="date" defaultValue={'23/09/2024'} {...register('date', { valueAsDate: true })} />) : null}
                    <input type="text" placeholder="Lesson Objective" {...register('label')} />
                </div>

                <div className='checkboxes'>
                    <div>
                        <label className='form-control'>
                            Finger Spaces
                            <input type="checkbox" {...register('finger')} />
                        </label>
                    </div>

                    <div>
                        <label className='form-control'>
                            Full Stop
                            <input type="checkbox" {...register('fullstop')} />
                        </label>
                    </div>

                    <div>
                        <label className='form-control'>
                            Letter Formation
                            <input type="checkbox" {...register('formation')} />
                        </label>
                    </div>

                    <div>
                        <label className='form-control'>
                            Punctuation
                            <input type="checkbox" {...register('punctuation')} />
                        </label>
                    </div>

                </div>

                <button type="submit">Download</button>
            </form>
        </div>
    );
}