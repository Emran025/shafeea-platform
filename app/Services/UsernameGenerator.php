<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Transliterator;

/**
 * Generates unique, human-readable usernames from a person's name.
 *
 * Public API is a strict, stable contract: {@see self::generate()} is the
 * only entry point, and its signature, this class name, and this
 * namespace must never change — it is a drop-in replacement for every
 * existing call site.
 *
 * Everything else below is a self-contained internal pipeline:
 *
 *   1. normalizeUnicode()   Unicode form/invisible-char/case normalization.
 *   2. transliterate()      Curated overrides first, then ICU (ext-intl),
 *                            then an ASCII fallback — see TRANSLITERATION
 *                            ENGINES below for how to extend this chain.
 *   3. sanitizeUsername()   Enforces the [a-z0-9._-] character set.
 *   4. generateCandidates() Builds meaningful alternatives before numbers.
 *   5. resolveUniqueness()  Batched, deterministic uniqueness checking
 *                            across students/teachers/applicants.
 *
 * Each stage is a small, single-purpose private static method so it can
 * be reasoned about (and unit tested indirectly via generate()) in
 * isolation, without the file being split across multiple classes.
 */
class UsernameGenerator
{
    // =========================================================================
    // PUBLIC API — do not change.
    // =========================================================================

    /**
     * Generate a unique, professional username based on a name.
     */
    public static function generate(string $name): string
    {
        $normalized = self::normalizeUnicode($name);

        if ($normalized === '') {
            return self::sanitizeUsername('');
        }

        $romanized = self::transliterate($normalized);

        $tokens = self::sanitizeTokens($romanized);
        $baseUsername = self::sanitizeUsername($romanized);

        $candidates = self::generateCandidates($baseUsername, $tokens);

        $available = self::resolveUniqueness($candidates);

        return $available ?? self::resolveUniquenessWithNumericFallback($baseUsername);
    }

    /**
     * Return the first candidate username derived from a name without any
     * database round-trip. Runs only stages 1-3 of the pipeline:
     *
     *   1. normalizeUnicode()  — clean invisible chars, diacritics, casing.
     *   2. transliterate()     — script → Latin → ASCII.
     *   3. sanitizeUsername()  — enforce [a-z0-9._-] character set.
     *
     * This is intentionally NOT unique-checked against the DB so it can be
     * called safely on every keystroke from the front-end suggestion endpoint.
     * Uniqueness is still enforced server-side when the form is submitted.
     *
     * @param string $name Raw name string (Arabic, Latin, or mixed).
     * @return string      A sanitized, human-readable base username candidate.
     */
    public static function suggest(string $name): string
    {
        $normalized = self::normalizeUnicode($name);

        if ($normalized === '') {
            return '';
        }

        $romanized = self::transliterate($normalized);

        return self::sanitizeUsername($romanized);
    }

    // =========================================================================
    // STAGE 1 — UNICODE NORMALIZATION
    //
    // Raw names arrive in inconsistent shapes: different Unicode
    // composition forms, invisible formatting characters copy-pasted from
    // chat apps, emoji, stray script-specific punctuation, mixed casing.
    // Every later stage assumes it receives already-normalized text, so
    // that assumption is established here, once.
    // =========================================================================

    private const INVISIBLE_CHARS_PATTERN = '/[\x{200B}-\x{200F}\x{202A}-\x{202E}\x{2060}\x{FEFF}\x{00AD}]/u';
    private const ARABIC_PUNCTUATION_PATTERN = '/[\x{060C}\x{061B}\x{061F}\x{066A}-\x{066D}\x{06D4}\x{FD3E}\x{FD3F}]/u';
    private const ARABIC_DIACRITICS_PATTERN = '/[\x{0610}-\x{061A}\x{064B}-\x{065F}\x{0670}\x{06D6}-\x{06DC}\x{06DF}-\x{06E8}\x{06EA}-\x{06ED}]/u';
    private const EMOJI_PATTERN = '/[\x{1F000}-\x{1FFFF}\x{2600}-\x{27BF}\x{2190}-\x{21FF}\x{2B00}-\x{2BFF}\x{FE0F}]/u';
    private const WHITESPACE_RUN_PATTERN = '/[\s\x{00A0}]+/u';

