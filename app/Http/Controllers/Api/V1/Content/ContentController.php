<?php

namespace App\Http\Controllers\Api\V1\content;

use App\Engine\CompositionContext;
use App\Http\Controllers\Controller;
use App\Services\School\CompositionService;
use App\Services\School\ResolutionService;
use App\Services\School\VisibilityService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

/**
 * Rendering Contract API — GET /api/content/{slug}
 *
 * Implements the full request contract from RenderingContract.md:
 *
 *   Required headers:
 *     X-Contract-Version: rendering_contract@2.0    (CTR-001)
 *     X-Locale: en | ar
 *     X-Audience: public | authenticated | admin_preview
 *     X-Preview: false | true
 *     X-Request-ID: <UUID>   (optional)
 *
 * Returns a Contract Envelope (page | error | partial).
 *
 * INVARIANTS enforced before composition:
 *   - CTR-001: Missing/incompatible X-Contract-Version → CONTRACT_MISMATCH
 *   - AR-003: is_preview=true AND audience≠admin_preview → error contract
 *
 * ContentPipeline.md stages implemented here:
 *   - Stage 1: Slug normalisation (lowercase, trim, strip trailing slash)
 *   - Stage 3: Cache check  (X-Cache: HIT)
 *   - Stage 4: Reserved slug guard
 *   - Stage 9: Cache write after composition
 */
class ContentController extends Controller
{
    private const SUPPORTED_CONTRACT_VERSION = 'rendering_contract@2.0';

    private const SUPPORTED_AUDIENCES = ['public', 'authenticated', 'admin_preview'];

    private const SUPPORTED_LOCALES = ['en', 'ar'];

    /**
     * Globally reserved slug prefixes that must never match a content page.
     * ContentPipeline.md Stage 4.
     */
    private const RESERVED_SLUGS = [
        'api',
        'admin',
        'health',
        'metrics',
        '_next',
        'static',
        'favicon.ico',
        'robots.txt',
        'sitemap.xml',
        'sitemap',
    ];

    /**
     * Cache TTL (seconds) by page type — ContentPipeline.md Stage 9.
     */
    private const CACHE_TTL = [
        'corporate.index'         => 300,
        'corporate.platform'      => 600,
        'corporate.about'         => 600,
        'corporate.contact'       => 600,
        'corporate.legal'         => 3600,
        'platform.full_page'      => 600,
        'platform.features'       => 600,
        'platform.use_cases'      => 600,
        'solution.industry'       => 600,
        'solution.role'           => 600,
        'solution.business_type'  => 600,
        'pricing.overview'        => 300,
        'pricing.platform'        => 300,
        'pricing.compare'         => 300,
        'resource.blog_post'      => 120,
        'resource.report'         => 600,
        'resource.customer_story' => 600,
        'resource.webinar'        => 600,
        'editorial.press_release' => 120,
        'trust.overview'          => 3600,
        'trust.section'           => 3600,
        'campaign.landing'        => 120,
        'utility.comparison'      => 300,
        'editorial'               => 120,
        'utility'                 => 3600,
    ];

    private const CACHE_TTL_DEFAULT = 300;

    public function __construct(
        private readonly VisibilityService $visibilityService,
        private readonly ResolutionService $resolutionService,
    ) {}

