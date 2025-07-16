<?php

use App\Models\User;
use App\Models\StudentReport;
use App\Models\TrackingType;
use App\Models\Unit;
use App\Models\TrackingUnit;
use App\Models\TrackingDetail;
use App\Models\Tracking;
use App\Models\FrequencyType;
use App\Models\Plan;
use App\Models\Enrollment;
use App\Models\HalaqahNote;
use App\Models\HalaqahSchedule;
use App\Models\Halaqah;
use App\Models\Permission;
use App\Models\Role;
use App\Models\Admin;
use App\Models\Teacher;
use App\Models\Student;
use App\Models\School;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

test('example', function () {
    expect(true)->toBeTrue();
});

// Example: User relationships
describe('User relationships', function () {
    it('has roles relationship', function () {
        $user = new User();
        expect($user->roles())->toBeInstanceOf(BelongsToMany::class);
    });
    it('has permissions relationship', function () {
        $user = new User();
        expect($user->permissions())->toBeInstanceOf(BelongsToMany::class);
    });
    it('has student relationship', function () {
        $user = new User();
        expect($user->student())->toBeInstanceOf(HasOne::class);
    });
    it('has teacher relationship', function () {
        $user = new User();
        expect($user->teacher())->toBeInstanceOf(HasOne::class);
    });
    it('has admin relationship', function () {
        $user = new User();
        expect($user->admin())->toBeInstanceOf(HasOne::class);
    });
});

describe('StudentReport relationships', function () {
    it('belongs to student', function () {
        $report = new StudentReport();
        expect($report->student())->toBeInstanceOf(BelongsTo::class);
    });
    it('belongs to halaqah', function () {
        $report = new StudentReport();
        expect($report->halaqah())->toBeInstanceOf(BelongsTo::class);
    });
    it('belongs to creator (user)', function () {
        $report = new StudentReport();
        expect($report->creator())->toBeInstanceOf(BelongsTo::class);
    });
});

describe('TrackingType relationships', function () {
    it('has many tracking units', function () {
        $type = new TrackingType();
        expect($type->trackingUnits())->toBeInstanceOf(HasMany::class);
    });
});

describe('Unit relationships', function () {
    it('has many tracking units', function () {
        $unit = new Unit();
        expect($unit->trackingUnits())->toBeInstanceOf(HasMany::class);
    });
    it('has many review plans', function () {
        $unit = new Unit();
        expect($unit->reviewPlans())->toBeInstanceOf(HasMany::class);
    });
    it('has many memorization plans', function () {
        $unit = new Unit();
        expect($unit->memorizationPlans())->toBeInstanceOf(HasMany::class);
    });
    it('has many sard plans', function () {
        $unit = new Unit();
        expect($unit->sardPlans())->toBeInstanceOf(HasMany::class);
    });
});
// Add similar describe blocks for all other models and their relationships as defined in your schema.
