// resources/js/Components/Pagination.jsx
import React from 'react';
import { Link } from '@inertiajs/react';

export default function Pagination({ links = [], className = '' }) {
    if (!links || links.length <= 3) { // Only show pagination if there's more than prev, current, next
        return null;
    }

    return (
        <div className={`flex items-center justify-between mt-6 ${className}`}>
            <div className="flex flex-wrap -mb-1">
                {links.map((link, index) => {
                    if (!link.url) {
                        return (
                            <div
                                key={`link-disabled-${index}`}
                                className="mr-1 mb-1 px-4 py-3 text-sm leading-4 text-gray-400 dark:text-gray-600 border rounded"
                                dangerouslySetInnerHTML={{ __html: link.label }} // To render &laquo; Previous &raquo; Next
                            />
                        );
                    }
                    return (
                        <Link
                            key={`link-${link.label}-${index}`}
                            className={`mr-1 mb-1 px-4 py-3 text-sm leading-4 border rounded hover:bg-white dark:hover:bg-gray-700 focus:border-indigo-500 focus:text-indigo-500 dark:focus:border-indigo-600 dark:focus:text-indigo-400 ${
                                link.active ? 'bg-indigo-500 text-white dark:bg-indigo-600 dark:text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                            }`}
                            href={link.url}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                })}
            </div>
        </div>
    );
}
