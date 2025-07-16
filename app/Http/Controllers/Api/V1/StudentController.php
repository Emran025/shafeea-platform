<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\ApiController;
use Illuminate\Http\Request;
use App\Repositories\StudentRepository;
use App\Repositories\StudentApplicantRepository;
use App\Http\Requests\Student\StoreStudentRequest;
use App\Http\Requests\Student\UpdateStudentRequest;
use App\Http\Requests\Student\AssignHalaqaRequest;
use App\Http\Requests\Student\ActionRequest;
use App\Http\Requests\Student\FollowUpRequest;
use App\Http\Resources\StudentResource;
use App\Http\Resources\StudentApplicantResource;
use App\Http\Resources\FollowUpResource;

class StudentController extends ApiController
{
    protected $students;
    protected $applicants;

    public function __construct(StudentRepository $students, StudentApplicantRepository $applicants)
    {
        $this->students = $students;
        $this->applicants = $applicants;
    }

    public function index(Request $request)
    {
        $students = $this->students->all($request->all());
        if (method_exists($students, 'total')) {
            return $this->paginated(StudentResource::collection($students));
        }
        return $this->success(StudentResource::collection($students));
    }

    public function show($id)
    {
        $student = $this->students->find($id);
        return $this->success(new StudentResource($student));
    }

    public function update(UpdateStudentRequest $request, $id)
    {
        $student = $this->students->update($id, $request->validated());
        return $this->success(new StudentResource($student), 'Student updated successfully.');
    }

    public function assign(AssignHalaqaRequest $request, $id)
    {
        // Implement assign logic in repository/service
        return $this->success(null, 'Student assigned to halaqa successfully.');
    }

    public function action(ActionRequest $request, $id)
    {
        // Implement action logic in repository/service
        return $this->success(null, 'Action completed successfully.');
    }

    public function followUp($id, Request $request)
    {
        // Implement follow-up logic in repository/service
        return $this->success(new FollowUpResource((object)[
            'id' => 15,
            'frequency' => 'daily',
            'details' => [
                ['type' => 'memorization', 'unit' => 'page', 'amount' => 2],
                ['type' => 'review', 'unit' => 'juz', 'amount' => 1],
                ['type' => 'recitation', 'unit' => 'page', 'amount' => 2],
            ],
            'updated_at' => now(),
            'created_at' => now(),
        ]));
    }

    public function updateFollowUp(FollowUpRequest $request, $id)
    {
        // Implement update follow-up logic in repository/service
        return $this->success(new FollowUpResource((object)[
            'id' => 15,
            'frequency' => $request->frequency,
            'details' => $request->details,
            'updated_at' => now(),
            'created_at' => now(),
        ]), 'Follow-up plan updated.');
    }

    public function applicants(Request $request)
    {
        $applicants = $this->applicants->all($request->all());
        if (method_exists($applicants, 'total')) {
            return $this->paginated(StudentApplicantResource::collection($applicants));
        }
        return $this->success(StudentApplicantResource::collection($applicants));
    }

    public function showApplicant($id)
    {
        $applicant = $this->applicants->find($id);
        return $this->success(new StudentApplicantResource($applicant));
    }

    public function applicantAction(Request $request, $id)
    {
        // Implement applicant action logic in repository/service
        return $this->success(null, 'Applicant accepted successfully.');
    }
}
