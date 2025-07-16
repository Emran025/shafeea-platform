<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\ApiController;
use App\Models\Student;
use Illuminate\Http\Request;

class SyncController extends ApiController
{
    /**
     * Sync all students updated since a specific timestamp.
     *
     * @param  Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function syncStudents(Request $request)
    {
        $validated = $request->validate([
            'updatedSince' => 'required|date_format:Y-m-d\TH:i:sP',
            'page' => 'integer|min:1',
            'limit' => 'integer|min:1|max:100',
        ]);

        $updatedSince = $request->input('updatedSince');
        $limit = $request->input('limit', 100);

        $students = Student::with([
                'user',
                'enrollments' => function ($query) {
                    $query->latest('enrolled_at')->limit(1);
                },
                'enrollments.plan.frequencyType',
                'enrollments.plan.reviewUnit',
                'enrollments.plan.memorizationUnit',
                'enrollments.plan.sardUnit',
                'enrollments.halaqah',
            ])
            ->where(function ($query) use ($updatedSince) {
                $query->where('updated_at', '>=', $updatedSince)
                      ->orWhere('created_at', '>=', $updatedSince);
            })
            ->paginate($limit);

        return $this->success([
            'data' => $students->items(),
            'pagination' => [
                'page' => $students->currentPage(),
                'limit' => $students->perPage(),
                'total' => $students->total(),
            ],
            'syncTimestamp' => now()->toIso8601String(),
        ]);
    }
}
