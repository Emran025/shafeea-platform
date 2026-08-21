<?php

namespace App\Http\Middleware\Api;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * VerifyBuildApiSignature
 *
 * Verifies that inbound requests to the Build API were signed by a trusted party
 * (i.e. GitHub Actions) using RSA-SHA256 digital signatures.
 *
 * ── How it works ────────────────────────────────────────────────────────────
 * The caller (GitHub Actions) must include two headers:
 *
 *   X-Build-Timestamp : Unix timestamp of the request (seconds since epoch).
 *   X-Build-Signature : Base64-encoded RSA-SHA256 signature of the string
 *                       "{timestamp}\n{request_body}" where request_body is the
 *                       raw JSON body (empty string for GET requests).
 *
 * The server verifies the signature using the RSA public key stored in the
 * BUILD_API_PUBLIC_KEY environment variable.
 *
 * Replay protection: requests with a timestamp older than 5 minutes are rejected.
 *
 * ── Key generation (one-time setup) ─────────────────────────────────────────
 * Generate a 4096-bit RSA keypair:
 *
 *   openssl genrsa -out build_api_private.pem 4096
 *   openssl rsa -in build_api_private.pem -pubout -out build_api_public.pem
 *
 * Store build_api_private.pem content as a GitHub Secret named BUILD_API_PRIVATE_KEY.
 * Store build_api_public.pem content in the server .env as BUILD_API_PUBLIC_KEY.
 * NEVER commit either key to the repository.
 */
class VerifyBuildApiSignature
{
    /**
     * Maximum age (seconds) of an accepted request timestamp.
     * Prevents replay attacks while tolerating minor clock skew.
     */
    const MAX_TIMESTAMP_AGE = 300; // 5 minutes

    public function handle(Request $request, Closure $next): Response
    {
        $timestamp = $request->header('X-Build-Timestamp');
        $signature = $request->header('X-Build-Signature');

        // ── Presence check ────────────────────────────────────────────────────
        if (empty($timestamp) || empty($signature)) {
            return $this->unauthorized('Missing authentication headers (X-Build-Timestamp, X-Build-Signature).');
        }

        // ── Timestamp validation ──────────────────────────────────────────────
        if (!ctype_digit((string) $timestamp)) {
            return $this->unauthorized('Invalid timestamp format.');
        }

        $age = abs(time() - (int) $timestamp);
        if ($age > self::MAX_TIMESTAMP_AGE) {
            return $this->unauthorized("Request timestamp is too old ({$age}s). Maximum allowed age is " . self::MAX_TIMESTAMP_AGE . "s.");
        }

        // ── Load public key from environment ─────────────────────────────────
        $publicKeyPem = config('services.build_api.public_key');
        if (empty($publicKeyPem)) {
            // Public key not configured — deny access to protect the endpoint
            \Illuminate\Support\Facades\Log::critical('Build API: BUILD_API_PUBLIC_KEY is not set in .env. All requests denied.');
            return $this->unauthorized('Build API is not configured on this server.');
        }

        $publicKey = openssl_pkey_get_public($publicKeyPem);
        if ($publicKey === false) {
            \Illuminate\Support\Facades\Log::critical('Build API: BUILD_API_PUBLIC_KEY is malformed and could not be parsed.');
            return $this->unauthorized('Build API public key is malformed.');
        }

        // ── Build the signed message ──────────────────────────────────────────
        // The signed string is: "{timestamp}\n{raw_body}"
        // For GET requests the body is an empty string.
        $rawBody   = $request->getContent();
        $signedMsg = $timestamp . "\n" . $rawBody;

        // ── Signature verification ────────────────────────────────────────────
        $decodedSig = base64_decode($signature, strict: true);
        if ($decodedSig === false) {
            return $this->unauthorized('Signature is not valid base64.');
        }

        $verified = openssl_verify($signedMsg, $decodedSig, $publicKey, OPENSSL_ALGO_SHA256);

        if ($verified !== 1) {
            return $this->unauthorized('Signature verification failed.');
        }

        return $next($request);
    }

    private function unauthorized(string $message): Response
    {
        return response()->json([
            'success' => false,
            'message' => $message,
        ], 401);
    }
}
