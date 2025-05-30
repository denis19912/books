// resources/js/Pages/Books/Index.jsx
import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton'; // Keep for potential future use, though not in current UI
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import Pagination from '@/Components/Pagination';

// SVG Icons for feedback messages (optional)
const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2 inline">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
    </svg>
);
const ExclamationTriangleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2 inline">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
);

export default function Index({ auth, books: initialBooks, filters: initialFilters, flash }) {
    const { props } = usePage();
    const [searchTerm, setSearchTerm] = useState(initialFilters?.search || '');
    const [statusFilter, setStatusFilter] = useState(initialFilters?.status_filter || '');
    const [feedbackMessage, setFeedbackMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        let messageText = '';
        let messageType = '';

        // Prioritize specific flash messages from scan page or other actions
        if (props.flash?.scan_result_type) {
            messageText = props.flash.message || 'Scan processed.';
            messageType = props.flash.scan_result_type.includes('error') ? 'error' :
                          props.flash.scan_result_type.includes('found') || props.flash.scan_result_type.includes('added') ? 'success' : 'info';
        } else if (props.flash?.success) { // General success
            messageText = props.flash.success;
            messageType = 'success';
        } else if (props.flash?.error) { // General error
            messageText = props.flash.error;
            messageType = 'error';
        } else if (flash?.success) { // Fallback to direct flash prop (less common with Inertia's shared flash)
            messageText = flash.success;
            messageType = 'success';
        } else if (flash?.error) {
            messageText = flash.error;
            messageType = 'error';
        }
        
        if (messageText) {
            setFeedbackMessage({ type: messageType, text: messageText });
            const timer = setTimeout(() => setFeedbackMessage({ text: '', type: '' }), 7000); // Display for 7 seconds
            return () => clearTimeout(timer);
        }
    }, [flash, props.flash]);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('books.index'), { search: searchTerm, status_filter: statusFilter }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };
    
    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('');
        router.get(route('books.index'), {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const deleteBook = (bookId, bookTitle) => {
        if (window.confirm(`Are you sure you want to delete "${bookTitle}"? This action cannot be undone.`)) {
            router.delete(route('books.destroy', bookId), {
                preserveScroll: true,
                onSuccess: () => setFeedbackMessage({ type: 'success', text: `Book "${bookTitle}" deleted successfully.` }),
                onError: (errors) => setFeedbackMessage({ type: 'error', text: `Error deleting book: ${Object.values(errors).join(' ')}` }),
            });
        }
    };

    const toggleReadStatus = (book) => {
        router.put(route('books.update', book.id), {
            ...book, 
            is_read: !book.is_read 
        }, {
            preserveScroll: true,
            onSuccess: () => setFeedbackMessage({ type: 'success', text: `Status for "${book.title}" updated.` }),
            onError: (errors) => setFeedbackMessage({ type: 'error', text: `Error updating status: ${Object.values(errors).join(' ')}` }),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">My Book Collection</h2>
                </div>
            }
        >
            <Head title="My Books" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {feedbackMessage && feedbackMessage.text && (
                        <div className={`mb-6 p-4 rounded-md text-sm flex items-center shadow ${
                            feedbackMessage.type === 'error' ? 'bg-red-100 border border-red-400 text-red-700 dark:bg-red-700/30 dark:border-red-600 dark:text-red-200' :
                            feedbackMessage.type === 'success' ? 'bg-green-100 border border-green-400 text-green-700 dark:bg-green-700/30 dark:border-green-600 dark:text-green-200' :
                            'bg-blue-100 border border-blue-400 text-blue-700 dark:bg-blue-700/30 dark:border-blue-600 dark:text-blue-200' // Info
                        }`}>
                            {feedbackMessage.type === 'error' && <ExclamationTriangleIcon />}
                            {feedbackMessage.type === 'success' && <CheckCircleIcon />}
                            {feedbackMessage.type === 'info' && <InformationCircleIcon />}
                            <span>{feedbackMessage.text}</span>
                        </div>
                    )}

                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg">
                        <div className="p-6 sm:p-8 text-gray-900 dark:text-gray-100">
                            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                                    <TextInput
                                        id="search"
                                        type="text"
                                        name="search"
                                        value={searchTerm}
                                        className="block w-full sm:w-auto flex-grow dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700"
                                        placeholder="Search title, author, ISBN..."
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <SelectInput
                                        id="status_filter"
                                        name="status_filter"
                                        className="block w-full sm:w-auto dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700"
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        options={[
                                            { value: '', label: 'All Statuses' },
                                            { value: 'read', label: 'Read' },
                                            { value: 'unread', label: 'Unread' },
                                        ]}
                                    />
                                    <PrimaryButton type="submit" className="w-full sm:w-auto justify-center">Search</PrimaryButton>
                                    {(searchTerm || statusFilter) && (
                                        <SecondaryButton type="button" onClick={clearFilters} className="w-full sm:w-auto justify-center">Clear</SecondaryButton>
                                    )}
                                </form>
                                <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0 w-full md:w-auto">
                                    <Link href={route('books.scan')} className="w-full sm:w-auto">
                                        <PrimaryButton className="w-full justify-center bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600">Scan New Book</PrimaryButton>
                                    </Link>
                                    <Link href={route('books.create')} className="w-full sm:w-auto">
                                        <SecondaryButton className="w-full justify-center">Add Manually</SecondaryButton>
                                    </Link>
                                </div>
                            </div>

                            {props.books && props.books.data && props.books.data.length > 0 ? (
                                <div className="overflow-x-auto mt-8 border border-gray-200 dark:border-gray-700 rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                                            <tr>
                                                <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Cover</th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Title</th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 hidden lg:table-cell">Author</th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 hidden md:table-cell">ISBN</th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Status</th>
                                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                                            {props.books.data.map((book) => (
                                                <tr key={book.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-150">
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                                                        {book.cover_image_url ? (
                                                            <img src={book.cover_image_url} alt={book.title} className="h-20 w-14 object-cover rounded shadow-sm" onError={(e) => e.target.src='https://placehold.co/56x80/e0e0e0/757575?text=N/A'}/>
                                                        ) : (
                                                            <div className="h-20 w-14 bg-gray-200 dark:bg-gray-700 rounded shadow-sm flex items-center justify-center text-xs text-gray-400 dark:text-gray-500">No Cover</div>
                                                        )}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700 dark:text-gray-300">
                                                        <div className="font-medium text-gray-900 dark:text-white">{book.title}</div>
                                                        <div className="text-gray-500 dark:text-gray-400 lg:hidden mt-1">{book.author}</div> {/* Show author below title on small screens */}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell">{book.author}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">{book.isbn}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                        <button
                                                            onClick={() => toggleReadStatus(book)}
                                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors duration-150 ${
                                                                book.is_read ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-700 dark:text-green-100 dark:hover:bg-green-600' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-600 dark:text-yellow-100 dark:hover:bg-yellow-500'
                                                            }`}
                                                        >
                                                            {book.is_read ? 'Read' : 'Unread'}
                                                        </button>
                                                    </td>
                                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-left text-sm font-medium sm:pr-6 space-x-2">
                                                        <Link href={route('books.edit', book.id)} className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">Edit</Link>
                                                        <button onClick={() => deleteBook(book.id, book.title)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">Delete</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                    </svg>
                                    <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">No books yet</h3>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by adding a new book to your collection.</p>
                                    <div className="mt-6 flex justify-center gap-3">
                                        <Link href={route('books.scan')}>
                                            <PrimaryButton className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600">Scan New Book</PrimaryButton>
                                        </Link>
                                        <Link href={route('books.create')}>
                                            <SecondaryButton>Add Manually</SecondaryButton>
                                        </Link>
                                    </div>
                                </div>
                            )}
                            {props.books && props.books.data && props.books.data.length > 0 && props.books.links && (
                               <Pagination links={props.books.links} className="mt-8"/>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
