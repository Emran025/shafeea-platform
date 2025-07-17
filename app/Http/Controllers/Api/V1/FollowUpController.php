<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;

class FollowUpController extends ApiController
{
    /**
     * GET /follow-ups/students
     * Retrieve follow-up reports for a student with optional summary.
     */
    public function studentReports(Request $request)
    {
        $studentId = $request->query('studentId');
        $trackDate = $request->query('trackDate');
        $page = (int) $request->query('page', 1);
        $limit = (int) $request->query('limit', 10);
        $sortBy = $request->query('sortBy', 'trackDate');
        $sortOrder = strtolower($request->query('sortOrder', 'asc'));

        // Sample data
        $reports = [
            [
                "id" => 1,
                "trackDate" => $trackDate ?? "2023-09-21",
                "attendance" => "present",
                "details" => [
                    [
                        "type" => "memorization",
                        "planned" => [ "unit" => "page", "amount" => 1 ],
                        "actual" => [ "unit" => "page", "amount" => 1, "amountAccumulated" => 16 ],
                        "gap" => 0,
                        "note" => "Good progress.",
                        "performanceScore" => 4.5
                    ],
                    [
                        "type" => "revision",
                        "planned" => [ "unit" => "juz", "amount" => 0.5 ],
                        "actual" => [ "unit" => "juz", "amount" => 0.25, "amountAccumulated" => 16 ],
                        "gap" => -0.25,
                        "note" => "Needs improvement.",
                        "performanceScore" => 3.0
                    ],
                    [
                        "type" => "recitation",
                        "planned" => [ "unit" => "hizb", "amount" => 1 ],
                        "actual" => [ "unit" => "hizb", "amount" => 1, "amountAccumulated" => 16 ],
                        "gap" => 0,
                        "note" => "Steady performance.",
                        "performanceScore" => 4.0
                    ]
                ]
            ]
        ];

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
            "reports" => $reports[0],
            "summary" => $summary,
            "pagination" => [
                "page" => $page,
                "limit" => $limit,
                "total" => 50
            ]
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
                "id" => 101,
                "name" => "Al-Fajr Halaqa",
                "avatar" => "base64string...",
                "students" => [
                    [
                        "id" => 1,
                        "name" => "Abdullah Ahmed",
                        "avatar" => "base64string...",
                        "frequency" => "daily",
                        "reportStatus" => "submitted",
                        "deviation" => 0
                    ],
                    [
                        "id" => 2,
                        "name" => "Yusuf Ali",
                        "avatar" => "base64string...",
                        "frequency" => "daily",
                        "reportStatus" => "pending",
                        "deviation" => -1
                    ]
                ],
                "summary" => [
                    "totalStudents" => 15,
                    "submittedCount" => 10,
                    "pendingCount" => 5,
                    "completeness" => "66.67%"
                ]
            ]
        ];

        $summary = [
            "totalHalaqas" => 15,
            "submittedCount" => 10,
            "pendingCount" => 5,
            "completeness" => "66.67%"
        ];

        return $this->success([
            "halaqas" => $halaqas,
            "summary" => $summary,
            "pagination" => [
                "page" => $page,
                "limit" => $limit,
                "total" => 15
            ]
        ]);
    }
}
