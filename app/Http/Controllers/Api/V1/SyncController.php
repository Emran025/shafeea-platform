<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\ApiController;
use App\Models\Student;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Http\Request;

class SyncController extends ApiController
{
    /**
     * Sync all students updated since a specific timestamp.
     *
     * @param  Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    // Helper to generate random ISO8601 datetime string within the last year
    private function randomDateSince($since = null)
    {
        $since = $since ? Carbon::parse($since) : Carbon::now()->subYear();
        $now = Carbon::now();
        return $since->addSeconds(rand(0, $now->diffInSeconds($since)))->toIso8601String();
    }

    // Helper to generate a random student record for syncing
    private function randomStudent($id = null, $updatedSince = null)
    {
        $updatedAt = $this->randomDateSince($updatedSince);

        return [
            'id' => $id ?? rand(1, 1000),
            'name' => 'Student ' . Str::random(5),
            'Avater' => base64_encode(Str::random(30)),
            'gender' => ['Male', 'Female'][array_rand(['Male', 'Female'])],
            'birthDate' => Carbon::now()->subYears(rand(10, 20))->toDateString(),
            'email' => Str::random(5) . '@example.com',
            'phoneZone' => '+966',
            'phone' => '5' . rand(10000000, 99999999),
            'country' => 'Saudi Arabia',
            'residence' => 'Riyadh',
            'city' => 'Riyadh',
            'qualification' => 'High School',
            'memorizationLevel' => rand(1, 10) . ' Juz',
            'status' => ['active', 'stopped', 'dropout'][array_rand(['active', 'stopped', 'dropout'])],
            'halaqa' => [
                'id' => rand(1, 50),
                'name' => 'Halaqa ' . Str::random(4),
            ],
            'followUpPlan' => [
                'PlanId' => rand(1, 100),
                'frequency' => ['daily', 'weekly', 'monthly'][array_rand(['daily', 'weekly', 'monthly'])],
                'details' => [
                    [
                        'type' => 'memorization',
                        'unit' => 'page',
                        'amount' => rand(1, 5),
                    ],
                    [
                        'type' => 'review',
                        'unit' => 'juz',
                        'amount' => rand(1, 3),
                    ],
                    [
                        'type' => 'recitation',
                        'unit' => 'page',
                        'amount' => rand(1, 4),
                    ],
                ],
                'updatedAt' => $updatedAt,
                'createdAt' => Carbon::parse($updatedAt)->subDays(rand(1, 30))->toIso8601String(),
            ],
            'isDeleted' => (bool)rand(0, 1) && rand(0, 10) > 8, // ~20% chance deleted
            'updatedAt' => $updatedAt,
        ];
    }

    // GET api/v1/sync/students
    public function syncStudents(Request $request)
    {
        $updatedSince = $request->query('updatedSince', Carbon::now()->subMonth()->toIso8601String());
        $limit = (int) $request->query('limit', 100);
        $page = (int) $request->query('page', 1);
        $total = 250; // total records updated since timestamp (mocked)

        $data = [];
        for ($i = 0; $i < $limit; $i++) {
            $data[] = $this->randomStudent(null, $updatedSince);
        }

        $syncTimestamp = Carbon::now()->toIso8601String();

        return $this->success([
            'data' => $data,
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $total,
            ],
            'syncTimestamp' => $syncTimestamp,
        ]);
    }
    // public function syncStudents(Request $request)
    // {
    //     $validated = $request->validate([
    //         'updatedSince' => 'required|date_format:Y-m-d\TH:i:sP',
    //         'page' => 'integer|min:1',
    //         'limit' => 'integer|min:1|max:100',
    //     ]);

    //     $updatedSince = $request->input('updatedSince');
    //     $limit = $request->input('limit', 100);

    //     $students = Student::with([
    //         'user',
    //         'enrollments' => function ($query) {
    //             $query->latest('enrolled_at')->limit(1);
    //         },
    //         'enrollments.plan.frequencyType',
    //         'enrollments.plan.reviewUnit',
    //         'enrollments.plan.memorizationUnit',
    //         'enrollments.plan.sardUnit',
    //         'enrollments.halaqah',
    //     ])
    //         ->where(function ($query) use ($updatedSince) {
    //             $query->where('updated_at', '>=', $updatedSince)
    //                 ->orWhere('created_at', '>=', $updatedSince);
    //         })
    //         ->paginate($limit);

    //     return $this->success([
    //         'data' => $students->items(),
    //         'pagination' => [
    //             'page' => $students->currentPage(),
    //             'limit' => $students->perPage(),
    //             'total' => $students->total(),
    //         ],
    //         'syncTimestamp' => now()->toIso8601String(),
    //     ]);
    // }
    // GET /api/v1/sync/teachers
    public function syncTeachers(Request $request)
    {
        // Simulated inputs
        $updatedSince = $request->query('updatedSince', null);
        $page = (int) $request->query('page', 1);
        $limit = (int) $request->query('limit', 100);

        // Sample teacher data (you can replace this with DB query with where('updated_at', '>=', $updatedSince))
        $teachers = [
            [
                "id" => 1,
                "name" => "Ahmed Mahmoud",
                "Avater" => "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "gender" => "Male",
                "birthDate" => "1985-03-10",
                "email" => "ahmed.mahmoud.new@example.com",
                "phoneZone" => "+20",
                "phone" => "1012345679",
                "country" => "Egypt",
                "residence" => "Cairo",
                "city" => "Cairo",
                "qualification" => "PhD in Islamic Studies and Quranic Exegesis",
                "experienceYears" => 11,
                "status" => "active",
                "assignedHalaqas" => [
                    [
                        "id" => 101,
                        "name" => "Al-Fajr halaqa",
                        "Avater" => "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    ]
                ],
                "isDeleted" => false,
                "updatedAt" => "2023-09-21T16:00:00Z"
            ]
        ];

        $pagination = [
            "page" => $page,
            "limit" => $limit,
            "total" => 50
        ];

        $syncTimestamp = Carbon::now()->toIso8601String();

        return $this->success([
            "data" => $teachers,
            "pagination" => $pagination,
            "syncTimestamp" => $syncTimestamp
        ]);
    }
    // GET /api/v1/sync/halaqas
    public function syncHalaqas(Request $request)
    {
        $updatedSince = $request->query('updatedSince');
        $page = (int) $request->query('page', 1);
        $limit = (int) $request->query('limit', 100);

        $halaqas = [
            [
                "id" => 1,
                "name" => "Al-Fajr Morning halaqa",
                "Avater" => "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "gender" => "Male",
                "residence" => "Riyadh",
                "SumOfStudents" => 10,
                "isActive" => false,
                "isDeleted" => false,
                "createdAt" => "2023-01-15T10:00:00Z",
                "updatedAt" => "2023-09-21T19:00:00Z"
            ],
            [
                "id" => 3,
                "name" => "Al-Maghrib halaqa",
                "Avater" => "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "isActive" => false,
                "isDeleted" => true,
                "createdAt" => "2023-01-15T10:00:00Z",
                "updatedAt" => "2023-09-22T11:45:00Z"
            ]
        ];

        $pagination = [
            "page" => $page,
            "limit" => $limit,
            "total" => 20
        ];

        return $this->success([
            "data" => $halaqas,
            "pagination" => $pagination,
            "syncTimestamp" => Carbon::now()->toIso8601String()
        ]);
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
