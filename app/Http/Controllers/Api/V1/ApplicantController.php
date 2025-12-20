<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;

class ApplicantController extends ApiController
{
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
    public function store(Request $request)
    {
        // TODO: create new applicant
        return $this->success([], 'Applicant created');
    }
}
