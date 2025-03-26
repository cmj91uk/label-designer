/* AI-Generated Code Start
 * Generated on: 2024-03-21
 * Modified on: 2024-03-21
 * Purpose: Multi-label form component with quantity support
 * Generator: Cursor AI
 */

import React, { useEffect } from 'react';
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
import { IMultiLabelSpec } from '../pdf-builder';

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
  quantity: number;
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
}> = ({ index, register, control, errors, watch, remove }) => {
  const useDate = watch(`labels.${index}.useDate`);
  const iconValues = watch(`labels.${index}.icons`);
  const selectedIconsCount = iconValues?.filter((icon: Icon) => icon.enabled).length || 0;

  return (
    <div className="mb-8 p-6 bg-gray-800 rounded-lg relative">
      <button
        type="button"
        onClick={() => remove(index)}
        className="absolute top-4 right-4 text-red-400 hover:text-red-300"
      >
        Remove
      </button>

      <TextArea
        label="Lesson Objective"
        register={register}
        error={errors?.labels?.[index]?.lessonObjective?.message}
        className="bg-gray-700 text-gray-100 border-gray-600 focus:border-fuchsia-400"
        {...register(`labels.${index}.lessonObjective`)}
      />

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-200 mb-1">
          Label Quantity
        </label>
        <input
          type="number"
          min="1"
          className="w-full px-3 py-2 border rounded-md shadow-sm bg-gray-700 text-gray-100 border-gray-600 focus:border-fuchsia-400"
          {...register(`labels.${index}.quantity`, {
            required: "Quantity is required",
            min: { value: 1, message: "Quantity must be at least 1" }
          })}
        />
        {errors?.labels?.[index]?.quantity && (
          <p className="mt-1 text-sm text-red-400">{errors.labels[index].quantity.message}</p>
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
          Icons (Select up to 3)
          <span className="ml-2 text-sm text-gray-400">
            {selectedIconsCount} of 3 selected
          </span>
        </label>
        {errors?.labels?.[index]?.icons && (
          <p className="text-sm text-red-400 mb-2">{errors.labels[index].icons.message}</p>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {AVAILABLE_ICONS.map((icon, iconIndex) => {
            const inputId = `icon-${index}-${iconIndex}`;
            const isSelected = iconValues?.[iconIndex]?.enabled;
            const isDisabled = !isSelected && selectedIconsCount >= 3;

            return (
              <label
                key={icon.name}
                htmlFor={inputId}
                className={`
                  h-16 p-3 rounded-lg cursor-pointer select-none
                  transition-all duration-200 ease-in-out
                  flex items-center justify-center text-center
                  ${isSelected
                    ? 'bg-fuchsia-900 border-2 border-fuchsia-400 text-fuchsia-100 shadow-lg'
                    : isDisabled
                      ? 'bg-gray-900 border-2 border-transparent text-gray-500 cursor-not-allowed'
                      : 'bg-gray-900 border-2 border-transparent hover:bg-gray-800 text-gray-200 hover:border-gray-700'
                  }
                `}
              >
                <input
                  type="checkbox"
                  id={inputId}
                  disabled={isDisabled}
                  className="sr-only"
                  {...register(`labels.${index}.icons.${iconIndex}.enabled`, {
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                      if (e.target.checked && selectedIconsCount >= 3) {
                        e.preventDefault();
                        return false;
                      }
                    }
                  })}
                />
                <span className="text-sm font-medium">{icon.name}</span>
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
    setValue,
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
        quantity: 8 // Default to match initial labelsPerSheet
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

  // Update quantities when labels per sheet changes
  const previousLabelsPerSheetRef = React.useRef(labelsPerSheet);
  useEffect(() => {
    if (previousLabelsPerSheetRef.current !== labelsPerSheet) {
      fields.forEach((_, index) => {
        setValue(`labels.${index}.quantity`, totalPositions);
      });
      previousLabelsPerSheetRef.current = labelsPerSheet;
    }
  }, [labelsPerSheet, fields, setValue, totalPositions]);

  const handleAddLabel = () => {
    append({
      lessonObjective: '',
      useDate: false,
      date: '',
      dateFormat: 'short',
      icons: AVAILABLE_ICONS,
      quantity: totalPositions
    });
  };

  const onSubmit: SubmitHandler<LessonFormData> = async (data) => {
    const format = LABEL_FORMATS[data.labelsPerSheet];

    if (!format) {
      console.error('Invalid label format');
      return;
    }

    const labelsPerPage = format.countX * format.countY;
    
    try {
      // Calculate total labels needed
      const totalLabels = data.labels.reduce((sum, label) => sum + label.quantity, 0);
      const totalPages = Math.ceil(totalLabels / labelsPerPage);
      const totalSpecs = totalPages * labelsPerPage;
      
      // Create specs array large enough for all pages
      const specs = new Array(totalSpecs).fill(null);
      let currentPosition = 0;
      
      // Fill the specs array with labels
      for (const label of data.labels) {
        const selectedIcons = label.icons
          .filter(icon => icon.enabled)
          .map(icon => icon.image);

        const spec: ILabelSpec = {
          date: label.useDate ? new Date(label.date!) : undefined,
          objective: label.lessonObjective,
          images: selectedIcons,
          dateFormat: label.dateFormat
        };

        // Add this label's quantity to the specs array
        for (let i = 0; i < label.quantity; i++) {
          specs[currentPosition] = spec;
          currentPosition++;
        }
      }

      // Generate the PDF with all labels
      const multiPageSpec: IMultiLabelSpec = { specs };
      await buildPdf(format, multiPageSpec);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto p-6 bg-gray-900 rounded-lg shadow-xl border border-gray-800">
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

      <div className="flex justify-between items-center mt-4">
        <button
          type="button"
          onClick={handleAddLabel}
          className="px-4 py-2 bg-fuchsia-600 text-white rounded-md hover:bg-fuchsia-700"
        >
          Add Another Label
        </button>

        {fields.length > 0 && (
          <div className="text-gray-300 text-sm">
            {(() => {
              const totalLabels = fields.reduce((sum, _, index) => {
                const quantity = watch(`labels.${index}.quantity`);
                return sum + (quantity ? parseInt(quantity.toString(), 10) : 0);
              }, 0);
              const pages = Math.ceil(totalLabels / totalPositions);
              return `${totalLabels} labels on ${pages} page${pages !== 1 ? 's' : ''}`;
            })()}
          </div>
        )}

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