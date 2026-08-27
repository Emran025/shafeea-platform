<?php

namespace App\Http\Controllers\Api\V1\Cms;

use App\Http\Controllers\Controller;
use App\Models\Cms\NavigationColumn;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class NavigationColumnController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'navigation_group_id' => ['required', 'uuid', 'exists:navigation_groups,id'],
            'label' => ['required', 'string', 'max:120'],
            'position' => ['required', 'integer', 'min:0'],
        ]);

        $column = NavigationColumn::create([
            'navigation_group_id' => $data['navigation_group_id'],
            'column_id' => Str::slug($data['label']).'-'.Str::random(6),
            'label' => ['en' => $data['label']],
            'position' => $data['position'],
            'featured_block' => null,
        ]);

        return response()->json(['id' => (string) $column->id], 201);
    }

    public function update(Request $request, NavigationColumn $navigationColumn): JsonResponse
    {
        $data = $request->validate([
            'label' => ['sometimes', 'required', 'string', 'max:120'],
            'position' => ['sometimes', 'required', 'integer', 'min:0'],
        ]);

        $fill = [];
        if (isset($data['label'])) {
            $fill['label'] = array_merge($navigationColumn->label ?? [], ['en' => $data['label']]);
        }
        if (isset($data['position'])) {
            $fill['position'] = $data['position'];
        }

        $navigationColumn->fill($fill)->save();

        return response()->json(['ok' => true]);
    }

    public function destroy(NavigationColumn $navigationColumn): JsonResponse
    {
        $navigationColumn->entries()->delete();
        $navigationColumn->delete();

        return response()->json(null, 204);
    }
}
