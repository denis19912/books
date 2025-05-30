// resources/js/Pages/Auth/Register.jsx (or wherever you place your themed register page)
import React, { useEffect } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import ApplicationLogo from '@/Components/ApplicationLogo'; // For consistency
import { Head, Link, useForm } from '@inertiajs/react';

export default function ThemedRegister({ canLogin }) { // Added canLogin prop
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
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
        post(route('register'));
    };

    return (
        <>
            <Head title="Register - Your Book Tracker" />
            <div className="relative sm:flex sm:justify-center sm:items-center min-h-screen bg-dots-darker dark:bg-dots-lighter bg-gray-100 dark:bg-gray-900 selection:bg-red-500 selection:text-white">
                <div className="sm:fixed sm:top-0 sm:right-0 p-6 text-end z-10">
                    {canLogin && ( // Show Login link if login is enabled
                        <Link
                            href={route('login')}
                            className="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                        >
                            Log in
                        </Link>
                    )}
                </div>

                <div className="w-full max-w-md p-6 lg:p-8 mx-auto">
                    <div className="flex flex-col items-center mb-8">
                        <Link href="/">
                            <ApplicationLogo className="h-20 w-auto fill-current text-gray-700 dark:text-gray-300" />
                        </Link>
                        <h1 className="mt-6 text-3xl font-bold text-gray-800 dark:text-white text-center">
                            Create Your Book Tracker Account
                        </h1>
                    </div>

                    <div className="p-6 sm:p-8 bg-white dark:bg-gray-800 shadow-xl rounded-lg">
                        <form onSubmit={submit}>
                            <div>
                                <InputLabel htmlFor="name" value="Name" className="dark:text-gray-300" />
                                <TextInput
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    className="mt-1 block w-full dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700"
                                    autoComplete="name"
                                    isFocused={true}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="email" value="Email" className="dark:text-gray-300" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700"
                                    autoComplete="username"
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
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
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="password_confirmation"
                                    value="Confirm Password"
                                    className="dark:text-gray-300"
                                />
                                <TextInput
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="mt-1 block w-full dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700"
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                />
                                <InputError message={errors.password_confirmation} className="mt-2" />
                            </div>

                            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <Link
                                    href={route('login')}
                                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800"
                                >
                                    Already registered?
                                </Link>
                                <PrimaryButton className="w-full sm:w-auto justify-center bg-red-600 hover:bg-red-700 focus:bg-red-700 active:bg-red-800 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:bg-red-600 dark:active:bg-red-700" disabled={processing}>
                                    Register
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
