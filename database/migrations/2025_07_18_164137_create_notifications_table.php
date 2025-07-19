<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // e.g., 'alert', 'reminder', 'system'
            $table->string('title');
            $table->text('message');
            $table->boolean('read')->default(false);
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->timestamp('scheduled_for')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
