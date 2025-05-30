// resources/js/Pages/Auth/VerifyEmail.jsx (or wherever you place your themed verify email page)
import React from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import ApplicationLogo from '@/Components/ApplicationLogo'; // For consistency
import { Head, Link, useForm } from '@inertiajs/react';

export default function ThemedVerifyEmail({ status, canLogin, canRegister }) { // Added canLogin, canRegister for top links if needed, though less common here
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <>
            <Head title="Email Verification - Your Book Tracker" />
            <div className="relative sm:flex sm:justify-center sm:items-center min-h-screen bg-dots-darker dark:bg-dots-lighter bg-gray-100 dark:bg-gray-900 selection:bg-red-500 selection:text-white">
                <div className="sm:fixed sm:top-0 sm:right-0 p-6 text-end z-10">
                    {/* Optional: Show Login/Register if deemed necessary for this page's context */}
                    {/* Usually, user is already in a flow, so these might be omitted */}
                    {/* {canLogin && (
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
                    )} */}
                </div>

                <div className="w-full max-w-md p-6 lg:p-8 mx-auto">
                    <div className="flex flex-col items-center mb-8">
                        <Link href="/">
                            <ApplicationLogo className="h-20 w-auto fill-current text-gray-700 dark:text-gray-300" />
                        </Link>
                        <h1 className="mt-6 text-3xl font-bold text-gray-800 dark:text-white text-center">
                            Verify Your Email Address
                        </h1>
                    </div>

                    <div className="p-6 sm:p-8 bg-white dark:bg-gray-800 shadow-xl rounded-lg">
                        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                            Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you? If you didn't receive the email, we will gladly send you another.
                        </div>

                        {status === 'verification-link-sent' && (
                            <div className="mb-4 text-sm font-medium text-green-600 dark:text-green-400">
                                A new verification link has been sent to the email address you provided during registration.
                            </div>
                        )}

                        <form onSubmit={submit}>
                            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <PrimaryButton className="w-full sm:w-auto justify-center bg-red-600 hover:bg-red-700 focus:bg-red-700 active:bg-red-800 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:bg-red-600 dark:active:bg-red-700" disabled={processing}>
                                    Resend Verification Email
                                </PrimaryButton>

                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="w-full sm:w-auto justify-center px-4 py-2 border border-transparent rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
                                >
                                    Log Out
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
