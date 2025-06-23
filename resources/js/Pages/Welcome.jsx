// You can save this as e.g., resources/js/Pages/DemoLanding.jsx
// Note: For this component to work, you need to install Swiper.js:
// npm install swiper

import React, { useEffect, useRef } from 'react';
import { Head } from '@inertiajs/react';

// Swiper.js imports
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';

// --- Reusable SVG Icon Components ---
const LogoIcon = () => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-label="Book Tracker Logo">
        <path d="M15 85 V 20 C 15 15, 20 10, 25 10 H 48 V 85 H 25 C 20 85, 15 90, 15 85 Z" className="fill-current text-gray-400 dark:text-gray-500"></path>
        <path d="M52 10 H 75 C 80 10, 85 15, 85 20 V 85 C 85 90, 80 85, 75 85 H 52 V 10 Z" className="fill-current text-gray-500 dark:text-gray-600"></path>
        <rect x="48" y="10" width="4" height="75" className="fill-current text-gray-600 dark:text-gray-700"></rect>
        <path d="M38 50 L48 62 L65 40" strokeLinecap="round" strokeLinejoin="round" strokeWidth="10" className="stroke-current text-red-600 dark:text-red-500 fill-none"></path>
    </svg>
);

const WarningIcon = () => (
    <svg className="h-5 w-5 text-yellow-500 dark:text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625l6.28-10.875zM10 15a1 1 0 110-2 1 1 0 010 2zm-1.75-4.5a.75.75 0 011.5 0v2.5a.75.75 0 01-1.5 0v-2.5z" clipRule="evenodd" />
    </svg>
);

const CheckIcon = () => (
    <svg className="mt-1 h-5 w-5 flex-none text-red-600 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
);

const ScanIcon = () => (
    <svg className="w-full max-w-xs h-auto" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <g>
            <rect x="30" y="50" width="140" height="80" rx="15" className="fill-current text-gray-200 dark:text-gray-700"/>
            <rect x="35" y="55" width="130" height="70" rx="10" className="fill-current text-gray-800 dark:text-black"/>
            <circle cx="100" cy="40" r="4" className="fill-current text-gray-200 dark:text-gray-700"/>
            <rect x="20" y="140" width="160" height="40" rx="10" className="fill-current text-gray-300 dark:text-gray-600"/>
            <rect x="30" y="145" width="20" height="30" className="fill-current text-gray-500 dark:text-gray-400"/>
            <rect x="55" y="145" width="5" height="30" className="fill-current text-gray-500 dark:text-gray-400"/>
            <rect x="65" y="145" width="15" height="30" className="fill-current text-gray-500 dark:text-gray-400"/>
            <rect x="85" y="145" width="5" height="30" className="fill-current text-gray-500 dark:text-gray-400"/>
            <rect x="95" y="145" width="10" height="30" className="fill-current text-gray-500 dark:text-gray-400"/>
            <rect x="110" y="145" width="15" height="30" className="fill-current text-gray-500 dark:text-gray-400"/>
            <rect x="130" y="145" width="5" height="30" className="fill-current text-gray-500 dark:text-gray-400"/>
            <rect x="150" y="145" width="20" height="30" className="fill-current text-gray-500 dark:text-gray-400"/>
            <line x1="100" y1="90" x2="20" y2="150" strokeWidth="3" className="stroke-current text-red-500/50"/>
            <line x1="100" y1="90" x2="180" y2="150" strokeWidth="3" className="stroke-current text-red-500/50"/>
        </g>
    </svg>
);

const ProgressIcon = () => (
    <svg className="w-full max-w-xs h-auto" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path d="M40 180 C 20 180, 20 160, 40 160 L 160 160 C 180 160, 180 180, 160 180 Z" className="fill-current text-gray-700 dark:text-gray-600"/>
        <path d="M40 20 L 160 20 L 160 160 L 40 160 Z" className="fill-current text-gray-200 dark:text-gray-700"/>
        <rect x="50" y="100" width="100" height="20" rx="10" className="fill-current text-gray-300 dark:text-gray-600"/>
        <rect x="50" y="100" width="75" height="20" rx="10" className="fill-current text-red-600 dark:text-red-500"/>
        <path d="M90,70 L110,90 L140,50" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" className="stroke-current text-green-500 fill-none"/>
    </svg>
);

