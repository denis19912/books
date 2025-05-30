// resources/js/Pages/Auth/Login.jsx (or wherever you place your themed login page)
import React, { useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import ApplicationLogo from '@/Components/ApplicationLogo'; // For consistency with Welcome page
import { Head, Link, useForm } from '@inertiajs/react';

export default function ThemedLogin({ status, canResetPassword, canRegister }) { // Added canRegister
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login')); // onFinish for password reset is handled by Breeze default
    };

    return (
        <>
            <Head title="Log in - Your Book Tracker" />
            <div className="relative sm:flex sm:justify-center sm:items-center min-h-screen bg-dots-darker dark:bg-dots-lighter bg-gray-100 dark:bg-gray-900 selection:bg-red-500 selection:text-white">
                <div className="sm:fixed sm:top-0 sm:right-0 p-6 text-end z-10">
                    {/* No "Dashboard" link here as user is not yet authenticated */}
                    {/* "Log in" link is not needed as this IS the login page */}
                    {canRegister && ( // Show Register link if registration is enabled
                        <Link
                            href={route('register')}
                            className="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
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
                            Log in to Your Book Tracker
                        </h1>
                    </div>

                    {status && (
                        <div className="mb-4 text-sm font-medium text-green-600 dark:text-green-400">
                            {status}
                        </div>
                    )}

                    <div className="p-6 sm:p-8 bg-white dark:bg-gray-800 shadow-xl rounded-lg">
                        <form onSubmit={submit}>
                            <div>
                                <InputLabel htmlFor="email" value="Email" className="dark:text-gray-300" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700"
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="password" value="Password" className="dark:text-gray-300" />
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700"
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            <div className="mt-4 block">
                                <label className="flex items-center">
                                    <Checkbox
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="dark:border-gray-600 dark:checked:bg-red-500 dark:checked:border-red-500"
                                    />
                                    <span className="ms-2 text-sm text-gray-600 dark:text-gray-400">Remember me</span>
                                </label>
                            </div>

                            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800"
                                    >
                                        Forgot your password?
                                    </Link>
                                )}
                                <PrimaryButton className="w-full sm:w-auto justify-center bg-red-600 hover:bg-red-700 focus:bg-red-700 active:bg-red-800 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:bg-red-600 dark:active:bg-red-700" disabled={processing}>
                                    Log in
                                </PrimaryButton>
                            </div>

                            {canRegister && (
                                <div className="mt-6 text-center">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Don't have an account?{' '}
                                        <Link href={route('register')} className="font-medium text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300">
                                            Register here
                                        </Link>
                                    </p>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
