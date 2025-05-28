// resources/js/Components/TextArea.jsx
import React, { forwardRef, useEffect, useRef } from 'react';

export default forwardRef(function TextArea(
    { className = '', isFocused = false, rows = 3, ...props },
    ref
) {
    const localRef = ref || useRef();

    useEffect(() => {
        if (isFocused) {
            localRef.current.focus();
        }
    }, [isFocused]); // Add isFocused to dependency array

    return (
        <textarea
            {...props}
            rows={rows}
            className={
                'border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm ' +
                className
            }
            ref={localRef}
        ></textarea>
    );
});
