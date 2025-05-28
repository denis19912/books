// resources/js/Components/BookForm.jsx
import React from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import TextArea from '@/Components/TextArea'; // Assuming you create this or similar
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import Checkbox from '@/Components/Checkbox'; // From Breeze

// A simple TextArea component example if not available from Breeze
// const TextArea = ({ className = '', ...props }) => (
//     <textarea
//         {...props}
//         className={
//             'border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm ' +
//             className
//         }
//     />
// );


export default function BookForm({ data, setData, errors, onSubmit, processing, submitButtonText = "Save Book" }) {
    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div>
                <InputLabel htmlFor="title" value="Title" />
                <TextInput
                    id="title"
                    name="title"
                    value={data.title || ''}
                    className="mt-1 block w-full"
                    autoComplete="title"
                    isFocused={true}
                    onChange={(e) => setData('title', e.target.value)}
                    required
                />
                <InputError message={errors.title} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="author" value="Author" />
                <TextInput
                    id="author"
                    name="author"
                    value={data.author || ''}
                    className="mt-1 block w-full"
                    autoComplete="author"
                    onChange={(e) => setData('author', e.target.value)}
                />
                <InputError message={errors.author} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="isbn" value="ISBN" />
                <TextInput
                    id="isbn"
                    name="isbn"
                    value={data.isbn || ''}
                    className="mt-1 block w-full"
                    autoComplete="isbn"
                    onChange={(e) => setData('isbn', e.target.value)}
                />
                <InputError message={errors.isbn} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="published_date" value="Published Date" />
                <TextInput
                    id="published_date"
                    type="date"
                    name="published_date"
                    value={data.published_date || ''}
                    className="mt-1 block w-full"
                    onChange={(e) => setData('published_date', e.target.value)}
                />
                <InputError message={errors.published_date} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="page_count" value="Page Count" />
                <TextInput
                    id="page_count"
                    type="number"
                    name="page_count"
                    value={data.page_count || ''}
                    className="mt-1 block w-full"
                    min="0"
                    onChange={(e) => setData('page_count', e.target.value)}
                />
                <InputError message={errors.page_count} className="mt-2" />
            </div>
            
            <div>
                <InputLabel htmlFor="cover_image_url" value="Cover Image URL" />
                <TextInput
                    id="cover_image_url"
                    name="cover_image_url"
                    type="url"
                    value={data.cover_image_url || ''}
                    className="mt-1 block w-full"
                    placeholder="https://example.com/image.jpg"
                    onChange={(e) => setData('cover_image_url', e.target.value)}
                />
                <InputError message={errors.cover_image_url} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="description" value="Description" />
                <TextArea // Use your TextArea component
                    id="description"
                    name="description"
                    value={data.description || ''}
                    className="mt-1 block w-full h-32" // Example height
                    onChange={(e) => setData('description', e.target.value)}
                />
                <InputError message={errors.description} className="mt-2" />
            </div>
            
            <div>
                <InputLabel htmlFor="custom_notes" value="Your Notes" />
                <TextArea // Use your TextArea component
                    id="custom_notes"
                    name="custom_notes"
                    value={data.custom_notes || ''}
                    className="mt-1 block w-full h-24" // Example height
                    onChange={(e) => setData('custom_notes', e.target.value)}
                />
                <InputError message={errors.custom_notes} className="mt-2" />
            </div>

            <div className="block mt-4">
                <label className="flex items-center">
                    <Checkbox
                        name="is_read"
                        checked={data.is_read || false}
                        onChange={(e) => setData('is_read', e.target.checked)}
                    />
                    <span className="ms-2 text-sm text-gray-600 dark:text-gray-400">Mark as Read</span>
                </label>
                <InputError message={errors.is_read} className="mt-2" />
            </div>

            <div className="flex items-center justify-end mt-4">
                <PrimaryButton className="ms-4" disabled={processing}>
                    {processing ? 'Saving...' : submitButtonText}
                </PrimaryButton>
            </div>
        </form>
    );
}
