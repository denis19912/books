// resources/js/Pages/Books/Scan.jsx
import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import BarcodeScanner from '@/Components/BarcodeScanner';
import { Head, usePage, router, Link } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

// SVG Icons for status messages (optional, but can make it prettier)
const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2 inline">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
    </svg>
);
const ExclamationTriangleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2 inline">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
);
const InformationCircleIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2 inline">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
    </svg>
);


export default function ScanBookPage({ auth }) {
    const { props } = usePage();
    const [scanResult, setScanResult] = useState({
        type: '', 
        message: '',
        book: null, 
        isbnToConfirm: null, 
    });
    const [lastScannedIsbn, setLastScannedIsbn] = useState('');
    const [isProcessingScan, setIsProcessingScan] = useState(false); 
    const [isConfirmingAdd, setIsConfirmingAdd] = useState(false); 

    useEffect(() => {
        if (props.flash) {
            const { scan_result_type, message, scanned_book_details, scanned_isbn } = props.flash;

            if (scan_result_type === 'not_in_library_prompt_add') {
                setScanResult({
                    type: 'not_in_library_prompt_add',
                    message: message || `ISBN ${scanned_isbn || lastScannedIsbn} is not in your library. Add it?`,
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

            setIsProcessingScan(false); 
            setIsConfirmingAdd(false);  

            if (scan_result_type !== 'not_in_library_prompt_add') {
                const timer = setTimeout(() => {
                    setScanResult({ type: '', message: '', book: null, isbnToConfirm: null });
                    setLastScannedIsbn('');
                }, 10000); // Keep result for 10s
                return () => clearTimeout(timer);
            }
        }
    }, [props.flash, lastScannedIsbn]); 

    useEffect(() => {
        if (props.errors && Object.keys(props.errors).length > 0) {
            const errorString = Object.values(props.errors).join(' ');
            setScanResult({ type: 'error_server', message: `Validation Error: ${errorString}`, book: null, isbnToConfirm: null });
            setIsProcessingScan(false);
            setIsConfirmingAdd(false);
        }
    }, [props.errors]);

    const handleInitialScan = (isbn) => {
        setScanResult({ type: 'processing', message: `ISBN: ${isbn}. Checking library...`, book: null, isbnToConfirm: null });
        setLastScannedIsbn(isbn);
        setIsProcessingScan(true);
        setIsConfirmingAdd(false); 

        router.post(route('books.handleScan'), { isbn }, {
            onError: (errors) => {
                const errorMessages = Object.values(errors).join(' ');
                setScanResult({ type: 'error_server', message: `Error checking ISBN: ${errorMessages || 'Unknown error.'}`, book: null, isbnToConfirm: null });
            },
            onFinish: () => {
                setIsProcessingScan(false);
                setScanResult(currentResult => {
                    if (currentResult.type === 'processing' && !props.flash?.scan_result_type && !props.flash?.success && !props.flash?.error) {
                        return {
                            type: 'info',
                            message: `Scan for ISBN ${isbn} processed. Server response unclear.`,
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
        setScanResult(prev => ({ ...prev, type: 'adding_book', message: `Adding ISBN: ${scanResult.isbnToConfirm}...` }));
        setIsConfirmingAdd(true);

        router.post(route('books.confirmAdd'), { isbn: scanResult.isbnToConfirm }, { 
            onError: (errors) => {
                const errorMessages = Object.values(errors).join(' ');
                setScanResult({ type: 'error_server', message: `Error adding book: ${errorMessages || 'Unknown error.'}`, book: null, isbnToConfirm: null });
            },
            onFinish: () => {
                setIsConfirmingAdd(false);
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
    
    // Determine when to show the scanner: not processing, no active message/prompt
    const showScanner = !isProcessingScan && !isConfirmingAdd && !scanResult.type;


    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Scan & Find/Add Book</h2>
                    <Link href={route('books.index')}>
                        <PrimaryButton className="w-full sm:w-auto justify-center">My Books List</PrimaryButton>
                    </Link>
                </div>
            }
        >
            <Head title="Scan Book" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg">
                        <div className="p-6 sm:p-8 text-gray-900 dark:text-gray-100">
                            <p className="mb-6 text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                                Use your device's camera to scan a book's barcode (ISBN). This will check if the book is already in your library or allow you to quickly add it.
                            </p>
                            
                            {showScanner && (
                                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-inner bg-gray-50 dark:bg-gray-800/30">
                                    <BarcodeScanner
                                        onDetected={handleInitialScan}
                                        onScannerError={handleScannerError}
                                    />
                                </div>
                            )}

                            {(isProcessingScan || isConfirmingAdd) && (
                                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-md text-center">
                                    <p className="font-medium text-blue-600 dark:text-blue-300 animate-pulse">
                                        {isProcessingScan && `Checking library for ISBN: ${lastScannedIsbn}...`}
                                        {isConfirmingAdd && `Adding book with ISBN: ${scanResult.isbnToConfirm}...`}
                                    </p>
                                </div>
                            )}

                            {scanResult.message && !isProcessingScan && !isConfirmingAdd && (
                                <div className={`mt-6 p-4 rounded-md text-sm border ${
                                    scanResult.type.includes('error') ? 'bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-700' :
                                    scanResult.type.includes('found') || scanResult.type.includes('added') || scanResult.type === 'success' ? 'bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700' :
                                    'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700' // For info, prompt
                                }`}>
                                    <p className={`flex items-center font-semibold mb-2 text-base ${
                                        scanResult.type.includes('error') ? 'text-red-700 dark:text-red-300' :
                                        scanResult.type.includes('found') || scanResult.type.includes('added') || scanResult.type === 'success' ? 'text-green-700 dark:text-green-300' :
                                        'text-blue-700 dark:text-blue-300'
                                    }`}>
                                        {scanResult.type.includes('error') && <ExclamationTriangleIcon />}
                                        {(scanResult.type.includes('found') || scanResult.type.includes('added') || scanResult.type === 'success') && <CheckCircleIcon />}
                                        {(scanResult.type === 'info' || scanResult.type === 'not_in_library_prompt_add') && <InformationCircleIcon />}

                                        {scanResult.type === 'found_in_library' ? 'Book Found in Your Library!' :
                                         scanResult.type === 'added_to_library' ? 'Book Added to Your Library!' :
                                         scanResult.type === 'not_in_library_prompt_add' ? 'Book Not in Library' :
                                         scanResult.type === 'success' ? 'Success!' :
                                         scanResult.type.includes('error') ? 'An Error Occurred' :
                                         'Scan Status'}
                                    </p>
                                    <p className="text-gray-700 dark:text-gray-400 ml-7">{scanResult.message}</p>

                                    {scanResult.book && (scanResult.type === 'found_in_library' || scanResult.type === 'added_to_library') && (
                                        <div className="mt-4 ml-7 p-4 bg-white dark:bg-gray-700/70 rounded-md border border-gray-200 dark:border-gray-600 flex flex-col sm:flex-row items-center gap-4">
                                            {scanResult.book.cover_image_url && (
                                                <img src={scanResult.book.cover_image_url} alt={`Cover of ${scanResult.book.title}`} className="w-24 h-36 object-contain rounded shadow-md flex-shrink-0" onError={(e) => e.target.src='https://placehold.co/96x144/e0e0e0/757575?text=N/A'}/>
                                            )}
                                            <div className="text-center sm:text-left">
                                                <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{scanResult.book.title}</h4>
                                                {scanResult.book.author && <p className="text-sm text-gray-600 dark:text-gray-400">by {scanResult.book.author}</p>}
                                                <p className={`mt-1 text-sm font-medium ${scanResult.book.is_read ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                                                    Status: {scanResult.book.is_read ? 'Read' : 'Unread'}
                                                </p>
                                                {scanResult.type === 'found_in_library' && scanResult.book.id && (
                                                    <Link href={route('books.edit', scanResult.book.id)} className="mt-2 inline-block">
                                                        <SecondaryButton size="sm">View/Edit Details</SecondaryButton>
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {scanResult.type === 'not_in_library_prompt_add' && scanResult.isbnToConfirm && (
                                        <div className="mt-4 ml-7 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center gap-3">
                                            <PrimaryButton onClick={handleConfirmAddBook} disabled={isConfirmingAdd} className="w-full sm:w-auto justify-center">
                                                {isConfirmingAdd ? 'Adding...' : `Add ISBN: ${scanResult.isbnToConfirm}`}
                                            </PrimaryButton>
                                            <SecondaryButton onClick={clearScanResult} disabled={isConfirmingAdd} className="w-full sm:w-auto justify-center">
                                                Cancel
                                            </SecondaryButton>
                                            <Link href={route('books.create', { isbn: scanResult.isbnToConfirm, title: scanResult.book?.title })} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline mt-2 sm:mt-0 sm:ml-auto">
                                                Add Manually with Details
                                            </Link>
                                        </div>
                                    )}

                                    {scanResult.type !== 'not_in_library_prompt_add' && (
                                        <div className="mt-4 ml-7 pt-4 border-t border-gray-200 dark:border-gray-700">
                                            <PrimaryButton onClick={clearScanResult} className="w-full sm:w-auto justify-center">Scan Another Book</PrimaryButton>
                                        </div>
                                    )}
                                </div>
                            )}
                             {!isProcessingScan && !isConfirmingAdd && !scanResult.message && lastScannedIsbn && (
                                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">Last ISBN scanned: {lastScannedIsbn}. Ready for new scan.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
