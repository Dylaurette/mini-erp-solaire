<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quotes', function (Blueprint $table) {
            $table->id();
            $table->string('type')->default('electronic'); // 'electronic' ou 'solar'
            $table->string('client_name')->nullable();
            $table->string('client_phone')->nullable();
            $table->string('client_email')->nullable();
            $table->foreignId('site_id')->nullable()->constrained('sites')->nullOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete(); // créateur
            $table->json('devices')->nullable(); // liste d'appareils / caractéristiques
            $table->text('notes')->nullable();
            $table->string('file_path')->nullable(); // chemin stockage fichier (devis / fiche technique)
            $table->string('status')->default('pending'); // pending, assigned, processed, closed
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quotes');
    }
};
