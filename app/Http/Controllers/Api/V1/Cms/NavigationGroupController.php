<?php

namespace App\Http\Controllers\Api\V1\Cms;

use App\Http\Controllers\Controller;
use App\Models\Cms\NavigationGroup;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NavigationGroupController extends Controller
{
    public function index(): JsonResponse
    {
        $groups = NavigationGroup::withTrashed(false)->where('site_scope', request()->route('school_code') ?? request()->get('site_scope'))
            ->with(['columns.entries'])
            ->orderBy('position')
            ->get()
            ->map(fn (NavigationGroup $g) => $this->serializeGroup($g));

        return response()->json(['groups' => $groups]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'label' => ['required', 'string', 'max:120'],
            'group_id' => ['required', 'string', 'max:120', \Illuminate\Validation\Rule::unique('navigation_groups')->where(fn ($query) => $query->where('site_scope', $request->route('school_code') ?? $request->get('site_scope')))],
            'type' => ['required', 'string', 'in:mega_menu,dropdown,direct_link'],
            'position' => ['required', 'integer', 'min:0'],
            'is_active' => ['boolean'],
        ]);

        $group = NavigationGroup::create([
            'group_id' => $data['group_id'],
            'label' => ['en' => $data['label']],
            'type' => $data['type'],
            'position' => $data['position'],
            'is_active' => $data['is_active'] ?? true,
            'site_scope' => $request->route('school_code') ?? $request->get('site_scope'),
        ]);

        return response()->json(['id' => (string) $group->id], 201);
    }

    public function update(Request $request, NavigationGroup $navigationGroup): JsonResponse
    {
        $data = $request->validate([
            'label' => ['sometimes', 'required', 'string', 'max:120'],
            'type' => ['sometimes', 'required', 'string', 'in:mega_menu,dropdown,direct_link'],
            'position' => ['sometimes', 'required', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $fill = [];
        if (isset($data['label'])) {
            $fill['label'] = array_merge($navigationGroup->label ?? [], ['en' => $data['label']]);
        }
        if (isset($data['type'])) {
            $fill['type'] = $data['type'];
        }
        if (isset($data['position'])) {
            $fill['position'] = $data['position'];
        }
        if (isset($data['is_active'])) {
            $fill['is_active'] = $data['is_active'];
        }

        $navigationGroup->fill($fill)->save();

        return response()->json(['ok' => true]);
    }

    public function destroy(NavigationGroup $navigationGroup): JsonResponse
    {
        $navigationGroup->columns()->each(function ($column) {
            $column->entries()->delete();
            $column->delete();
        });
        $navigationGroup->delete();

        return response()->json(null, 204);
    }

    private function serializeGroup(NavigationGroup $g): array
    {
        return [
            'id' => (string) $g->id,
            'group_id' => $g->group_id,
            'label' => $g->label['en'] ?? '',
            'type' => $g->type,
            'position' => (int) $g->position,
            'is_active' => (bool) $g->is_active,
            'columns' => $g->columns->map(fn ($col) => $this->serializeColumn($col))->values()->all(),
        ];
    }

    private function serializeColumn($col): array
    {
        return [
            'id' => (string) $col->id,
            'column_id' => $col->column_id,
            'label' => $col->label['en'] ?? '',
            'position' => (int) $col->position,
            'navigation_group_id' => (string) $col->navigation_group_id,
            'entries' => $col->entries->map(fn ($e) => [
                'id' => (string) $e->id,
                'label' => $e->label['en'] ?? '',
                'destination_type' => $e->destination_type,
                'destination_value' => $e->destination_value,
                'position' => (int) $e->position,
                'is_badge_highlighted' => (bool) $e->is_badge_highlighted,
                'badge_text' => $e->badge_text['en'] ?? null,
                'navigation_column_id' => (string) $e->navigation_column_id,
            ])->values()->all(),
        ];
    }
}
