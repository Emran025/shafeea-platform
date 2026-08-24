---
name: Case-insensitive email/username normalization
description: Laravel app-level pattern for guaranteeing emails/usernames are always case-insensitive, without relying on DB collation.
---

Auth::attempt() and where('email', ...) / where('username', ...) queries are
case-sensitive whenever the underlying column's collation is (SQLite TEXT by
default, MySQL utf8mb4_bin, etc.). Laravel's own `Auth::attempt()` does not
normalize input for you.

**Rule:** never rely on DB collation for case-insensitive matching. Enforce
normalization at two layers instead:
1. **Storage** — Eloquent mutators (`setXAttribute`) on the model
   (`mb_strtolower(trim($value))`) so every write path (create, update, mass
   assignment, boot()-time auto-generation) is normalized automatically,
   even call sites you haven't touched.
2. **Lookup/validation** — normalize the raw input (via FormRequest
   `prepareForValidation()`, or inline before `Validator::make`/`Auth::attempt`)
   *before* it's used in a query or auth check, since a mutator only fires on
   assignment, never on a `where()` clause built from user input.

**Why:** a real production case had users unable to log in / see false
"already taken" collisions purely because of letter-casing differences
between how an account was created and how the same value was typed later.

**How to apply:** when adding any new email/username entry point (new
registration flow, admin-created account, profile update, uniqueness rule),
add both layers — the mutator alone is not enough if a raw `where()` bypasses
the model (e.g. `DB::table(...)->where('username', $value)`).
