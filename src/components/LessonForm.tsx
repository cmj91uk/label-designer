/* AI-Generated Code Start
 * Generated on: 2024-03-16
 * Purpose: Lesson form component based on JSON schema
 * Generator: Cursor AI
 */

import React from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { TextArea, Select, Checkbox } from './FormControls';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { buildPdf } from '../pdf-builder';
import { ILabelSpec } from '../label-spec';
import {
  EightPerSheet,
  FourteenPerSheet,
  EighteenPerSheet,
  TwentyOnePerSheet,
  TwentyFourPerSheet,
  SixtyFivePerSheet,
  ILabelFormat
} from '../label';

// Import icon assets
import { FingerSpace, Formation, FullStop, Punctuation, Capital, PencilGrip, GreatIdeas, PhonicsSkills, Target, Ascenders, Spade } from '../icons';

interface Icon {
  name: string;
  enabled: boolean;
  image: string;
}

interface LessonFormData {
  lessonObjective: string;
  useDate: boolean;
  date?: string;
  dateFormat: 'long' | 'short';
  labelsPerSheet: number;
  icons: Icon[];
}

const LABELS_PER_SHEET_OPTIONS = [
  { value: '8', label: '8 Labels' },
  { value: '14', label: '14 Labels' },
  { value: '18', label: '18 Labels' },
  { value: '21', label: '21 Labels' },
  { value: '24', label: '24 Labels' },
  { value: '65', label: '65 Labels' },
];

const AVAILABLE_ICONS: Icon[] = [
  { name: "Finger Spaces", enabled: false, image: FingerSpace },
  { name: "Full Stop", enabled: false, image: FullStop },
  { name: "Letter Formation", enabled: false, image: Formation },
  { name: "Punctuation", enabled: false, image: Punctuation },
  { name: "Capital Letters", enabled: false, image: Capital },
  { name: "Pencil Grip", enabled: false, image: PencilGrip },
  { name: "Phonics Skills", enabled: false, image: PhonicsSkills },
  { name: "Great Ideas", enabled: false, image: GreatIdeas },
  { name: "Ascenders", enabled: false, image: Ascenders },
  { name: "Target", enabled: false, image: Target },
  { name: "Digging Deeper", enabled: false, image: Spade },
];

const LABEL_FORMATS: { [key: string]: ILabelFormat } = {
  '8': EightPerSheet,
  '14': FourteenPerSheet,
  '18': EighteenPerSheet,
  '21': TwentyOnePerSheet,
  '24': TwentyFourPerSheet,
  '65': SixtyFivePerSheet,
};

