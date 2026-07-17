<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\HalaqahResource;
use App\Http\Resources\StudentHistoryResource;
use App\Http\Resources\StudentKhatmResource;
use App\Http\Requests\AssignStudentsRequest;
use App\Http\Requests\AssignTeacherRequest;
use App\Http\Requests\StoreHalaqahRequest;
use App\Http\Requests\UpdateHalaqahRequest;
use App\Repositories\HalaqahRepository;
use App\Services\HalaqahService;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

// Make sure you're extending your new ApiController
class HalaqahController extends ApiController
{
    protected $halaqahRepository;

    protected $halaqahService;

    public function __construct(HalaqahRepository $halaqahRepository, HalaqahService $halaqahService)
    {
        $this->halaqahRepository = $halaqahRepository;
        $this->halaqahService = $halaqahService;
    }

    public function index(Request $request)
    {
        $halaqahs = $this->halaqahRepository->all($request->all());

        return $this->paginatedSuccess($halaqahs, HalaqahResource::class, 'halaqas');
    }

    public function store(StoreHalaqahRequest $request)
    {
        $validated = $request->validated();
        $data = $validated;
        $data['sum_of_students'] = 0;
        $data['is_deleted'] = false;

        $halaqah = $this->halaqahService->createHalaqah($data);

        // Use the success helper for a single resource creation (201)
        return $this->success(new HalaqahResource($halaqah), 'Halaqah created successfully.', 201);
    }

    public function show($id)
    {
        $halaqah = $this->halaqahRepository->find($id);

        // Use the success helper for a single resource retrieval
        return $this->success(new HalaqahResource($halaqah), 'Halaqah retrieved successfully.');
    }


    public function update(UpdateHalaqahRequest $request, $id)
    {
        $validated = $request->validated();

        $halaqah = $this->halaqahService->updateHalaqah($id, $validated);

        return $this->success(new HalaqahResource($halaqah), 'Halaqah updated successfully.');
    }

    public function assignStudents(AssignStudentsRequest $request, $id)
    {
        $validated = $request->validated();

        try {
            $this->halaqahService->assignStudents($id, $validated['studentUserIds']);

            // Use success helper for a simple message response
            return $this->success(null, 'Students assigned to Halaqa successfully.');
        } catch (ModelNotFoundException $e) {
            return $this->error('Halaqa not found.', 404);
        } catch (Exception $e) {
            // Catches other errors like capacity exceeded
            return $this->error($e->getMessage(), 400);
        }
    }

    public function assignTeacher(AssignTeacherRequest $request, $id)
    {
        $validated = $request->validated();

        $this->halaqahService->assignTeacher($id, $validated['teacher_id']);

        return $this->success(null, 'Teacher assigned to Halaqa successfully.');
    }

    public function teachersHistory(Request $request, $id)
    {
        $teachers = $this->halaqahRepository->getTeacherHistory($id, $request->all());

        $data = $teachers->map(function ($teacher) {
            return [
                'id' => $teacher->user_id,
                'name' => $teacher->user->name,
                'avatar' => $teacher->user->avatar,
                'assignedAt' => $teacher->pivot->assigned_at,
                'note' => $teacher->pivot->note,
                'isCurrent' => $teacher->pivot->is_current,
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
