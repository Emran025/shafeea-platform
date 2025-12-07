<?php

use App\Models\Faq;
use App\Models\FaqCategory;
use App\Models\PrivacyPolicy;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Carbon;
use function Pest\Laravel\getJson;
use function Pest\Laravel\postJson;
use function Pest\Laravel\putJson;
use function Pest\Laravel\deleteJson;
use function Pest\Laravel\actingAs;

use App\Models\Admin;

beforeEach(function () {
    // Create a regular user
    $this->user = User::factory()->create();

    // Create an admin user correctly
    $this->admin = User::factory()->create();
    Admin::factory()->create(['user_id' => $this->admin->id]);

    // Create a FAQ category
    $this->category = FaqCategory::factory()->create(['is_active' => true]);

    // Create a FAQ
    Faq::factory()->create([
        'category_id' => $this->category->id,
        'is_active' => true,
    ]);

    // Create a privacy policy
    PrivacyPolicy::factory()->create([
        'version' => '1.0.0',
        'last_updated' => Carbon::now(),
        'is_active' => true,
    ]);
});

// Public Routes
test('can get all active faq categories', function () {
    actingAs($this->user, 'sanctum')
        ->getJson('/api/v1/help/faq-categories')
        ->assertStatus(200);
});

test('can get faqs by category', function () {
    actingAs($this->user, 'sanctum')
        ->getJson('/api/v1/help/faq-categories/' . $this->category->id . '/faqs')
        ->assertStatus(200);
});

test('can get latest privacy policy', function () {
    actingAs($this->user, 'sanctum')
        ->getJson('/api/v1/help/privacy-policy')
        ->assertStatus(200);
});

// Admin Routes
test('admin can create faq category', function () {
    $categoryData = ['name' => 'New Category', 'is_active' => true];
    actingAs($this->admin, 'sanctum')
        ->postJson('/api/v1/help/admin/faq-categories', $categoryData)
        ->assertStatus(201);
});

test('regular user cannot create faq category', function () {
    $categoryData = ['name' => 'New Category', 'is_active' => true];
    actingAs($this->user, 'sanctum')
        ->postJson('/api/v1/help/admin/faq-categories', $categoryData)
        ->assertStatus(403);
});

test('admin can update faq category', function () {
    $updateData = ['name' => 'Updated Name'];
    actingAs($this->admin, 'sanctum')
        ->putJson('/api/v1/help/admin/faq-categories/' . $this->category->id, $updateData)
        ->assertStatus(200);
});

test('admin can delete faq category', function () {
    actingAs($this->admin, 'sanctum')
        ->deleteJson('/api/v1/help/admin/faq-categories/' . $this->category->id)
        ->assertStatus(200);
});

// User Consent
test('user can record consent for privacy policy', function () {
    $consentData = ['version' => '1.0.0'];
    actingAs($this->user, 'sanctum')
        ->postJson('/api/v1/help/privacy-policy/consent', $consentData)
        ->assertStatus(200);
});
