<?php

// 1. Create the Migration
// Run this command in your WSL terminal, inside your project directory:
// sail artisan make:model Book -m

// This will create:
// - app/Models/Book.php
// - database/migrations/YYYY_MM_DD_HHMMSS_create_books_table.php

// --------------------------------------------------------------------------
// File: database/migrations/YYYY_MM_DD_HHMMSS_create_books_table.php
// --------------------------------------------------------------------------
// Make sure to replace YYYY_MM_DD_HHMMSS with the actual timestamp
// on the generated migration file.

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('books', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Link to the user who owns the book
            $table->string('title')->nullable();
            $table->string('author')->nullable();
            $table->string('isbn')->unique()->nullable(); // ISBN, should be unique if provided
            $table->text('description')->nullable();
            $table->string('cover_image_url')->nullable(); // URL to a cover image
            $table->boolean('is_read')->default(false);
            $table->date('published_date')->nullable();
            $table->integer('page_count')->nullable();
            $table->string('custom_notes')->nullable(); // Any personal notes about the book
            $table->timestamps(); // created_at and updated_at
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('books');
    }
};
