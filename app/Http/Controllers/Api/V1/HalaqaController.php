<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\HalaqahResource;
use App\Http\Resources\StudentHistoryResource;
use App\Http\Resources\StudentKhatmResource;
use App\Repositories\HalaqahRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;

// Make sure you're extending your new ApiController
class HalaqaController extends ApiController
{
    protected $halaqahRepository;

    public function __construct(HalaqahRepository $halaqahRepository)
    {
        $this->halaqahRepository = $halaqahRepository;
    }

    public function index(Request $request)
    {
        $halaqahs = $this->halaqahRepository->all($request->all());
        // Use paginatedSuccess to handle paginated resource collections
        return $this->paginatedSuccess($halaqahs, HalaqahResource::class, 'Halaqahs retrieved successfully.');
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'avatar' => 'nullable|string',
            'gender' => ['required', Rule::in(['Male', 'Female', 'Both'])],
            'residence' => 'required|string|max:255',
            'max_students' => 'required|integer|min:1',
            'is_active' => 'sometimes|boolean',
            'teacher_id' => 'nullable|exists:teachers,id',
            'school_id' => 'required|exists:schools,id',
        ]);

        if ($validator->fails()) {
            // Use the error helper for validation failures
            return $this.error('The given data was invalid.', 422, $validator->errors());
        }

        $data = $validator->validated();
        $data['sum_of_students'] = 0;
        $data['is_deleted'] = false;

        $halaqah = $this->halaqahRepository->create($data);

        // Use the success helper for a single resource creation (201)
        return $this->success(new HalaqahResource($halaqah), 'Halaqah created successfully.', 201);
    }

    public function show($id)
    {
        $halaqah = $this->halaqahRepository->find($id);
        // Use the success helper for a single resource retrieval
        return $this->success(new HalaqahResource($halaqah), 'Halaqah retrieved successfully.');
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'avatar' => 'sometimes|nullable|string',
            'gender' => ['sometimes', 'required', Rule::in(['Male', 'Female', 'Both'])],
            'residence' => 'sometimes|required|string|max:255',
            'max_students' => 'sometimes|required|integer|min:1',
            'is_active' => 'sometimes|boolean',
            'teacher_id' => 'sometimes|nullable|exists:teachers,id',
            'school_id' => 'sometimes|required|exists:schools,id',
        ]);

        if ($validator->fails()) {
            return $this->error('The given data was invalid.', 422, $validator->errors());
        }

        $halaqah = $this->halaqahRepository->update($id, $validator->validated());

        return $this->success(new HalaqahResource($halaqah), 'Halaqah updated successfully.');
    }

    public function assignStudents(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'student_ids' => 'required|array',
            'student_ids.*' => 'required|integer|exists:students,id',
        ]);

        if ($validator->fails()) {
            return $this->error('The given data was invalid.', 422, $validator->errors());
        }

        try {
            $this->halaqahRepository->assignStudents($id, $request->input('student_ids'));
            // Use success helper for a simple message response
            return $this->success(null, 'Students assigned to Halaqa successfully.');
        } catch (ModelNotFoundException $e) {
            return $this->error('Halaqa not found.', 404);
        } catch (Exception $e) {
            // Catches other errors like capacity exceeded
            return $this->error($e->getMessage(), 400);
        }
    }

    public function assignTeacher(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'teacher_id' => 'required|integer|exists:teachers,id',
        ]);

        if ($validator->fails()) {
            return $this->error('The given data was invalid.', 422, $validator->errors());
        }

        $this->halaqahRepository->assignTeacher($id, $request->input('teacher_id'));

        return $this->success(null, 'Teacher assigned to Halaqa successfully.');
    }

    public function teachersHistory(Request $request, $id)
    {
        $teachers = $this->halaqahRepository->getTeacherHistory($id, $request->all());

        $data = $teachers->map(function ($teacher) {
            return [
                "id" => $teacher->id,
                "name" => $teacher->user->name,
                "avatar" => $teacher->user->avatar,
                "assigned_at" => $teacher->pivot->assigned_at,
                "note" => $teacher->pivot->note,
                "is_current" => $teacher->pivot->is_current,
            ];
        });

        return $this->success($data, 'Teacher history retrieved successfully.');
    }

    public function studentsKhatm(Request $request, $id)
    {
        $students = $this->halaqahRepository->getKhatmStudents($id, $request->all());
        // Use the paginatedSuccess helper with our new StudentKhatmResource
        return $this->paginatedSuccess($students, StudentKhatmResource::class, 'Khatm student list retrieved successfully.');
    }

    public function studentsHistory(Request $request, $id)
    {
        $enrollments = $this->halaqahRepository->getStudentHistory($id, $request->all());
        // Use the paginatedSuccess helper with our new StudentHistoryResource
        return $this->paginatedSuccess($enrollments, StudentHistoryResource::class, 'Student history retrieved successfully.');
    }
}
