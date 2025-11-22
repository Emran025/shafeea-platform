<?php

use App\Models\User;
use Illuminate\Support\Facades\Notification;

use function Pest\Laravel\postJson;

test('reset password link can be requested via api for existing user', function () {
    $user = User::factory()->create();

    postJson('/api/v1/forgot-password', ['email' => $user->email])
        ->assertStatus(200)
        ->assertJson([
            'status' => 'success',
            'message' => 'If the email exists, a reset link has been sent.'
        ]);
});

test('forgot password success response has correct api structure', function () {
    $user = User::factory()->create();

    postJson('/api/v1/forgot-password', ['email' => $user->email])
        ->assertStatus(200)
        ->assertJsonStructure([
            'status',
            'message',
            'data'
        ]);
});

test('reset password link returns same response for non-existing user', function () {
    postJson('/api/v1/forgot-password', ['email' => 'non-existing-user@example.com'])
        ->assertStatus(200)
        ->assertJson([
            'status' => 'success',
            'message' => 'If the email exists, a reset link has been sent.'
        ]);
});

test('reset password link returns validation error for invalid email', function () {
    postJson('/api/v1/forgot-password', ['email' => 'not-an-email'])
        ->assertStatus(422)
        ->assertJson([
            'status' => 'error',
            'message' => 'The given data was invalid.',
            'errors' => [
                'email' => ['The email must be a valid email address.'],
            ],
        ]);
});

test('reset password link returns validation error for missing email', function () {
    postJson('/api/v1/forgot-password', [])
        ->assertStatus(422)
        ->assertJson([
            'status' => 'error',
            'message' => 'The given data was invalid.',
            'errors' => [
                'email' => ['The email field is required.'],
            ],
        ]);
});
