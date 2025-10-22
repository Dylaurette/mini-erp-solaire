<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePaymentsTable extends Migration
{
    public function up()
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->morphs('payable'); // sale or purchase, or proforma -> payable_type, payable_id
            $table->decimal('amount', 12, 2)->default(0);
            $table->string('method')->nullable(); // cash, mobile_money, bank_transfer
            $table->date('paid_at')->nullable();
            $table->foreignId('site_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('payments');
    }
}

