// resources/js/Pages/Auth/ForgotPassword.jsx (or wherever you place your themed forgot password page)
import React from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import ApplicationLogo from '@/Components/ApplicationLogo'; // For consistency
import { Head, Link, useForm } from '@inertiajs/react';

export default function ThemedForgotPassword({ status, canLogin, canRegister }) { // Added canLogin, canRegister
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <>
            <Head title="Forgot Password - Your Book Tracker" />
            <div className="relative sm:flex sm:justify-center sm:items-center min-h-screen bg-dots-darker dark:bg-dots-lighter bg-gray-100 dark:bg-gray-900 selection:bg-red-500 selection:text-white">
                <div className="sm:fixed sm:top-0 sm:right-0 p-6 text-end z-10">
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
                </div>

                <div className="w-full max-w-md p-6 lg:p-8 mx-auto">
                    <div className="flex flex-col items-center mb-8">
                        <Link href="/">
                            <ApplicationLogo className="h-20 w-auto fill-current text-gray-700 dark:text-gray-300" />
                        </Link>
                        <h1 className="mt-6 text-3xl font-bold text-gray-800 dark:text-white text-center">
                            Forgot Your Password?
                        </h1>
                    </div>

                    <div className="p-6 sm:p-8 bg-white dark:bg-gray-800 shadow-xl rounded-lg">
                        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                            No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one.
                        </div>

                        {status && (
                            <div className="mb-4 text-sm font-medium text-green-600 dark:text-green-400">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit}>
                            <div>
                                <InputLabel htmlFor="email" value="Email" className="dark:text-gray-300" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700"
                                    isFocused={true}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <Link
                                    href={route('login')}
                                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800"
                                >
                                    Back to Log in
                                </Link>
                                <PrimaryButton className="w-full sm:w-auto justify-center bg-red-600 hover:bg-red-700 focus:bg-red-700 active:bg-red-800 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:bg-red-600 dark:active:bg-red-700" disabled={processing}>
                                    Email Password Reset Link
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
