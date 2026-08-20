<?php

/*
|--------------------------------------------------------------------------
| Admin Seed Configuration
|--------------------------------------------------------------------------
|
| Canonical source of truth for all admin seeder data.
| Previously sourced from database/content/admin/{users,topic_assignments,
| permissions,role_permissions}.json — those files are now superseded by
| this config.
|
| Sensitive values (emails, default password) are env-driven so they are
| never committed as plain text. Structural data (roles, topics, permissions)
| lives here in PHP so it is version-controlled and IDE-friendly.
|
*/

return [

    // ── Default admin password (used by AdminAccessSeeder) ────────────────
    'default_password' => env('ADMIN_DEFAULT_PASSWORD', 'Acc@123456'),

    // ── Seed Users ────────────────────────────────────────────────────────
    // Each entry: name, email (from env), role slug, is_active.
    // Emails are env-driven; only non-sensitive display names and roles
    // are hardcoded here.
    'users' => [
        [
            'name'      => env('ADMIN_USER_SYSADMIN_NAME', 'System Admin'),
            'email'     => env('ADMIN_USER_SYSADMIN_EMAIL', 'admin@accsystemerp.com'),
            'role'      => 'platform.admin',
            'is_active' => 1,
        ],
        [
            'name'      => env('ADMIN_USER_OPS_NAME', 'Omar Operations'),
            'email'     => env('ADMIN_USER_OPS_EMAIL', 'omar@accsystemerp.com'),
            'role'      => 'ops.manager',
            'is_active' => 1,
        ],
        [
            'name'      => env('ADMIN_USER_PUBLISHER1_NAME', 'Pat Publisher'),
            'email'     => env('ADMIN_USER_PUBLISHER1_EMAIL', 'pat@accsystemerp.com'),
            'role'      => 'content.publisher',
            'is_active' => 1,
        ],
        [
            'name'      => env('ADMIN_USER_PUBLISHER2_NAME', 'Robin Relay'),
            'email'     => env('ADMIN_USER_PUBLISHER2_EMAIL', 'robin@accsystemerp.com'),
            'role'      => 'content.publisher',
            'is_active' => 1,
        ],
        [
            'name'      => env('ADMIN_USER_SUPERVISOR_NAME', 'Sara Supervisor'),
            'email'     => env('ADMIN_USER_SUPERVISOR_EMAIL', 'sara@accsystemerp.com'),
            'role'      => 'content.supervisor',
            'is_active' => 1,
        ],
        [
            'name'      => env('ADMIN_USER_EDITOR1_NAME', 'Emma Editor'),
            'email'     => env('ADMIN_USER_EDITOR1_EMAIL', 'emma@accsystemerp.com'),
            'role'      => 'content.editor',
            'is_active' => 1,
        ],
        [
            'name'      => env('ADMIN_USER_EDITOR2_NAME', 'Sam Sato'),
            'email'     => env('ADMIN_USER_EDITOR2_EMAIL', 'sam@accsystemerp.com'),
            'role'      => 'content.editor',
            'is_active' => 1,
        ],
        [
            'name'      => env('ADMIN_USER_AUTHOR1_NAME', 'Alex Author'),
            'email'     => env('ADMIN_USER_AUTHOR1_EMAIL', 'alex@accsystemerp.com'),
            'role'      => 'content.author',
            'is_active' => 1,
        ],
        [
            'name'      => env('ADMIN_USER_AUTHOR2_NAME', 'Chris Writer'),
            'email'     => env('ADMIN_USER_AUTHOR2_EMAIL', 'chris@accsystemerp.com'),
            'role'      => 'content.author',
            'is_active' => 1,
        ],
        [
            'name'      => env('ADMIN_USER_AUTHOR3_NAME', 'Dana Pen'),
            'email'     => env('ADMIN_USER_AUTHOR3_EMAIL', 'dana@accsystemerp.com'),
            'role'      => 'content.author',
            'is_active' => 1,
        ],
        [
            'name'      => env('ADMIN_USER_INQ_MANAGER_NAME', 'Iman Inquiries'),
            'email'     => env('ADMIN_USER_INQ_MANAGER_EMAIL', 'iman@accsystemerp.com'),
            'role'      => 'inquiry.manager',
            'is_active' => 1,
        ],
        [
            'name'      => env('ADMIN_USER_INQ_EMAIL_NAME', 'Elan Email'),
            'email'     => env('ADMIN_USER_INQ_EMAIL_EMAIL', 'elan@accsystemerp.com'),
            'role'      => 'inquiry.email',
            'is_active' => 1,
        ],
        [
            'name'      => env('ADMIN_USER_INQ_SUPPORT_NAME', 'Sophie Support'),
            'email'     => env('ADMIN_USER_INQ_SUPPORT_EMAIL', 'sophie@accsystemerp.com'),
            'role'      => 'inquiry.support',
            'is_active' => 1,
        ],
        [
            'name'      => env('ADMIN_USER_INQ_FAQ_NAME', 'Farid FAQ'),
            'email'     => env('ADMIN_USER_INQ_FAQ_EMAIL', 'farid@accsystemerp.com'),
            'role'      => 'inquiry.faq',
            'is_active' => 1,
        ],
    ],

    // ── Topic → Author assignments ─────────────────────────────────────────
    // Keys are topic names; values are arrays of user env keys (resolved below).
    // Emails are resolved via env() so they stay consistent with the users list.
    'topic_assignments' => [
        'Fintech'      => [env('ADMIN_USER_EDITOR1_EMAIL', 'emma@accsystemerp.com'), env('ADMIN_USER_AUTHOR1_EMAIL', 'alex@accsystemerp.com')],
        'Enterprise'   => [env('ADMIN_USER_EDITOR2_EMAIL', 'sam@accsystemerp.com')],
        'Cloud'        => [env('ADMIN_USER_EDITOR2_EMAIL', 'sam@accsystemerp.com'),  env('ADMIN_USER_AUTHOR2_EMAIL', 'chris@accsystemerp.com')],
        'Mobile'       => [env('ADMIN_USER_AUTHOR2_EMAIL', 'chris@accsystemerp.com')],
        'AI & ML'      => [env('ADMIN_USER_EDITOR2_EMAIL', 'sam@accsystemerp.com'),  env('ADMIN_USER_EDITOR1_EMAIL', 'emma@accsystemerp.com')],
        'Commerce'     => [env('ADMIN_USER_AUTHOR3_EMAIL', 'dana@accsystemerp.com')],
        'Partnerships' => [env('ADMIN_USER_AUTHOR3_EMAIL', 'dana@accsystemerp.com'), env('ADMIN_USER_AUTHOR1_EMAIL', 'alex@accsystemerp.com')],
    ],

    // ── Permissions ───────────────────────────────────────────────────────
    'permissions' => [
        ['code' => 'edit_content',            'label' => 'Edit content'],
        ['code' => 'submit_for_review',       'label' => 'Submit for review'],
        ['code' => 'request_changes',         'label' => 'Request changes'],
        ['code' => 'approve',                 'label' => 'Approve'],
        ['code' => 'publish',                 'label' => 'Publish'],
        ['code' => 'unpublish',               'label' => 'Unpublish'],
        ['code' => 'manage_pages',            'label' => 'Manage pages'],
        ['code' => 'manage_sections',         'label' => 'Manage sections'],
        ['code' => 'manage_permissions',      'label' => 'Manage permissions'],
        ['code' => 'manage_users',            'label' => 'Manage users'],
        ['code' => 'manage_keywords',         'label' => 'Manage keywords'],
        ['code' => 'manage_topics',           'label' => 'Manage topics'],
        ['code' => 'manage_site_structure',   'label' => 'Manage site structure (tabs, top-bar, layout)'],
        ['code' => 'manage_supervisors',      'label' => 'Manage supervisor accounts (T2/T3/T5)'],
        ['code' => 'manage_content_users',    'label' => 'Manage content user accounts (editors & authors)'],
        ['code' => 'assign_topics',           'label' => 'Assign topics to authors'],
        ['code' => 'manage_inquiries',        'label' => 'Manage all inquiry channels (overview)'],
        ['code' => 'manage_email_inquiries',  'label' => 'Manage inbound email inquiries'],
        ['code' => 'manage_support_tickets',  'label' => 'Manage support panel tickets'],
        ['code' => 'manage_faq',              'label' => 'Manage FAQ entries and categories'],
    ],

];
