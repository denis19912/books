// resources/js/Pages/Welcome.jsx
import React from 'react';
import { Link, Head, router } from '@inertiajs/react'; // Added router for potential redirect
import ApplicationLogo from '@/Components/ApplicationLogo'; 

export default function Welcome({ auth, canLogin, canRegister, laravelVersion, phpVersion }) {
    
    // Optional: If this page is somehow loaded for an authenticated user,
    // and you want to force redirect from the client side (though server-side is better for '/').
    // React.useEffect(() => {
    //     if (auth && auth.user) {
    //         router.replace(route('dashboard'));
    //     }
    // }, [auth]);

    return (
        <>
            <Head title="Welcome to Your Book Tracker" />
            <div className={`relative sm:flex sm:justify-center sm:items-center min-h-screen bg-dots-darker dark:bg-dots-lighter bg-gray-100 dark:bg-gray-900 selection:bg-red-500 selection:text-white`}>
                <div className="sm:fixed sm:top-0 sm:right-0 p-6 text-end z-10">
                    {auth && auth.user ? (
                        <Link
                            href={route('dashboard')}
                            className="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            {canLogin && (
                                <Link
                                    href={route('login')}
                                    className="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                                >
                                    Log in
                                </Link>
                            )}

                            {canRegister && (
                                <Link
                                    href={route('register')}
                                    className="ms-4 font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                                >
                                    Register
                                </Link>
                            )}
                        </>
                    )}
                </div>

                <div className="max-w-7xl mx-auto p-6 lg:p-8">
                    <div className="flex flex-col items-center">
                        <ApplicationLogo className="h-24 w-auto fill-current text-gray-700 dark:text-gray-300" />
                        <h1 className="mt-8 text-4xl sm:text-5xl font-bold text-gray-800 dark:text-white text-center">
                            Your Personal Book Tracker
                        </h1>
                        <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto text-center">
                            Welcome! This is your personal space to effortlessly manage your home library. Keep track of every book you own, monitor your reading progress, and discover what to read next.
                        </p>
                         {!auth?.user && canRegister && (
                            <Link href={route('register')}>
                                <button className="mt-4 px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition duration-150 ease-in-out">
                                    Get Started - It's Free!
                                </button>
                            </Link>
                        )}
                    </div>

                    <div className="mt-16">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="p-6 bg-white dark:bg-gray-800/50 dark:bg-gradient-to-bl from-gray-700/50 via-transparent dark:ring-1 dark:ring-inset dark:ring-white/5 rounded-lg shadow-xl shadow-gray-500/20 dark:shadow-none flex flex-col motion-safe:hover:scale-[1.01] transition-all duration-250">
                                <div className="h-16 w-16 bg-red-50 dark:bg-red-800/20 flex items-center justify-center rounded-full self-start">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" className="w-7 h-7 stroke-red-500">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05l.856-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
                                    </svg>
                                </div>
                                <h2 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">Organize Your Collection</h2>
                                <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                                    Catalog all your books in one place. Add titles, authors, ISBNs, cover images, and personal notes. Never misplace a book or buy a duplicate again.
                                </p>
                            </div>

                            <div className="p-6 bg-white dark:bg-gray-800/50 dark:bg-gradient-to-bl from-gray-700/50 via-transparent dark:ring-1 dark:ring-inset dark:ring-white/5 rounded-lg shadow-xl shadow-gray-500/20 dark:shadow-none flex flex-col motion-safe:hover:scale-[1.01] transition-all duration-250">
                                <div className="h-16 w-16 bg-red-50 dark:bg-red-800/20 flex items-center justify-center rounded-full self-start">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" className="w-7 h-7 stroke-red-500">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                                    </svg>
                                </div>
                                <h2 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">Track Your Reading</h2>
                                <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                                    Mark books as read or unread. See your progress at a glance and get motivated to dive into your next literary adventure.
                                </p>
                            </div>
                            
                            <div className="p-6 bg-white dark:bg-gray-800/50 dark:bg-gradient-to-bl from-gray-700/50 via-transparent dark:ring-1 dark:ring-inset dark:ring-white/5 rounded-lg shadow-xl shadow-gray-500/20 dark:shadow-none flex flex-col motion-safe:hover:scale-[1.01] transition-all duration-250">
                                <div className="h-16 w-16 bg-red-50 dark:bg-red-800/20 flex items-center justify-center rounded-full self-start">
                                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" className="w-7 h-7 stroke-red-500">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                                    </svg>
                                </div>
                                <h2 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">Scan & Go</h2>
                                <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                                    Use your phone's camera to scan a book's ISBN. Quickly add new books to your collection or check if you already own a title while you're in a bookstore.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center mt-16 px-0 sm:items-center sm:justify-between">
                        <div className="text-center text-sm text-gray-500 dark:text-gray-400 sm:text-start">
                            <div className="flex items-center gap-4">
                                <a
                                    href="https://laravel.com/docs"
                                    className="group inline-flex items-center hover:text-gray-700 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                                >
                                    {/* ... existing laravel docs link ... */}
                                </a>
                            </div>
                        </div>

                        <div className="ms-4 text-center text-sm text-gray-500 dark:text-gray-400 sm:text-end sm:ms-0">
                            Laravel v{laravelVersion} (PHP v{phpVersion})
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
