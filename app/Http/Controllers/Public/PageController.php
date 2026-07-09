<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use App\Models\LandingPageSetting;
use App\Models\PrivacyPolicy;
use App\Models\TermsOfUse;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    /**
     * Home / welcome page.
     */
    public function welcome(): Response
    {
        $settings = LandingPageSetting::where('group', 'welcome_page')
            ->get()
            ->pluck('value', 'key');

        return Inertia::render('welcome', [
            'settings' => $settings,
        ]);
    }

    /**
     * About us page.
     */
    public function about(): Response
    {
        return Inertia::render('about');
    }

    /**
     * Privacy policy page.
     */
    public function privacy(): Response
    {
        $privacyPolicy = PrivacyPolicy::where('is_active', true)
            ->latest('last_updated')
            ->first();

        return Inertia::render('privacy', [
            'privacyPolicy' => $privacyPolicy,
        ]);
    }

    /**
     * Terms of use page.
     */
    public function terms(): Response
    {
        $terms = TermsOfUse::where('is_active', true)
            ->latest('last_updated')
            ->first();

        return Inertia::render('terms', [
            'terms' => $terms,
        ]);
    }

    /**
     * FAQ page.
     */
    public function faq(): Response
    {
        $faqs = Faq::with('category', 'tags')
            ->where('is_active', true)
            ->where('display_order', 1)
            ->orderBy('display_order', 'asc')
            ->get();

        return Inertia::render('faq', [
            'faqs' => $faqs,
        ]);
    }

    /**
     * Mobile apps download page.
     *
     * APK URLs point to the canonical GitHub Release assets.
     * The filenames (shafeea-student.apk / shafeea-teach.apk) are stable
     * across all releases — /releases/latest/download/ always serves the
     * most recent release with that exact filename.
     *
     * Override via STUDENT_APK_URL / TEACH_APK_URL in .env when needed
     * (e.g. pointing to a staging build or a specific release version).
     *
     * Note: config() is used — NOT env() — so this works correctly when
     * Laravel's config cache is active (php artisan config:cache).
     */
    public function download(): Response
    {
        return Inertia::render('download', [
            'studentApkUrl' => config(
                'app.student_apk_url',
                'https://github.com/Emran025/shafeea_student/releases/latest/download/shafeea-student.apk'
            ),
            'teachApkUrl' => config(
                'app.teach_apk_url',
                'https://github.com/Emran025/shafeea_teach/releases/latest/download/shafeea-teach.apk'
            ),
        ]);
    }

    /**
     * Redirect to the appropriate dashboard based on user role.
     */
    public function dashboard(): \Illuminate\Http\RedirectResponse
    {
        $user = auth()->user();
        if ($user && $user->admin) {
            return redirect()->route('admin.dashboard');
        }

        return redirect()->route('welcome');
    }
}
