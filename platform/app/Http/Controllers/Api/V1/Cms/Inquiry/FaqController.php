<?php

namespace App\Http\Controllers\Api\V1\Cms\Inquiry;

use App\Http\Controllers\Controller;
use App\Models\Cms\Faq;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

/**
 * Manages FAQ entries with server-side filtering by category, locale, and published state.
 * Guarded by require.permission:manage_faq
 *
 * GET    /api/admin/inquiry/faqs                - list with filters
 * POST   /api/admin/inquiry/faqs                - create FAQ entry
 * GET    /api/admin/inquiry/faqs/{faq}          - single entry
 * PUT    /api/admin/inquiry/faqs/{faq}          - update entry
 * DELETE /api/admin/inquiry/faqs/{faq}          - delete entry
 * POST   /api/admin/inquiry/faqs/{faq}/publish  - publish entry
 * POST   /api/admin/inquiry/faqs/{faq}/unpublish- unpublish entry
 */
class FaqController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Faq::query()->with('category:id,name,slug')->whereHas('category', fn($q) => $q->where('site_scope', $request->route('school_code') ?? $request->get('site_scope')));

        if ($locale = $request->query('locale')) {
            $query->where('locale', $locale);
        }
        if ($categoryId = $request->query('category_id')) {
            $query->where('category_id', $categoryId);
        }
        if ($request->has('published')) {
            $query->where('is_published', (bool) $request->query('published'));
        }

        $items = $query->orderBy('sort_order')->orderBy('id')->paginate(30);

        return response()->json($items);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'category_id' => ['nullable', 'exists:faq_categories,id'],
            'locale'      => ['required', Rule::in(['en', 'ar'])],
            'question'    => ['required', 'string'],
            'answer'      => ['required', 'string'],
            'sort_order'  => ['sometimes', 'integer', 'min:0'],
        ]);

        $actorId = $request->attributes->get('admin_user')?->id;
        $data['created_by'] = $actorId;

        $faq = Faq::create($data);

        return response()->json(['id' => $faq->id], 201);
    }

    public function show(Faq $faq): JsonResponse
    {
        return response()->json($faq->load('category:id,name,slug', 'author:id,name', 'publisher:id,name'));
    }

    public function update(Request $request, Faq $faq): JsonResponse
    {
        $data = $request->validate([
            'category_id' => ['sometimes', 'nullable', 'exists:faq_categories,id'],
            'locale'      => ['sometimes', Rule::in(['en', 'ar'])],
            'question'    => ['sometimes', 'string'],
            'answer'      => ['sometimes', 'string'],
            'sort_order'  => ['sometimes', 'integer', 'min:0'],
        ]);

        $faq->fill($data)->save();

        return response()->json(['ok' => true]);
    }

    public function destroy(Faq $faq): JsonResponse
    {
        $faq->delete();
        return response()->json(null, 204);
    }

    /** POST /api/admin/inquiry/faqs/{faq}/publish */
    public function publish(Request $request, Faq $faq): JsonResponse
    {
        $actorId = $request->attributes->get('admin_user')?->id;

        $faq->fill([
            'is_published' => true,
            'published_by' => $actorId,
            'published_at' => now(),
        ])->save();

        return response()->json(['ok' => true, 'published_at' => $faq->published_at]);
    }

    /** POST /api/admin/inquiry/faqs/{faq}/unpublish */
    public function unpublish(Faq $faq): JsonResponse
    {
        $faq->fill([
            'is_published' => false,
            'published_at' => null,
            'published_by' => null,
        ])->save();

        return response()->json(['ok' => true]);
    }
}
