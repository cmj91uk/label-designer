/* AI-Generated Code Start
 * Generated on: 2024-03-21
 * Purpose: Multi-label form component
 * Generator: Cursor AI
 */

import React, { useState } from 'react';
import { useForm, SubmitHandler, Controller, useFieldArray } from 'react-hook-form';
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

interface LabelSpec {
  lessonObjective: string;
  useDate: boolean;
  date?: string;
  dateFormat: 'long' | 'short';
  icons: Icon[];
  positions: number[];
}

interface LessonFormData {
  labelsPerSheet: number;
  labels: LabelSpec[];
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

const LabelSpecForm: React.FC<{
  index: number;
  register: any;
  control: any;
  errors: any;
  watch: any;
  remove: (index: number) => void;
  totalPositions: number;
}> = ({ index, register, control, errors, watch, remove, totalPositions }) => {
  const useDate = watch(`labels.${index}.useDate`);
  const iconValues = watch(`labels.${index}.icons`);
  const selectedIconsCount = iconValues?.filter((icon: Icon) => icon.enabled).length || 0;
  const MAX_ICONS = 3;

  return (
    <div className="p-4 mb-4 border border-gray-700 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-100">Label {index + 1}</h3>
        <button
          type="button"
          onClick={() => remove(index)}
          className="text-red-400 hover:text-red-300"
        >
          Remove
        </button>
      </div>

      <TextArea
        label="Lesson Objective"
        register={register}
        error={errors?.labels?.[index]?.lessonObjective?.message}
        placeholder="Enter the main objective of the lesson"
        rows={3}
        className="bg-gray-700 text-gray-100 border-gray-600 focus:border-fuchsia-400 placeholder-gray-400"
        {...register(`labels.${index}.lessonObjective`)}
      />

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-200 mb-2">
          Label Positions (1-{totalPositions})
        </label>
        <input
          type="text"
          placeholder="e.g., 1,2,3 or 1-5"
          className="w-full px-3 py-2 border rounded-md shadow-sm bg-gray-700 text-gray-100 border-gray-600 focus:border-fuchsia-400"
          {...register(`labels.${index}.positions`)}
        />
        {errors?.labels?.[index]?.positions && (
          <p className="mt-1 text-sm text-red-400">{errors.labels[index].positions.message}</p>
        )}
      </div>

      <Checkbox
        label="Include Date"
        register={register}
        error={errors?.labels?.[index]?.useDate?.message}
        {...register(`labels.${index}.useDate`)}
      />

      {useDate && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-200 mb-1">
            Date
          </label>
          <Controller
            control={control}
            name={`labels.${index}.date`}
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
              error={errors?.labels?.[index]?.dateFormat?.message}
              options={[
                { value: 'short', label: 'Short (1/1/2024)' },
                { value: 'long', label: 'Long (Monday 1st January 2024)' }
              ]}
              className="bg-gray-700 text-gray-100 border-gray-600 focus:border-fuchsia-400"
              {...register(`labels.${index}.dateFormat`)}
            />
          </div>
        </div>
      )}

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-200 mb-2">
          Icons (Select up to {MAX_ICONS})
          <span className="ml-2 text-sm text-gray-400">
            {selectedIconsCount} of {MAX_ICONS} selected
          </span>
        </label>
        {errors?.labels?.[index]?.icons && (
          <p className="text-sm text-red-400 mb-2">{errors.labels[index].icons.message}</p>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {AVAILABLE_ICONS.map((icon, iconIndex) => {
            const inputId = `icon-${index}-${iconIndex}`;
            const isSelected = iconValues?.[iconIndex]?.enabled;
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
                  {...register(`labels.${index}.icons.${iconIndex}.enabled`, {
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
    </div>
  );
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
      labelsPerSheet: 8,
      labels: [{
        lessonObjective: '',
        useDate: false,
        date: '',
        dateFormat: 'short',
        icons: AVAILABLE_ICONS,
        positions: []
      }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "labels"
  });

  const labelsPerSheet = watch('labelsPerSheet');
  const format = LABEL_FORMATS[labelsPerSheet];
  const totalPositions = format ? format.countX * format.countY : 0;

  const parsePositions = (posStr: string): number[] => {
    if (!posStr) return [];
    
    const positions: number[] = [];
    const parts = posStr.split(',').map(p => p.trim());
    
    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(Number);
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = start; i <= end; i++) {
            if (i > 0 && i <= totalPositions && !positions.includes(i)) {
              positions.push(i);
            }
          }
        }
      } else {
        const num = Number(part);
        if (!isNaN(num) && num > 0 && num <= totalPositions && !positions.includes(num)) {
          positions.push(num);
        }
      }
    }
    
    return positions.sort((a, b) => a - b);
  };

  const onSubmit: SubmitHandler<LessonFormData> = async (data) => {
    const format = LABEL_FORMATS[data.labelsPerSheet];

    if (!format) {
      console.error('Invalid label format');
      return;
    }

    // Convert form data to IMultiLabelSpec
    const specs = new Array(totalPositions).fill(null);
    
    data.labels.forEach(label => {
      const positions = parsePositions(label.positions.toString());
      const selectedIcons = label.icons
        .filter(icon => icon.enabled)
        .map(icon => icon.image);

      const spec: ILabelSpec = {
        date: label.useDate ? new Date(label.date!) : undefined,
        objective: label.lessonObjective,
        images: selectedIcons,
        dateFormat: label.dateFormat
      };

      positions.forEach(pos => {
        specs[pos - 1] = spec;
      });
    });

    try {
      await buildPdf(format, { specs });
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto p-6 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-gray-100">MSJ Label Builder</h2>

      <div className="mb-6">
        <Select
          label="Labels Per Sheet"
          register={register}
          error={errors.labelsPerSheet?.message}
          options={LABELS_PER_SHEET_OPTIONS}
          className="bg-gray-700 text-gray-100 border-gray-600 focus:border-fuchsia-400"
          {...register("labelsPerSheet", {
            required: "Labels per sheet is required",
            validate: (value) => {
              const numValue = parseInt(value.toString(), 10);
              return [8, 14, 18, 21, 24, 65].includes(numValue) || "Invalid number of labels per sheet";
            }
          })}
        />
      </div>

      {fields.map((field, index) => (
        <LabelSpecForm
          key={field.id}
          index={index}
          register={register}
          control={control}
          errors={errors}
          watch={watch}
          remove={remove}
          totalPositions={totalPositions}
        />
      ))}

      <div className="flex justify-between mt-4">
        <button
          type="button"
          onClick={() => append({
            lessonObjective: '',
            useDate: false,
            date: '',
            dateFormat: 'short',
            icons: AVAILABLE_ICONS,
            positions: []
          })}
          className="px-4 py-2 bg-fuchsia-600 text-white rounded-md hover:bg-fuchsia-700"
        >
          Add Another Label
        </button>

        <button
          type="submit"
          className="px-4 py-2 bg-fuchsia-500 text-white rounded-md hover:bg-fuchsia-600"
        >
          Generate PDF
        </button>
      </div>
    </form>
  );
};

/* AI-Generated Code End */ 