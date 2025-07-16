<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;

class StudentController extends ApiController
{
    // GET /students
    public function index(Request $request)
    {
        // TODO: fetch students with filters, pagination, sorting
        return $this->success([], 'List of students');
    }

    // GET /students/{id}
    public function show($id)
    {
        // TODO: fetch student profile by id
        return $this->success([], "Student profile with id {$id}");
    }

    // PUT /students/{id}
    public function update(Request $request, $id)
    {
        // TODO: update student by id
        return $this->success([], "Student with id {$id} updated");
    }

    // GET /students/{id}/follow-up
    public function getFollowUp($id)
    {
        // TODO: get follow-up plan for student id
        return $this->success([], "Follow-up plan for student {$id}");
    }

    // PUT /students/{id}/follow-up
    public function updateFollowUp(Request $request, $id)
    {
        // TODO: update or add follow-up plan
        return $this->success([], "Follow-up plan for student {$id} updated");
    }

    // POST /students/{id}/assign
    public function assignToHalaqa(Request $request, $id)
    {
        // TODO: assign student to halaqa
        return $this->success([], "Student {$id} assigned to halaqa");
    }

    // POST /students/{id}/actions
    public function takeAction(Request $request, $id)
    {
        // TODO: suspend, expel, or other actions
        return $this->success([], "Action taken on student {$id}");
    }
}
