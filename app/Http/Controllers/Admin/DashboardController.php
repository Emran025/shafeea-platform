<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\{Student, Teacher, Halaqah, Enrollment, StudentReport, HalaqahSchedule, Notification};
use App\Models\Admin as AdminModel;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        // KPIs
        $totalStudents = Student::count();
        $totalTeachers = Teacher::count();
        $totalHalaqahs = Halaqah::count();
        $newEnrollments = Enrollment::where('created_at', '>=', now()->subDays(30))->count();
        $avgBehavior = round(StudentReport::avg('behavior'), 2);

        // Grouped counts
        $studentsByQualification = Student::select('qualification', DB::raw('count(*) as total'))->groupBy('qualification')->get();
        $studentsByGender = Student::select(DB::raw('count(*) as total'))->get();
        $activeEnrollments =  Enrollment::where('created_at', '>=', 'updated_at')->count();
        $admins = AdminModel::with('user.roles')->get();
        $scheduledHalaqahs = HalaqahSchedule::whereBetween('start_time', [now()->startOfWeek(), now()->endOfWeek()])->count();

        // Notifications (last 10, unread or scheduled for now)
        $notifications = Notification::where(function ($q) {
            $q->where('read', false)
                ->orWhere('scheduled_for', '<=', now());
        })
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        // Table Data
        $halaqahsTable = Halaqah::with(['teachers.user', 'enrollments'])->get();
        $teachersTable = Teacher::with(['user', 'halaqahs'])->get();
        $studentsTable = Student::with(['user', 'enrollments'])->get();
        $enrollmentsTable = Enrollment::with(['student.user', 'halaqah', 'currentPlan'])->get();
        $adminsTable = AdminModel::with('user.roles')->get();

        // Chart Data
        $studentsPerHalaqah = Halaqah::withCount('enrollments')->get(['id', 'name', 'enrollments_count']);

        $driver = DB::connection()->getDriverName();
        $monthExpression = match ($driver) {
            'mysql' => "DATE_FORMAT(created_at, '%Y-%m')",
            'pgsql' => "TO_CHAR(created_at, 'YYYY-MM')",
            default => "strftime('%Y-%m', created_at)",
        };
        $enrollmentTrends = Enrollment::selectRaw("$monthExpression as month, COUNT(*) as count")
            ->where('created_at', '>=', now()->subMonths(6))
            ->groupBy('month')->orderBy('month')->get();

        $behaviorTrends = StudentReport::selectRaw('DATE(created_at) as date, AVG(behavior) as avg_behavior')
            ->where('created_at', '>=', now()->subMonths(6))
            ->groupBy('date')->orderBy('date')->get();
        // $enrollmentStatus = Enrollment::select('status', DB::raw('count(*) as total'))->groupBy('status')->get();
        $genderPerHalaqah = Halaqah::with(['enrollments.student'])->get()->map(function ($halaqah) {
            $genders = $halaqah->enrollments->groupBy(fn($e) => $e->student->gender ?? 'unknown')->map->count();
            return [
                'halaqah' => $halaqah->name,
                'male' => $genders['male'] ?? 0,
                'female' => $genders['female'] ?? 0,
            ];
        });

        // Alerts (example: full halaqahs, low behavior, upcoming schedules)
        $fullHalaqahs = Halaqah::whereColumn('sum_of_students', '>=', 'max_students')->get();
        $lowBehaviorStudents = StudentReport::where('behavior', '<', 2)->with('student.user')->get();
        $upcomingSchedules = HalaqahSchedule::whereBetween('start_time', [now(), now()->addDays(3)])->get();

        return Inertia::render('admin/dashboard', [
            'kpis' => [
                'students' => $totalStudents,
                'teachers' => $totalTeachers,
                'halaqahs' => $totalHalaqahs,
                'new_enrollments' => $newEnrollments,
                'avg_behavior' => $avgBehavior,
                'students_by_qualification' => $studentsByQualification,
                'students_by_gender' => $studentsByGender,
                'active_enrollments' => $activeEnrollments,
                'admins' => $admins,
                'scheduled_halaqahs' => $scheduledHalaqahs,
            ],
            'charts' => [
                'studentsPerHalaqah' => $studentsPerHalaqah,
                'enrollmentTrends' => $enrollmentTrends,
                'behaviorTrends' => $behaviorTrends,
                //'enrollmentStatus' => $enrollmentStatus,
                'genderPerHalaqah' => $genderPerHalaqah,
            ],
            'tables' => [
                'halaqahs' => $halaqahsTable,
                'teachers' => $teachersTable,
                'students' => $studentsTable,
                'enrollments' => $enrollmentsTable,
                'admins' => $adminsTable,
            ],
            'notifications' => $notifications,
            'alerts' => [
                'fullHalaqahs' => $fullHalaqahs,
                'lowBehaviorStudents' => $lowBehaviorStudents,
                'upcomingSchedules' => $upcomingSchedules,
            ],
        ]);
    }
}
