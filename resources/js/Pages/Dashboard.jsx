// resources/js/Pages/Dashboard.jsx
import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

// Placeholder data - in a real app, this would come from props/backend
const bookStats = {
    totalBooks: 0, // Example: props.totalBooks
    booksRead: 0,  // Example: props.booksRead
    booksUnread: 0 // Example: props.booksUnread
};

// You would pass the actual stats from your controller to this page
// For example, in your controller:
// return Inertia::render('Dashboard', [
//     'totalBooks' => Auth::user()->books()->count(),
//     'booksRead' => Auth::user()->books()->where('is_read', true)->count(),
//     'booksUnread' => Auth::user()->books()->where('is_read', false)->count(),
// ]);
// Then, in this component: export default function Dashboard({ auth, totalBooks, booksRead, booksUnread }) { ... }


export default function Dashboard({ auth, totalBooks = 0, booksRead = 0, booksUnread = 0 }) { // Added default props for stats
    const userName = auth.user ? auth.user.name : 'User';

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard - Your Book Tracker" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Welcome Message */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <h3 className="text-2xl font-semibold mb-2">Welcome back, {userName}!</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Here's a quick overview of your library. Ready to dive into a new story or organize your collection?
                            </p>
                        </div>
                    </div>

                    {/* Stats Section - This would ideally be populated by data from your backend */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6 text-center">
                            <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">Total Books</h4>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalBooks}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6 text-center">
                            <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">Books Read</h4>
                            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{booksRead}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6 text-center">
                            <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">Books Unread</h4>
                            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{booksUnread}</p>
                        </div>
                    </div>

                    {/* Quick Actions Section */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href={route('books.create')} className="w-full sm:w-auto">
                                    <PrimaryButton className="w-full justify-center bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600">
                                        Add New Book Manually
                                    </PrimaryButton>
                                </Link>
                                <Link href={route('books.scan')} className="w-full sm:w-auto">
                                    <SecondaryButton className="w-full justify-center">
                                        Scan Book ISBN
                                    </SecondaryButton>
                                </Link>
                                <Link href={route('books.index')} className="w-full sm:w-auto">
                                    <SecondaryButton className="w-full justify-center">
                                        View My Full Library
                                    </SecondaryButton>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* You can add more sections here, like "Recently Added Books" or "Reading Suggestions" */}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