// --- Main Component ---
export default function DemoLandingPage() {
    // Refs for elements that will be animated
    const featureSectionsRef = useRef([]);

    useEffect(() => {
        // --- Intersection Observer for Scroll Animations ---
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '0px 0px -100px 0px' // Trigger when section is 100px into view
        });

        featureSectionsRef.current.forEach(section => {
            if (section) {
                observer.observe(section);
            }
        });

        // --- Initialize Swiper ---
        const swiper = new Swiper('.book-shelf-slider', {
            effect: 'coverflow',
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: 'auto',
            coverflowEffect: {
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            loop: true,
            autoplay: {
                delay: 2500,
                disableOnInteraction: false,
            },
        });
        
        // Cleanup function for observer
        return () => {
             featureSectionsRef.current.forEach(section => {
                if (section) {
                    observer.unobserve(section);
                }
            });
            swiper.destroy();
        };
    }, []); // Empty dependency array ensures this runs only once on mount

    return (
        <>
            <Head>
                <title>Have I Read It? - Demo Landing Page</title>
                {/* Assuming Poppins font is loaded globally in your main app layout/css */}
                <style>{`
                    body { font-family: 'Poppins', sans-serif; }
                    /* Custom styles for scroll animations */
                    .fade-in-section { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease-out, transform 0.6s ease-out; }
                    .fade-in-section.is-visible { opacity: 1; transform: translateY(0); }
                    .bg-dots-darker { background-image: url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z' fill='rgba(0,0,0,0.07)'/%3E%3C/svg%3E"); }
                    @media (prefers-color-scheme: dark) { .dark\\:bg-dots-lighter { background-image: url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z' fill='rgba(255,255,255,0.07)'/%3E%3C/svg%3E"); } }
                    /* Swiper custom styles */
                    .swiper-button-next, .swiper-button-prev { color: #ef4444; transform: scale(0.75); }
                    .dark .swiper-button-next, .dark .swiper-button-prev { color: #f87171; }
                    .swiper-pagination-bullet-active { background-color: #ef4444 !important; }
                `}</style>
            </Head>

            <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
                {/* Hero Section */}
                <div className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden bg-dots-darker dark:bg-dots-lighter">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-white dark:from-gray-900/30 dark:to-gray-900"></div>
                    <div className="relative z-10 px-4 sm:px-6 py-24">
                        <div className="mx-auto h-20 w-20 sm:h-24 sm:w-24 mb-6">
                            <LogoIcon />
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Have I Read It?
                        </h1>
                        <p className="mt-6 text-base sm:text-lg md:text-xl max-w-3xl mx-auto text-gray-600 dark:text-gray-400">
                            The ultimate companion for book lovers. Instantly check if you own a book, track your reading progress, and build your perfect digital library.
                        </p>
                        <div className="mt-10 sm:mt-12 max-w-2xl mx-auto p-4 bg-yellow-100 dark:bg-yellow-900/30 border-l-4 border-yellow-500 text-yellow-800 dark:text-yellow-300 rounded-lg shadow-lg text-left">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <WarningIcon />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Demo Website - Under Development</h3>
                                    <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                                        <p>This is a demonstration of what the final application will look like. Login, registration, and data storage are currently disabled. Feel free to explore the concept!</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="py-16 sm:py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-2xl mx-auto lg:text-center">
                            <h2 className="text-base font-semibold leading-7 text-red-600 dark:text-red-400">YOUR PERSONAL LIBRARIAN</h2>
                            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Everything you need to manage your books</p>
                            <p className="mt-6 text-base md:text-lg leading-8 text-gray-600 dark:text-gray-400">Never buy a duplicate book again. Know what you've read, what you want to read next, and where every book belongs.</p>
                        </div>

                        {/* Feature: Scan & Check */}
                        <div ref={el => featureSectionsRef.current[0] = el} className="mt-16 max-w-5xl mx-auto grid md:grid-cols-2 gap-x-8 gap-y-12 items-center fade-in-section">
                            <div className="md:order-2">
                                <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Scan & Check Instantly</h3>
                                <p className="mt-4 text-base md:text-lg text-gray-600 dark:text-gray-400">In a bookstore and see a title you like? Use your phone's camera to scan the barcode. The app instantly checks your library to see if you already own it.</p>
                                <ul className="mt-6 space-y-3 text-base text-gray-600 dark:text-gray-400">
                                    <li className="flex gap-x-3"><CheckIcon /><span>Avoid buying duplicate books.</span></li>
                                    <li className="flex gap-x-3"><CheckIcon /><span>Quickly add new books to your digital shelf.</span></li>
                                </ul>
                            </div>
                            <div className="md:order-1 flex items-center justify-center p-4 sm:p-8"><ScanIcon /></div>
                        </div>

                        {/* Feature: Digital Bookshelf with SLIDER */}
                        <div ref={el => featureSectionsRef.current[1] = el} className="mt-16 max-w-5xl mx-auto grid md:grid-cols-2 gap-x-12 gap-y-12 items-center fade-in-section">
                            <div>
                                <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Your Digital Bookshelf</h3>
                                <p className="mt-4 text-base md:text-lg text-gray-600 dark:text-gray-400">Visually organize your physical books. See all your covers in a clean, scrollable view, just like a real shelf. It's the perfect way to remember every book you own.</p>
                            </div>
                            <div className="w-full h-80 sm:h-96 p-4 bg-gray-200 dark:bg-gray-800 rounded-xl shadow-lg relative overflow-hidden">
                                <div className="swiper book-shelf-slider h-full">
                                    <div className="swiper-wrapper">
                                        <div className="swiper-slide flex items-center justify-center"><img src="https://placehold.co/200x300/f87171/ffffff?text=Dune" className="h-5/6 w-auto object-cover rounded-md shadow-lg" alt="Book cover placeholder" /></div>
                                        <div className="swiper-slide flex items-center justify-center"><img src="https://placehold.co/200x300/60a5fa/ffffff?text=Foundation" className="h-5/6 w-auto object-cover rounded-md shadow-lg" alt="Book cover placeholder" /></div>
                                        <div className="swiper-slide flex items-center justify-center"><img src="https://placehold.co/200x300/34d399/ffffff?text=Sapiens" className="h-5/6 w-auto object-cover rounded-md shadow-lg" alt="Book cover placeholder" /></div>
                                        <div className="swiper-slide flex items-center justify-center"><img src="https://placehold.co/200x300/fbbf24/ffffff?text=Atomic+Habits" className="h-5/6 w-auto object-cover rounded-md shadow-lg" alt="Book cover placeholder" /></div>
                                        <div className="swiper-slide flex items-center justify-center"><img src="https://placehold.co/200x300/a78bfa/ffffff?text=The+Hobbit" className="h-5/6 w-auto object-cover rounded-md shadow-lg" alt="Book cover placeholder" /></div>
                                    </div>
                                    <div className="swiper-pagination"></div>
                                    <div className="swiper-button-prev"></div>
                                    <div className="swiper-button-next"></div>
                                </div>
                            </div>
                        </div>

                        {/* Feature: Track Reading */}
                        <div ref={el => featureSectionsRef.current[2] = el} className="mt-16 max-w-5xl mx-auto grid md:grid-cols-2 gap-x-8 gap-y-12 items-center fade-in-section">
                            <div className="md:order-2">
                                <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Track Your Reading Progress</h3>
                                <p className="mt-4 text-base md:text-lg text-gray-600 dark:text-gray-400">Move books from your "To-Read" pile to your "Finished" list with a single click. See stats on how many books you've read and stay motivated to tackle your reading goals.</p>
                            </div>
                            <div className="md:order-1 flex items-center justify-center p-4 sm:p-8"><ProgressIcon /></div>
                        </div>
                    </div>
                </div>
                
                {/* Footer/Stay Tuned */}
                <footer className="bg-white dark:bg-gray-800/50 mt-16">
                    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">Coming Soon!</h2>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">This project is currently under active development. Check back for updates!</p>
                        <p className="mt-8 text-xs text-gray-500 dark:text-gray-400">&copy; 2025 Have I Read It? - All Rights Reserved.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}
