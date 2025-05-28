// Filename: resources/js/Components/BarcodeScanner.jsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import Quagga from '@ericblade/quagga2'; // Using a community-maintained fork

// Basic styling (can be moved to a CSS file or use Tailwind classes)
const styles = {
    viewport: {
        width: '100%',
        maxWidth: '640px',
        height: 'auto',
        position: 'relative',
        border: '2px solid #333',
        borderRadius: '8px',
        overflow: 'hidden',
        margin: '10px auto',
    },
    canvas: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
    },
    video: { // Ensure video fills the viewport
        width: '100%',
        height: '100%',
        objectFit: 'cover', // Cover ensures it fills, might crop
    },
    controls: {
        marginTop: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
    },
    button: {
        padding: '10px 15px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        backgroundColor: '#fff',
        cursor: 'pointer',
        fontSize: '16px',
    },
    result: {
        marginTop: '15px',
        padding: '10px',
        borderRadius: '5px',
        backgroundColor: '#fff',
        border: '1px solid #ddd',
        minWidth: '200px',
        textAlign: 'center',
    },
    errorMessage: {
        color: 'red',
        backgroundColor: '#ffe0e0',
        borderColor: '#ffc0c0',
        marginTop: '15px',
        padding: '10px',
        borderRadius: '5px',
    },
    loader: {
        border: '5px solid #f3f3f3',
        borderTop: '5px solid #3498db',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        animation: 'spin 1s linear infinite',
        margin: '10px auto',
    },
};

// Keyframes for spin animation (if not using Tailwind animations)
const keyframesStyle = `
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}`;


const BarcodeScanner = ({ onDetected, onScannerError }) => {
    const [isScanning, setIsScanning] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showViewport, setShowViewport] = useState(false);
    const scannerRef = useRef(null); // For the div Quagga targets

    // Add keyframes to document head
    useEffect(() => {
        const styleSheet = document.createElement("style");
        styleSheet.innerText = keyframesStyle;
        document.head.appendChild(styleSheet);
        return () => {
            document.head.removeChild(styleSheet);
        };
    }, []);

    const stopScanner = useCallback(() => {
        if (Quagga.initialized) {
            Quagga.stop();
        }
        setIsScanning(false);
        setShowViewport(false);
        setIsLoading(false);
        console.log("Scanner stopped.");
    }, []);

    const handleProcessed = (result) => {
        const drawingCtx = Quagga.canvas.ctx.overlay;
        const drawingCanvas = Quagga.canvas.dom.overlay;

        if (result) {
            if (result.boxes) {
                drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
                result.boxes.filter(box => box !== result.box).forEach(box => {
                    Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "green", lineWidth: 2 });
                });
            }
            if (result.box) {
                Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "#00F", lineWidth: 2 });
            }
        }
    };

    const handleDetected = useCallback((data) => {
        if (data && data.codeResult && data.codeResult.code) {
            console.log("Barcode detected:", data.codeResult.code);
            onDetected(data.codeResult.code); // Pass detected code to parent
            stopScanner(); // Stop scanning after detection
        }
    }, [onDetected, stopScanner]);


    const startLiveScan = useCallback(async () => {
        setError(null);
        setIsLoading(true);
        setShowViewport(true); // Show viewport immediately

        // Check for camera permissions
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
            stream.getTracks().forEach(track => track.stop()); // Release stream, Quagga will manage it
        } catch (err) {
            console.error("Camera permission error:", err);
            const permissionError = `Camera access denied or no camera found. Please grant permission. Error: ${err.message}`;
            setError(permissionError);
            if (onScannerError) onScannerError(permissionError);
            setIsLoading(false);
            setShowViewport(false);
            return;
        }

        const quaggaConfig = {
            inputStream: {
                name: "Live",
                type: "LiveStream",
                target: scannerRef.current, // Target the div
                constraints: {
                    width: { min: 640 },
                    height: { min: 480 },
                    facingMode: "environment",
                    aspectRatio: { min: 1, max: 2 }
                },
                area: { top: "20%", right: "10%", left: "10%", bottom: "20%" },
            },
            locator: { patchSize: "medium", halfSample: true },
            numOfWorkers: navigator.hardwareConcurrency || 2,
            decoder: {
                readers: ["ean_reader", "ean_8_reader", "code_128_reader", "upc_reader"],
                debug: { drawBoundingBox: true, showFrequency: false, drawScanline: true, showPattern: false }
            },
            locate: true,
        };

        Quagga.init(quaggaConfig, (err) => {
            if (err) {
                console.error("Quagga initialization error:", err);
                const initError = `Error initializing scanner: ${err.name} - ${err.message}.`;
                setError(initError);
                if (onScannerError) onScannerError(initError);
                setIsLoading(false);
                setShowViewport(false);
                return;
            }
            console.log("Quagga initialization finished. Ready to start.");
            Quagga.start();
            setIsScanning(true);
            setIsLoading(false);
            Quagga.onProcessed(handleProcessed);
            Quagga.onDetected(handleDetected);
        });

    }, [handleDetected, onScannerError]);


    const processImageFile = (file) => {
        if (!file) return;
        setError(null);
        setIsLoading(true);
        setShowViewport(false); // No live viewport for file processing

        const reader = new FileReader();
        reader.onload = (event) => {
            const quaggaConfig = {
                inputStream: {
                    name: "Image",
                    type: "ImageStream",
                    src: event.target.result,
                    size: 800 // Image size (longer side)
                },
                locator: { patchSize: "medium", halfSample: true },
                numOfWorkers: navigator.hardwareConcurrency || 2,
                decoder: { readers: ["ean_reader", "ean_8_reader", "code_128_reader", "upc_reader"] },
                locate: true,
            };

            Quagga.decodeSingle(quaggaConfig, (result) => {
                setIsLoading(false);
                if (result && result.codeResult && result.codeResult.code) {
                    console.log("Barcode from image:", result.codeResult.code);
                    onDetected(result.codeResult.code);
                } else {
                    const noCodeError = "No barcode detected in the image.";
                    setError(noCodeError);
                    if (onScannerError) onScannerError(noCodeError);
                    console.log("No barcode found in image or error in decoding.");
                }
            });
        };
        reader.readAsDataURL(file);
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (Quagga.initialized) {
                Quagga.offProcessed(handleProcessed);
                Quagga.offDetected(handleDetected);
                Quagga.stop();
            }
        };
    }, [handleDetected]); // Re-register listeners if handleDetected changes

    // Check for HTTPS (or localhost) for camera access
    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
                const httpsError = 'Camera access requires HTTPS. Please serve your page over HTTPS or use localhost for live scanning.';
                setError(httpsError);
                if (onScannerError) onScannerError(httpsError);
            }
        }
    }, [onScannerError]);


    return (
        <div className="barcode-scanner-container p-4 bg-gray-100 rounded-lg shadow">
            <div style={styles.controls} className="mb-4">
                {!isScanning ? (
                    <button
                        onClick={startLiveScan}
                        style={styles.button}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                        disabled={isLoading || (error && error.includes('HTTPS'))}
                    >
                        {isLoading ? 'Starting...' : 'Start Live Scan'}
                    </button>
                ) : (
                    <button
                        onClick={stopScanner}
                        style={styles.button}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Stop Scan
                    </button>
                )}
                <p className="my-2 text-sm text-gray-600">OR</p>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => processImageFile(e.target.files[0])}
                    style={styles.button}
                    className="text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                    disabled={isLoading}
                />
                <p className="text-xs text-gray-500 mt-1">
                    <em>For live scanning, grant camera permissions.</em>
                </p>
            </div>

            {isLoading && <div style={styles.loader} className="loader-spin"></div>}

            {error && (
                <div style={styles.errorMessage} className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            {showViewport && (
                <div ref={scannerRef} style={styles.viewport} id="interactive" className="viewport">
                    {/* Quagga injects canvas/video here. Style its children if needed. */}
                    {/* The video and canvas elements created by Quagga will inherit styles from #interactive video and #interactive canvas */}
                </div>
            )}
        </div>
    );
};

