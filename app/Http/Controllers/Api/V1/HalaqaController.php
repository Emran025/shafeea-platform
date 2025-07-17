<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;

class HalaqaController extends ApiController
{
    // GET /api/v1/halaqas
    public function index(Request $request)
    {
        $data = [
            [
                "id" => 1,
                "name" => "Al-Fajr halaqa",
                "Avater" => "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJyb2xlIjoic3VwZXJ2aXNvciJ9.cThIIo-f-Fk6cT4pL5dffF3hAblA-O2r....",
                "isActive" => true,
                "gender" => "Male",
                "residence" => "Riyadh",
                "SumOfStudents" => 10,
                "createdAt" => "2023-01-10T08:00:00Z",
            ]
        ];
        $pagination = [
            "page" => $request->query('page', 1),
            "limit" => $request->query('limit', 10),
            "total" => 15
        ];

        return response()->json([
            "data" => $data,
            "pagination" => $pagination,
        ], 200);
    }

    // POST /api/v1/halaqas
    public function store(Request $request)
    {
        $newHalaqa = [
            "id" => 2,
            "name" => $request->input('name', 'Al-Asr halaqa'),
            "Avater" => "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJyb2xlIjoic3VwZXJ2aXNvciJ9.cThIIo-f-Fk6cT4pL5dffF3hAblA-O2r....",
            "isActive" => true,
            "gender" => $request->input('gender', 'Female'),
            "residence" => $request->input('residence', 'Jeddah'),
            "SumOfStudents" => 10,
            "createdAt" => now()->toIso8601String(),
            "updatedAt" => now()->toIso8601String(),
        ];

        return response()->json($newHalaqa, 201);
    }

    // GET /api/v1/halaqas/{id}
    public function show($id)
    {
        $halaqa = [
            "id" => (int)$id,
            "name" => "Al-Fajr halaqa",
            "Avater" => "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJyb2xlIjoic3VwZXJ2aXNvciJ9.cThIIo-f-Fk6cT4pL5dffF3hAblA-O2r....",
            "isActive" => true,
            "gender" => "Male",
            "residence" => "Riyadh",
            "SumOfStudents" => 10,
            "createdAt" => "2023-01-10T08:00:00Z",
            "updatedAt" => "2023-09-21T18:00:00Z"
        ];

        return response()->json($halaqa, 200);
    }

    // PUT /api/v1/halaqas/{id}
    public function update(Request $request, $id)
    {
        $updatedHalaqa = [
            "id" => (int)$id,
            "name" => $request->input('name', 'Al-Fajr Morning halaqa'),
            "Avater" => $request->input('Avater', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."),
            "isActive" => $request->input('isActive', false),
            "gender" => $request->input('gender', 'Male'),
            "residence" => $request->input('residence', 'Riyadh'),
            "SumOfStudents" => 10,
            "createdAt" => "2023-01-10T08:00:00Z",
            "updatedAt" => now()->toIso8601String()
        ];

        return response()->json($updatedHalaqa, 200);
    }

    // POST /api/v1/halaqas/{id}/assign-students
    public function assignStudents(Request $request, $id)
    {
        // Just simulate success
        return response()->json([
            "status" => 200,
            "message" => "Students assigned to Halaqa successfully."
        ], 200);
    }

    // POST /api/v1/halaqas/{id}/assign-teacher
    public function assignTeacher(Request $request, $id)
    {
        // Just simulate success
        return response()->json([
            "status" => 200,
            "message" => "Teacher assigned to Halaqa successfully."
        ], 200);
    }

    // GET /api/v1/halaqas/{id}/teachers/history
    public function teachersHistory(Request $request, $id)
    {
        $data = [
            [
                "id" => 1,
                "name" => "Ahmed Mahmoud",
                "Avater" => "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "assignedAt" => "2022-08-01T09:00:00Z",
                "unassignedAt" => "2023-08-01T09:00:00Z"
            ],
            [
                "id" => 2,
                "name" => "Aisha Ibrahim",
                "Avater" => "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "assignedAt" => "2023-08-01T09:00:00Z",
                "unassignedAt" => null
            ]
        ];

        $pagination = [
            "page" => $request->query('page', 1),
            "limit" => $request->query('limit', 10),
            "total" => 2
        ];

        return response()->json([
            "data" => $data,
            "pagination" => $pagination
        ], 200);
    }

    // GET /api/v1/halaqas/{id}/students/khatm
    public function studentsKhatm(Request $request, $id)
    {
        $data = [
            [
                "id" => 5,
                "name" => "Zainab Hassan",
                "Avater" => "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "completionDate" => "2023-06-15T14:00:00Z"
            ]
        ];

        $pagination = [
            "page" => $request->query('page', 1),
            "limit" => $request->query('limit', 10),
            "total" => 1
        ];

        return response()->json([
            "data" => $data,
            "pagination" => $pagination
        ], 200);
    }

    // GET /api/v1/halaqas/{id}/students/history
    public function studentsHistory(Request $request, $id)
    {
        $data = [
            [
                "id" => 3,
                "name" => "Omar Ali",
                "Avater" => "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "enrolledAt" => "2022-09-01T10:00:00Z",
                "leftAt" => "2023-03-01T10:00:00Z",
                "status" => "dropped"
            ],
            [
                "id" => 4,
                "name" => "Fatima Zahra",
                "Avater" => "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "enrolledAt" => "2023-01-15T10:00:00Z",
                "leftAt" => null,
                "status" => "active"
            ]
        ];

        $pagination = [
            "page" => $request->query('page', 1),
            "limit" => $request->query('limit', 10),
            "total" => 2
        ];

        return response()->json([
            "data" => $data,
            "pagination" => $pagination
        ], 200);
    }
}
