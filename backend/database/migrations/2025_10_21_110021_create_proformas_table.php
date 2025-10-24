<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProformasTable extends Migration
{
    public function up()
    {
        Schema::create('proformas', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->unique();
            $table->foreignId('site_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete(); // technicien
            $table->text('description')->nullable();
            $table->decimal('total', 12, 2)->default(0);
            $table->enum('status', ['draft','sent','accepted','rejected'])->default('draft');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('proformas');
    }
}
