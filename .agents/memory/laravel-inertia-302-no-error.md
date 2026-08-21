---
name: Diagnosing "every POST redirects with no error" in Laravel + Inertia
description: A 302 after a POST is normal Inertia/Laravel behavior for both success and validation-failure redirects; don't assume it's a bug from the status code alone.
---

A user reported that every POST (admin login, a public registration form, a public application form) in a Laravel + Inertia app returned 302 in the browser Network tab, with the form appearing "stuck" and no visible error.

**Why this is misleading:** in Laravel/Inertia, both a successful form submission (`redirect()->route(...)`) and a validation/auth failure (`back()->withErrors(...)`) return HTTP 302 with a similarly-sized redirect body. The status code alone cannot distinguish "worked as intended" from "failed validation" — you have to check whether the destination and flashed errors are correct.

**How to apply:** before assuming a code bug, reproduce the exact flow locally (composer install, npm install, migrate, seed, `php artisan serve`) with curl using a real cookie jar (GET the form to capture session + XSRF-TOKEN cookies, decode the XSRF-TOKEN cookie value, POST with `X-XSRF-TOKEN` + `X-Requested-With` headers using the same cookies). If the same commit reproduces correct behavior locally, the bug is very likely environment-specific (session cookie domain, reverse proxy not forwarding cookies/headers, session table not persisting) rather than an application logic bug — shift the investigation to production env vars (APP_URL, SESSION_DOMAIN, SESSION_SECURE_COOKIE) and proxy/cache config, which usually requires the user's own server access to confirm.

Also useful: in this Replit environment, backgrounded processes started with `&` in one ShellExec call do not survive into the next ShellExec call (each call is a fresh shell). To run a dev server and curl against it, start the server and run the test commands in the *same* ShellExec invocation.
