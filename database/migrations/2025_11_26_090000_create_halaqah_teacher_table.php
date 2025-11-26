<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use App\Models\Halaqah;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Step 1: Create the new pivot table
        Schema::create('halaqah_teacher', function (Blueprint $table) {
            $table->id();
            $table->foreignId('halaqah_id')->constrained()->onDelete('cascade');
            $table->foreignId('teacher_id')->constrained()->onDelete('cascade');
            $table->timestamp('assigned_at')->useCurrent();
            $table->text('note')->nullable();
            $table->boolean('is_current')->default(true);
        });

        // Step 2: Migrate existing data from 'halaqahs' to 'halaqah_teacher'
        $halaqahs = DB::table('halaqahs')->whereNotNull('teacher_id')->get();
        foreach ($halaqahs as $halaqah) {
            DB::table('halaqah_teacher')->insert([
                'halaqah_id' => $halaqah->id,
                'teacher_id' => $halaqah->teacher_id,
                'assigned_at' => $halaqah->created_at,
                'is_current' => true,
                'note' => 'تمت الإضافة بواسطة الترحيل التلقائي للنظام', // "Added by system auto-migration"
            ]);
        }

        // Step 3: Drop the 'teacher_id' column from the 'halaqahs' table
        Schema::table('halaqahs', function (Blueprint $table) {
            $table->dropForeign(['teacher_id']);
            $table->dropColumn('teacher_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Step 1: Add the 'teacher_id' column back to the 'halaqahs' table
        Schema::table('halaqahs', function (Blueprint $table) {
            $table->foreignId('teacher_id')->nullable()->constrained()->onDelete('set null');
        });

        // Step 2: Restore the 'teacher_id' from the 'halaqah_teacher' table
        $assignments = DB::table('halaqah_teacher')->where('is_current', true)->get();
        foreach ($assignments as $assignment) {
            DB::table('halaqahs')
                ->where('id', $assignment->halaqah_id)
                ->update(['teacher_id' => $assignment->teacher_id]);
        }

        // Step 3: Drop the pivot table
        Schema::dropIfExists('halaqah_teacher');
    }
};
