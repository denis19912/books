// resources/js/Pages/Books/Edit.jsx
import React, { useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import BookForm from '@/Components/BookForm';
import { Head, useForm, Link } from '@inertiajs/react';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Edit({ auth, book }) { // `book` prop is passed from controller
    const { data, setData, put, processing, errors, reset } = useForm({
        title: book.title || '',
        author: book.author || '',
        isbn: book.isbn || '',
        description: book.description || '',
        cover_image_url: book.cover_image_url || '',
        is_read: book.is_read || false,
        published_date: book.published_date || '',
        page_count: book.page_count || '',
        custom_notes: book.custom_notes || '',
    });

    // If the book prop changes (e.g., due to navigation), reset the form.
    useEffect(() => {
        reset({
            title: book.title || '',
            author: book.author || '',
            isbn: book.isbn || '',
            description: book.description || '',
            cover_image_url: book.cover_image_url || '',
            is_read: book.is_read || false,
            published_date: book.published_date ? new Date(book.published_date).toISOString().split('T')[0] : '', // Format for date input
            page_count: book.page_count || '',
            custom_notes: book.custom_notes || '',
        });
    }, [book]);

    const submit = (e) => {
        e.preventDefault();
        put(route('books.update', book.id));
    };

    const deleteBook = () => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            router.delete(route('books.destroy', book.id));
        }
    };


    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                     <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Edit Book: {book.title}</h2>
                     <Link href={route('books.index')}>
                        <SecondaryButton>Back to My Books</SecondaryButton>
                    </Link>
                </div>
            }
        >
            <Head title={`Edit ${book.title}`} />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-white">
                           <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Book Details</h3>
                                <DangerButton onClick={deleteBook} disabled={processing}>
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
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
