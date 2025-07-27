<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\ApiController;
use App\Models\Student;
use App\Repositories\StudentRepository;
use App\Repositories\HalaqahRepository;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Resources\StudentSyncResource;
use App\Models\Teacher;
use App\Http\Resources\TeacherSyncResource;
use App\Http\Resources\HalaqahResource;
class SyncController extends ApiController
{
    /**
     * Sync all students updated since a specific timestamp.
     *
     * @param  Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    protected StudentRepository $students;

    public function __construct(StudentRepository $students)
    {
        $this->students = $students;
    }

    public function syncStudents(Request $request)
    {
        $updatedSince = $request->input('updatedSince', now()->subMonth()->toIso8601String());
        $limit = $request->input('limit', 100);
        $page = $request->input('page', 1);

        $studentsPaginator = $this->students->sync($updatedSince, $limit, $page);

        return $this->paginatedSuccess($studentsPaginator, StudentSyncResource::class, 'students');
    }
    // GET /api/v1/sync/teachers
    public function syncTeachers(Request $request)
    {
        $query = Teacher::with('halaqahs');

        if ($request->has('updated_after')) {
            $query->where('updated_at', '>', $request->input('updated_after'));
        }

        $teachersPaginator = $query->paginate(15); // أو العدد الذي يناسبك

        return $this->paginatedSuccess($teachersPaginator, TeacherSyncResource::class);
    }
    // GET /api/v1/sync/halaqas
    public function syncHalaqas(Request $request, HalaqahRepository $repository)
    {
        $updatedSince = $request->query('updatedSince');
        $page = (int) $request->query('page', 1);
        $limit = (int) $request->query('limit', 100);

        $halaqas = $repository->getUpdatedSince($updatedSince, $limit, $page);
    //   return response()->json(HalaqahResource::collection($halaqas));
        return $this->paginatedSuccess(
            $halaqas,
            HalaqahResource::class,
            // Carbon::now()->toIso8601String()
        );
    }
    //GET api/v1/sync/reports
    public function syncReports(Request $request)
    {
        $updatedSince = $request->query('updatedSince');
        $studentId = $request->query('studentId');
        $page = (int) $request->query('page', 1);
        $limit = (int) $request->query('limit', 10);
        $sortBy = $request->query('sortBy', 'trackDate');
        $sortOrder = strtolower($request->query('sortOrder', 'asc'));

        // Sample report data
        $reports = [
            [
                "id" => 1,
                "trackDate" => "2023-09-21",
                "attendance" => "present",
                "behaviourAssessment" => 4.5,
                "details" => [
                    [
                        "type" => "memorization",
                        "planned" => ["unit" => "page", "amount" => 1],
                        "actual" => ["unit" => "page", "amount" => 1, "amountAccumulated" => 16],
                        "gap" => 0,
                        "note" => "Good progress."
                    ],
                    [
                        "type" => "revision",
                        "planned" => ["unit" => "juz", "amount" => 0.5],
                        "actual" => ["unit" => "juz", "amount" => 0.25, "amountAccumulated" => 16],
                        "gap" => -0.25,
                        "performanceScore" => 4.5,
                        "note" => "Needs improvement."
                    ],
                    [
                        "type" => "recitation",
                        "planned" => ["unit" => "hizb", "amount" => 1],
                        "actual" => ["unit" => "hizb", "amount" => 1, "amountAccumulated" => 16],
                        "gap" => 0,
                        "performanceScore" => 4.5,
                        "note" => "Stable performance."
                    ]
                ]
            ]
        ];

        // Sort (not applied here, since it's static data)
        if ($sortOrder === 'desc') {
            $reports = array_reverse($reports);
        }

        // Pagination simulation
        $total = 500;
        $offset = ($page - 1) * $limit;
        $pagedReports = array_slice($reports, $offset, $limit);

        // Optional summary if studentId is present
        $summary = $studentId ? [
            "totalPendingReports" => 2,
            "totalDeviation" => -0.25,
            "status" => "behind",
            "studentPerformance" => [
                "averageBehaviourScore" => 4.3,
                "averageAchievementRate" => 89.7,
                "averageExecutionQuality" => 4.1,
                "reportCount" => 132
            ]
        ] : null;

        return $this->success([
            "reports" => $pagedReports[0], // returning the first report as per example
            "summary" => $summary,
            "pagination" => [
                "page" => $page,
                "limit" => $limit,
                "total" => $total
            ],
            "syncTimestamp" => now()->toIso8601String()
        ]);
    }
}
