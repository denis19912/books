// resources/js/Pages/Books/Index.jsx
import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput'; // Assuming you have or create this
import Pagination from '@/Components/Pagination'; // Assuming you have or create this

export default function Index({ auth, books: initialBooks, filters: initialFilters, flash }) {
    const { props } = usePage(); // Contains all props including books, filters, flash
    const [searchTerm, setSearchTerm] = useState(initialFilters?.search || '');
    const [statusFilter, setStatusFilter] = useState(initialFilters?.status_filter || '');
    const [feedbackMessage, setFeedbackMessage] = useState('');

    useEffect(() => {
        if (flash?.success) {
            setFeedbackMessage({ type: 'success', text: flash.success });
        } else if (flash?.error) {
            setFeedbackMessage({ type: 'error', text: flash.error });
        }
        // Clear message after a few seconds
        const timer = setTimeout(() => setFeedbackMessage(''), 5000);
        return () => clearTimeout(timer);
    }, [flash]);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('books.index'), { search: searchTerm, status_filter: statusFilter }, {
            preserveState: true,
            replace: true,
        });
    };
    
    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('');
        router.get(route('books.index'), {}, { // Send empty object to clear filters on backend
            preserveState: true,
            replace: true,
        });
    };


    const deleteBook = (bookId, bookTitle) => {
        if (window.confirm(`Are you sure you want to delete "${bookTitle}"?`)) {
            router.delete(route('books.destroy', bookId), {
                onSuccess: () => setFeedbackMessage({ type: 'success', text: `Book "${bookTitle}" deleted.` }),
                onError: (errors) => setFeedbackMessage({ type: 'error', text: `Error deleting book: ${Object.values(errors).join(' ')}` }),
            });
        }
    };

    const toggleReadStatus = (book) => {
        router.put(route('books.update', book.id), {
            ...book, // Send all book data
            is_read: !book.is_read // Toggle the status
        }, {
            preserveScroll: true,
            onSuccess: () => setFeedbackMessage({ type: 'success', text: `Book "${book.title}" status updated.` }),
            onError: (errors) => setFeedbackMessage({ type: 'error', text: `Error updating status: ${Object.values(errors).join(' ')}` }),
        });
    };


    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">My Books</h2>}
        >
            <Head title="My Books" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {feedbackMessage && (
                        <div className={`mb-4 p-4 rounded-md ${feedbackMessage.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            {feedbackMessage.text}
                        </div>
                    )}

                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                                <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-2">
                                    <TextInput
                                        id="search"
                                        type="text"
                                        name="search"
                                        value={searchTerm}
                                        className="block"
                                        placeholder="Search title, author, ISBN..."
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <SelectInput
                                        id="status_filter"
                                        name="status_filter"
                                        className="block"
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        options={[
                                            { value: '', label: 'All Statuses' },
                                            { value: 'read', label: 'Read' },
                                            { value: 'unread', label: 'Unread' },
                                        ]}
                                    />
                                    <PrimaryButton type="submit">Search</PrimaryButton>
                                    {(searchTerm || statusFilter) && (
                                        <SecondaryButton type="button" onClick={clearFilters}>Clear</SecondaryButton>
                                    )}
                                </form>
                                <div className="flex gap-2 mt-4 sm:mt-0">
                                    <Link href={route('books.scan')}>
                                        <PrimaryButton>Scan ISBN</PrimaryButton>
                                    </Link>
                                    <Link href={route('books.create')}>
                                        <SecondaryButton>Add Manually</SecondaryButton>
                                    </Link>
                                </div>
                            </div>

                            {props.books && props.books.data && props.books.data.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-700">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cover</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Author</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ISBN</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                            {props.books.data.map((book) => (
                                                <tr key={book.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {book.cover_image_url ? (
                                                            <img src={book.cover_image_url} alt={book.title} className="h-16 w-auto object-contain rounded" onError={(e) => e.target.src='https://placehold.co/40x60/EEE/CCC?text=No+Image'}/>
                                                        ) : (
                                                            <div className="h-16 w-10 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-xs text-gray-500">No Image</div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">{book.title}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{book.author}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{book.isbn}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <button
                                                            onClick={() => toggleReadStatus(book)}
                                                            className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                                                book.is_read ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-600 dark:text-yellow-100'
                                                            }`}
                                                        >
                                                            {book.is_read ? 'Read' : 'Unread'}
                                                        </button>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                        <Link href={route('books.edit', book.id)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200">Edit</Link>
                                                        <button onClick={() => deleteBook(book.id, book.title)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200">Delete</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p>No books found. Add some to your library!</p>
                            )}
                            {props.books && props.books.data && props.books.data.length > 0 && props.books.links && (
                               <Pagination links={props.books.links} className="mt-6"/>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

// Note: SelectInput and Pagination are assumed components.
// You would need to create them, or use a library that provides them.
// Example for a simple SelectInput:
// const SelectInput = ({ label, name, value, onChange, options, ...props }) => (
//     <div>
//         {label && <label htmlFor={name}>{label}</label>}
//         <select name={name} id={name} value={value} onChange={onChange} {...props}>
//             {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
//         </select>
//     </div>
// );
// Pagination component would typically map over props.books.links to render Link components.
