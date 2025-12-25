<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SubscriptionPlan;
use Illuminate\Http\Request;
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
    public function update(Request $request, SubscriptionPlan $subscriptionPlan)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'is_active' => 'required|boolean',
            'features' => 'required|array',
            'is_recommended' => 'required|boolean',
            'sort_order' => 'required|integer',
        ]);

        $subscriptionPlan->update($validated);

        return redirect()->route('admin.subscriptionPlans.index')->with('success', 'تم تحديث الباقة بنجاح.');
    }
}
