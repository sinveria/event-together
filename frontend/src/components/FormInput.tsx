// src/components/FormInput.tsx
import React, { ChangeEvent } from 'react';

interface OptionType {
  id?: string | number;
  value: string;
  label?: string;
  name?: string;
  title?: string;
}

interface FormInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  type?: string;
  isTextarea?: boolean;
  isSelect?: boolean;
  options?: OptionType[];
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  name?: string;
  id?: string;
  rows?: number;
  min?: string | number;
  max?: string | number;
  step?: string | number;
}

const FormInput = ({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  isTextarea = false,
  isSelect = false,
  options = [],
  error,
  required = false,
  disabled = false,
  className = '',
  name,
  id,
  rows = 4,
  min,
  max,
  step,
  ...props
}: FormInputProps) => {
  const inputClasses = `w-full px-4 py-3 text-lg border-2 border-gray-900 rounded-lg focus:outline-none focus:border-[#323FF0] transition-colors ${className} ${error ? 'border-red-500' : ''
    } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`;

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className="block text-lg font-medium text-gray-900 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {isTextarea ? (
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          rows={rows}
          className={inputClasses}
          disabled={disabled}
          required={required}
          name={name}
          id={id}
          {...props}
        />
      ) : isSelect ? (
        <select
          value={value}
          onChange={onChange}
          className={inputClasses}
          disabled={disabled}
          required={required}
          name={name}
          id={id}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option: OptionType) => {
            const optionValue = option.value || option.id?.toString() || '';
            const optionLabel = option.label || option.name || option.title || optionValue;
            return (
              <option key={optionValue} value={optionValue}>
                {optionLabel}
              </option>
            );
          })}
        </select>
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={inputClasses}
          disabled={disabled}
          required={required}
          name={name}
          id={id}
          min={min}
          max={max}
          step={step}
          {...props}
        />
      )}

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FormInput;