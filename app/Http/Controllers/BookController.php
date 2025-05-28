<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class BookController extends Controller
{
    /**
     * Display a listing of the user's books.
     *
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $query = Auth::user()->books();

        if ($request->has('search') && $request->input('search') !== '') {
            $searchTerm = $request->input('search');
            $query->where(function ($q) use ($searchTerm) {
                $q->where('title', 'like', '%' . $searchTerm . '%')
                  ->orWhere('author', 'like', '%' . $searchTerm . '%')
                  ->orWhere('isbn', 'like', '%' . $searchTerm . '%');
            });
        }

        if ($request->has('status_filter') && in_array($request->input('status_filter'), ['read', 'unread'])) {
            $query->where('is_read', $request->input('status_filter') === 'read');
        }

        $books = $query->orderBy('created_at', 'desc')->paginate(10)->withQueryString();

        return Inertia::render('Books/Index', [
            'books' => $books,
            'filters' => $request->only(['search', 'status_filter']),
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
                // Include scan-specific flash data if navigating here from scan page
                'scan_result_type' => session('scan_result_type'),
                'message' => session('message'),
                'scanned_book_details' => session('scanned_book_details'),
            ]
        ]);
    }

    /**
     * Show the form for creating a new book (manual entry).
     *
     * @return \Inertia\Response
     */
    public function create(Request $request) // Allow passing ISBN for prefill
    {
        return Inertia::render('Books/Create', [
            'prefill_isbn' => $request->query('isbn'),
            'prefill_title' => $request->query('title'),
        ]);
    }

    /**
     * Store a newly created book in storage (manual entry).
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'nullable|string|max:255',
            'isbn' => [
                'nullable',
                'string',
                'max:20',
                Rule::unique('books')->where(function ($query) {
                    return $query->where('user_id', Auth::id());
                }),
            ],
            'description' => 'nullable|string',
            'cover_image_url' => 'nullable|url|max:2048',
            'is_read' => 'sometimes|boolean',
            'published_date' => 'nullable|date',
            'page_count' => 'nullable|integer|min:0',
            'custom_notes' => 'nullable|string',
        ]);

        $validatedData['user_id'] = Auth::id();
        if (!isset($validatedData['is_read'])) {
            $validatedData['is_read'] = false;
        }

        Book::create($validatedData);

        return redirect()->route('books.index')->with('success', 'Book added manually successfully!');
    }

    /**
     * Show the form for editing the specified book.
     *
     * @param  \App\Models\Book  $book
     * @return \Inertia\Response
     */
    public function edit(Book $book)
    {
        if ($book->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }
        return Inertia::render('Books/Edit', ['book' => $book]);
    }

    /**
     * Update the specified book in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Book  $book
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, Book $book)
    {
        if ($book->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'nullable|string|max:255',
            'isbn' => [
                'nullable',
                'string',
                'max:20',
                Rule::unique('books')->where(function ($query) {
                    return $query->where('user_id', Auth::id());
                })->ignore($book->id),
            ],
            'description' => 'nullable|string',
            'cover_image_url' => 'nullable|url|max:2048',
            'is_read' => 'sometimes|boolean',
            'published_date' => 'nullable|date',
            'page_count' => 'nullable|integer|min:0',
            'custom_notes' => 'nullable|string',
        ]);
        
        if (!isset($validatedData['is_read'])) {
            $validatedData['is_read'] = false;
        } else {
            $validatedData['is_read'] = filter_var($validatedData['is_read'], FILTER_VALIDATE_BOOLEAN);
        }

        $book->update($validatedData);

        return redirect()->route('books.index')->with('success', 'Book updated successfully!');
    }

    /**
     * Remove the specified book from storage.
     *
     * @param  \App\Models\Book  $book
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Book $book)
    {
        if ($book->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }
        $book->delete();
        return redirect()->route('books.index')->with('success', 'Book deleted successfully!');
    }

    /**
     * Handle the initial scanned ISBN to check if it exists or prompt to add.
     */
    public function handleScannedIsbn(Request $request)
    {
        $request->validate(['isbn' => 'required|string|max:20']);
        $isbn = $request->input('isbn');
        $userId = Auth::id();

        $existingBook = Book::where('isbn', $isbn)->where('user_id', $userId)->first();

        if ($existingBook) {
            return back()->with([
                'scan_result_type' => 'found_in_library',
                'message' => 'This book (' . $existingBook->title . ') is already in your library!',
                'scanned_book_details' => [
                    'id' => $existingBook->id,
                    'title' => $existingBook->title,
                    'author' => $existingBook->author,
                    'is_read' => $existingBook->is_read,
                    'cover_image_url' => $existingBook->cover_image_url,
                ]
            ]);
        } else {
            // Book not found, prompt user to add it
            return back()->with([
                'scan_result_type' => 'not_in_library_prompt_add',
                'message' => "ISBN: " . $isbn . " is not in your library. Would you like to try and add it?",
                'scanned_isbn' => $isbn // Send back the ISBN for confirmation on the frontend
            ]);
        }
    }

    /**
     * Confirm and add a new book after user agrees to add a scanned ISBN.
     */
    public function confirmAndAddBook(Request $request)
    {
        $request->validate(['isbn' => 'required|string|max:20']);
        $isbn = $request->input('isbn');
        $userId = Auth::id();

        // Double-check if it was somehow added between the prompt and confirmation
        $existingBook = Book::where('isbn', $isbn)->where('user_id', $userId)->first();
        if ($existingBook) {
            return back()->with([
                'scan_result_type' => 'found_in_library',
                'message' => 'This book (' . $existingBook->title . ') was already in your library (possibly added concurrently).',
                'scanned_book_details' => [
                    'id' => $existingBook->id,
                    'title' => $existingBook->title,
                    'author' => $existingBook->author,
                    'is_read' => $existingBook->is_read,
                    'cover_image_url' => $existingBook->cover_image_url,
                ]
            ]);
        }

        // Proceed with Google Books API fetch and book creation
        $title = 'Unknown Title (ISBN: ' . $isbn . ')'; // Default title includes ISBN
        $author = 'Unknown Author';
        $description = null;
        $cover_image_url = null;
        $published_date_str = null;
        $page_count = null;
        $detailsFetchedFromApi = false;

        try {
            $response = Http::timeout(10)->get("https://www.googleapis.com/books/v1/volumes", ['q' => 'isbn:' . $isbn]);
            if ($response->successful() && isset($response->json()['items'][0]['volumeInfo'])) {
                $volumeInfo = $response->json()['items'][0]['volumeInfo'];
                $title = $volumeInfo['title'] ?? $title; // Keep ISBN in title if API doesn't provide one
                $author = isset($volumeInfo['authors']) ? implode(', ', $volumeInfo['authors']) : $author;
                $description = $volumeInfo['description'] ?? null;
                $published_date_str = $volumeInfo['publishedDate'] ?? null;
                $page_count = $volumeInfo['pageCount'] ?? null;

                if (isset($volumeInfo['imageLinks']['thumbnail'])) {
                    $cover_image_url = $volumeInfo['imageLinks']['thumbnail'];
                } elseif (isset($volumeInfo['imageLinks']['smallThumbnail'])) {
                    $cover_image_url = $volumeInfo['imageLinks']['smallThumbnail'];
                }
                
                if ($published_date_str) {
                    if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $published_date_str)) {} 
                    elseif (preg_match('/^\d{4}-\d{2}$/', $published_date_str)) { $published_date_str .= '-01'; } 
                    elseif (preg_match('/^\d{4}$/', $published_date_str)) { $published_date_str .= '-01-01'; } 
                    else { $published_date_str = null; }
                }
                $detailsFetchedFromApi = true;
            } else {
                 Log::warning('Google Books API call failed or no items found for ISBN: ' . $isbn . ' during confirm add.', ['response_body' => $response->body(), 'status_code' => $response->status()]);
            }
        } catch (\Exception $e) {
            Log::error('Error fetching from Google Books API for ISBN ' . $isbn . ' during confirm add: ' . $e->getMessage());
            // We will still create the book with minimal info if API fails
        }
        
        $newBook = Book::create([
            'user_id' => $userId,
            'isbn' => $isbn,
            'title' => $title,
            'author' => $author,
            'description' => $description,
            'cover_image_url' => $cover_image_url,
            'published_date' => $published_date_str,
            'page_count' => $page_count,
            'is_read' => false,
        ]);

        $message = $detailsFetchedFromApi ? 
                   'Book "' . $newBook->title . '" successfully added to your library!' :
                   'Book (ISBN: ' . $newBook->isbn . ') added with minimal details. API lookup failed or returned no data. You can edit it manually.';

        return back()->with([
            'scan_result_type' => 'added_to_library',
            'message' => $message,
            'scanned_book_details' => [
                'id' => $newBook->id,
                'title' => $newBook->title,
                'author' => $newBook->author,
                'is_read' => $newBook->is_read,
                'cover_image_url' => $newBook->cover_image_url,
            ]
        ]);
    }
}
