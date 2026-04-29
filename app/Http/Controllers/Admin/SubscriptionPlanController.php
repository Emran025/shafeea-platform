<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateSubscriptionPlanRequest;
use App\Models\SubscriptionPlan;
use Inertia\Inertia;

class SubscriptionPlanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $subscriptionPlans = SubscriptionPlan::orderBy('sort_order')->get();

        return Inertia::render('admin/subscription-plans/index', [
            'subscriptionPlans' => $subscriptionPlans
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SubscriptionPlan $subscriptionPlan)
    {
        return Inertia::render('admin/subscription-plans/edit', [
            'subscriptionPlans' => $subscriptionPlan
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSubscriptionPlanRequest $request, SubscriptionPlan $subscriptionPlan)
    {
        $validated = $request->validated();

        $subscriptionPlan->update($validated);

        return redirect()->route('admin.subscription-plans.index')->with('success', 'تم تحديث الباقة بنجاح.');
    }
}
