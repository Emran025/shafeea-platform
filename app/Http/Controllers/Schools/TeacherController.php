<?php

namespace App\Http\Controllers\Schools;

use App\Http\Controllers\Controller;
use App\Http\Requests\Teacher\StoreTeacherRequest;
use App\Http\Requests\Teacher\UpdateTeacherRequest;
use App\Http\Resources\TeacherResource;
use App\Repositories\TeacherRepository;
use App\Services\TeacherService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeacherController extends Controller
{
    protected $teachers;

    protected $teacherService;

    public function __construct(TeacherRepository $teachers, TeacherService $teacherService)
    {
        $this->teachers = $teachers;
        $this->teacherService = $teacherService;
    }

    /**
     * Display a listing of the teachers.
     */
    public function index(Request $request)
    {
        $teachers = $this->teachers->all($request->all());

        return Inertia::render('schools/teachers/index', [
            'teachers' => TeacherResource::collection($teachers),
            'filters' => $request->all(),
        ]);
    }

    /**
     * Show the form for creating a new teacher.
     */
    public function create()
    {
        return Inertia::render('schools/teachers/create');
    }

    /**
     * Store a newly created teacher in storage (API).
     */
    public function store(StoreTeacherRequest $request)
    {
        $this->teacherService->createTeacher($request->validated());

        return redirect()->route('schools.teachers.index')->with('success', 'Teacher created successfully.');
    }

    /**
     * Display the specified teacher.
     */
    public function show($id)
    {
        $teacher = $this->teachers->find($id);
        // Get all students in the teacher's halaqahs
        $students = $teacher->halaqahs->flatMap(function ($halaqah) {
            return $halaqah->enrollments->map(function ($enrollment) {
                return $enrollment->student;
            });
        })->unique('id')->filter()->values();

        return Inertia::render('schools/teachers/show', [
            'teacher' => new TeacherResource($teacher),
            'students' => \App\Http\Resources\StudentResource::collection($students),
        ]);
    }

    /**
     * Show the form for editing the specified teacher.
     */
    public function edit($id)
    {
        $teacher = $this->teachers->find($id);
        $students = $teacher->halaqahs->flatMap(function ($halaqah) {
            return $halaqah->enrollments->map(function ($enrollment) {
                return $enrollment->student;
            });
        })->unique('id')->filter()->values();

        return Inertia::render('schools/teachers/edit', [
            'teacher' => new TeacherResource($teacher),
            'students' => \App\Http\Resources\StudentResource::collection($students),
        ]);
    }

    /**
     * Update the specified teacher in storage (API).
     */
    public function update(UpdateTeacherRequest $request, $id)
    {
        $this->teacherService->updateTeacher($id, $request->validated());

        return redirect()->route('schools.teachers.index')->with('success', 'Teacher updated successfully.');
    }

    /**
     * Remove the specified teacher from storage (API).
     */
    public function destroy($id)
    {
        $teacher = \App\Models\Teacher::findOrFail($id);
        $teacher->delete();
        $teacher->user?->delete();

        return redirect()->route('schools.teachers.index')->with('success', 'Teacher deleted successfully.');
    }
}
