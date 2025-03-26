/* AI-Generated Code Start
 * Generated on: 2024-03-16
 * Purpose: Reusable form control components with Tailwind CSS styling and React Hook Form integration
 * Generator: Cursor AI
 */

import React, { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { UseFormRegister } from 'react-hook-form';

interface FormControlProps {
  label: string;
  error?: string;
  className?: string;
  name: string;
}

type InputProps = FormControlProps & 
  InputHTMLAttributes<HTMLInputElement> & {
    register?: UseFormRegister<any>;
  };

type TextAreaProps = FormControlProps & 
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    register?: UseFormRegister<any>;
  };

type SelectProps = FormControlProps & 
  SelectHTMLAttributes<HTMLSelectElement> & {
    options: Array<{ value: string; label: string }>;
    register?: UseFormRegister<any>;
  };

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  register,
  name,
  ...props
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-200 mb-1">{label}</label>
    <input
      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-fuchsia-400 focus:border-fuchsia-400 
        ${error ? 'border-red-500' : 'border-gray-600'} 
        ${className}`}
      {...(register ? register(name) : {})}
      {...props}
    />
    {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
  </div>
);

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  className = '',
  register,
  name,
  ...props
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-200 mb-1">{label}</label>
    <textarea
      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-fuchsia-400 focus:border-fuchsia-400 
        ${error ? 'border-red-500' : 'border-gray-600'} 
        ${className}`}
      {...(register ? register(name) : {})}
      {...props}
    />
    {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
  </div>
);

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  className = '',
  register,
  name,
  ...props
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-200 mb-1">{label}</label>
    <select
      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-fuchsia-400 focus:border-fuchsia-400 
        ${error ? 'border-red-500' : 'border-gray-600'} 
        ${className}`}
      {...(register ? register(name) : {})}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
  </div>
);

export const Checkbox: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  register,
  name,
  ...props
}) => {
  // Generate a unique ID for the checkbox
  const id = `checkbox-${name}`;
  
  return (
    <div className="mb-4">
      <div className="flex items-center">
        <input
          type="checkbox"
          id={id}
          className={`h-4 w-4 text-fuchsia-400 focus:ring-fuchsia-400 border-gray-600 rounded 
            ${error ? 'border-red-500' : ''} 
            ${className}`}
          {...(register ? register(name) : {})}
          {...props}
        />
        <label htmlFor={id} className="ml-2 block text-sm text-gray-200 cursor-pointer">{label}</label>
      </div>
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
};

export const Radio: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  register,
  name,
  ...props
}) => (
  <div className="mb-4">
    <div className="flex items-center">
      <input
        type="radio"
        className={`h-4 w-4 text-fuchsia-400 focus:ring-fuchsia-400 border-gray-600 
          ${error ? 'border-red-500' : ''} 
          ${className}`}
        {...(register ? register(name) : {})}
        {...props}
      />
      <label className="ml-2 block text-sm text-gray-200">{label}</label>
    </div>
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

/* AI-Generated Code End */ 