<?php

namespace App\Http\Controllers\Api\V1\cms\Inquiry;

use App\Http\Controllers\Controller;
use App\Models\Cms\FaqCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

/**
 * Manages FAQ categories (used for server-side FAQ filtering).
 * Guarded by require.permission:manage_faq
 *
 * GET    /api/admin/inquiry/faq-categories              - list all categories
 * POST   /api/admin/inquiry/faq-categories              - create category
 * PUT    /api/admin/inquiry/faq-categories/{category}   - update category
 * DELETE /api/admin/inquiry/faq-categories/{category}   - delete category
 */
class FaqCategoryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = FaqCategory::query()->withCount('faqs');

        if ($locale = $request->query('locale')) {
            $query->where('locale', $locale);
        }
        if ($request->query('active_only')) {
            $query->where('is_active', true);
        }

        return response()->json($query->orderBy('sort_order')->get());
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'       => ['required', 'string', 'max:120'],
            'locale'     => ['required', Rule::in(['en', 'ar'])],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
            'is_active'  => ['sometimes', 'boolean'],
        ]);

        $data['slug'] = Str::slug($data['name'] . '-' . $data['locale']);

        $category = FaqCategory::create($data);

        return response()->json(['id' => $category->id], 201);
    }

    public function update(Request $request, FaqCategory $faqCategory): JsonResponse
    {
        $data = $request->validate([
            'name'       => ['sometimes', 'string', 'max:120'],
            'locale'     => ['sometimes', Rule::in(['en', 'ar'])],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
            'is_active'  => ['sometimes', 'boolean'],
        ]);

        if (isset($data['name'])) {
            $locale = $data['locale'] ?? $faqCategory->locale;
            $data['slug'] = Str::slug($data['name'] . '-' . $locale);
        }

        $faqCategory->fill($data)->save();

        return response()->json(['ok' => true]);
    }

    public function destroy(FaqCategory $faqCategory): JsonResponse
    {
        $faqCategory->delete();
        return response()->json(null, 204);
    }
}
