<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'title',
        'author',
        'isbn',
        'description',
        'cover_image_url',
        'is_read',
        'published_date',
        'page_count',
        'custom_notes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_read' => 'boolean',
        'published_date' => 'date',
    ];

    /**
     * Get the user that owns the book.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

