<?php

use App\Models\{User, Student, Teacher, Admin, School, Role, Permission, Halaqah, Enrollment, Plan, FrequencyType, Tracking, TrackingDetail, TrackingType, TrackingUnit, Unit};

it('user has student, teacher, admin, school, roles, and permissions', function () {
    $school = School::factory()->create();
    $user = User::factory()->for($school)->create();

    Student::factory()->create(['user_id' => $user->id]);
    Teacher::factory()->create(['user_id' => $user->id]);
    Admin::factory()->create(['user_id' => $user->id]);

    $roles = Role::factory()->count(2)->create();
    $user->roles()->attach($roles);

    $permissions = Permission::factory()->count(3)->create();
    $user->permissions()->attach($permissions);

    expect($user->school)->toBeInstanceOf(School::class);
    expect($user->student)->toBeInstanceOf(Student::class);
    expect($user->teacher)->toBeInstanceOf(Teacher::class);
    expect($user->admin)->toBeInstanceOf(Admin::class);
    expect($user->roles)->toHaveCount(2);
    expect($user->permissions)->toHaveCount(3);
});

it('school has users and halaqahs', function () {
    $school = School::factory()->create();
    $users = User::factory()->count(2)->for($school)->create();
    $halaqahs = Halaqah::factory()->count(3)->for($school)->create();

    expect($school->users)->toHaveCount(2);
    expect($school->halaqahs)->toHaveCount(3);
});

it('teacher has halaqahs', function () {
    $teacher = Teacher::factory()->create();
    Halaqah::factory()->count(2)->for($teacher)->create();

    expect($teacher->halaqahs)->toHaveCount(2);
});

it('halaqah has enrollments, school, and teacher', function () {
    $teacher = Teacher::factory()->create();
    $school = School::factory()->create();
    $halaqah = Halaqah::factory()->for($teacher)->for($school)->create();

    $student = Student::factory()->create();
    $plan = Plan::factory()->create();
    Enrollment::factory()->count(3)->for($halaqah)->for($student)->for($plan)->create();

    expect($halaqah->teacher)->toBeInstanceOf(Teacher::class);
    expect($halaqah->school)->toBeInstanceOf(School::class);
    expect($halaqah->enrollments)->toHaveCount(3);
});

it('plan has frequency type and trackings', function () {
    $frequency = FrequencyType::factory()->create();
    $plan = Plan::factory()->for($frequency)->create();
    Tracking::factory()->count(2)->for($plan)->create();

    expect($plan->frequencyType)->toBeInstanceOf(FrequencyType::class);
    expect($plan->trackings)->toHaveCount(2);
});

it('tracking has tracking details', function () {
    $plan = Plan::factory()->create();
    $tracking = Tracking::factory()->for($plan)->create();

    TrackingDetail::factory()->count(2)->for($tracking)->create();

    expect($tracking->trackingDetails)->toHaveCount(2);
});

it('tracking detail links to tracking unit, type and unit', function () {
    $unit = Unit::factory()->create();
    $trackingUnit1 = TrackingUnit::factory()->for($unit)->create();
    $trackingUnit2 = TrackingUnit::factory()->for($unit)->create();

    $tracking = Tracking::factory()->create();
    $type = TrackingType::factory()->create();

    $detail = TrackingDetail::factory()->create([
        'tracking_id' => $tracking->id,
        'tracking_type_id' => $type->id,
        'from_tracking_unit_id' => $trackingUnit1->id,
        'to_tracking_unit_id' => $trackingUnit2->id,
    ]);

    expect($detail->tracking)->toBeInstanceOf(Tracking::class);
    expect($detail->trackingType)->toBeInstanceOf(TrackingType::class);
    expect($detail->fromTrackingUnit->unit)->toBeInstanceOf(Unit::class);
    expect($detail->toTrackingUnit->unit)->toBeInstanceOf(Unit::class);
});


