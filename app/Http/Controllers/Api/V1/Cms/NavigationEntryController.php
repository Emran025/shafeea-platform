<?php

namespace App\Http\Controllers\Api\V1\Cms;

use App\Http\Controllers\Controller;
use App\Models\Cms\NavigationEntry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NavigationEntryController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'navigation_column_id' => ['required', 'uuid', 'exists:navigation_columns,id'],
            'label'                => ['required', 'string', 'max:200'],
            'destination_type'     => ['required', 'string', 'in:internal_page,external_url'],
            'destination_value'    => ['required', 'string', 'max:500'],
            'position'             => ['required', 'integer', 'min:0'],
            'is_badge_highlighted' => ['boolean'],
            'badge_text'           => ['nullable', 'string', 'max:80'],
        ]);

        $entry = NavigationEntry::create([
            'navigation_column_id' => $data['navigation_column_id'],
            'label'                => ['en' => $data['label']],
            'destination_type'     => $data['destination_type'],
            'destination_value'    => $data['destination_value'],
            'position'             => $data['position'],
            'is_badge_highlighted' => $data['is_badge_highlighted'] ?? false,
            'badge_text'           => isset($data['badge_text']) && $data['badge_text']
                ? ['en' => $data['badge_text']]
                : null,
        ]);

        return response()->json(['id' => (string) $entry->id], 201);
    }

    public function update(Request $request, NavigationEntry $navigationEntry): JsonResponse
    {
        $data = $request->validate([
            'label'                => ['sometimes', 'required', 'string', 'max:200'],
            'destination_type'     => ['sometimes', 'required', 'string', 'in:internal_page,external_url'],
            'destination_value'    => ['sometimes', 'required', 'string', 'max:500'],
            'position'             => ['sometimes', 'required', 'integer', 'min:0'],
            'is_badge_highlighted' => ['sometimes', 'boolean'],
            'badge_text'           => ['nullable', 'string', 'max:80'],
        ]);

        $fill = [];
        if (isset($data['label'])) {
            $fill['label'] = array_merge($navigationEntry->label ?? [], ['en' => $data['label']]);
        }
        if (isset($data['destination_type']))     $fill['destination_type']     = $data['destination_type'];
        if (isset($data['destination_value']))    $fill['destination_value']    = $data['destination_value'];
        if (isset($data['position']))             $fill['position']             = $data['position'];
        if (isset($data['is_badge_highlighted'])) $fill['is_badge_highlighted'] = $data['is_badge_highlighted'];
        if (array_key_exists('badge_text', $data)) {
            $fill['badge_text'] = $data['badge_text'] ? ['en' => $data['badge_text']] : null;
        }

        $navigationEntry->fill($fill)->save();

        return response()->json(['ok' => true]);
    }

    public function destroy(NavigationEntry $navigationEntry): JsonResponse
    {
        $navigationEntry->delete();
        return response()->json(null, 204);
    }
}
