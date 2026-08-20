<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;

class TeacherApplicantController extends ApiController
{
    // GET /api/v1/teachers/applicants
    public function index(Request $request)
    {
        $data = [
            [
                'id' => 1,
                'name' => 'Fatima Ali',
                'Avater' => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...base64string...',
                'gender' => 'Female',
                'birthDate' => '1992-11-25',
                'email' => 'fatima.ali@example.com',
                'phoneZone' => '+971',
                'phone' => '551234567',
                'country' => 'UAE',
                'residence' => 'Abu Dhabi',
                'city' => 'Abu Dhabi',
                'qualification' => "Bachelor's in Arabic Language",
                'experienceYears' => 3,
                'status' => 'new',
                'createdAt' => '2023-09-20T10:00:00Z',
            ],
        ];

        $pagination = [
            'page' => $request->query('page', 1),
            'limit' => $request->query('limit', 10),
            'total' => 15,
        ];

        return response()->json([
            'data' => $data,
            'pagination' => $pagination,
        ], 200);
    }

    // GET /api/v1/teachers/applicants/{id}
    public function show($id)
    {
        $applicant = [
            'id' => (int) $id,
            'name' => 'Fatima Ali',
            'Avater' => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...base64string...',
            'gender' => 'Female',
            'birthDate' => '1992-11-25',
            'email' => 'fatima.ali@example.com',
            'phoneZone' => '+971',
            'phone' => '551234567',
            'whatsappZone' => '+971',
            'whatsappPhone' => '551234567',
            'country' => 'UAE',
            'residence' => 'Abu Dhabi',
            'city' => 'Abu Dhabi',
            'qualification' => "Bachelor's in Arabic Language",
            'experienceYears' => 3,
            'status' => 'new',
            'note' => 'Awaiting documents verification.',
            'createdAt' => '2023-09-20T10:00:00Z',
            'processedAt' => null,
        ];

        return response()->json($applicant, 200);
    }

    // POST /api/v1/teachers/applicants
    public function store(Request $request)
    {
        $newApplicant = [
            'id' => 2,
            'name' => $request->input('name', 'Aisha Ibrahim'),
            'Avater' => $request->input('Avater', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...base64string...'),
            'gender' => $request->input('gender', 'Female'),
            'birthDate' => $request->input('birthDate', '1990-07-15'),
            'email' => $request->input('email', 'aisha.ibrahim@example.com'),
            'phoneZone' => $request->input('phoneZone', '+966'),
            'phone' => $request->input('phone', '501234567'),
            'country' => $request->input('country', 'Saudi Arabia'),
            'residence' => $request->input('residence', 'Jeddah'),
            'city' => $request->input('city', 'Jeddah'),
            'qualification' => $request->input('qualification', "Master's in Quranic Sciences"),
            'experienceYears' => $request->input('experienceYears', 5),
            'status' => 'active',
            'createdAt' => now()->toIso8601String(),
        ];

        return response()->json($newApplicant, 201);
    }

    // POST /api/v1/teachers/applicants/{id}/actions
    public function takeAction(Request $request, $id)
    {
        $action = $request->input('action', 'accept');
        $note = $request->input('note', '');

        return response()->json([
            'status' => 200,
            'message' => "Applicant {$action}ed successfully.",
            'note' => $note,
            'applicantId' => $id,
        ], 200);
    }
}
