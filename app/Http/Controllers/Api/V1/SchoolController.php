<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSchoolRequest;
use App\Http\Requests\UpdateSchoolRequest;
use App\Http\Resources\SchoolResource;
use App\Models\School;

class SchoolController extends ApiController
{
    public function index()
    {
        return SchoolResource::collection(School::all());
    }

    public function store(StoreSchoolRequest $request)
    {
        $school = School::create($request->validated());

        return new SchoolResource($school);
    }

    public function show(School $school)
    {
        return new SchoolResource($school);
    }

    public function update(UpdateSchoolRequest $request, School $school)
    {
        $school->update($request->validated());

        return new SchoolResource($school);
    }

    public function destroy(School $school)
    {
        $school->delete();

        return response()->noContent();
    }
}
