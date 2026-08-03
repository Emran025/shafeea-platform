<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Restore all missing tables and columns lost during the schema merge.
     */
    public function up(): void
    {
        // 1. halaqah_teacher pivot table
        if (! Schema::hasTable('halaqah_teacher')) {
            Schema::create('halaqah_teacher', function (Blueprint $table) {
                $table->id();
                $table->foreignId('halaqah_id')->constrained()->onDelete('cascade');
                $table->foreignId('teacher_id')->constrained()->onDelete('cascade');
                $table->timestamp('assigned_at')->useCurrent();
                $table->text('note')->nullable();
                $table->boolean('is_current')->default(true);
            });
        }

        // 2. applicant_rejections missing school_id
        if (Schema::hasTable('applicant_rejections')) {
            Schema::table('applicant_rejections', function (Blueprint $table) {
                if (! Schema::hasColumn('applicant_rejections', 'school_id')) {
                    $table->foreignId('school_id')->nullable()->after('applicant_id')->constrained()->onDelete('cascade');
                }
            });
        }

        // 3. content_types missing feature flags and status columns
        if (Schema::hasTable('content_types')) {
            Schema::table('content_types', function (Blueprint $table) {
                if (! Schema::hasColumn('content_types', 'has_categories')) {
                    $table->boolean('has_categories')->default(true)->after('description');
                }
                if (! Schema::hasColumn('content_types', 'has_tags')) {
                    $table->boolean('has_tags')->default(true)->after('has_categories');
                }
                if (! Schema::hasColumn('content_types', 'has_comments')) {
                    $table->boolean('has_comments')->default(true)->after('has_tags');
                }
                if (! Schema::hasColumn('content_types', 'has_media')) {
                    $table->boolean('has_media')->default(true)->after('has_comments');
                }
                if (! Schema::hasColumn('content_types', 'is_active')) {
                    $table->boolean('is_active')->default(true)->after('has_media');
                }
            });
        }

        // 4. tags missing description and usage_count
        if (Schema::hasTable('tags')) {
            Schema::table('tags', function (Blueprint $table) {
                if (! Schema::hasColumn('tags', 'description')) {
                    $table->text('description')->nullable()->after('tag_slug');
                }
                if (! Schema::hasColumn('tags', 'usage_count')) {
                    $table->integer('usage_count')->default(0)->after('description');
                }
            });
        }

        // 5. user_consents missing policy tracking columns
        if (Schema::hasTable('user_consents')) {
            Schema::table('user_consents', function (Blueprint $table) {
                if (! Schema::hasColumn('user_consents', 'policy_type')) {
                    $table->string('policy_type', 50)->nullable()->after('user_id');
                }
                if (! Schema::hasColumn('user_consents', 'policy_version')) {
                    $table->string('policy_version', 50)->nullable()->after('policy_type');
                }
                if (! Schema::hasColumn('user_consents', 'ip_address')) {
                    $table->string('ip_address', 45)->nullable()->after('policy_version');
                }
                if (! Schema::hasColumn('user_consents', 'user_agent')) {
                    $table->text('user_agent')->nullable()->after('ip_address');
                }
                if (! Schema::hasColumn('user_consents', 'consented_at')) {
                    $table->timestamp('consented_at')->useCurrent()->after('user_agent');
                }
            });
        }

        // 6. halaqah_notes missing admin_id
        if (Schema::hasTable('halaqah_notes')) {
            Schema::table('halaqah_notes', function (Blueprint $table) {
                if (! Schema::hasColumn('halaqah_notes', 'admin_id')) {
                    $table->foreignId('admin_id')->nullable()->after('halaqah_id')->constrained('admins')->onDelete('cascade');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('halaqah_teacher');

        if (Schema::hasTable('applicant_rejections')) {
            Schema::table('applicant_rejections', function (Blueprint $table) {
                if (Schema::hasColumn('applicant_rejections', 'school_id')) {
                    $table->dropConstrainedForeignId('school_id');
                }
            });
        }

        if (Schema::hasTable('content_types')) {
            Schema::table('content_types', function (Blueprint $table) {
                $table->dropColumn(['has_categories', 'has_tags', 'has_comments', 'has_media', 'is_active']);
            });
        }

        if (Schema::hasTable('tags')) {
            Schema::table('tags', function (Blueprint $table) {
                $table->dropColumn(['description', 'usage_count']);
            });
        }

        if (Schema::hasTable('user_consents')) {
            Schema::table('user_consents', function (Blueprint $table) {
                $table->dropColumn(['policy_type', 'policy_version', 'ip_address', 'user_agent', 'consented_at']);
            });
        }

        if (Schema::hasTable('halaqah_notes')) {
            Schema::table('halaqah_notes', function (Blueprint $table) {
                if (Schema::hasColumn('halaqah_notes', 'admin_id')) {
                    $table->dropConstrainedForeignId('admin_id');
                }
            });
        }
    }
};
