<?php

use function Pest\Laravel\postJson;
use App\Models\User;

dataset('login_users', [
    'User with email' => [['login' => 'user1@example.com', 'password' => 'password1']],
    'User with phone' => [['login' => '700123456', 'password' => 'password2']],
    'User with other email' => [['login' => 'user2@example.com', 'password' => 'password3']],
]);

test('users can login with valid credentials', function (array $credentials) {
    // إنشاء المستخدم بناءً على ما إذا كان تسجيل الدخول بريدًا إلكترونيًا أو رقم هاتف
    User::factory()->create([
        'email' => filter_var($credentials['login'], FILTER_VALIDATE_EMAIL) ? $credentials['login'] : null,
        'phone' => is_numeric($credentials['login']) ? $credentials['login'] : null,
        'password' => bcrypt($credentials['password']),
    ]);

    // إرسال طلب تسجيل الدخول
    $response = postJson('/api/v1/auth/login', $credentials);

    // التحقق من نجاح الاستجابة وبنية البيانات
    $response->assertStatus(200);
    $response->assertJsonStructure([
        'success',
        'message',
        'data' => [
            'token',
            'user' => ['id', 'name', 'email', 'phone'],
        ]
    ]);
})->with('login_users');
