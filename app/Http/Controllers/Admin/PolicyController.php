<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Admin\UpdatePolicyRequest;
use App\Http\Controllers\Controller;
use App\Models\PrivacyPolicy;
use App\Models\TermsOfUse;
use Illuminate\Support\Facades\Redirect;
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

    public function edit($type, $id)
    {
        $policy = $type === 'policy' ? PrivacyPolicy::findOrFail($id) : TermsOfUse::findOrFail($id);

        return Inertia::render('admin/policies/edit', [
            'policy' => $policy,
            'type' => $type,
        ]);
    }

    public function update(UpdatePolicyRequest $request, $type, $id)
    {
        $validated = $request->validated();

        $incrementVersion = function ($version) {
            $parts = explode('.', $version);
            if (count($parts) > 0) {
                $parts[count($parts) - 1]++;
            } else {
                return (int) $version + 1;
            }

            return implode('.', $parts);
        };

        $summaryJson = json_encode($request->input('summary', []));
        $sectionsJson = json_encode($request->input('sections'));

        if ($type === 'policy') {
            $oldPolicy = PrivacyPolicy::findOrFail($id);
            $oldPolicy->update(['is_active' => false]);

            PrivacyPolicy::create([
                'version' => $incrementVersion($oldPolicy->version),
                'sections_json' => $sectionsJson,
                'summary_json' => $summaryJson,
                'is_active' => true,
                'last_updated' => now(),
            ]);
        } else {
            $oldTerm = TermsOfUse::findOrFail($id);
            $oldTerm->update(['is_active' => false]);

            TermsOfUse::create([
                'version' => $incrementVersion($oldTerm->version),
                'sections_json' => $sectionsJson,
                'summary_json' => $summaryJson,
                'is_active' => true,
                'last_updated' => now(),
            ]);
        }

        return Redirect::route('admin/policies')->with('success', 'Policy updated successfully.');
    }
}