    public function show(Request $request, ?string $slug = null): JsonResponse
    {
        $requestId  = $request->header('X-Request-ID') ?? Str::uuid()->toString();
        $composedAt = now()->toISOString();

        // ------------------------------------------------------------------
        // CTR-001: Validate X-Contract-Version header
        // ------------------------------------------------------------------
        $contractVersion = $request->header('X-Contract-Version');

        if (empty($contractVersion) || $contractVersion !== self::SUPPORTED_CONTRACT_VERSION) {
            return $this->errorResponse(
                errorType: 'CONTRACT_MISMATCH',
                httpStatus: 406,
                message: "Renderer contract version '{$contractVersion}' is incompatible with engine version. "
                    . 'Required: ' . self::SUPPORTED_CONTRACT_VERSION,
                requestId: $requestId,
                composedAt: $composedAt,
            );
        }

        // ------------------------------------------------------------------
        // Parse and validate context headers
        // ------------------------------------------------------------------
        $locale   = $request->header('X-Locale', 'en');
        $audience = $request->header('X-Audience', 'public');
        $preview  = filter_var($request->header('X-Preview', 'false'), FILTER_VALIDATE_BOOLEAN);

        if (! in_array($audience, self::SUPPORTED_AUDIENCES, true)) {
            return $this->errorResponse(
                errorType: 'CONTRACT_MISMATCH',
                httpStatus: 406,
                message: "Unsupported X-Audience value '{$audience}'. Allowed: " . implode(', ', self::SUPPORTED_AUDIENCES),
                requestId: $requestId,
                composedAt: $composedAt,
            );
        }

        if (! in_array($locale, self::SUPPORTED_LOCALES, true)) {
            return $this->errorResponse(
                errorType: 'CONTRACT_MISMATCH',
                httpStatus: 406,
                message: "Unsupported X-Locale value '{$locale}'. Allowed: " . implode(', ', self::SUPPORTED_LOCALES),
                requestId: $requestId,
                composedAt: $composedAt,
            );
        }

        // ------------------------------------------------------------------
        // AR-003: is_preview=true requires audience=admin_preview
        // ------------------------------------------------------------------
        if ($preview && $audience !== 'admin_preview') {
            return $this->errorResponse(
                errorType: 'CONTRACT_MISMATCH',
                httpStatus: 406,
                message: 'AR-003: X-Preview: true is only permitted when X-Audience is admin_preview.',
                requestId: $requestId,
                composedAt: $composedAt,
            );
        }

        // ------------------------------------------------------------------
        // STAGE 1: Slug normalisation (ContentPipeline.md)
        // Lowercase, trim whitespace, strip leading and trailing slashes.
        // Default to 'home' when no slug is provided (root page request).
        // ------------------------------------------------------------------
        $slug = strtolower(trim($slug ?? 'home', "/ \t\n\r\0\x0B")) ?: 'home';

        // ------------------------------------------------------------------
        // STAGE 4: Reserved slug guard (ContentPipeline.md)
        // ------------------------------------------------------------------
        $slugRoot = explode('/', $slug)[0];
        if (in_array($slugRoot, self::RESERVED_SLUGS, true)) {
            return $this->errorResponse(
                errorType: 'PAGE_NOT_FOUND',
                httpStatus: 404,
                message: "Slug '{$slug}' maps to a reserved system path.",
                requestId: $requestId,
                composedAt: $composedAt,
            );
        }

        // ------------------------------------------------------------------
        // STAGE 3: Cache check (ContentPipeline.md)
        // Only cache non-preview public/authenticated contracts.
        // ------------------------------------------------------------------
        $cacheKey = null;

        if (! $preview && $audience !== 'admin_preview') {
            $cacheKey = "engine:v1:{$slug}:{$locale}:{$audience}";
            $cached   = Cache::get($cacheKey);

            if ($cached !== null) {
                return response()->json($cached, 200)
                    ->header('X-Composition-ID', $cached['request_id'] ?? $requestId)
                    ->header('X-Engine-Version', '1.0.0')
                    ->header('X-Contract-Version', self::SUPPORTED_CONTRACT_VERSION)
                    ->header('X-Cache', 'HIT');
            }
        }

        // ------------------------------------------------------------------
        // Build CompositionContext
        // ------------------------------------------------------------------
        $context = new CompositionContext(
            locale: $locale,
            audience: $audience,
            isPreview: $preview,
            resolvedAt: Carbon::now(),
            requestId: $requestId,
        );

        // ------------------------------------------------------------------
        // Run the Composition Pipeline
        // ------------------------------------------------------------------
        $compositionService = new CompositionService($this->visibilityService, $this->resolutionService);
        $contract           = $compositionService->compose($slug, $context);

        // ------------------------------------------------------------------
        // Determine HTTP status from contract
        // ------------------------------------------------------------------
        $httpStatus = 200;

        if ($contract['contract_type'] === 'error') {
            $httpStatus = $contract['payload']['http_hint'] ?? 500;
        }

        // ------------------------------------------------------------------
        // AR-001 final re-validation:
        // Strip any warnings that may have leaked into a public contract (CTR-003)
        // ------------------------------------------------------------------
        if ($context->isPublic() && isset($contract['payload']['warnings'])) {
            unset($contract['payload']['warnings']);
        }

        // ------------------------------------------------------------------
        // STAGE 9: Cache write (ContentPipeline.md)
        // Cache only successful page contracts for non-preview audiences.
        // TTL is governed by page type (corporate.index=300s, editorial=120s, etc.)
        // ------------------------------------------------------------------
        if ($cacheKey !== null && $contract['contract_type'] === 'page' && $httpStatus === 200) {
            $pageType = $contract['payload']['page']['type'] ?? 'default';
            $ttl      = self::CACHE_TTL[$pageType] ?? self::CACHE_TTL_DEFAULT;
            Cache::put($cacheKey, $contract, $ttl);
        }

        return response()->json($contract, $httpStatus)
            ->header('X-Composition-ID', $contract['request_id'] ?? $requestId)
            ->header('X-Engine-Version', '1.0.0')
            ->header('X-Contract-Version', self::SUPPORTED_CONTRACT_VERSION)
            ->header('X-Cache', 'MISS');
    }

    // -------------------------------------------------------------------------
    // Error response builder
    // -------------------------------------------------------------------------

    private function errorResponse(
        string $errorType,
        int    $httpStatus,
        string $message,
        string $requestId,
        string $composedAt,
    ): JsonResponse {
        $envelope = [
            'contract_version' => self::SUPPORTED_CONTRACT_VERSION,
            'contract_type'    => 'error',
            'engine_version'   => '1.0.0',
            'request_id'       => $requestId,
            'composed_at'      => $composedAt,
            'payload'          => [
                'error_type' => $errorType,
                'http_hint'  => $httpStatus,
                'message'    => $message,
                'navigation' => ['locale' => 'en', 'primary' => []],
            ],
        ];

        return response()->json($envelope, $httpStatus)
            ->header('X-Engine-Version', '1.0.0')
            ->header('X-Contract-Version', self::SUPPORTED_CONTRACT_VERSION)
            ->header('X-Cache', 'MISS');
    }
}
