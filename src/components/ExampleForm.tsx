/* AI-Generated Code Start
 * Generated on: 2024-03-16
 * Purpose: Example form component demonstrating usage of form controls with React Hook Form
 * Generator: Cursor AI
 */

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Input, TextArea, Select, Checkbox, Radio } from './FormControls';

interface FormData {
  name: string;
  email: string;
  message: string;
  country: string;
  subscribe: boolean;
  gender: string;
}

export const ExampleForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      email: '',
      message: '',
      country: '',
      subscribe: false,
      gender: '',
    }
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log('Form submitted:', data);
  };

  const countryOptions = [
    { value: '', label: 'Select a country' },
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Example Form</h2>
      
      <Input
        label="Name"
        name="name"
        type="text"
        register={register}
        error={errors.name?.message}
        placeholder="Enter your name"
        required
      />

      <Input
        label="Email"
        name="email"
        type="email"
        register={register}
        error={errors.email?.message}
        placeholder="Enter your email"
        required
      />

      <TextArea
        label="Message"
        name="message"
        register={register}
        error={errors.message?.message}
        placeholder="Enter your message"
        rows={4}
      />

      <Select
        label="Country"
        name="country"
        register={register}
        options={countryOptions}
        error={errors.country?.message}
      />

      <Checkbox
        label="Subscribe to newsletter"
        name="subscribe"
        register={register}
        error={errors.subscribe?.message}
      />

      <div className="space-y-2">
        <p className="block text-sm font-medium text-gray-700">Gender</p>
        <Radio
          label="Male"
          name="gender"
          value="male"
          register={register}
          error={errors.gender?.message}
        />
        <Radio
          label="Female"
          name="gender"
          value="female"
          register={register}
          error={errors.gender?.message}
        />
        <Radio
          label="Other"
          name="gender"
          value="other"
          register={register}
          error={errors.gender?.message}
        />
      </div>

      <button
        type="submit"
        className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        Submit
      </button>
    </form>
  );
};

/* AI-Generated Code End */ 