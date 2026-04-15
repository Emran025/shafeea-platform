<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\HalaqahResource;
use App\Http\Resources\StudentSyncResource;
use App\Http\Resources\TeacherSyncResource;
use App\Http\Resources\StudentReportResource;
use App\Models\Teacher;
use App\Models\Student;
use App\Models\StudentReport;
use App\Repositories\HalaqahRepository;
use App\Repositories\StudentRepository;
use Illuminate\Http\Request;

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
        // --------------------------------------------------------------------------------
        // Note: The recommended date format for 'updatedSince' is ISO 8601 (e.g., '2023-01-01T00:00:00Z').
        // --------------------------------------------------------------------------------
        $updatedSince = $request->input('updatedSince');
        $limit = $request->input('limit', 100);
        $page = $request->input('page', 1);

        $studentsPaginator = $this->students->sync($updatedSince, $limit, $page);

        return $this->success(StudentSyncResource::collection($studentsPaginator), 'students');
    }

    // GET /api/v1/sync/teachers
    public function syncTeachers(Request $request)
    {
        // --------------------------------------------------------------------------------
        // Note: The recommended date format for 'updatedSince' is ISO 8601 (e.g., '2023-01-01T00:00:00Z').
        // --------------------------------------------------------------------------------
        $query = Teacher::with(['user', 'halaqahs']);
 
        $updatedSince = $request->input('updatedSince');
        if ($updatedSince && $updatedSince != '0') {
            // Handle numeric timestamp
            if (is_numeric($updatedSince)) {
                $updatedSince = \Illuminate\Support\Carbon::createFromTimestampMs($updatedSince);
            }
            $query->where(function ($query) use ($updatedSince) {
                $query->where('updated_at', '>=', $updatedSince)
                    ->orWhere('created_at', '>=', $updatedSince);
            });
        }

        $teachersPaginator = $query->paginate(15);

        return $this->success(TeacherSyncResource::collection($teachersPaginator), 'teachers');
    }

    // GET /api/v1/sync/halaqas
    public function syncHalaqas(Request $request, HalaqahRepository $repository)
    {
        // --------------------------------------------------------------------------------
        // Note: The recommended date format for 'updatedSince' is ISO 8601 (e.g., '2023-01-01T00:00:00Z').
        // --------------------------------------------------------------------------------
        $updatedSince = $request->input('updatedSince');
        $page = (int) $request->query('page', 1);
        $limit = (int) $request->query('limit', 100);

        // Standardize updatedSince '0' as null
        if ($updatedSince == '0') $updatedSince = null;

        $halaqas = $repository->getUpdatedSince($updatedSince, $limit, $page);

        return $this->success(HalaqahResource::collection($halaqas), 'halaqas');
    }

    // GET api/v1/sync/reports
    public function syncReports(Request $request)
    {
        $updatedSince = $request->query('updatedSince');
        $studentUserId = $request->query('studentId');
        $page = (int) $request->query('page', 1);
        $limit = (int) $request->query('limit', 10);
        $sortBy = $request->query('sortBy', 'trackDate');
        $sortOrder = strtolower($request->query('sortOrder', 'desc'));

        $query = StudentReport::query();

        if ($studentUserId) {
            // StudentId here refers to the user_id of the student
            $student = Student::where('user_id', $studentUserId)->first();
            if ($student) {
                $query->where('student_id', $student->id);
            } else {
                $query->whereRaw('1 = 0'); // No results if student doesn't exist
            }
        }

        if ($updatedSince && $updatedSince != '0') {
            if (is_numeric($updatedSince)) {
                $updatedSince = \Illuminate\Support\Carbon::createFromTimestampMs($updatedSince);
            }
            $query->where(function ($q) use ($updatedSince) {
                $q->where('updated_at', '>=', $updatedSince)
                    ->orWhere('created_at', '>=', $updatedSince);
            });
        }

        // Map frontend sort names to backend columns
        $sortMap = [
            'trackDate' => 'report_date',
            'updatedAt' => 'updated_at',
            'behavior' => 'behavior',
        ];
        $dbSortBy = $sortMap[$sortBy] ?? 'report_date';

        $reports = $query->orderBy($dbSortBy, $sortOrder)->paginate($limit);

        // Summary logic for specific student (using mock data for structure, but checking if student exists)
        $summary = $studentUserId ? [
            'totalPendingReports' => 0,
            'totalDeviation' => 0,
            'status' => 'stable',
            'studentPerformance' => [
                'averageBehaviourScore' => 4.0,
                'averageAchievementRate' => 90,
                'averageExecutionQuality' => 4.0,
                'reportCount' => $reports->total(),
            ],
        ] : null;

        return $this->success([
            'reports' => StudentReportResource::collection($reports),
            'summary' => $summary,
            'syncTimestamp' => now()->toIso8601String(),
        ], 'reports');
    }
}
