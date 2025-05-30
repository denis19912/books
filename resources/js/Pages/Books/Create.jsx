// resources/js/Pages/Books/Create.jsx
import React, { useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import BookForm from '@/Components/BookForm'; 
import { Head, useForm, usePage, Link } from '@inertiajs/react'; // Added Link
import SecondaryButton from '@/Components/SecondaryButton'; // For "Back" button

export default function Create({ auth }) {
    const { props } = usePage(); 
    const { data, setData, post, processing, errors, reset } = useForm({
        title: props.prefill_title || '',
        author: '',
        isbn: props.prefill_isbn || '',
        description: '',
        cover_image_url: '',
        is_read: false,
        published_date: '',
        page_count: '',
        custom_notes: '',
    });

    useEffect(() => {
        setData(prevData => ({
            ...prevData,
            title: props.prefill_title || prevData.title || '',
            isbn: props.prefill_isbn || prevData.isbn || '',
        }));
    }, [props.prefill_title, props.prefill_isbn]);


    const submit = (e) => {
        e.preventDefault();
        post(route('books.store'), {
            onSuccess: () => reset(), 
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Add New Book Manually
                    </h2>
                    <Link href={route('books.index')}>
                        <SecondaryButton>Back to My Books</SecondaryButton>
                    </Link>
                </div>
            }
        >
            <Head title="Add New Book" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    {/* Enhanced card styling here */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg">
                        <div className="p-6 sm:p-8 text-gray-900 dark:text-gray-100">
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
