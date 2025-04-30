import React, { forwardRef } from 'react';

const Select = forwardRef(({
  label,
  id,
  name,
  value,
  options = [],
  placeholder = 'Select an option',
  error,
  disabled = false,
  className = '',
  required = false,
  helperText,
  onChange,
  onBlur,
  ...props
}, ref) => {
  const selectId = id || name || `select-${Math.random().toString(36).substring(2, 9)}`;
  
  const baseSelectStyles = 'w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500';
  const errorStyles = error ? 'border-red-500 text-red-900' : 'border-gray-300';
  const disabledStyles = disabled ? 'bg-gray-100 cursor-not-allowed' : '';
  
  return (
    <div className={className}>
      {label && (
        <label 
          htmlFor={selectId} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative rounded-md shadow-sm">
        <select
          id={selectId}
          name={name}
          ref={ref}
          value={value}
          disabled={disabled}
          className={`${baseSelectStyles} ${errorStyles} ${disabledStyles} py-2 px-4 appearance-none`}
          onChange={onChange}
          onBlur={onBlur}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg 
            className="h-5 w-5 text-gray-400" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor" 
            aria-hidden="true"
          >
            <path 
              fillRule="evenodd" 
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;