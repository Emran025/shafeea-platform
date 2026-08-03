<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add the custom notification fields that existed in the original
     * notifications table before the models were merged.
     *
     * The merge replaced the custom table with Laravel's built-in morphable
     * notifications structure, which lost: title, message, read, user_id,
     * and scheduled_for.
     */
    public function up(): void
    {
        Schema::table('notifications', function (Blueprint $table) {
            if (! Schema::hasColumn('notifications', 'title')) {
                $table->string('title')->nullable()->after('type');
            }

            if (! Schema::hasColumn('notifications', 'message')) {
                $table->text('message')->nullable()->after('title');
            }

            if (! Schema::hasColumn('notifications', 'read')) {
                $table->boolean('read')->default(false)->after('message');
            }

            if (! Schema::hasColumn('notifications', 'user_id')) {
                $table->foreignId('user_id')
                    ->nullable()
                    ->after('read')
                    ->constrained()
                    ->onDelete('cascade');
            }

            if (! Schema::hasColumn('notifications', 'scheduled_for')) {
                $table->timestamp('scheduled_for')->nullable()->after('user_id');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('notifications', function (Blueprint $table) {
            $table->dropConstrainedForeignId('user_id');
            $table->dropColumn(['title', 'message', 'read', 'scheduled_for']);
        });
    }
};
