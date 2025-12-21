<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\Student\StoreStudentRequest;
use App\Http\Resources\StudentResource;
use App\Repositories\StudentApplicantRepository;
use Illuminate\Http\Request;

class ApplicantController extends ApiController
{
    protected $applicants;

    public function __construct(StudentApplicantRepository $applicants)
    {
        $this->applicants = $applicants;
    }

    // GET /students/applicants
    public function index(Request $request)
    {
        // TODO: list applicants with filters & pagination
        return $this->success([], 'List of applicants');
    }

    // GET /students/applicants/{id}
    public function show($id)
    {
        // TODO: get applicant profile
        return $this->success([], "Applicant profile with id {$id}");
    }

    // POST /students/applicants/{id}/actions
    public function takeAction(Request $request, $id)
    {
        // TODO: accept or reject applicant
        return $this->success([], "Action taken on applicant {$id}");
    }

    // POST /students/applicants
    public function store(StoreStudentRequest $request)
    {
        $student = $this->applicants->create($request->validated());

        return $this->success(new StudentResource($student), 'Applicant created', 201);
    }
}
