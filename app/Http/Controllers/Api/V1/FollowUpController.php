<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use App\Models\Student ;
use App\Models\Tracking ;
class FollowUpController extends ApiController
{
    /**
     * GET /follow-ups/students
     * Retrieve follow-up reports for a student with optional summary.
     */

    public function studentReports(Request $request)
    {
        $studentUserId = $request->query('studentId');
        $trackDate = $request->query('trackDate');
        $page = (int) $request->query('page', 1);
        $limit = (int) $request->query('limit', 10);
        $sortBy = $request->query('sortBy', 'trackDate'); // mapped to 'date' column
        $sortOrder = strtolower($request->query('sortOrder', 'asc'));

        $student = Student::where('user_id', $studentUserId)->first();
        if (! $student) {
            // Fallback: try finding by student id directly
            $student = Student::find($studentUserId);
        }

        if (! $student) {
            return $this->error('Student not found', 404);
        }

        // Build Query for Trackings
        $query = Tracking::whereHas('enrollment', function ($q) use ($student) {
            $q->where('student_id', $student->id);
        });

        if ($trackDate) {
            $query->whereDate('date', $trackDate);
        }

        $sortColumn = ($sortBy === 'trackDate') ? 'date' : 'created_at';
        $query->orderBy($sortColumn, $sortOrder);

        $paginator = $query->with(['details.trackingType', 'details.toTrackingUnit.unit'])
            ->paginate($limit, ['*'], 'page', $page);

        // Transform Data
        $reports = collect($paginator->items())->map(function ($tracking) {
            return [
                'id' => $tracking->id,
                'trackDate' => $tracking->date,
                'attendance' => 'present', // Placeholder as attendance is not currently in Tracking
                'details' => $tracking->details->map(function ($detail) {
                    $unit = $detail->toTrackingUnit && $detail->toTrackingUnit->unit
                        ? $detail->toTrackingUnit->unit->code
                        : null;

                    // Planned = Actual - Gap
                    $planned = $detail->actual_amount - $detail->gap;

                    return [
                        'type' => $detail->trackingType ? $detail->trackingType->name : 'unknown',
                        'planned' => ['unit' => $unit, 'amount' => (float) $planned],
                        'actual' => ['unit' => $unit, 'amount' => (float) $detail->actual_amount, 'amountAccumulated' => 0],
                        'gap' => (float) $detail->gap,
                        'note' => $detail->comment,
                        'performanceScore' => (float) $detail->score,
                    ];
                }),
            ];
        });

        // Summary Statistics (Aggregate over all time for this student)
        $allTrackingIds = \App\Models\Tracking::whereHas('enrollment', function ($q) use ($student) {
            $q->where('student_id', $student->id);
        })->pluck('id');

        $totalDeviation = \App\Models\TrackingDetail::whereIn('tracking_id', $allTrackingIds)->sum('gap');
        $avgScore = \App\Models\TrackingDetail::whereIn('tracking_id', $allTrackingIds)->avg('score');
        $reportCount = $allTrackingIds->count();

        $summary = [
            'totalPendingReports' => 0,
            'totalDeviation' => (float) $totalDeviation,
            'status' => $totalDeviation < 0 ? 'behind' : 'on-track',
            'studentPerformance' => [
                'averageBehaviourScore' => 0, // Behavior score not present in Tracking table
                'averageAchievementRate' => $avgScore ? ($avgScore / 5 * 100) : 0,
                'averageExecutionQuality' => (float) $avgScore,
                'reportCount' => $reportCount,
            ],
        ];

        return $this->success([
            'reports' => $reports,
            'summary' => $summary,
            'pagination' => [
                'page' => $paginator->currentPage(),
                'limit' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ]);
    }

    /**
     * GET /follow-ups/halaqas
     * Retrieve follow-up reports and summaries for all Halaqas.
     */
    public function halaqaReports(Request $request)
    {
        $date = $request->query('date');
        $frequency = $request->query('frequency');
        $page = (int) $request->query('page', 1);
        $limit = (int) $request->query('limit', 10);
        $sortBy = $request->query('sortBy', 'halaqaName');
        $sortOrder = strtolower($request->query('sortOrder', 'asc'));

        // Sample data
        $halaqas = [
            [
                'id' => 101,
                'name' => 'Al-Fajr Halaqa',
                'avatar' => 'base64string...',
                'students' => [
                    [
                        'id' => 1,
                        'name' => 'Abdullah Ahmed',
                        'avatar' => 'base64string...',
                        'frequency' => 'daily',
                        'reportStatus' => 'submitted',
                        'deviation' => 0,
                    ],
                    [
                        'id' => 2,
                        'name' => 'Yusuf Ali',
                        'avatar' => 'base64string...',
                        'frequency' => 'daily',
                        'reportStatus' => 'pending',
                        'deviation' => -1,
                    ],
                ],
                'summary' => [
                    'totalStudents' => 15,
                    'submittedCount' => 10,
                    'pendingCount' => 5,
                    'completeness' => '66.67%',
                ],
            ],
        ];

        $summary = [
            'totalHalaqas' => 15,
            'submittedCount' => 10,
            'pendingCount' => 5,
            'completeness' => '66.67%',
        ];

        return $this->success([
            'halaqas' => $halaqas,
            'summary' => $summary,
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => 15,
            ],
        ]);
    }
}
