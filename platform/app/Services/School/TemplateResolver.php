<?php

namespace App\Services\School;

/**
 * TemplateResolver — resolves {{dotted.key}} placeholders throughout a composed
 * contract, binding school-specific data at request time.
 *
 * INVARIANTS:
 *   - Read-only: never modifies the source context array.
 *   - Deterministic: same contract + same context → same output.
 *   - Unknown placeholders are left as-is (not silently dropped).
 */
class TemplateResolver
{
    /**
     * Recursively walk any array/string structure and replace
     * {{dotted.key}} tokens with values from $context.
     *
     * @param  mixed $template  The composed contract or any sub-structure.
     * @param  array $context   Flat-or-nested resolution context, e.g. ['school' => [...]]
     * @return mixed            Same type as $template, with placeholders resolved.
     */
    public function resolve(mixed $template, array $context): mixed
    {
        if (is_string($template)) {
            return $this->interpolate($template, $context);
        }

        if (is_array($template)) {
            foreach ($template as $key => $value) {
                $template[$key] = $this->resolve($value, $context);
            }
        }

        // booleans, ints, nulls — pass through unchanged
        return $template;
    }

    // -------------------------------------------------------------------------
    // Internals
    // -------------------------------------------------------------------------

    private function interpolate(string $str, array $context): string
    {
        // Fast path — skip strings that have no placeholder
        if (!str_contains($str, '{{')) {
            return $str;
        }

        return preg_replace_callback(
            '/\{\{([a-z0-9_.]+)\}\}/i',
            function (array $matches) use ($context): string {
                $resolved = $this->dot($context, $matches[1]);

                if ($resolved === null) {
                    // Unknown placeholder — leave it in place so it's visible in output
                    return $matches[0];
                }

                // Arrays are JSON-encoded so they can be embedded in strings or parsed by the renderer
                return is_array($resolved) ? json_encode($resolved, JSON_UNESCAPED_UNICODE) : (string) $resolved;
            },
            $str
        );
    }

    /**
     * Dot-notation accessor: "school.programs" → $context['school']['programs']
     * Returns null when any segment is missing.
     */
    private function dot(array $data, string $key): mixed
    {
        $parts = explode('.', $key);
        $value = $data;

        foreach ($parts as $part) {
            if (!is_array($value) || !array_key_exists($part, $value)) {
                return null;
            }
            $value = $value[$part];
        }

        return $value;
    }
}
