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

it('all models exist and can be instantiated', function () {
    $models = [
        User::class,
        StudentReport::class,
        TrackingType::class,
        Unit::class,
        TrackingUnit::class,
        TrackingDetail::class,
        Tracking::class,
        FrequencyType::class,
        Plan::class,
        Enrollment::class,
        HalaqahNote::class,
        HalaqahSchedule::class,
        Halaqah::class,
        Permission::class,
        Role::class,
        Admin::class,
        Teacher::class,
        Student::class,
        School::class,
    ];

    foreach ($models as $model) {
        $instance = new $model();
        expect($instance)->toBeObject();
    }
});

it('all models with factories can be created', function () {
    $models = [
        User::class,
        StudentReport::class,
        TrackingType::class,
        Unit::class,
        TrackingUnit::class,
        TrackingDetail::class,
        Tracking::class,
        FrequencyType::class,
        Plan::class,
        Enrollment::class,
        HalaqahNote::class,
        HalaqahSchedule::class,
        Halaqah::class,
        Permission::class,
        Role::class,
        Admin::class,
        Teacher::class,
        Student::class,
        School::class,
    ];

    foreach ($models as $model) {
        if (!method_exists($model, 'factory')) {
            throw new Exception("Model {$model} does not have a factory method.");
        }

        $instance = $model::factory()->create(); // Create and save in DB
        expect($instance)->toBeObject();
        expect($instance->exists)->toBeTrue();
    }
});
