<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    // ── Build API ─────────────────────────────────────────────────────────────
    // RSA public key used to verify signed requests from GitHub Actions.
    // The private key is stored in GitHub Secrets (BUILD_API_PRIVATE_KEY).
    // Generate a keypair: openssl genrsa -out priv.pem 4096
    //                     openssl rsa -in priv.pem -pubout -out pub.pem
    'build_api' => [
        'public_key' => env('BUILD_API_PUBLIC_KEY'),
    ],

    // ── GitHub Integration ────────────────────────────────────────────────────
    // Used to dispatch repository_dispatch events from the admin dashboard.
    // Each application repository (student, teach) hosts its own build workflows.
    'github' => [
        'token' => env('GITHUB_DISPATCH_TOKEN'),
        'owner' => env('GITHUB_OWNER', 'Emran025'),
        'student_repo' => env('GITHUB_STUDENT_REPO', 'shafeea_student'),
        'teach_repo' => env('GITHUB_TEACH_REPO', 'shafeea_teach'),
    ],

    // ── Virtual School Settings ────────────────────────────────────────────────
    'virtual_school' => [
        'app_key' => env('VIRTUAL_SCHOOL_APP_KEY'),
        'keystore_file' => env('VIRTUAL_SCHOOL_KEYSTORE_FILE'),
        'store_password' => env('VIRTUAL_SCHOOL_KEYSTORE_STORE_PASSWORD'),
        'key_alias' => env('VIRTUAL_SCHOOL_KEYSTORE_KEY_ALIAS', 'shafeea'),
        'key_password' => env('VIRTUAL_SCHOOL_KEYSTORE_KEY_PASSWORD'),
    ],

];
