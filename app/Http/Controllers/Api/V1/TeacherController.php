<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\ApiController;
use Illuminate\Http\Request;
use App\Repositories\TeacherRepository;
use App\Http\Requests\Teacher\StoreTeacherRequest;
use App\Http\Requests\Teacher\UpdateTeacherRequest;
use App\Http\Resources\TeacherResource;

class TeacherController extends ApiController
{
    protected $teachers;

    public function __construct(TeacherRepository $teachers)
    {
        $this->teachers = $teachers;
    }

    public function index(Request $request)
    {
        $teachers = $this->teachers->all($request->all());
        // dd($teachers);
        // return response()->json($teachers);
        if (method_exists($teachers, 'total')) {
            return $this->paginated(TeacherResource::collection($teachers));
        }
        return $this->success(TeacherResource::collection($teachers));
    }

    public function store(StoreTeacherRequest $request)
    {
        // Implement teacher creation logic
        // For now, just return a success response
        return $this->success(null, 'Teacher created successfully', 201);
    }

    public function show($id)
    {
        $teacher = $this->teachers->find($id);
        return $this->success(new TeacherResource($teacher));
    }

    public function update(UpdateTeacherRequest $request, $id)
    {
        $teacher = $this->teachers->update($id, $request->validated());
        return $this->success(new TeacherResource($teacher), 'Teacher updated successfully');
    }

    public function halaqas(Request $request, $id)
    {
        $teacher = $this->teachers->find($id);
        $halaqas = $teacher->halaqahs;
        return $this->success(['data' => $halaqas]);
    }

    public function listHalaqas(Request $request, $id)
    {
        try {
            $teacher = $this->teachers->find($id);
            $halaqas = $teacher->halaqahs;
            return $this->success(['data' => $halaqas]);
        } catch (\Throwable $e) {
            return $this->error('Failed to list halaqas', 500, $e->getMessage());
        }
    }

    public function assignToHalaqas(Request $request, $id)
    {
        try {
            $halaqaIds = $request->input('halaqaIds', []);
            $this->teachers->assignHalaqas($id, $halaqaIds);
            return $this->success([
                'teacherId' => $id,
                'halaqaIds' => $halaqaIds
            ], 'Teacher assigned to halaqas successfully');
        } catch (\Throwable $e) {
            return $this->error('Failed to assign halaqas', 500, $e->getMessage());
        }
    }
}
