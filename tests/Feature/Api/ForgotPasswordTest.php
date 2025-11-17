<?php

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Notification;

use function Pest\Laravel\postJson;

test('reset password link can be requested via api', function () {
    Notification::fake();

    $user = User::factory()->create();

    postJson('/api/v1/forgot-password', ['email' => $user->email])
        ->assertStatus(200)
        ->assertJson([
            'status' => 'success',
            'message' => 'If the email exists, a reset link has been sent.'
        ]);

    Notification::assertSentTo($user, ResetPassword::class);
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
