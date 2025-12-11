<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PrivacyPolicy;
use App\Models\TermsOfUse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PolicyController extends Controller
{
    public function index()
    {
        $terms = TermsOfUse::latest('last_updated')->get();
        $policies = PrivacyPolicy::latest('last_updated')->get();

        return Inertia::render('admin/policies/index', [
            'terms' => $terms,
            'policies' => $policies,
        ]);
    }

    public function editTerm(TermsOfUse $term)
    {
        return Inertia::render('admin/policies/edit-term', [
            'term' => $term,
        ]);
    }

    public function updateTerm(Request $request, TermsOfUse $term)
    {
        $request->validate([
            'content' => 'required|string',
            'is_active' => 'required|boolean',
        ]);

        $term->update([
            'content' => $request->input('content'),
            'is_active' => $request->input('is_active'),
            'last_updated' => now(),
        ]);

        return redirect()->route('admin.policies.index')->with('success', 'Terms of Use updated successfully.');
    }

    public function editPolicy(PrivacyPolicy $policy)
    {
        return Inertia::render('admin/policies/edit-policy', [
            'policy' => $policy,
        ]);
    }

    public function updatePolicy(Request $request, PrivacyPolicy $policy)
    {
        $request->validate([
            'content' => 'required|string',
            'is_active' => 'required|boolean',
        ]);

        $policy->update([
            'content' => $request->input('content'),
            'is_active' => $request->input('is_active'),
            'last_updated' => now(),
        ]);

        return redirect()->route('admin.policies.index')->with('success', 'Privacy Policy updated successfully.');
    }
}