export default BarcodeScanner;

// How to use in another React component (e.g., a Page in Inertia)
/*
import React, { useState } from 'react';
import BarcodeScanner from '@/Components/BarcodeScanner'; // Adjust path as needed
import { Inertia } from '@inertiajs/inertia'; // For older Inertia versions
// For Inertia v1.0+ (often used with Laravel 10+ Breeze installs)
// import { router } from '@inertiajs/react'


export default function AddBookPage() {
    const [scannedIsbn, setScannedIsbn] = useState('');
    const [feedbackMessage, setFeedbackMessage] = useState('');

    const handleIsbnDetected = (isbn) => {
        setFeedbackMessage(`ISBN Detected: ${isbn}. Sending to server...`);
        console.log("ISBN to send to Laravel:", isbn);

        // --- Using Inertia to send data to Laravel ---
        // For Inertia v0.x (e.g. Inertia.js/inertia-react)
        // Inertia.post('/books/handle-scan', { isbn }, {
        //     onSuccess: (page) => {
        //         console.log('Server success response props:', page.props);
        //         setFeedbackMessage(page.props.flash?.success || 'Book processed!');
        //         if (page.props.book) {
        //             setScannedIsbn(page.props.book.isbn); // Or update a list, etc.
        //         }
        //     },
        //     onError: (errors) => {
        //         console.error('Server error response:', errors);
        //         const errorMessages = Object.values(errors).join(' ');
        //         setFeedbackMessage(`Error: ${errorMessages || 'Could not process book.'}`);
        //     },
        //     onFinish: () => {
        //         // e.g. stop a loader
        //     }
        // });

        // For Inertia v1.0+ (e.g. @inertiajs/react)
        // import { router } from '@inertiajs/react'
        // router.post('/books/handle-scan', { isbn }, {
        //      onSuccess: (page) => {
        //         console.log('Server success response props:', page.props);
        //         setFeedbackMessage(page.props.flash?.success || 'Book processed!');
        //         if (page.props.book) {
        //             setScannedIsbn(page.props.book.isbn);
        //         }
        //     },
        //     onError: (errors) => {
        //         console.error('Server error response:', errors);
        //         const errorMessages = Object.values(errors).join(' ');
        //         setFeedbackMessage(`Error: ${errorMessages || 'Could not process book.'}`);
        //     },
        // });


    };

    const handleScannerError = (errorMessage) => {
        setFeedbackMessage(`Scanner Error: ${errorMessage}`);
    };

    return (
        <div> // Enclose with your AuthenticatedLayout or GuestLayout
            <h1>Scan Book ISBN</h1>
            <BarcodeScanner onDetected={handleIsbnDetected} onScannerError={handleScannerError} />
            {feedbackMessage && <p className="mt-4 p-2 bg-gray-200 rounded">{feedbackMessage}</p>}
            {scannedIsbn && <p className="mt-2">Last Scanned ISBN: {scannedIsbn}</p>}
        </div>
    );
}
*/

