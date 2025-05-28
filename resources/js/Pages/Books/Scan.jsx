// resources/js/Pages/Books/Scan.jsx
import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import BarcodeScanner from '@/Components/BarcodeScanner';
import { Head, usePage, router, Link } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function ScanBookPage({ auth }) {
    const { props } = usePage();
    const [scanResult, setScanResult] = useState({
        type: '', // 'info', 'processing', 'found_in_library', 'not_in_library_prompt_add', 'adding_book', 'added_to_library', 'error_scanner', 'error_server'
        message: '',
        book: null, // Stores details of found book OR ISBN for prompting add
        isbnToConfirm: null, // Store ISBN if user needs to confirm adding it
    });
    const [lastScannedIsbn, setLastScannedIsbn] = useState('');
    const [isProcessingScan, setIsProcessingScan] = useState(false); // For initial scan check
    const [isConfirmingAdd, setIsConfirmingAdd] = useState(false); // For the "add book" action

    // Handle flash messages from server redirects
    useEffect(() => {
        if (props.flash) {
            const { scan_result_type, message, scanned_book_details, scanned_isbn } = props.flash;

            if (scan_result_type === 'not_in_library_prompt_add') {
                setScanResult({
                    type: 'not_in_library_prompt_add',
                    message: message || `ISBN ${scanned_isbn} is not in your library. Would you like to try and add it?`,
                    book: null,
                    isbnToConfirm: scanned_isbn || lastScannedIsbn,
                });
            } else if (scan_result_type) {
                setScanResult({
                    type: scan_result_type,
                    message: message || '',
                    book: scanned_book_details || null,
                    isbnToConfirm: null,
                });
            } else if (props.flash.success) {
                setScanResult({ type: 'success', message: props.flash.success, book: null, isbnToConfirm: null });
            } else if (props.flash.error) {
                setScanResult({ type: 'error_server', message: props.flash.error, book: null, isbnToConfirm: null });
            }

            setIsProcessingScan(false); // Ensure initial processing state is cleared
            setIsConfirmingAdd(false);  // Ensure add confirmation processing state is cleared

            // Clear message after some time, unless it's a prompt to add
            if (scan_result_type !== 'not_in_library_prompt_add') {
                const timer = setTimeout(() => {
                    setScanResult({ type: '', message: '', book: null, isbnToConfirm: null });
                    setLastScannedIsbn('');
                }, 10000);
                return () => clearTimeout(timer);
            }
        }
    }, [props.flash, lastScannedIsbn]); // Added lastScannedIsbn to ensure prompt gets correct ISBN if flash is slightly delayed

    // Handle validation errors
    useEffect(() => {
        if (props.errors && Object.keys(props.errors).length > 0) {
            const errorString = Object.values(props.errors).join(' ');
            setScanResult({ type: 'error_server', message: `Validation Error: ${errorString}`, book: null, isbnToConfirm: null });
            setIsProcessingScan(false);
            setIsConfirmingAdd(false);
        }
    }, [props.errors]);

    const handleInitialScan = (isbn) => {
        setScanResult({ type: 'processing', message: `ISBN Detected: ${isbn}. Checking your library...`, book: null, isbnToConfirm: null });
        setLastScannedIsbn(isbn);
        setIsProcessingScan(true);
        setIsConfirmingAdd(false); // Reset this

        router.post(route('books.handleScan'), { isbn }, {
            onError: (errors) => {
                const errorMessages = Object.values(errors).join(' ');
                setScanResult({ type: 'error_server', message: `Error checking ISBN: ${errorMessages || 'An unknown error occurred.'}`, book: null, isbnToConfirm: null });
            },
            onFinish: () => {
                setIsProcessingScan(false);
                // Further state updates will be handled by props.flash useEffect
                // or if type is still 'processing' after onFinish, it means flash was not sufficient
                setScanResult(currentResult => {
                    if (currentResult.type === 'processing' && !props.flash?.scan_result_type && !props.flash?.success && !props.flash?.error) {
                        return {
                            type: 'info',
                            message: `Scan for ISBN ${isbn} processed. Server response might not have specific details.`,
                            book: null,
                            isbnToConfirm: null
                        };
                    }
                    return currentResult;
                });
            }
        });
    };

    const handleConfirmAddBook = () => {
        if (!scanResult.isbnToConfirm) return;
        setScanResult(prev => ({ ...prev, type: 'adding_book', message: `Attempting to add ISBN: ${scanResult.isbnToConfirm}...` }));
        setIsConfirmingAdd(true);

        router.post(route('books.confirmAdd'), { isbn: scanResult.isbnToConfirm }, { // New route
            onError: (errors) => {
                const errorMessages = Object.values(errors).join(' ');
                setScanResult({ type: 'error_server', message: `Error adding book: ${errorMessages || 'An unknown error occurred.'}`, book: null, isbnToConfirm: null });
            },
            onFinish: () => {
                setIsConfirmingAdd(false);
                // Success/further error messages will be handled by props.flash useEffect
            }
        });
    };

    const handleScannerError = (errorMessage) => {
        setScanResult({ type: 'error_scanner', message: `Scanner Error: ${errorMessage}`, book: null, isbnToConfirm: null });
        setIsProcessingScan(false);
        setIsConfirmingAdd(false);
    };

    const clearScanResult = () => {
        setScanResult({ type: '', message: '', book: null, isbnToConfirm: null });
        setLastScannedIsbn('');
        setIsProcessingScan(false);
        setIsConfirmingAdd(false);
    };
    
    const showScanner = !scanResult.message && !isProcessingScan && !isConfirmingAdd && !scanResult.isbnToConfirm;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Scan & Find/Add Book</h2>
                    <Link href={route('books.index')}>
                        <PrimaryButton>My Books List</PrimaryButton>
                    </Link>
                </div>
            }
        >
            <Head title="Scan Book" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                                Scan a book's barcode to check your library or add it.
                            </p>
                            
                            {showScanner && (
                                <BarcodeScanner
                                    onDetected={handleInitialScan}
                                    onScannerError={handleScannerError}
                                />
                            )}

                            {(isProcessingScan || isConfirmingAdd) && (
                                <p className="mt-4 text-center text-blue-600 dark:text-blue-400">
                                    {isProcessingScan && `Checking your library for ISBN: ${lastScannedIsbn}...`}
                                    {isConfirmingAdd && `Adding book with ISBN: ${scanResult.isbnToConfirm}...`}
                                </p>
                            )}

                            {scanResult.message && (
                                <div className="mt-6 p-4 rounded-md text-sm border dark:border-gray-600">
                                    <p className={`font-semibold mb-2 ${
                                        scanResult.type.includes('error') ? 'text-red-700 dark:text-red-300' :
                                        scanResult.type === ('found_in_library') || scanResult.type === ('added_to_library') || scanResult.type === 'success' ? 'text-green-700 dark:text-green-300' :
                                        'text-blue-700 dark:text-blue-300'
                                    }`}>
                                        {scanResult.type === 'found_in_library' ? 'Book Found in Library!' :
                                         scanResult.type === 'added_to_library' ? 'Book Added to Library!' :
                                         scanResult.type === 'not_in_library_prompt_add' ? 'Book Not in Library' :
                                         scanResult.type === 'success' ? 'Success!' :
                                         scanResult.type.includes('error') ? 'Error' :
                                         'Status'}
                                    </p>
                                    <p className="text-gray-700 dark:text-gray-300">{scanResult.message}</p>

                                    {scanResult.book && (scanResult.type === 'found_in_library' || scanResult.type === 'added_to_library') && (
                                        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md border dark:border-gray-600">
                                            {/* ... book details rendering same as before ... */}
                                            <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-100">{scanResult.book.title}</h4>
                                            {scanResult.book.author && <p className="text-sm text-gray-600 dark:text-gray-400">by {scanResult.book.author}</p>}
                                            {scanResult.book.cover_image_url && (
                                                <img src={scanResult.book.cover_image_url} alt={`Cover of ${scanResult.book.title}`} className="mt-2 h-32 w-auto object-contain rounded shadow" onError={(e) => e.target.style.display='none'}/>
                                            )}
                                            <p className={`mt-2 text-sm font-medium ${scanResult.book.is_read ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                                                Status: {scanResult.book.is_read ? 'Read' : 'Unread'}
                                            </p>
                                            {scanResult.type === 'found_in_library' && scanResult.book.id && (
                                                <Link href={route('books.edit', scanResult.book.id)} className="mt-3 inline-block">
                                                    <SecondaryButton size="sm">View/Edit Details</SecondaryButton>
                                                </Link>
                                            )}
                                        </div>
                                    )}
                                    
                                    {scanResult.type === 'not_in_library_prompt_add' && scanResult.isbnToConfirm && (
                                        <div className="mt-4 space-x-2">
                                            <PrimaryButton onClick={handleConfirmAddBook} disabled={isConfirmingAdd}>
                                                {isConfirmingAdd ? 'Adding...' : `Add ISBN: ${scanResult.isbnToConfirm}`}
                                            </PrimaryButton>
                                            <SecondaryButton onClick={clearScanResult} disabled={isConfirmingAdd}>
                                                Cancel
                                            </SecondaryButton>
                                        </div>
                                    )}

                                    {/* "Scan Another" button appears if not prompting to add and not currently processing initial scan */}
                                    {scanResult.type !== 'not_in_library_prompt_add' && !isProcessingScan && (
                                        <div className="mt-4">
                                            <PrimaryButton onClick={clearScanResult}>Scan Another Book</PrimaryButton>
                                        </div>
                                    )}
                                </div>
                            )}
                             {!isProcessingScan && !isConfirmingAdd && !scanResult.message && lastScannedIsbn && (
                                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">Last ISBN scanned: {lastScannedIsbn}. Ready for new scan or waiting for server details.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
