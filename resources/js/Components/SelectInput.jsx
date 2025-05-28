// resources/js/Components/SelectInput.jsx
import React from 'react';

export default function SelectInput({
    id,
    name,
    value,
    className = '',
    autoComplete,
    required,
    onChange,
    options = [], // Expect an array of objects like [{ value: 'val', label: 'Label' }]
    label,
    children, // Allow passing options as children too
    ...props
}) {
    return (
        <div className="w-full">
            {label && (
                <label htmlFor={id || name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {label}
                </label>
            )}
            <select
                {...props}
                id={id || name}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                autoComplete={autoComplete}
                className={
                    `border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm ` +
                    className
                }
            >
                {children}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
