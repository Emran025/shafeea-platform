<?php

use function Pest\Laravel\postJson;
use App\Models\User;

dataset('login_users', [
    'User with email' => [['login' => 'user1@example.com', 'password' => 'password1']],
    'User with phone' => [['login' => '700123456', 'password' => 'password2']],
    'User with other email' => [['login' => 'user2@example.com', 'password' => 'password3']],
]);

$deviceInfo = [
    'device_id' => 'test-device-id',
    'model' => 'Test Model',
    'manufacturer' => 'Test Manufacturer',
    'os_version' => 'Test OS 1.0',
];

test('users can login with valid credentials and device info', function (array $credentials) use ($deviceInfo) {
    // إنشاء المستخدم بناءً على ما إذا كان تسجيل الدخول بريدًا إلكترونيًا أو رقم هاتف
    User::factory()->create([
        'email' => filter_var($credentials['login'], FILTER_VALIDATE_EMAIL) ? $credentials['login'] : null,
        'phone' => is_numeric($credentials['login']) ? $credentials['login'] : null,
        'password' => bcrypt($credentials['password']),
    ]);

    $payload = array_merge($credentials, ['device_info' => $deviceInfo]);

    // إرسال طلب تسجيل الدخول
    $response = postJson('/api/v1/auth/login', $payload);

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

test('new users can register with valid data and device info', function () use ($deviceInfo) {
    $userData = [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ];

    $payload = array_merge($userData, ['device_info' => $deviceInfo]);

    $response = postJson('/api/v1/auth/register', $payload);

    $response->assertStatus(200);
    $response->assertJsonStructure([
        'success',
        'message',
        'data' => [
            'token',
            'user' => ['id', 'name', 'email', 'phone'],
        ]
    ]);

    $this->assertDatabaseHas('users', ['email' => 'test@example.com']);
    $this->assertDatabaseHas('devices', ['device_id' => 'test-device-id']);
});
