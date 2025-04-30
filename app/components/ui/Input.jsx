import React, { forwardRef } from 'react';

const Input = forwardRef(({
  type = 'text',
  label,
  id,
  name,
  value,
  placeholder,
  error,
  disabled = false,
  className = '',
  required = false,
  helperText,
  icon,
  onIconClick,
  onChange,
  onBlur,
  ...props
}, ref) => {
  const inputId = id || name || `input-${Math.random().toString(36).substring(2, 9)}`;
  
  const baseInputStyles = 'w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500';
  const errorStyles = error ? 'border-red-500 text-red-900 placeholder-red-300' : 'border-gray-300';
  const disabledStyles = disabled ? 'bg-gray-100 cursor-not-allowed' : '';
  const iconStyles = icon ? 'pl-10' : '';
  
  return (
    <div className={className}>
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative rounded-md shadow-sm">
        {icon && (
          <div 
            className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-${onIconClick ? 'auto' : 'none'}`}
            onClick={onIconClick}
          >
            <span className="text-gray-500 sm:text-sm">{icon}</span>
          </div>
        )}
        
        <input
          type={type}
          id={inputId}
          name={name}
          ref={ref}
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          className={`${baseInputStyles} ${errorStyles} ${disabledStyles} ${iconStyles} py-2 px-4`}
          onChange={onChange}
          onBlur={onBlur}
          {...props}
        />
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

Input.displayName = 'Input';

export default Input;