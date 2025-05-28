// resources/js/Pages/Books/Create.jsx
import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import BookForm from '@/Components/BookForm'; // Assuming BookForm is in Components
import { Head, useForm } from '@inertiajs/react';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        author: '',
        isbn: '',
        description: '',
        cover_image_url: '',
        is_read: false,
        published_date: '',
        page_count: '',
        custom_notes: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('books.store'), {
            onSuccess: () => reset(), // Reset form on success
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Add New Book Manually</h2>}
        >
            <Head title="Add New Book" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <BookForm
                                data={data}
                                setData={setData}
                                errors={errors}
                                onSubmit={submit}
                                processing={processing}
                                submitButtonText="Add Book"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
