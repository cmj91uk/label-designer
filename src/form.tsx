import { useForm, SubmitHandler } from 'react-hook-form';
import { buildPdf } from './pdf-builder';
import { FingerSpace, Formation, FullStop, Punctuation } from './icons';
import { EightPerSheet, ILabelFormat, TwentyFourPerSheet } from './label';

interface LessonForm {
    date: Date,
    label: string,
    finger: boolean,
    formation: boolean,
    fullstop: boolean,
    punctuation: boolean,
    labelFormat: 'eight' | 'twentyfour'
}

export const Form = () => {

    const { register, handleSubmit } = useForm<LessonForm>({
        defaultValues: {
            date: new Date(),
            labelFormat: 'eight'
        }
    });

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
        }

        buildPdf(format, new Date(data.date), data.label, images, 10);
    }

    return (
        <div>
            <form onSubmit={handleSubmit(submit)}>
                <input type="date" {...register('date')} />
                <input type="text" {...register('label')} />

                <div>
                    <label>
                        Eight
                        <input type='radio' value='eight' {...register('labelFormat')} />
                    </label>
                    <label>
                        Twenty Four
                        <input type='radio' value='twentyfour' {...register('labelFormat')} />
                    </label>
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