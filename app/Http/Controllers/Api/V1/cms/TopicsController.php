<?php

namespace App\Http\Controllers\Api\V1\cms;

use App\Http\Controllers\Controller;
use App\Models\Cms\Topic;
use App\Models\Auth\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TopicsController extends Controller
{
    public function index(): JsonResponse
    {
        $users = User::query()
            ->whereIn('role', ['content.editor', 'content.author'])
            ->orderBy('name')
            ->get(['id', 'name', 'email', 'role']);

        $topics = Topic::query()
            ->with('users:id,name,email,role')
            ->orderBy('id')
            ->get()
            ->map(fn(Topic $topic) => [
                'id' => (string) $topic->id,
                'name' => $topic->name,
                'desc' => $topic->description ?? '',
                'articles' => (int) $topic->articles_count,
                'color' => $topic->color,
                'users' => $topic->users->pluck('email')->values()->all(),
            ]);

        return response()->json([
            'topics' => $topics,
            'users' => $users,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120', Rule::unique('topics', 'name')],
            'desc' => ['nullable', 'string', 'max:1000'],
            'color' => ['required', 'string', 'max:16'],
            'users' => ['array'],
            'users.*' => ['email', Rule::exists('users', 'email')],
        ]);

        $topic = Topic::query()->create([
            'name' => $data['name'],
            'description' => $data['desc'] ?? '',
            'color' => $data['color'],
            'articles_count' => 0,
        ]);

        $this->syncUsers($topic, $data['users'] ?? []);

        return response()->json(['id' => (string) $topic->id], 201);
    }

    public function update(Request $request, Topic $topic): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120', Rule::unique('topics', 'name')->ignore($topic->id)],
            'desc' => ['nullable', 'string', 'max:1000'],
            'color' => ['required', 'string', 'max:16'],
            'users' => ['array'],
            'users.*' => ['email', Rule::exists('users', 'email')],
        ]);

        $topic->fill([
            'name' => $data['name'],
            'description' => $data['desc'] ?? '',
            'color' => $data['color'],
        ])->save();

        $this->syncUsers($topic, $data['users'] ?? []);

        return response()->json(['ok' => true]);
    }

    public function destroy(Topic $topic): JsonResponse
    {
        $topic->users()->detach();
        $topic->delete();
        return response()->json(null, 204);
    }

    private function syncUsers(Topic $topic, array $emails): void
    {
        $userIds = User::query()->whereIn('email', $emails)->pluck('id')->all();
        $topic->users()->sync($userIds);
    }
}
