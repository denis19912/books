// resources/js/Pages/Books/Edit.jsx
import React, { useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import BookForm from '@/Components/BookForm';
import { Head, useForm, Link, router } from '@inertiajs/react';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';

// Helper function to safely format date (consistent with other forms)
const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
        // Ensure dateString is treated as local if it's just YYYY-MM-DD by appending time
        // Or if it includes time, new Date() should handle it.
        // Adding 'T00:00:00Z' assumes the date string from DB is UTC if it's just a date.
        // If your dates are stored with timezone or are already local, adjust accordingly.
        const date = new Date(dateString.includes('T') ? dateString : dateString + 'T00:00:00Z');
        if (isNaN(date.getTime())) {
            // console.warn(`Invalid date string received in Edit: ${dateString}`);
            return ''; 
        }
        return date.toISOString().split('T')[0];
    } catch (error) {
        // console.error(`Error formatting date in Edit: ${dateString}`, error);
        return ''; 
    }
};

export default function Edit({ auth, book }) { 
    const { data, setData, put, processing, errors, reset } = useForm({
        title: book.title || '',
        author: book.author || '',
        isbn: book.isbn || '',
        description: book.description || '',
        cover_image_url: book.cover_image_url || '',
        is_read: book.is_read || false,
        published_date: formatDateForInput(book.published_date), 
        page_count: book.page_count || '',
        custom_notes: book.custom_notes || '',
    });

    useEffect(() => {
        setData({ 
            title: book.title || '',
            author: book.author || '',
            isbn: book.isbn || '',
            description: book.description || '',
            cover_image_url: book.cover_image_url || '',
            is_read: book.is_read || false,
            published_date: formatDateForInput(book.published_date),
            page_count: book.page_count || '',
            custom_notes: book.custom_notes || '',
        });
    }, [book]); 

    const submit = (e) => {
        e.preventDefault();
        put(route('books.update', book.id));
    };

    const deleteBook = () => {
        if (window.confirm(`Are you sure you want to delete "${book.title}"? This action cannot be undone.`)) {
            router.delete(route('books.destroy', book.id));
        }
    };


    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                     <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Edit: {book.title}</h2>
                     <Link href={route('books.index')}>
                        <SecondaryButton className="w-full sm:w-auto justify-center">Back to My Books</SecondaryButton>
                    </Link>
                </div>
            }
        >
            <Head title={`Edit ${book.title}`} />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg">
                        <div className="p-6 sm:p-8 text-gray-900 dark:text-gray-100">
                           <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Book Details</h3>
                                <DangerButton onClick={deleteBook} disabled={processing} className="w-full sm:w-auto justify-center">
                                    Delete Book
                                </DangerButton>
                            </div>
                            <BookForm
                                data={data}
                                setData={setData}
                                errors={errors}
                                onSubmit={submit}
                                processing={processing}
                                submitButtonText="Update Book"
                                // If you re-add cover image uploads, pass relevant props here
                                // currentCoverImageUrl={data.cover_image_url}
                                // onCoverImageChange={handleCoverImageChange}
                                // newCoverImagePreview={newCoverImagePreview}
                                // clearNewCoverImage={clearNewCoverImage}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
