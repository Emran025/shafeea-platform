<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PrivacyPolicy;
use App\Models\TermsOfUse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

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

    public function edit($type, $id)
    {
        $policy = $type === 'policy' ? PrivacyPolicy::findOrFail($id) : TermsOfUse::findOrFail($id);

        return Inertia::render('admin/policies/edit', [
            'policy' => $policy,
            'type' => $type,
        ]);
    }

    public function update(Request $request, $type, $id)
    {
        $request->validate([
            'sections' => 'required|array',
        ]);

        if ($type === 'policy') {
            $oldPolicy = PrivacyPolicy::findOrFail($id);
            $oldPolicy->update(['is_active' => false]);

            PrivacyPolicy::create([
                'version' => $oldPolicy->version + 1,
                'sections_json' => json_encode($request->input('sections')),
                'is_active' => true,
                'last_updated' => now(),
            ]);
        } else {
            $oldTerm = TermsOfUse::findOrFail($id);
            $oldTerm->update(['is_active' => false]);

            TermsOfUse::create([
                'version' => $oldTerm->version + 1,
                'sections_json' => json_encode($request->input('sections')),
                'is_active' => true,
                'last_updated' => now(),
            ]);
        }

        return Redirect::route('admin.policies.index')->with('success', 'Policy updated successfully.');
    }
}