    private static function normalizeUnicode(string $name): string
    {
        $name = self::normalizeUnicodeForm($name);
        $name = (string) preg_replace(self::INVISIBLE_CHARS_PATTERN, '', $name);
        $name = (string) preg_replace(self::EMOJI_PATTERN, '', $name);
        $name = (string) preg_replace(self::ARABIC_DIACRITICS_PATTERN, '', $name);
        $name = (string) preg_replace(self::ARABIC_PUNCTUATION_PATTERN, ' ', $name);
        $name = (string) preg_replace(self::WHITESPACE_RUN_PATTERN, ' ', $name);

        return mb_strtolower(trim($name));
    }

    /**
     * Composes the string into NFC (Normalization Form C) so visually
     * identical input represented with different underlying code point
     * sequences (e.g. "é" as one code point vs "e" + combining acute)
     * normalizes to a single canonical form before anything else runs.
     */
    private static function normalizeUnicodeForm(string $name): string
    {
        if (!class_exists(\Normalizer::class)) {
            return $name;
        }

        $normalized = \Normalizer::normalize($name, \Normalizer::FORM_C);

        return $normalized !== false ? $normalized : $name;
    }

    // =========================================================================
    // STAGE 2 — TRANSLITERATION
    //
    // Strict priority order, evaluated per word (and once as a whole
    // phrase, for multi-word compounds):
    //
    //   1. CURATED_NAMES   Conventional, globally-recognized spellings
    //                      ("محمد" -> "mohamed") that a generic engine
    //                      cannot know, because they are a *convention*,
    //                      not a linguistic standard.
    //   2. ICU / ext-intl  "Any-Latin; Latin-ASCII" — a maintained,
    //                      standards-based ruleset covering essentially
    //                      every Unicode script, used for anything not
    //                      in the curated table.
    //   3. iconv fallback  Used only if ext-intl is unavailable in the
    //                      current runtime, so the pipeline degrades
    //                      gracefully instead of failing outright.
    //
    // EXTENDING THIS CHAIN: add entries to CURATED_NAMES for more
    // conventional spellings, or add a new closure to
    // transliterationEngines() (in priority order) for a new generic
    // engine — no other part of the pipeline needs to change either way.
    // =========================================================================

    /**
     * Curated overrides for names whose colloquial, globally-recognized
     * Latin spelling differs from what a generic transliteration engine
     * produces. Keyed by normalized (lowercased, diacritic-stripped)
     * source form; multi-word compounds are included so they match as a
     * phrase before per-word lookup could fragment them incorrectly.
     */
    // private const CURATED_NAMES = [
    // ];

    /** ICU rule set: converts any script to Latin, then folds remaining
     *  diacritics/ligatures to plain ASCII (é -> e, ß -> ss, ...). */
    private const ICU_RULE_SET = 'Any-Latin; Latin-ASCII';

    private static ?Transliterator $icuTransliterator = null;
    private static bool $icuInitialized = false;

    private static function transliterate(string $normalizedText): string
    {
        // if (isset(self::CURATED_NAMES[$normalizedText])) {
        //     return self::CURATED_NAMES[$normalizedText];
        // }

        $words = preg_split('/\s+/u', trim($normalizedText), -1, PREG_SPLIT_NO_EMPTY) ?: [];

        return implode(' ', array_map(self::transliterateWord(...), $words));
    }

    private static function transliterateWord(string $word): string
    {
        // if (isset(self::CURATED_NAMES[$word])) {
        //     return self::CURATED_NAMES[$word];
        // }

        foreach (self::transliterationEngines() as $engine) {
            $result = $engine($word);

            if ($result !== null) {
                return $result;
            }
        }

        // No engine available at all: return the word unchanged rather
        // than failing. Final sanitization will strip whatever the
        // [a-z0-9._-] filter cannot accept.
        return $word;
    }

    /**
     * Ordered chain of generic transliteration engines, each returning
     * null when unavailable in the current runtime so the next one is
     * tried. This is the extension point for adding another engine later
     * — append a closure here, in priority order.
     *
     * @return list<callable(string): ?string>
     */
    private static function transliterationEngines(): array
    {
        return [
            self::icuEngine(...),
            self::asciiFallbackEngine(...),
        ];
    }

    private static function icuEngine(string $word): ?string
    {
        $transliterator = self::resolveIcuTransliterator();

        if ($transliterator === null) {
            return null;
        }

        $result = $transliterator->transliterate($word);

        return $result !== false ? $result : null;
    }

    private static function asciiFallbackEngine(string $word): ?string
    {
        if (!function_exists('iconv')) {
            return null;
        }

        $result = @iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $word);

