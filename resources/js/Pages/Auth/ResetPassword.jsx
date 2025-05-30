// resources/js/Pages/Auth/ResetPassword.jsx (or wherever you place your themed reset password page)
import React, { useEffect } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import ApplicationLogo from '@/Components/ApplicationLogo'; // For consistency
import { Head, Link, useForm } from '@inertiajs/react';

export default function ThemedResetPassword({ token, email, canLogin, canRegister }) { // Added canLogin, canRegister
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('password.store')); // 'password.store' is often the route name for submitting the reset form
    };

    return (
        <>
            <Head title="Reset Password - Your Book Tracker" />
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
                            Reset Your Password
                        </h1>
                    </div>

                    <div className="p-6 sm:p-8 bg-white dark:bg-gray-800 shadow-xl rounded-lg">
                        <form onSubmit={submit}>
                            <div>
                                <InputLabel htmlFor="email" value="Email" className="dark:text-gray-300" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600" // Readonly appearance
                                    autoComplete="username"
                                    onChange={(e) => setData('email', e.target.value)}
                                    readOnly // Email is usually pre-filled and not editable here
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="password" value="New Password" className="dark:text-gray-300" />
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700"
                                    autoComplete="new-password"
                                    isFocused={true}
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="password_confirmation"
                                    value="Confirm New Password"
                                    className="dark:text-gray-300"
                                />
                                <TextInput
                                    type="password"
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="mt-1 block w-full dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700"
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                />
                                <InputError message={errors.password_confirmation} className="mt-2" />
                            </div>

                            <div className="mt-6 flex items-center justify-end">
                                <PrimaryButton className="w-full sm:w-auto justify-center bg-red-600 hover:bg-red-700 focus:bg-red-700 active:bg-red-800 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:bg-red-600 dark:active:bg-red-700" disabled={processing}>
                                    Reset Password
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
