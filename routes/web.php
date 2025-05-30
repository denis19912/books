<?php

// File: routes/web.php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\BookController; // Make sure BookController is imported
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [ // Or 'Auth/Login' if you want login as the landing
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    $user = Auth::user(); // Get the authenticated user

    // Calculate the stats
    $totalBooks =1;
    $booksRead = 2;
    $booksUnread =0;

    // Pass the stats to the Dashboard.jsx component
    return Inertia::render('Dashboard', [
        'totalBooks' => $totalBooks,
        'booksRead' => $booksRead,
        'booksUnread' => $booksUnread,
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Book Scanning Route
    Route::get('/books/scan', function () {
        return inertia('Books/Scan'); // Renders the Scan.jsx page component
    })->name('books.scan')->middleware('verified'); // Ensure user is verified for all book actions

    Route::post('/books/handle-scan', [BookController::class, 'handleScannedIsbn'])
        ->name('books.handleScan')
        ->middleware('verified');

    // Book Resource Routes (CRUD)
    Route::get('/books', [BookController::class, 'index'])
        ->name('books.index')
        ->middleware('verified');
    Route::get('/books/create', [BookController::class, 'create'])
        ->name('books.create')
        ->middleware('verified');
    Route::post('/books', [BookController::class, 'store'])
        ->name('books.store')
        ->middleware('verified');
    Route::get('/books/{book}/edit', [BookController::class, 'edit'])
        ->name('books.edit')
        ->middleware('verified');
    Route::put('/books/{book}', [BookController::class, 'update']) // Or use PATCH
        ->name('books.update')
        ->middleware('verified');
    Route::delete('/books/{book}', [BookController::class, 'destroy'])
        ->name('books.destroy')
        ->middleware('verified');
    Route::post('/books/confirm-add', [BookController::class, 'confirmAndAddBook'])->name('books.confirmAdd');

    // Optional: Show route if you implement it
    // Route::get('/books/{book}', [BookController::class, 'show'])->name('books.show')->middleware('verified');
});

// This line is crucial. It includes all the authentication routes
// (login, register, logout, password reset, etc.)
// This file is typically created by Laravel Breeze.
require __DIR__.'/auth.php';

?>
