// resources/js/Pages/Auth/ConfirmPassword.jsx (or wherever you place your themed confirm password page)
import React, { useEffect } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import ApplicationLogo from '@/Components/ApplicationLogo'; // For consistency
import { Head, Link, useForm } from '@inertiajs/react';

export default function ThemedConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('password.confirm'));
    };

    return (
        <>
            <Head title="Confirm Password - Your Book Tracker" />
            <div className="relative sm:flex sm:justify-center sm:items-center min-h-screen bg-dots-darker dark:bg-dots-lighter bg-gray-100 dark:bg-gray-900 selection:bg-red-500 selection:text-white">
                {/* No top-right auth links here as user is typically already authenticated */}

                <div className="w-full max-w-md p-6 lg:p-8 mx-auto">
                    <div className="flex flex-col items-center mb-8">
                        <Link href="/">
                            <ApplicationLogo className="h-20 w-auto fill-current text-gray-700 dark:text-gray-300" />
                        </Link>
                        <h1 className="mt-6 text-3xl font-bold text-gray-800 dark:text-white text-center">
                            Confirm Your Password
                        </h1>
                    </div>

                    <div className="p-6 sm:p-8 bg-white dark:bg-gray-800 shadow-xl rounded-lg">
                        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                            This is a secure area of the application. Please confirm your password before continuing.
                        </div>

                        <form onSubmit={submit}>
                            <div className="mt-4">
                                <InputLabel htmlFor="password" value="Password" className="dark:text-gray-300" />
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700"
                                    isFocused={true}
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            <div className="mt-6 flex items-center justify-end">
                                {/* Optional: Add a cancel button or link back to dashboard if appropriate for your UX */}
                                {/* <Link href={route('dashboard')} className="text-sm text-gray-600 dark:text-gray-400 hover:underline">
                                    Cancel
                                </Link> */}
                                <PrimaryButton className="w-full sm:w-auto justify-center bg-red-600 hover:bg-red-700 focus:bg-red-700 active:bg-red-800 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:bg-red-600 dark:active:bg-red-700" disabled={processing}>
                                    Confirm
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