        return $result !== false ? $result : (string) preg_replace('/[^\x20-\x7E]/', '', $word);
    }

    /**
     * Lazily builds and caches a single Transliterator instance per
     * request lifecycle — building one is comparatively expensive, and
     * usernames may be generated many times in a batch import.
     */
    private static function resolveIcuTransliterator(): ?Transliterator
    {
        if (self::$icuInitialized) {
            return self::$icuTransliterator;
        }

        self::$icuInitialized = true;

        if (!extension_loaded('intl') || !class_exists(Transliterator::class)) {
            return self::$icuTransliterator = null;
        }

        return self::$icuTransliterator = Transliterator::create(self::ICU_RULE_SET);
    }

    // =========================================================================
    // STAGE 3 — SANITIZATION
    //
    // The single point where transliterated text is forced into the
    // literal character set a username may contain, and where malformed
    // separator sequences ("john..smith", ".john", "john.") are corrected.
    // =========================================================================

    private const ALLOWED_CHARACTERS_PATTERN = '/[^a-z0-9._-]+/';
    private const REPEATED_SEPARATORS_PATTERN = '/[._-]{2,}/';
    private const SEPARATOR_TRIM_CHARS = '._-';
    private const FALLBACK_USERNAME = 'user';
    private const MINIMUM_USERNAME_LENGTH = 3;

    private static function sanitizeUsername(string $text): string
    {
        $text = str_replace(' ', '.', $text);
        $text = (string) preg_replace(self::ALLOWED_CHARACTERS_PATTERN, '', $text);
        $text = (string) preg_replace(self::REPEATED_SEPARATORS_PATTERN, '.', $text);
        $text = trim($text, self::SEPARATOR_TRIM_CHARS);

        return mb_strlen($text) < self::MINIMUM_USERNAME_LENGTH ? self::FALLBACK_USERNAME : $text;
    }

    /**
     * Joins two already-sanitized fragments with a single separator,
     * guaranteeing the join itself can never introduce a duplicated or
     * dangling separator.
     */
    private static function joinFragments(string $left, string $right, string $separator = '.'): string
    {
        $left = trim($left, self::SEPARATOR_TRIM_CHARS);
        $right = trim($right, self::SEPARATOR_TRIM_CHARS);

        if ($left === '') {
            return $right;
        }

        if ($right === '') {
            return $left;
        }

        return $left . $separator . $right;
    }

    /**
     * Splits the romanized name into individually sanitized word tokens,
     * used by candidate generation to build initials/partial-surname
     * variants (e.g. "john" + "s" from "john smith").
     *
     * @return list<string>
     */
    private static function sanitizeTokens(string $romanized): array
    {
        $words = preg_split('/\s+/u', trim($romanized), -1, PREG_SPLIT_NO_EMPTY) ?: [];

        return array_values(array_filter(
            array_map(self::sanitizeUsername(...), $words),
            static fn (string $token) => $token !== '' && $token !== self::FALLBACK_USERNAME,
        ));
    }

    // =========================================================================
    // STAGE 4 — CANDIDATE GENERATION
    //
    // Jumping straight from "does the base username exist?" to "append an
    // incrementing counter" produces usernames like "john42" that look
    // arbitrary and machine-generated. Meaningful human-like alternatives
    // — initials, partial surnames, common word suffixes — are tried
    // first; numeric suffixes are a last resort (see STAGE 5).
    // =========================================================================

    /** Low-noise suffix words appended before ever falling back to numbers. */
    private const WORD_SUFFIXES = ['dev', 'student', 'official', 'user'];

    /**
     * @param list<string> $tokens Sanitized individual name parts, in order.
     * @return list<string> Ordered, de-duplicated candidate usernames.
     */
    private static function generateCandidates(string $baseUsername, array $tokens): array
    {
        $tokens = array_values(array_filter($tokens, static fn (string $t) => $t !== ''));
        $candidates = [$baseUsername];

        if (count($tokens) >= 2) {
            $first = $tokens[0];
            $last = $tokens[count($tokens) - 1];

            array_push(
                $candidates,
                self::joinFragments($first, mb_substr($last, 0, 1)),
                self::joinFragments($first, $last, '_'),
                self::joinFragments($first, mb_substr($last, 0, 2)),
                self::joinFragments(mb_substr($first, 0, 1), $last),
                self::joinFragments($first, $last, '-'),
            );
        } elseif (count($tokens) === 1) {
            $only = $tokens[0];
            array_push(
                $candidates,
                $only . 'q',
                self::joinFragments($only, 'a'),
                self::joinFragments($only, 'aa', '-'),
            );
        }

        foreach (self::WORD_SUFFIXES as $suffix) {
            $candidates[] = self::joinFragments($baseUsername, $suffix);
        }

        return self::deduplicateCandidates($candidates);
    }

    /**
     * @param list<string> $candidates
     * @return list<string>
     */
    private static function deduplicateCandidates(array $candidates): array
    {
        $seen = [];
        $result = [];

        foreach ($candidates as $candidate) {
            $candidate = trim($candidate, self::SEPARATOR_TRIM_CHARS);

            if ($candidate === '' || isset($seen[$candidate])) {
                continue;
            }

            $seen[$candidate] = true;
            $result[] = $candidate;
        }

        return $result;
    }

    // =========================================================================
    // STAGE 5 — UNIQUENESS RESOLUTION
    //
    // Checking one candidate at a time against three tables inside a loop
    // does not scale against tables holding millions of rows. Instead,
    // each table is asked once per batch — "which of these N candidates
    // are already taken?" via `whereIn` — turning an O(attempts) query
    // count into a small constant number of queries per batch.
    // =========================================================================

    private const USERNAME_TABLES = ['students', 'teachers', 'applicants'];
    private const USERNAME_COLUMN = 'username';
    private const NUMERIC_SUFFIX_BATCH_SIZE = 25;
    private const MAX_NUMERIC_SUFFIX_ATTEMPTS = 1000;

    /**
     * Returns the first username, in order, from $candidates that does not
     * already exist in any tracked table — or null if every candidate in
     * the batch is taken.
     *
     * @param list<string> $candidates
     */
    private static function resolveUniqueness(array $candidates): ?string
    {
        if ($candidates === []) {
            return null;
        }

        $taken = self::fetchTakenUsernames($candidates);

        foreach ($candidates as $candidate) {
            if (!isset($taken[$candidate])) {
                return $candidate;
            }
        }

        return null;
    }

    /**
     * Falls back to deterministic numeric suffixes, still checked in
     * batches, once every meaningful candidate is confirmed taken.
     * Bounded by MAX_NUMERIC_SUFFIX_ATTEMPTS as a safety valve.
     */
    private static function resolveUniquenessWithNumericFallback(string $base): string
    {
        $attempted = 0;

        while ($attempted < self::MAX_NUMERIC_SUFFIX_ATTEMPTS) {
            $batch = [];
            for ($offset = 1; $offset <= self::NUMERIC_SUFFIX_BATCH_SIZE; $offset++) {
                $batch[] = $base . ($attempted + $offset);
            }

            $available = self::resolveUniqueness($batch);

            if ($available !== null) {
                return $available;
            }

            $attempted += self::NUMERIC_SUFFIX_BATCH_SIZE;
        }

        return self::deterministicOverflowUsername($base);
    }

    /**
     * Extremely unlikely last resort: even the numeric suffix range was
     * fully exhausted. Rather than reach for randomness — which would
     * break the pipeline's "same input -> same output" guarantee — this
     * derives a stable suffix purely from the base username itself, so
     * the exact same input always resolves to the exact same overflow
     * username. Still verified against the database before returning.
     */
    private static function deterministicOverflowUsername(string $base): string
    {
        $attempt = 0;

        do {
            $suffix = substr(hash('crc32b', $base . '#' . $attempt), 0, 8);
            $candidate = $base . $suffix;
            $attempt++;
        } while (self::resolveUniqueness([$candidate]) === null && $attempt < self::MAX_NUMERIC_SUFFIX_ATTEMPTS);

        return $candidate;
    }

    /**
     * Runs exactly one query per tracked table (three total, regardless
     * of batch size) and merges the results into a single lookup set.
     *
     * @param list<string> $candidates
     * @return array<string, true>
     */
    private static function fetchTakenUsernames(array $candidates): array
    {
        $taken = [];

        foreach (self::USERNAME_TABLES as $table) {
            $existing = DB::table($table)
                ->whereIn(self::USERNAME_COLUMN, $candidates)
                ->pluck(self::USERNAME_COLUMN);

            foreach ($existing as $username) {
                $taken[$username] = true;
            }
        }

        return $taken;
    }
}