export const LessonForm: React.FC = () => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LessonFormData>({
    defaultValues: {
      lessonObjective: '',
      useDate: false,
      date: '',
      dateFormat: 'short',
      labelsPerSheet: 8,
      icons: AVAILABLE_ICONS,
    }
  });

  const useDate = watch('useDate');
  const iconValues = watch('icons');

  const selectedIconsCount = iconValues?.filter(icon => icon.enabled).length || 0;
  const MAX_ICONS = 3;

  const onSubmit: SubmitHandler<LessonFormData> = async (data) => {
    const labelsPerSheet = parseInt(data.labelsPerSheet.toString(), 10);
    const format = LABEL_FORMATS[labelsPerSheet];

    if (!format) {
      console.error('Invalid label format');
      return;
    }

    const selectedIcons = data.icons
      .filter(icon => icon.enabled)
      .map(icon => icon.image);

    const labelSpec: ILabelSpec = {
      useNewLabelDesign: true,
      date: data.useDate ? new Date(data.date!) : undefined,
      objective: data.lessonObjective,
      images: selectedIcons,
      dateFormat: data.dateFormat
    };

    try {
      await buildPdf(format, labelSpec);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto p-6 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-gray-100">MSJ Label Builder</h2>

      <TextArea
        label="Lesson Objective"
        register={register}
        error={errors.lessonObjective?.message}
        placeholder="Enter the main objective of the lesson"
        rows={3}
        className="bg-gray-700 text-gray-100 border-gray-600 focus:border-fuchsia-400 placeholder-gray-400"
        {...register("lessonObjective")}
      />

      <Checkbox
        label="Include Date"
        register={register}
        error={errors.useDate?.message}
        {...register("useDate")}
      />

      {useDate && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-200 mb-1">
            Date
          </label>
          <Controller
            control={control}
            name="date"
            rules={{
              validate: (value) => {
                if (useDate && !value) {
                  return "Date is required when 'Include Date' is checked";
                }
                return true;
              }
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <DatePicker
                  selected={value ? new Date(value) : null}
                  onChange={(date) => onChange(date?.toISOString().split('T')[0])}
                  dateFormat="yyyy-MM-dd"
                  className={`
                    w-full px-3 py-2 border rounded-md shadow-sm
                    bg-gray-700 text-gray-100
                    focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:border-fuchsia-400
                    ${error ? 'border-red-500' : 'border-gray-600'}
                    placeholder-gray-400
                  `}
                  placeholderText="Select a date"
                />
                {error && (
                  <p className="mt-1 text-sm text-red-400">{error.message}</p>
                )}
              </>
            )}
          />

          <div className="mt-3">
            <Select
              label="Date Format"
              register={register}
              error={errors.dateFormat?.message}
              options={[
                { value: 'short', label: 'Short (1/1/2024)' },
                { value: 'long', label: 'Long (Monday 1st January 2024)' }
              ]}
              className="bg-gray-700 text-gray-100 border-gray-600 focus:border-fuchsia-400"
              {...register("dateFormat")}
            />
          </div>
        </div>
      )}

      <Select
        label="Labels Per Sheet"
        register={register}
        error={errors.labelsPerSheet?.message}
        options={LABELS_PER_SHEET_OPTIONS}
        className="mb-4 bg-gray-700 text-gray-100 border-gray-600 focus:border-fuchsia-400"
        {...register("labelsPerSheet", {
          required: "Labels per sheet is required",
          validate: (value) => {
            const numValue = parseInt(value.toString(), 10);
            return [8, 14, 18, 21, 24, 65].includes(numValue) || "Invalid number of labels per sheet";
          }
        })}
      />

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-200 mb-2">
          Icons (Select up to {MAX_ICONS})
          <span className="ml-2 text-sm text-gray-400">
            {selectedIconsCount} of {MAX_ICONS} selected
          </span>
        </label>
        {errors.icons && (
          <p className="text-sm text-red-400 mb-2">{errors.icons.message}</p>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {AVAILABLE_ICONS.map((icon, index) => {
            const inputId = `icon-${index}`;
            const isSelected = iconValues?.[index]?.enabled;
            const isDisabled = !isSelected && selectedIconsCount >= MAX_ICONS;

            return (
              <label
                key={icon.name}
                htmlFor={inputId}
                className={`
                  h-16 p-3 rounded-lg cursor-pointer select-none
                  transition-all duration-200 ease-in-out
                  flex items-center justify-center
                  ${isSelected
                    ? 'bg-fuchsia-900 border-2 border-fuchsia-400 text-fuchsia-100 shadow-lg'
                    : isDisabled
                      ? 'bg-gray-800 border-2 border-transparent text-gray-500 cursor-not-allowed'
                      : 'bg-gray-700 border-2 border-transparent hover:bg-gray-600 text-gray-200'
                  }
                `}
              >
                <input
                  type="checkbox"
                  id={inputId}
                  disabled={isDisabled}
                  className="sr-only"
                  {...register(`icons.${index}.enabled`, {
                    onChange: (e) => {
                      if (e.target.checked && selectedIconsCount >= MAX_ICONS) {
                        e.preventDefault();
                        return false;
                      }
                    }
                  })}
                />
                <span className="text-sm font-medium text-center">{icon.name}</span>
              </label>
            );
          })}
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-fuchsia-500 text-white py-2 px-4 rounded-md hover:bg-fuchsia-600 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors"
      >
        Submit
      </button>
    </form>
  );
};

/* AI-Generated Code End */ 