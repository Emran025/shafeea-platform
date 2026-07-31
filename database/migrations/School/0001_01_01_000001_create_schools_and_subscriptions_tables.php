<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // subscription_plans
        Schema::create('subscription_plans', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->string('currency')->default('SAR');
            $table->enum('billing_period', ['monthly', 'yearly'])->default('monthly');
            $table->json('features')->nullable();
            $table->boolean('is_recommended')->default(false);
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });

        // schools
        Schema::create('schools', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('School name');
            $table->string('code')->nullable()->unique()->comment('School code');
            $table->string('logo')->nullable()->comment('School avatar or logo URL');
            $table->string('phone')->comment('School contact phone');
            $table->string('phone_zone', 10)->default('+966')->comment('School phone country code');
            $table->string('country')->nullable()->comment('Country');
            $table->string('city')->nullable()->comment('City');
            $table->string('location')->nullable()->comment('Location description');
            $table->string('address')->nullable()->comment('Full address');
            $table->string('email')->unique()->comment('School primary email');
            $table->boolean('is_active')->default(true)->comment('School active status');
            $table->string('status')->default('active')->comment('Operational status');
            
            // Subscriptions & Resolution fields
            $table->foreignId('current_plan_id')->nullable()->constrained('subscription_plans')->onDelete('set null');
            $table->enum('subscription_status', ['active', 'past_due', 'canceled', 'pending_payment'])->default('pending_payment');
            $table->timestamp('subscription_ends_at')->nullable();

            // Build identity & resolution fields
            $table->string('build_app_id')->nullable()->unique();
            $table->string('build_api_key_hash')->nullable();
            $table->timestamp('build_api_key_created_at')->nullable();
            $table->string('site_scope')->nullable()->unique();
            $table->string('custom_domain')->nullable()->unique();
            $table->boolean('use_custom_domain')->default(false);
            $table->string('theme_id')->default('emerald');

            $table->timestamps();
            $table->softDeletes()->comment('Soft delete timestamp');
        });

        // subscriptions
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained()->onDelete('cascade');
            $table->foreignId('plan_id')->nullable()->constrained('subscription_plans')->onDelete('cascade');
            $table->foreignId('subscription_plan_id')->nullable()->constrained('subscription_plans')->onDelete('cascade');
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->decimal('price_paid', 10, 2)->nullable();
            $table->string('status')->default('active'); // active, expired, canceled
            $table->timestamps();
        });

        // payments
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained()->onDelete('cascade');
            $table->foreignId('subscription_id')->nullable()->constrained()->onDelete('set null');
            $table->string('transaction_id')->nullable()->unique();
            $table->enum('payment_method', ['online', 'reference_number', 'free'])->nullable();
            $table->string('reference_number')->nullable()->unique();
            $table->decimal('amount', 10, 2);
            $table->string('currency', 3)->default('SAR');
            $table->enum('status', ['pending', 'paid', 'failed', 'completed'])->default('pending');
            $table->json('payload')->nullable();
            $table->timestamps();
        });

        // plans
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('name')->comment('Plan name');
            $table->text('description')->nullable()->comment('Plan description');
            $table->date('start_date')->nullable()->comment('Plan start date');
            $table->date('end_date')->nullable()->comment('Plan end date');
            $table->boolean('has_review')->default(false)->comment('Has review section');
            $table->foreignId('review_unit_id')->nullable()->constrained('units')->onDelete('set null')->comment('FK to units for review');
            $table->integer('review_amount')->nullable()->comment('Amount for review');
            $table->boolean('has_memorization')->default(false)->comment('Has memorization section');
            $table->foreignId('memorization_unit_id')->nullable()->constrained('units')->onDelete('set null')->comment('FK to units for memorization');
            $table->integer('memorization_amount')->nullable()->comment('Amount for memorization');
            $table->boolean('has_sard')->default(false)->comment('Has sard section');
            $table->foreignId('sard_unit_id')->nullable()->constrained('units')->onDelete('set null')->comment('FK to units for sard');
            $table->integer('sard_amount')->nullable()->comment('Amount for sard');
            $table->foreignId('frequency_type_id')->nullable()->constrained('frequency_types')->onDelete('cascade')->comment('FK to frequency_types');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('plans');
        Schema::dropIfExists('payments');
        Schema::dropIfExists('subscriptions');
        Schema::dropIfExists('schools');
        Schema::dropIfExists('subscription_plans');
    }
};
